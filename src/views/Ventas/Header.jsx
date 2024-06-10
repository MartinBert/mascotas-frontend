// React Components and Hooks
import React, { useEffect } from 'react'

// Custom components
import { errorAlert } from '../../components/alerts'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { AutoComplete, Button, Col, DatePicker, Row, Spin } from 'antd'

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
const { nonCaseSensitive } = helpers.stringHelper

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
    const redirectFocus = () => {
        const clientField = sale_state.saleRefs.ref_autocompleteClient
        const dateField = sale_state.saleRefs.ref_datePicker
        const documentField = sale_state.saleRefs.ref_autocompleteDocument
        const finalizeButton = sale_state.saleRefs.ref_buttonToFinalizeSale
        const openProductSelectionModalButton = sale_state.saleRefs.ref_buttonToOpenProductSelectionModal
        const paymentMethodField = sale_state.saleRefs.ref_autocompletePaymentMethod
        const paymentPlanField = sale_state.saleRefs.ref_autocompletePaymentPlan
        let unfilledField
        if (!sale_state.valueForDatePicker) unfilledField = dateField
        else if (clientField.value === '') unfilledField = clientField
        else if (documentField.value === '') unfilledField = documentField
        else if (paymentMethodField.value === '') unfilledField = paymentMethodField
        else if (paymentPlanField.value === '') unfilledField = paymentPlanField
        else if (sale_state.renglones.length === 0) unfilledField = openProductSelectionModalButton
        else unfilledField = finalizeButton
        if (!unfilledField) return
        else return unfilledField.focus()
    }

    useEffect(() => { redirectFocus() }, [
        sale_state.cliente,
        sale_state.documento,
        sale_state.fechaEmision,
        sale_state.mediosPago,
        sale_state.planesPago,
        sale_state.porcentajeDescuentoGlobal,
        sale_state.porcentajeRecargoGlobal,
        sale_state.renglones.length
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
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
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
        sale_state.saleRefs.ref_autocompleteClient.focus()
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
        redirectFocus()
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
        redirectFocus()
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
            id='buttonToOpenProductSelectionModal'
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

    // ------------ Spin for loading document ------------ //
    const spinForLoadingDocument = !sale_state.loadingDocumentIndex
        ? null
        : <span><Spin />Procesando...</span>


    const header = [
        {
            element: autocompleteClient,
            order: { lg: 3, md: 4, sm: 5, xl: 3, xs: 5, xxl: 3 }
        },
        {
            element: autocompleteDocument,
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        },
        {
            element: autocompletePaymentMethod,
            order: { lg: 10, md: 10, sm: 8, xl: 10, xs: 8, xxl: 10 }
        },
        {
            element: autocompletePaymentPlan,
            order: { lg: 11, md: 12, sm: 9, xl: 11, xs: 9, xxl: 11 }
        },
        {
            element: buttonToClearFields,
            order: { lg: 4, md: 7, sm: 10, xl: 4, xs: 10, xxl: 4 }
        },
        {
            element: buttonToClearGlobalPercentage,
            order: { lg: 12, md: 11, sm: 12, xl: 12, xs: 12, xxl: 12 }
        },
        {
            element: buttonToClearProducts,
            order: { lg: 8, md: 9, sm: 11, xl: 8, xs: 11, xxl: 8 }
        },
        {
            element: buttonToOpenCustomProductsSelectionModal,
            order: { lg: 5, md: 3, sm: 2, xl: 5, xs: 2, xxl: 5 }
        },
        {
            element: buttonToOpenGeneralPercentageModal,
            order: { lg: 9, md: 5, sm: 3, xl: 9, xs: 3, xxl: 9 }
        },
        {
            element: buttonToOpenProductsSelectionModal,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: datePickerForBillingDate,
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 }
        },
        {
            element: spinForLoadingDocument,
            order: { lg: 7, md: 8, sm: 7, xl: 7, xs: 7, xxl: 7 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 6, md: 12, sm: 24, xl: 6, xs: 24, xxl: 6 }
    }

    return (
        <Col span={24}>
            <Row
                gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                justify='space-around'
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