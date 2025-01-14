// React Components and Hooks
import React, { useEffect } from 'react'

// Custom components
import { errorAlert } from '../../components/alerts'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Input, Row, Select } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useSaleContext } = contexts.Sale
const { findNextVoucherNumber_fiscal, findNextVoucherNumber_noFiscal, creditCodes, debitCodes } = helpers.afipHelper
const { dateToAfip, isItLater } = helpers.dateHelper
const { roundTwoDecimals } = helpers.mathHelper
const { sortArrayOfSelectOptions } = helpers.objHelper
const { fixInputNumber, fixInputNumberValue, nonCaseSensitive, normalizeString } = helpers.stringHelper


const Header = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    // --------------------- Actions --------------------- //
    const loadNextVoucherNumber = async () => {
        if (!sale_state.documento) return
        if (!sale_state.empresa) return
        sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
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
        if (isNaN(number)) return sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
        sale_dispatch({ type: 'SET_VOUCHER_NUMBERS', payload: number })
        sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
    }

    const setFocus = () => {
        const { existsRefs, refs } = validateFocus()
        if (!existsRefs) return
        let unfilledField
        if (!sale_state.valueForDatePicker) unfilledField = refs.datePicker
        else if (!sale_state.selectClient.selectedValue) unfilledField = refs.selectClient
        else if (!sale_state.selectDocument.selectedValue) unfilledField = refs.selectDocument
        else if (!sale_state.selectPaymentMethod.selectedValue) unfilledField = refs.selectPaymentMethod
        else if (!sale_state.selectPaymentPlan.selectedValue) unfilledField = refs.selectPaymentPlan
        else if (sale_state.renglones.length === 0) unfilledField = refs.selectToAddProductByName
        else unfilledField = refs.buttonToFinalizeSale
        unfilledField.focus()
    }

    const setFocusWhenPressingEnterOrEsc = (e) => {
        if (e.keyCode === 13 || e.keyCode === 27) { // Enter or Escape
            e.preventDefault()
            setFocus()
        } else return
    }

    const setFocusWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            setFocus()
        } else return
    }

    const validateFocus = () => {
        const refs = {
            buttonToFinalizeSale: sale_state.refs.buttonToFinalizeSale,
            datePicker: sale_state.refs.datePicker,
            selectClient: sale_state.refs.selectClient,
            selectDocument: sale_state.refs.selectDocument,
            selectPaymentMethod: sale_state.refs.selectPaymentMethod,
            selectPaymentPlan: sale_state.refs.selectPaymentPlan,
            selectToAddProductByBarcode: sale_state.refs.selectToAddProductByBarcode,
            selectToAddProductByName: sale_state.refs.selectToAddProductByName
        }
        const existsRefs = !Object.values(refs).includes(null)
        const data = { existsRefs, refs }
        return data
    }

    /* eslint-disable */
    useEffect(() => { loadNextVoucherNumber() }, [sale_state.documento, sale_state.empresa])
    useEffect(() => { setFocus() }, [
        sale_state.cliente,
        sale_state.documento,
        sale_state.fechaEmision,
        sale_state.mediosPago,
        sale_state.planesPago
    ])
    /* eslint-enable */

    // ---------- Date picker for billing date ----------- //
    const loadTodayDate = () => {
        sale_dispatch({ type: 'SET_DATES', payload: new Date() })
    }

    // eslint-disable-next-line
    useEffect(() => { loadTodayDate() }, [])

    const changeDate = async (e) => {
        if (!e) return sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        if (isItLater(new Date(), e.$d)) {
            errorAlert('No es conveniente facturar con fecha posterior a hoy.')
            return sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        }
        const [lastBill] = await api.ventas.findNewerSale()
        const dateOfLastBill = parseInt(dateToAfip(lastBill.fechaEmision))
        const selectedDate = parseInt(dateToAfip(e.$d))
        if (selectedDate < dateOfLastBill) {
            errorAlert('La fecha de facturación debe ser igual o posterior a la del último comprobante emitido.')
            return sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        }
        sale_dispatch({ type: 'SET_DATES', payload: e.$d })
    }

    const datePickerForBillingDate = (
        <DatePicker
            format={['DD/MM/YYYY']}
            id='salesHeader_datePickerForBillingDate'
            onChange={changeDate}
            style={{ width: '100%' }}
            value={sale_state.valueForDatePicker}
        />
    )

    // -------------- Input custom product --------------- //
    const addCustomProduct = () => {
        const {
            isConceptInvalid,
            isPercentageIvaInvalid,
            isUnitPriceInvalid,
            invalidStatus
        } = invalidStatusOfCustomProduct()
        if (invalidStatus) {
            const status = {
                concept: isConceptInvalid ? 'error' : null,
                percentageIva: isPercentageIvaInvalid ? 'error' : null,
                unitPrice: isUnitPriceInvalid ? 'error' : null
            }
            sale_dispatch({ type: 'SET_STATUS_OF_CUSTOM_PRODUCT', payload: status })
            setTimeout(resetStatusOfCustomProduct, 2000)
        } else {
            const customProduct = generateCustomProductParams()
            sale_dispatch({ type: 'SET_PRODUCT', payload: customProduct })
        }
    }

    const generateCustomProductParams = () => {
        const porcentajeIvaVenta = parseFloat(sale_state.customProductParams.percentageIva)
        const precioVenta = parseFloat(sale_state.customProductParams.unitPrice)
        const ivaVenta = precioVenta * porcentajeIvaVenta / 100
        const quantityOfAlreadyCustomProductsSaved = sale_state.productos.filter(product => product._id.startsWith('customProduct_')).length
        const _id = 'customProduct_' + (quantityOfAlreadyCustomProductsSaved + 1)
        const customProduct = {
            _id,
            codigoBarras: _id,
            ivaVenta: roundTwoDecimals(ivaVenta),
            key: _id,
            nombre: sale_state.customProductParams.concept,
            precioVenta: roundTwoDecimals(precioVenta),
            porcentajeIvaVenta: roundTwoDecimals(porcentajeIvaVenta),
            profit: roundTwoDecimals(precioVenta - ivaVenta),
            unidadMedida: { fraccionamiento: 1, nombre: 'Unid.' }
        }
        return customProduct
    }

    const inputCustomProductStyle = {
        border: 'solid 1px',
        borderColor: '#808080',
        borderRadius: '5px',
        marginLeft: '3px',
        marginRight: '3px',
        padding: '5px'
    }

    const invalidStatusOfCustomPercentageIva = (value) => {
        if (!value) return false
        if (
            parseFloat(value) < 0
            || parseFloat(value) > 100
            || value.endsWith('.')
            || value.endsWith(',')
        ) return true
        else return false
    }

    const invalidStatusOfCustomProduct = () => {
        const customConcept = sale_state.customProductParams.concept
        const customPercentageIva = sale_state.customProductParams.percentageIva
        const customUnitPrice = sale_state.customProductParams.unitPrice
        const isConceptInvalid = !customConcept || customConcept === ''
        const isPercentageIvaInvalid = sale_state.empresa?.condicionFiscal?.adicionaIva && (
            !customPercentageIva
            || customPercentageIva === ''
            || invalidStatusOfCustomPercentageIva(customPercentageIva)
        )
        const isUnitPriceInvalid = (
            !customUnitPrice
            || customUnitPrice === ''
            || invalidStatusOfCustomUnitPrice(customUnitPrice)
        )
        const invalidStatus = [isConceptInvalid, isPercentageIvaInvalid, isUnitPriceInvalid].includes(true)
        const data = { isConceptInvalid, isPercentageIvaInvalid, isUnitPriceInvalid, invalidStatus }
        return data
    }

    const invalidStatusOfCustomUnitPrice = (value) => {
        if (!value) return false
        if (
            parseFloat(value) < 0
            || value.endsWith('.')
            || value.endsWith(',')
        ) return true
        else return false
    }

    const loadCustomPercentageIva = () => {
        if (!sale_state.empresa) return
        const addIvaInVoucher = sale_state.empresa.condicionFiscal.adicionaIva
        let defaultIva
        if (!addIvaInVoucher) defaultIva = '0'
        else defaultIva = '21'
        sale_dispatch({ type: 'SET_CUSTOM_PERCENTAGE_IVA', payload: defaultIva })
    }

    // eslint-disable-next-line
    useEffect(() => { loadCustomPercentageIva() }, [sale_state.empresa])

    const onChangeCustomConcept = async (e) => {
        const value = e.target.value === '' ? null : e.target.value
        sale_dispatch({ type: 'SET_CUSTOM_CONCEPT', payload: value })
        const status = null
        sale_dispatch({ type: 'SET_STATUS_OF_CUSTOM_CONCEPT', payload: status })
    }

    const onChangeCustomPercentageIva = async (e) => {
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = sale_state.customProductParams.percentageIva
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({ type: 'SET_CUSTOM_PERCENTAGE_IVA', payload: fixedValue })
        const status = invalidStatusOfCustomPercentageIva(currentValue) ? 'error' : null
        sale_dispatch({ type: 'SET_STATUS_OF_CUSTOM_PERCENTAGE_IVA', payload: status })
    }

    const onChangeCustomUnitPrice = async (e) => {
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = sale_state.customProductParams.unitPrice
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({ type: 'SET_CUSTOM_UNIT_PRICE', payload: fixedValue })
        const status = invalidStatusOfCustomUnitPrice(currentValue) ? 'error' : null
        sale_dispatch({ type: 'SET_STATUS_OF_CUSTOM_UNIT_PRICE', payload: status })
    }

    const resetStatusOfCustomProduct = () => {
        const currentCustomPercentageIva = sale_state.customProductParams.percentageIva
        const currentCustomUnitPrice = sale_state.customProductParams.unitPrice
        const status = {
            concept: null,
            percentageIva: invalidStatusOfCustomPercentageIva(currentCustomPercentageIva) ? 'error' : null,
            unitPrice: invalidStatusOfCustomUnitPrice(currentCustomUnitPrice) ? 'error' : null
        }
        sale_dispatch({ type: 'SET_STATUS_OF_CUSTOM_PRODUCT', payload: status })
    }

    const keyboardFocusAfterChangeCustomConcept = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            if (!sale_state.customProductParams.concept) sale_state.refs.inputCustomConcept.focus()
            else if (!sale_state.customProductParams.unitPrice) sale_state.refs.inputCustomUnitPrice.focus()
            else if (sale_state.empresa.condicionFiscal.adicionaIva && !sale_state.customProductParams.percentageIva)
                sale_state.refs.inputCustomPercentageIva.focus()
            else return setFocus()
        } else if (e.keyCode === 27) { // Escape
            setFocusWhenPressingEsc(e)
        }
    }

    const inputCustomProduct = (
        <Row
            gutter={[8, 8]}
            id='salesHeader_inputCustomProduct'
            justify='center'
            style={inputCustomProductStyle}
        >
            <Col span={24}>
                Agregar concepto personalizado
            </Col>
            <Col span={24}>
                <Input
                    allowClear
                    id='salesHeader_inputCustomConcept'
                    onChange={onChangeCustomConcept}
                    onKeyUp={keyboardFocusAfterChangeCustomConcept}
                    placeholder='Concepto'
                    status={sale_state.fieldStatus.customProduct.concept}
                    style={{ width: '100%' }}
                    value={sale_state.customProductParams.concept}
                />
                <span
                    style={{
                        color: 'red',
                        display: sale_state.fieldStatus.customProduct.concept === 'error' ? 'block' : 'none'
                    }}
                >
                    Escribe un concepto.
                </span>
            </Col>
            <Col span={12}>
                <Input
                    allowClear
                    id='salesHeader_inputCustomUnitPrice'
                    onChange={onChangeCustomUnitPrice}
                    onKeyUp={keyboardFocusAfterChangeCustomConcept}
                    placeholder='Precio Unitario'
                    status={sale_state.fieldStatus.customProduct.unitPrice}
                    style={{ width: '100%' }}
                    value={sale_state.customProductParams.unitPrice}
                />
                <span
                    style={{
                        color: 'red',
                        display: sale_state.fieldStatus.customProduct.unitPrice === 'error' ? 'block' : 'none'
                    }}
                >
                    Escribe un precio válido mayor que cero.
                </span>
            </Col>
            {
                !sale_state.empresa?.condicionFiscal?.adicionaIva
                    ? null
                    : (
                        <Col span={12}>
                            <Input
                                allowClear
                                id='salesHeader_inputCustomPercentageIva'
                                onChange={onChangeCustomPercentageIva}
                                onKeyUp={keyboardFocusAfterChangeCustomConcept}
                                placeholder='Porcentaje IVA'
                                status={sale_state.fieldStatus.customProduct.percentageIva}
                                style={{ width: '100%' }}
                                suffix='% IVA'
                                value={sale_state.customProductParams.percentageIva}
                            />
                            <span
                                style={{
                                    color: 'red',
                                    display: sale_state.fieldStatus.customProduct.percentageIva === 'error' ? 'block' : 'none'
                                }}
                            >
                                Igrese un valor entre cero y 100.
                            </span>
                        </Col>
                    )
            }
            <Col span={12}>
                <Button
                    className='btn-primary'
                    id='salesHeader_buttonToAddCustomProduct'
                    onClick={addCustomProduct}
                    onKeyUp={setFocusWhenPressingEsc}
                    style={{ width: '100%' }}
                >
                    Añadir
                </Button>
            </Col>
        </Row>
    )

    // ------------ Input general percentage ------------- //
    const statusOfGeneralPercentageValue = () => {
        const generalPercentage = sale_state.generalPercentage
        if (!generalPercentage) return null
        if (
            parseFloat(generalPercentage) < 0
            || (sale_state.generalPercentageType === 'discount' && parseFloat(generalPercentage) > 100)
            || generalPercentage.toString().endsWith('.')
            || generalPercentage.toString().endsWith(',')
        ) return 'error'
        else return null
    }

    const inputGeneralPercentageStyle = {
        border: 'solid 1px',
        borderColor: '#808080',
        borderRadius: '5px',
        marginLeft: '3px',
        marginRight: '3px',
        padding: '5px'
    }

    const onChangeGeneralPercentage = (e) => {
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = sale_state.generalPercentage
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({ type: 'SET_GENERAL_PERCENTAGE', payload: fixedValue })
        const fieldStatus = statusOfGeneralPercentageValue()
        sale_dispatch({ type: 'SET_STATUS_OF_GENERAL_PERCENTAGE', payload: fieldStatus })
    }

    const onClearGeneralPercentageType = () => {
        sale_dispatch({ type: 'SET_GENERAL_PERCENTAGE', payload: null })
        sale_dispatch({ type: 'SET_GENERAL_PERCENTAGE_TYPE', payload: null })
    }

    const onSelectGeneralPercentageType = (e) => {
        sale_dispatch({ type: 'SET_GENERAL_PERCENTAGE_TYPE', payload: e })
        if (!sale_state.generalPercentage) sale_state.refs.inputGeneralPercentageValue.focus()
        else setFocus()
    }

    const inputGeneralPercentage = (
        <Row
            gutter={[8, 8]}
            id='salesHeader_inputGeneralPercentage'
            style={inputGeneralPercentageStyle}
        >
            <Col span={24}>
                Agregar descuento/recargo general
            </Col>
            <Col span={12}>
                <Select
                    allowClear
                    id='salesHeader_selectGeneralPercentageType'
                    onClear={onClearGeneralPercentageType}
                    onKeyUp={setFocusWhenPressingEsc}
                    onSelect={onSelectGeneralPercentageType}
                    options={sale_state.selectGeneralPercentageType.options}
                    placeholder='Descuento/Recargo'
                    style={{ width: '100%' }}
                    value={sale_state.selectGeneralPercentageType.selectedValue}
                />
            </Col>
            <Col span={12}>
                <Input
                    allowClear
                    id='salesHeader_inputGeneralPercentageValue'
                    onChange={onChangeGeneralPercentage}
                    onKeyUp={setFocusWhenPressingEnterOrEsc}
                    placeholder='Porcentaje'
                    status={statusOfGeneralPercentageValue()}
                    style={{ width: '100%' }}
                    value={sale_state.generalPercentage}
                />
                <span
                    style={{
                        color: 'red',
                        display: statusOfGeneralPercentageValue() === 'error' ? 'block' : 'none'
                    }}
                >
                    {
                        sale_state.generalPercentageType === 'discount'
                            ? 'Escribe un porcentaje válido entre cero y 100.'
                            : 'Escribe un porcentaje válido mayor que cero.'
                    }
                </span>
            </Col>
        </Row>
    )

    // ------------------ Select client ------------------ //
    const onSearchClient = async (e) => {
        const filters = JSON.stringify({ normalizedBusinessName: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findClients = await api.clientes.findPaginated(params)
        const clients = findClients.docs
        const options = clients.map(client => { return { label: client.razonSocial, value: client.normalizedBusinessName } })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_CLIENT', payload: options })
    }

    const onSelectClient = async (e) => {
        const filters = JSON.stringify({ normalizedBusinessName: e })
        const findClients = await api.clientes.findAllByFilters(filters)
        const [client] = findClients.docs
        sale_dispatch({ type: 'SET_CLIENT', payload: client })
        sale_dispatch({ type: 'SET_STATUS_OF_CLIENT', payload: null })
    }

    const onClearClient = () => {
        sale_dispatch({ type: 'SET_CLIENT', payload: null })
    }

    const selectClient = (
        <>
            <Select
                allowClear
                filterOption={nonCaseSensitive}
                filterSort={sortArrayOfSelectOptions}
                id='salesHeader_selectClient'
                onClear={onClearClient}
                onSearch={onSearchClient}
                onSelect={onSelectClient}
                options={sale_state.selectClient.options}
                placeholder='Cliente'
                showSearch
                status={sale_state.fieldStatus.client}
                style={{ width: '100%' }}
                value={sale_state.selectClient.selectedValue}
            />
            <span
                style={{
                    color: 'red',
                    display: sale_state.fieldStatus.client === 'error' ? 'block' : 'none'
                }}
            >
                Debe seleccionar el cliente.
            </span>
        </>
    )

    // ------------------ Select document ----------------- //
    const onSearchDocument = async (e) => {
        const filters = JSON.stringify({ normalizedName: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findDocuments = await api.documentos.findPaginated(params)
        const documents = findDocuments.docs
        const fixedDocuments = documents.filter(document => !creditCodes.includes(document.codigoUnico) && !debitCodes.includes(document.codigoUnico))
        const options = fixedDocuments.map(document => { return { label: document.nombre, value: document.normalizedName } })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_DOCUMENT', payload: options })
    }

    const onSelectDocument = async (e) => {
        const filters = JSON.stringify({ normalizedName: e })
        const findDocuments = await api.documentos.findAllByFilters(filters)
        const [document] = findDocuments.docs
        sale_dispatch({ type: 'SET_DOCUMENT', payload: document })
        sale_dispatch({ type: 'SET_STATUS_OF_DOCUMENT', payload: null })
    }

    const onClearDocument = () => {
        sale_dispatch({ type: 'SET_DOCUMENT', payload: null })
    }

    const selectDocument = (
        <>
            <Select
                allowClear
                filterOption={nonCaseSensitive}
                filterSort={sortArrayOfSelectOptions}
                id='salesHeader_selectDocument'
                onClear={onClearDocument}
                onSearch={onSearchDocument}
                onSelect={onSelectDocument}
                options={sale_state.selectDocument.options}
                placeholder='Documento'
                showSearch
                status={sale_state.fieldStatus.document}
                style={{ width: '100%' }}
                value={sale_state.selectDocument.selectedValue}
            />
            <span
                style={{
                    color: 'red',
                    display: sale_state.fieldStatus.document === 'error' ? 'block' : 'none'
                }}
            >
                Debe seleccionar el documento a emitir.
            </span>
        </>
    )

    // -------------- Select payment method -------------- //
    const onSearchPaymentMethod = async (e) => {
        const filters = JSON.stringify({ normalizedName: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findPaymentMethods = await api.mediospago.findPaginated(params)
        const paymentMethods = findPaymentMethods.docs
        const options = paymentMethods.map(paymentMethod => { return { label: paymentMethod.nombre, value: paymentMethod.normalizedName } })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PAYMENT_METHOD', payload: options })
    }

    const onSelectPaymentMethod = async (e) => {
        const filters = JSON.stringify({ normalizedName: e })
        const findPaymentMethods = await api.mediospago.findAllByFilters(filters)
        const paymentMethods = findPaymentMethods.docs
        sale_dispatch({ type: 'SET_PAYMENT_METHOD', payload: paymentMethods })
        sale_dispatch({ type: 'SET_STATUS_OF_PAYMENT_METHOD', payload: null })
    }

    const onClearPaymentMethod = () => {
        sale_dispatch({ type: 'SET_PAYMENT_METHOD', payload: [] })
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
    }

    const selectPaymentMethod = (
        <>
            <Select
                allowClear
                filterOption={nonCaseSensitive}
                filterSort={sortArrayOfSelectOptions}
                id='salesHeader_selectPaymentMethod'
                onClear={onClearPaymentMethod}
                onSearch={onSearchPaymentMethod}
                onSelect={onSelectPaymentMethod}
                options={sale_state.selectPaymentMethod.options}
                placeholder='Medio de pago'
                showSearch
                status={sale_state.fieldStatus.paymentMethod}
                style={{ width: '100%' }}
                value={sale_state.selectPaymentMethod.selectedValue}
            />
            <span
                style={{
                    color: 'red',
                    display: sale_state.fieldStatus.paymentMethod === 'error' ? 'block' : 'none'
                }}
            >
                Debe seleccionar un medio de pago.
            </span>
        </>
    )

    // -------------- Select payment plans ------------- //
    const clearPaymentPlanWhenSelectingPaymentMethod = async () => {
        const idOfSelectedPaymentMethods = sale_state.mediosPago
        const selectedPaymentPlans = sale_state.planesPago
        if (idOfSelectedPaymentMethods.length < 1 || selectedPaymentPlans.length < 1) return
        const selectedPaymentMethods = await Promise.all(
            idOfSelectedPaymentMethods.map(async idOfMethod => {
                const findMethod = await api.mediospago.findById(idOfMethod)
                return findMethod.data
            })
        )
        if (selectedPaymentMethods.includes(null) || selectedPaymentMethods.includes(undefined)) {
            return sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
        }
        const verifyIfSelectedPaymentMethodIncludesSelectedPaymentPlan = selectedPaymentMethods.map(method => {
            const arrayIdOfMethodPlans = method.planes.map(plan => plan._id)
            const idOfSelectedPlans = selectedPaymentPlans.map(plan => plan._id)
            const verifyIfSelectedMethodPlansIncludesSelectedPlans = idOfSelectedPlans.map(selectedPlanId => {
                if (arrayIdOfMethodPlans.includes(selectedPlanId)) return true
                else return false
            })
            if (verifyIfSelectedMethodPlansIncludesSelectedPlans.includes(true)) return true
            else return false
        })
        const selectedPaymentMethodIncludesSelectedPaymentPlan =
            verifyIfSelectedPaymentMethodIncludesSelectedPaymentPlan.includes(true) ? true : false
        if (selectedPaymentMethodIncludesSelectedPaymentPlan) return
        else sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
    }

    const loadPaymentPlans = async () => {
        if (sale_state.mediosPagoNombres.length === 0) return
        const findSelectedPaymentMethod = await api.mediospago.findById(sale_state.mediosPago[0])
        const paymentPlans = findSelectedPaymentMethod?.data?.planes ?? []
        const options = paymentPlans.map(paymentPlan => { return { label: paymentPlan.nombre, value: paymentPlan.normalizedName } })
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PAYMENT_PLAN', payload: options })
    }

    /* eslint-disable */
    useEffect(() => { clearPaymentPlanWhenSelectingPaymentMethod() }, [sale_state.mediosPagoNombres])
    useEffect(() => { loadPaymentPlans() }, [sale_state.mediosPagoNombres])
    /* eslint-enable */

    const onSelectPaymentPlan = async (e) => {
        const findSelectedPaymentMethod = await api.mediospago.findById(sale_state.mediosPago[0])
        const findPlansOfPaymentMethod = findSelectedPaymentMethod?.data?.planes ?? []
        const paymentPlan = findPlansOfPaymentMethod.filter(paymentPlan => paymentPlan.normalizedName === e)
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: paymentPlan })
        sale_dispatch({ type: 'SET_STATUS_OF_PAYMENT_PLAN', payload: null })
    }

    const onClearPaymentPlan = () => {
        sale_dispatch({ type: 'SET_PAYMENT_PLAN', payload: [] })
    }

    const selectPaymentPlan = (
        <>
            <Select
                allowClear
                filterOption={nonCaseSensitive}
                filterSort={sortArrayOfSelectOptions}
                id='salesHeader_selectPaymentPlan'
                onClear={onClearPaymentPlan}
                onSelect={onSelectPaymentPlan}
                options={sale_state.selectPaymentPlan.options}
                placeholder='Plan de pago'
                showSearch
                status={sale_state.fieldStatus.paymentPlan}
                style={{ width: '100%' }}
                value={sale_state.selectPaymentPlan.selectedValue}
            />
            <span
                style={{
                    color: 'red',
                    display: sale_state.fieldStatus.paymentPlan === 'error' ? 'block' : 'none'
                }}
            >
                Debe seleccionar un plan de pago.
            </span>
        </>
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
                label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', width: '50%' }}>
                            {product.codigoBarras}
                        </div>
                        <div style={{ width: '50%' }}>
                            {'(' + product.nombre + ')'}
                        </div>
                    </div>
                ),
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
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            sale_dispatch({ type: 'SET_PRODUCT', payload: product })
        }
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: [] })
        sale_state.refs.selectToAddProductByBarcode.focus()
    }

    const selectToAddProductByBarcode = (
        <Select
            allowClear
            id='salesHeader_selectToAddProductByBarcode'
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
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            sale_dispatch({ type: 'SET_PRODUCT', payload: product })
        }
        sale_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: [] })
        sale_state.refs.selectToAddProductByName.focus()
    }

    const selectToAddProductByName = (
        <Select
            allowClear
            filterOption={nonCaseSensitive}
            id='salesHeader_selectToAddProductByName'
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

    // ----------- Title of general percentage ----------- //
    const invalidStatusOfTitleOfGeneralPercentage = () => {
        const invalidStatus = statusOfGeneralPercentageValue() === 'error' || !sale_state.generalPercentage || !sale_state.generalPercentageType
        if (invalidStatus) return true
        else return false
    }

    const titleOfGeneralPercentage = invalidStatusOfTitleOfGeneralPercentage()
        ? null
        : sale_state.generalPercentageType === 'discount'
            ? <h1>Descuento general del {sale_state.generalPercentage}%</h1>
            : <h1>Recargo general del {sale_state.generalPercentage}%</h1>

    // ------------- Title of voucher total -------------- //
    const invalidStatusOfTitleOfVoucherTotal = () => {
        const invalidStatus = statusOfGeneralPercentageValue() === 'error' || sale_state.existsLineError
        if (invalidStatus) return true
        else return false
    }

    const titleOfVoucherTotal = invalidStatusOfTitleOfVoucherTotal()
        ? null
        : <h1>Neto Total: {sale_state.total}</h1>


    // ----------------------- GRID ---------------------- //
    const itemsToRender_group1 = [selectToAddProductByName, selectToAddProductByBarcode]
    const itemsToRender_group2 = [datePickerForBillingDate, selectClient, selectDocument, selectPaymentMethod, selectPaymentPlan]
    const itemsToRender_group3 = [inputCustomProduct, inputGeneralPercentage]
    const groupsToRender = [
        { order: { lg: 3, md: 3, sm: 3, xl: 1, xs: 3, xxl: 1 }, toRender: itemsToRender_group1 },
        { order: { lg: 1, md: 1, sm: 1, xl: 2, xs: 1, xxl: 2 }, toRender: itemsToRender_group2 },
        { order: { lg: 2, md: 2, sm: 2, xl: 3, xs: 2, xxl: 3 }, toRender: itemsToRender_group3 }
    ]
    const responsiveSpan = { lg: 12, md: 12, sm: 24, xl: 8, xs: 24, xxl: 8 }

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Row gutter={[8, 8]}>
                    {
                        groupsToRender.map((group, groupIndex) => {
                            return (
                                <Col
                                    key={'saleHeader_groupsToRender_' + groupIndex}
                                    lg={{ order: group.order.lg, span: responsiveSpan.lg }}
                                    md={{ order: group.order.md, span: responsiveSpan.md }}
                                    sm={{ order: group.order.sm, span: responsiveSpan.sm }}
                                    xl={{ order: group.order.xl, span: responsiveSpan.xl }}
                                    xs={{ order: group.order.xs, span: responsiveSpan.xs }}
                                    xxl={{ order: group.order.xxl, span: responsiveSpan.xxl }}
                                >
                                    <Row gutter={[8, 8]}>
                                        {
                                            group.toRender.map((item, itemIndex) => {
                                                return (
                                                    <Col
                                                        key={`saleHeader_itemsToRender_group${groupIndex}_ + ${itemIndex}`}
                                                        span={24}
                                                    >
                                                        {item}
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Col>
            <Col span={24}>
                <Row>
                    <Col span={12}>
                        {titleOfGeneralPercentage}
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        {titleOfVoucherTotal}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Header