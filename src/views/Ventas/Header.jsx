// React Components and Hooks
import React, { useEffect } from 'react'

// Custom components
import { errorAlert } from '../../components/alerts'
import InputHidden from '../../components/generics/InputHidden'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { AutoComplete, Button, Col, DatePicker, Row, Select } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { useSaleCustomProductsContext } = contexts.SaleCustomProducts
const { useSaleContext } = contexts.Sale
const { useSaleProductsContext } = contexts.SaleProducts
const { findNextVoucherNumber_fiscal, findNextVoucherNumber_noFiscal, fiscalVouchersCodes } = helpers.afipHelper
const { isItLater } = helpers.dateHelper
const { sortArray } = helpers.objHelper
const { nonCaseSensitive, normalizeString } = helpers.stringHelper

const creditCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.credit)
    .filter(code => code !== null)

const debitCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.debit)
    .filter(code => code !== null)


const Header = () => {
    const [, productSelectionModal_dispatch] = useProductSelectionModalContext()
    const [, customProducts_dispatch] = useSaleCustomProductsContext()
    const [sale_state, sale_dispatch] = useSaleContext()
    const [, saleProducts_dispatch] = useSaleProductsContext()

    // --------------------- Actions --------------------- //
    const validateFocus = () => {
        const refs = {
            autocompleteClient: sale_state.refs.autocompleteClient,
            autocompleteDocument: sale_state.refs.autocompleteDocument,
            autocompletePaymentMethod: sale_state.refs.autocompletePaymentMethod,
            autocompletePaymentPlan: sale_state.refs.autocompletePaymentPlan,
            buttonToFinalizeSale: sale_state.refs.buttonToFinalizeSale,
            datePicker: sale_state.refs.datePicker,
            selectToAddProductByBarcode: sale_state.refs.selectToAddProductByBarcode,
            selectToAddProductByName: sale_state.refs.selectToAddProductByName,
            selectToAddProductByProductCode: sale_state.refs.selectToAddProductByProductCode
        }
        const existsRefs = !Object.values(refs).includes(null)
        const data = { existsRefs, refs }
        return data
    }

    const setFocus = () => {
        const { existsRefs, refs } = validateFocus()
        if (!existsRefs) return
        let unfilledField
        if (!sale_state.valueForDatePicker) unfilledField = refs.datePicker
        else if (refs.autocompleteClient.value === '') unfilledField = refs.autocompleteClient
        else if (refs.autocompleteDocument.value === '') unfilledField = refs.autocompleteDocument
        else if (refs.autocompletePaymentMethod.value === '') unfilledField = refs.autocompletePaymentMethod
        else if (refs.autocompletePaymentPlan.value === '') unfilledField = refs.autocompletePaymentPlan
        else if (sale_state.renglones.length === 0) unfilledField = refs.selectToAddProductByName
        else unfilledField = refs.buttonToFinalizeSale
        unfilledField.focus()
    }

    const setFocusWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            setFocus()
        } else return
    }

    useEffect(() => { setFocus() }, [
        sale_state.cliente,
        sale_state.documento,
        sale_state.fechaEmision,
        sale_state.mediosPago,
        sale_state.planesPago
    ])

    useEffect(() => {
        const loadNextVoucherNumber = async () => {
            if (!sale_state.documento) return
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
            sale_dispatch({ type: 'SET_TOTAL' })

            let number
            if (sale_state.documento.fiscal) {
                const fiscalVoucherNumber = await findNextVoucherNumber_fiscal(
                    sale_state.documentoCodigo,
                    sale_state.empresaCuit,
                    sale_state.puntoVentaNumero
                )
                number = fiscalVoucherNumber
            } else {
                const noFiscalVoucherNumber = await findNextVoucherNumber_noFiscal(
                    sale_state.documentoCodigo
                )
                number = noFiscalVoucherNumber
            }
            sale_dispatch({ type: 'SET_VOUCHER_NUMBERS', payload: number })
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
        }
        loadNextVoucherNumber()
    }, [sale_state.documento])

    // --------------- Autocomplete client --------------- //
    const loadClients = async () => {
        const findClients = await api.clientes.findAll()
        const clients = findClients.docs
        const clientNames = clients.map(client => { return { value: client.razonSocial } })
        const orderedClientNames = sortArray(clientNames, 'value')
        sale_dispatch({ type: 'SET_ALL_CLIENTS', payload: orderedClientNames })
    }

    useEffect(() => { loadClients() }, [])

    const onChangeClient = (e) => {
        sale_dispatch({ type: 'SET_CLIENT_INPUT', payload: e })
    }

    const onClearClient = () => {
        sale_dispatch({ type: 'SET_CLIENT', payload: null })
    }

    const onSelectClient = async (e) => {
        const filters = JSON.stringify({ razonSocial: e })
        const findClient = await api.clientes.findAllByFilters(filters)
        const [client] = findClient.docs
        sale_dispatch({ type: 'SET_CLIENT', payload: client })
        sale_dispatch({ type: 'SET_CLIENT_INPUT', payload: client.razonSocial })
    }

    const autocompleteClient = (
        <AutoComplete
            allowClear
            autoFocus
            defaultActiveFirstOption
            filterOption={nonCaseSensitive}
            id='autocompleteClient'
            onChange={onChangeClient}
            onClear={onClearClient}
            onSelect={onSelectClient}
            options={sale_state.allClients}
            placeholder='Cliente'
            style={{ width: '100%' }}
            value={sale_state.clientInput}
        />
    )

    // -------------- Autocomplete document -------------- //
    const loadDocuments = async () => {
        const fiscalNotesCodes = [...creditCodes, ...debitCodes]
        const findDocuments = await api.documentos.findAll()
        const documents = findDocuments.docs.filter(document => !fiscalNotesCodes.includes(document.codigoUnico))
        const documentsNames = documents.map(document => { return { value: document.nombre } })
        const orderedDocumentsNames = sortArray(documentsNames, 'value')
        sale_dispatch({ type: 'SET_ALL_DOCUMENTS', payload: orderedDocumentsNames })
    }

    useEffect(() => { loadDocuments() }, [])

    const onChangeDocument = (e) => {
        sale_dispatch({ type: 'SET_DOCUMENT_INPUT', payload: e })
    }

    const onClearDoument = () => {
        sale_dispatch({ type: 'SET_DOCUMENT', payload: null })
    }

    const onSelectDocument = async (e) => {
        const filters = JSON.stringify({ nombre: e })
        const findDocument = await api.documentos.findAllByFilters(filters)
        const [document] = findDocument.docs
        sale_dispatch({ type: 'SET_DOCUMENT', payload: document })
        sale_dispatch({ type: 'SET_DOCUMENT_INPUT', payload: document.nombre })
    }

    const autocompleteDocument = (
        <>
            <AutoComplete
                allowClear
                defaultActiveFirstOption
                filterOption={nonCaseSensitive}
                id='autocompleteDocument'
                onChange={onChangeDocument}
                onClear={onClearDoument}
                onSelect={onSelectDocument}
                options={sale_state.allDocuments}
                placeholder='Documento'
                style={{ width: '100%' }}
                value={sale_state.documentInput}
            />
        </>
    )

    // ----------- Autocomplete payment method ----------- //
    const loadPaymentMethods = async () => {
        const findPaymentMethods = await api.mediospago.findAll()
        const paymentMethods = findPaymentMethods.docs
        const paymentMethodsNames = paymentMethods.map(paymentMethod => { return { value: paymentMethod.nombre } })
        const orderedPaymentMethodsNames = sortArray(paymentMethodsNames)
        sale_dispatch({ type: 'SET_ALL_PAYMENT_METHODS', payload: orderedPaymentMethodsNames })
    }

    useEffect(() => { loadPaymentMethods() }, [])

    const onChangePaymentMethod = (e) => {
        sale_dispatch({ type: 'SET_PAYMENT_METHOD_INPUT', payload: e })
    }

    const onClearPaymentMethods = () => {
        sale_dispatch({ type: 'SET_PAYMENT_METHOD', payload: [] })
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onSelectPaymentMethods = async (e) => {
        const filters = JSON.stringify({ nombre: e })
        const findPaymentMethod = await api.mediospago.findAllByFilters(filters)
        const paymentMethod = findPaymentMethod.docs
        sale_dispatch({ type: 'SET_PAYMENT_METHOD', payload: paymentMethod })
        sale_dispatch({ type: 'SET_PAYMENT_METHOD_INPUT', payload: paymentMethod[0].nombre })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const autocompletePaymentMethod = (
        <AutoComplete
            allowClear
            defaultActiveFirstOption
            filterOption={nonCaseSensitive}
            id='autocompletePaymentMethod'
            onChange={onChangePaymentMethod}
            onClear={onClearPaymentMethods}
            onSelect={onSelectPaymentMethods}
            options={sale_state.mediosPagoToAutocomplete}
            placeholder='Medio de pago'
            style={{ width: '100%' }}
            value={sale_state.mediosPagoInput}
        />
    )

    // ----------- Autocomplete payment plans ---------- //
    const loadPaymentPlans = async () => {
        const playmentMethodSelectedID = sale_state.mediosPago
        if (playmentMethodSelectedID.length === 0) return sale_dispatch({ type: 'SET_ALL_PAYMENT_PLANS', payload: [] })
        const findPaymentMethodSelected = await api.mediospago.findById(playmentMethodSelectedID[0])
        const paymentPlans = findPaymentMethodSelected?.data?.planes ?? []
        const paymentPlansNames = paymentPlans.map(paymentPlan => { return { value: paymentPlan.nombre } })
        const orderedPaymentPlansNames = sortArray(paymentPlansNames, 'value')
        sale_dispatch({ type: 'SET_ALL_PAYMENT_PLANS', payload: orderedPaymentPlansNames })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    useEffect(() => { loadPaymentPlans() }, [sale_state.mediosPagoNombres])

    const onChangePaymentPlan = (e) => {
        sale_dispatch({ type: 'SET_PAYMENT_PLAN_INPUT', payload: e })
    }

    const onClearPaymentPlans = () => {
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onSelectPaymentPlans = async (e) => {
        const playmentMethodSelectedID = sale_state.mediosPago
        if (playmentMethodSelectedID.length === 0) return
        const findPaymentMethodSelected = await api.mediospago.findById(playmentMethodSelectedID[0])
        const paymentPlans = findPaymentMethodSelected?.data?.planes ?? []
        const paymentPlan = paymentPlans.filter(paymentPlan => paymentPlan.nombre === e)
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: paymentPlan })
        sale_dispatch({ type: 'SET_PAYMENT_PLAN_INPUT', payload: paymentPlan[0].nombre })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const autocompletePaymentPlan = (
        <AutoComplete
            allowClear
            defaultActiveFirstOption
            filterOption={nonCaseSensitive}
            id='autocompletePaymentPlan'
            onChange={onChangePaymentPlan}
            onClear={onClearPaymentPlans}
            onSelect={onSelectPaymentPlans}
            options={sale_state.planesPagoToAutocomplete}
            placeholder='Plan de pago'
            style={{ width: '100%' }}
            value={sale_state.planesPagoInput}
        />
    )

    // ------------- Button to clear fields -------------- //
    const onClearFields = () => {
        sale_dispatch({ type: 'SET_CLIENT', payload: null })
        sale_dispatch({ type: 'SET_CLIENT_INPUT', payload: null })
        sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        sale_dispatch({ type: 'SET_DOCUMENT', payload: null })
        sale_dispatch({ type: 'SET_DOCUMENT_INPUT', payload: null })
        sale_dispatch({ type: 'SET_PAYMENT_METHOD', payload: [] })
        sale_dispatch({ type: 'SET_PAYMENT_METHOD_INPUT', payload: null })
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
        sale_dispatch({ type: 'SET_PAYMENT_PLAN_INPUT', payload: null })
        sale_dispatch({ type: 'SET_TOTAL' })
        sale_state.refs.autocompleteClient.focus()
    }

    const buttonToClearFields = (
        <Button
            danger
            onClick={onClearFields}
            style={{ width: '100%' }}
            type='primary'
        >
            Reiniciar campos
        </Button>
    )

    // -------- Button to clear global percentage -------- //
    const onClearGlobalPercentage = () => {
        sale_dispatch({ type: 'SET_FIELD_STATUS', payload: { percentage: null, percentageType: null } })
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_PERCENT', payload: 0 })
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION', payload: 'discount' })
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION_INPUT', payload: 'discount' })
        sale_dispatch({ type: 'SET_GLOBAL_SURCHARGE_PERCENT', payload: 0 })
        sale_dispatch({ type: 'SET_PERCENTAGE_OF_GLOBAL_DISCOUNT_INPUT', payload: '' })
        sale_dispatch({ type: 'SET_PERCENTAGE_OF_GLOBAL_SURCHARGE_INPUT', payload: '' })
        sale_dispatch({ type: 'SET_TOTAL' })
        setFocus()
    }

    const buttonToClearGlobalPercentage = (
        <Button
            danger
            onClick={onClearGlobalPercentage}
            style={{ width: '100%' }}
            type='primary'
        >
            Quitar porcentaje global
        </Button>
    )

    // ------------ Button to clear products ------------- //
    const onClearProducts = () => {
        saleProducts_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
        setFocus()
    }

    const buttonToClearProducts = (
        <Button
            danger
            onClick={onClearProducts}
            style={{ width: '100%' }}
            type='primary'
        >
            Quitar productos
        </Button>
    )

    // ---- Button to open products selection modal ------ //
    const openProductsSelectionModal = () => {
        productSelectionModal_dispatch({ type: 'SHOW_PRODUCT_MODAL' })
    }

    const buttonToOpenProductsSelectionModal = (
        <Button
            className='btn-primary'
            onClick={openProductsSelectionModal}
        >
            Productos
        </Button>
    )

    // -- Button to open custom products selection modal -- //
    const openCustomProductsSelectionModal = () => {
        customProducts_dispatch({ type: 'SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const buttonToOpenCustomProductsSelectionModal = (
        <Button
            className='btn-primary'
            onClick={openCustomProductsSelectionModal}
        >
            Productos personalizados
        </Button>
    )

    // ----- Button to open general percentage modal ----- //
    const openGeneralPercentageModal = () => {
        sale_dispatch({ type: 'SHOW_DISCOUNT_SURCHARGE_MODAL' })
    }

    const buttonToOpenGeneralPercentageModal = (
        <Button
            className='btn-primary'
            onClick={openGeneralPercentageModal}
        >
            Descuento/Recargo general
        </Button>
    )

    // ---------- Date picker for billing date ----------- //
    const loadTodayDate = () => {
        sale_dispatch({ type: 'SET_DATES', payload: new Date() })
    }

    useEffect(() => { loadTodayDate() }, [])

    const changeDate = (e) => {
        if (!e) {
            sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        } else {
            if (isItLater(new Date(), e.$d)) {
                errorAlert('No es conveniente facturar con fecha posterior a hoy.')
                sale_dispatch({ type: 'SET_DATES', payload: new Date() })
            }
            else sale_dispatch({ type: 'SET_DATES', payload: e.$d })
        }
    }

    const datePickerForBillingDate = (
        <DatePicker
            format={['DD/MM/YYYY']}
            id='datePicker'
            onChange={changeDate}
            style={{ width: '100%' }}
            value={sale_state.valueForDatePicker}
        />
    )

    // -------- Select to add product by barcode --------- //
    const onSearchProductByBarcode = async (e) => {
        const filters = JSON.stringify({ normalizedBarcode: normalizeString(e) })
        const params = { page: 1, limit: 15, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsAlreadySelected = sale_state.productos.map(product => product.normalizedBarcode)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedBarcode))
        const options = productsNotYetSelected.map(product => {
            return {
                label: product.nombre + ` (${product.codigoBarras})`,
                value: product.normalizedBarcode
            }
        })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: options })
    }

    const onSelectProductByBarcode = async (e) => {
        const filters = JSON.stringify({ normalizedBarcode: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsToSet = [...sale_state.productos, ...products]
        saleProducts_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: [] })
        sale_state.refs.selectToAddProductByBarcode.focus()
    }

    const selectToAddProductByBarcode = (
        <Select
            allowClear
            id='selectToAddProductByBarcode'
            onKeyUp={setFocusWhenPressingEsc}
            onSearch={onSearchProductByBarcode}
            onSelect={onSelectProductByBarcode}
            options={sale_state.selectToAddProductByBarcode.options}
            placeholder='Buscar producto por cód. barras'
            showSearch
            style={{ width: '100%' }}
            value={sale_state.selectToAddProductByBarcode.selectedValue}
        />
    )

    // ---------- Select to add product by name ---------- //
    const onSearchProductByName = async (e) => {
        const filters = JSON.stringify({ normalizedName: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsAlreadySelected = sale_state.productos.map(product => product.normalizedName)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedName))
        const options = productsNotYetSelected.map(product => { return { label: product.nombre, value: product.normalizedName } })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: options })
    }

    const onSelectProductByName = async (e) => {
        const filters = JSON.stringify({ normalizedName: e })
        const findProducts = await api.productos.findAllByFilters(filters)
        const products = findProducts.docs
        const productsToSet = [...sale_state.productos, ...products]
        saleProducts_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: [] })
        sale_state.refs.selectToAddProductByName.focus()
    }

    const selectToAddProductByName = (
        <Select
            allowClear
            filterOption={nonCaseSensitive}
            id='selectToAddProductByName'
            onKeyUp={setFocusWhenPressingEsc}
            onSearch={onSearchProductByName}
            onSelect={onSelectProductByName}
            options={sale_state.selectToAddProductByName.options}
            placeholder='Buscar producto por nombre'
            showSearch
            style={{ width: '100%' }}
            value={sale_state.selectToAddProductByName.selectedValue}
        />
    )

    // ------ Select to add product by product code ------ //
    const onSearchProductByProductCode = async (e) => {
        const filters = JSON.stringify({ normalizedProductCode: normalizeString(e) })
        const params = { page: 1, limit: 15, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsAlreadySelected = sale_state.productos.map(product => product.normalizedProductCode)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedProductCode))
        const options = productsNotYetSelected.map(product => {
            return {
                label: product.nombre + ` (${product.codigoProducto})`,
                value: product.normalizedProductCode
            }
        })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_PRODUCTCODE', payload: options })
    }

    const onSelectProductByProductCode = async (e) => {
        const filters = JSON.stringify({ normalizedProductCode: e })
        const findProducts = await api.productos.findAllByFilters(filters)
        const products = findProducts.docs
        const productsToSet = [...sale_state.productos, ...products]
        saleProducts_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_PRODUCTCODE', payload: [] })
        sale_state.refs.selectToAddProductByProductCode.focus()
    }

    const selectToAddProductByProductCode = (
        <Select
            allowClear
            id='selectToAddProductByProductCode'
            onKeyUp={setFocusWhenPressingEsc}
            onSearch={onSearchProductByProductCode}
            onSelect={onSelectProductByProductCode}
            options={sale_state.selectToAddProductByProductCode.options}
            placeholder='Buscar producto por cód. producto'
            showSearch
            style={{ width: '100%' }}
            value={sale_state.selectToAddProductByProductCode.selectedValue}
        />
    )


    const header = [
        {
            element: autocompleteClient,
            order: { lg: 5, md: 5, sm: 5, xl: 5, xs: 5, xxl: 5 }
        },
        {
            element: autocompleteDocument,
            order: { lg: 8, md: 8, sm: 6, xl: 8, xs: 6, xxl: 8 }
        },
        {
            element: autocompletePaymentMethod,
            order: { lg: 11, md: 11, sm: 8, xl: 11, xs: 8, xxl: 11 }
        },
        {
            element: autocompletePaymentPlan,
            order: { lg: 14, md: 14, sm: 9, xl: 14, xs: 9, xxl: 14 }
        },
        {
            element: buttonToClearFields,
            order: { lg: 12, md: 12, sm: 10, xl: 12, xs: 10, xxl: 12 }
        },
        {
            element: buttonToClearGlobalPercentage,
            order: { lg: 16, md: 16, sm: 12, xl: 16, xs: 12, xxl: 16 }
        },
        {
            element: buttonToClearProducts,
            order: { lg: 15, md: 15, sm: 11, xl: 15, xs: 11, xxl: 15 }
        },
        {
            element: buttonToOpenCustomProductsSelectionModal,
            order: { lg: 6, md: 6, sm: 2, xl: 6, xs: 2, xxl: 6 }
        },
        {
            element: buttonToOpenGeneralPercentageModal,
            order: { lg: 9, md: 9, sm: 3, xl: 9, xs: 3, xxl: 9 }
        },
        {
            element: buttonToOpenProductsSelectionModal,
            order: { lg: 3, md: 3, sm: 1, xl: 3, xs: 1, xxl: 3 }
        },
        {
            element: datePickerForBillingDate,
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 }
        },
        {
            element: <InputHidden />,
            order: { lg: 10, md: 10, sm: 4, xl: 10, xs: 4, xxl: 10 }
        },
        {
            element: <InputHidden />,
            order: { lg: 13, md: 13, sm: 4, xl: 13, xs: 4, xxl: 13 }
        },
        {
            element: selectToAddProductByBarcode,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: selectToAddProductByName,
            order: { lg: 1, md: 1, sm: 4, xl: 1, xs: 4, xxl: 1 }
        },
        {
            element: selectToAddProductByProductCode,
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 8, md: 8, sm: 24, xl: 8, xs: 24, xxl: 8 }
    }

    return (
        <Col span={24}>
            <Row
                gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                justify='end'
            >
                {
                    header.map((item, index) => {
                        return (
                            <Col
                                key={'saleHeader_itemsToRender_' + index}
                                lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                                md={{ order: item.order.md, span: responsiveGrid.span.md }}
                                sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                                xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                                xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                                xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                            >
                                {item.element}
                            </Col>
                        )
                    })
                }
            </Row>
            <br />
            <Row>
                <Col span={12}>
                    {
                        (sale_state.porcentajeDescuentoGlobal === 0 && sale_state.porcentajeRecargoGlobal === 0)
                            ? null
                            : (
                                <span>
                                    {
                                        sale_state.porcentajeDescuentoGlobal !== 0
                                            ? <h1>Descuento de {sale_state.porcentajeDescuentoGlobal}% aplicado a toda la factura</h1>
                                            : <h1>Recargo de {sale_state.porcentajeRecargoGlobal}% aplicado a toda la factura</h1>
                                    }
                                </span>
                            )
                    }
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <h1>Neto Total: {sale_state.total}</h1>
                </Col>
            </Row>
        </Col>
    )
}

export default Header