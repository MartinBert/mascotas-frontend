// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import Delete from '../../components/icons/Delete'

// Design Components
import { Button, Checkbox, Col, Input, Row, Space, Spin, Table } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import Header from './Header'
import FinalizeSaleModal from './FinalizeSaleModal'
import { errorAlert } from '../../components/alerts'

// Imports Destructurings
const { useSaleContext } = contexts.Sale
const { findNextVoucherNumber_fiscal, findNextVoucherNumber_noFiscal } = helpers.afipHelper
const { round } = helpers.mathHelper
const { fixInputNumber, fixInputNumberValue } = helpers.stringHelper


const Ventas = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    // --------------------- Actions --------------------- //
    const addRefs = () => {
        const refs = {
            ...sale_state.refs,
            inputCustomPercentageIva: sale_state.loadingView ? null : document.getElementById('salesHeader_inputCustomPercentageIva')
        }
        sale_dispatch({ type: 'SET_REFS', payload: refs })
    }

    const loadData = async () => {
        // Refs data
        const refs = {
            buttonToAddCustomProduct: sale_state.loadingView ? null : document.getElementById('salesHeader_buttonToAddCustomProduct'),
            buttonToCancelFinalizeSale: sale_state.loadingView ? null : document.getElementById('salesFinalizeSaleModal_buttonToCancelFinalizeSale'),
            buttonToFinalizeSale: sale_state.loadingView ? null : document.getElementById('salesIndex_buttonToFinalizeSale'),
            buttonToSaveFinalizeSale: sale_state.loadingView ? null : document.getElementById('salesFinalizeSaleModal_buttonToSaveFinalizeSale'),
            datePicker: sale_state.loadingView ? null : document.getElementById('salesHeader_datePickerForBillingDate'),
            inputCustomConcept: sale_state.loadingView ? null : document.getElementById('salesHeader_inputCustomConcept'),
            inputCustomProduct: sale_state.loadingView ? null : document.getElementById('salesHeader_inputCustomProduct'),
            inputCustomUnitPrice: sale_state.loadingView ? null : document.getElementById('salesHeader_inputCustomUnitPrice'),
            inputGeneralPercentage: sale_state.loadingView ? null : document.getElementById('salesHeader_inputGeneralPercentage'),
            inputGeneralPercentageValue: sale_state.loadingView ? null : document.getElementById('salesHeader_inputGeneralPercentageValue'),
            salesIndex: sale_state.loadingView ? null : document.getElementById('salesIndex'),
            selectClient: sale_state.loadingView ? null : document.getElementById('salesHeader_selectClient'),
            selectDocument: sale_state.loadingView ? null : document.getElementById('salesHeader_selectDocument'),
            selectPaymentMethod: sale_state.loadingView ? null : document.getElementById('salesHeader_selectPaymentMethod'),
            selectPaymentPlan: sale_state.loadingView ? null : document.getElementById('salesHeader_selectPaymentPlan'),
            selectGeneralPercentageType: sale_state.loadingView ? null : document.getElementById('salesHeader_selectGeneralPercentageType'),
            selectToAddProductByBarcode: sale_state.loadingView ? null : document.getElementById('salesHeader_selectToAddProductByBarcode'),
            selectToAddProductByName: sale_state.loadingView ? null : document.getElementById('salesHeader_selectToAddProductByName')
        }
        sale_dispatch({ type: 'SET_REFS', payload: refs })
        // User data
        const userId = localStorage.getItem('userId')
        const loggedUser = await api.users.findById(userId)
        const findBusiness = await api.business.findById(loggedUser.data.empresa._id)
        sale_dispatch({ type: 'SET_COMPANY', payload: findBusiness.data })
        sale_dispatch({ type: 'SET_SALE_POINT', payload: loggedUser.data.puntoVenta })
        sale_dispatch({ type: 'SET_USER', payload: loggedUser.data })
        // Voucher data
        const response = await api.sales.findLastIndex()
        sale_dispatch({ type: 'SET_INDEX', payload: response.data + 1 })
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

    const setFocusWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            setFocus()
        } else return
    }

    const updateLines = () => {
        sale_dispatch({ type: 'SET_LINES', payload: sale_state.productos })
    }

    const updateState = () => {
        sale_dispatch({ type: 'UPDATE_LINES_VALUES' })
        sale_dispatch({ type: 'UPDATE_TOTALS' })
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
            selectToAddProductByName: sale_state.refs.selectToAddProductByName,
            selectToAddProductByProductCode: sale_state.refs.selectToAddProductByProductCode
        }
        const existsRefs = !Object.values(refs).includes(null)
        const data = { existsRefs, refs }
        return data
    }

    const verifyErrorsInLines = () => {
        const errorsInLines = sale_state.renglones.map(line => {
            const errorsArray = [
                statusOfLineDiscountPercentage(line) === 'error' ? true : false,
                statusOfLineNetPrice(line) === 'error' ? true : false,
                statusOfLineQuantity(line) === 'error' ? true : false,
                statusOfLineSurchargePercentage(line) === 'error' ? true : false
            ]
            const existsErrorInLine = errorsArray.includes(true) ? true : false
            return existsErrorInLine
        })
        const existsErrors = errorsInLines.includes(true) ? true : false
        if (existsErrors) sale_dispatch({ type: 'SET_EXISTS_LINE_ERROR', payload: true })
        else sale_dispatch({ type: 'SET_EXISTS_LINE_ERROR', payload: false })
    }

    /* eslint-disable */
    useEffect(() => { addRefs() }, [sale_state.empresa])
    useEffect(() => { verifyErrorsInLines() }, [sale_state.renglones])
    useEffect(() => { loadData() }, [])
    useEffect(() => { setFocus() }, [
        sale_state.valueForDatePicker,
        sale_state.selectClient.selectedValue,
        sale_state.selectDocument.selectedValue,
        sale_state.selectPaymentMethod.selectedValue,
        sale_state.selectPaymentPlan.selectedValue
    ])
    useEffect(() => { updateLines() }, [sale_state.productos.length])
    useEffect(() => { updateState() }, [sale_state.lastModifiedParameter])
    /* eslint-enable */

    // ------------ Actions of product to sale ----------- //
    const deleteProduct = (line) => {
        sale_dispatch({ type: 'DELETE_PRODUCT', payload: line })
    }

    const actionsOfProductToSale = (line) => {
        const element = (
            <div
                align='middle'
                key={line.key}
                onClick={e => deleteProduct(line)}
            >
                <Delete />
            </div>
        )
        return element
    }

    // ---------- Button to start finalize sale ---------- //
    const loadNextVoucherNumber = async () => {
        if (!sale_state.documento) return 'error'
        if (!sale_state.empresa) return 'error'
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
        if (isNaN(number)) {
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
            return 'error'
        } else {
            sale_dispatch({ type: 'SET_VOUCHER_NUMBERS', payload: number })
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
            return 'success'
        }
    }

    const restartErrorIfNotExistsProducts = () => {
        return sale_dispatch({ type: 'SET_ERROR_IF_NOT_EXISTS_PRODUCTS', payload: false })
    }

    const startFinalizeSale = async () => {
        if (sale_state.renglones.length < 1) {
            sale_dispatch({ type: 'SET_ERROR_IF_NOT_EXISTS_PRODUCTS', payload: true })
            setTimeout(restartErrorIfNotExistsProducts, 2000)
            return sale_state.refs.selectToAddProductByName.focus()
        }
        const status = {
            ...sale_state.fieldStatus,
            client: !sale_state.cliente ? 'error' : null,
            document: !sale_state.documento ? 'error' : null,
            paymentMethod: sale_state.mediosPago.length < 1 ? 'error' : null,
            paymentPlan: sale_state.planesPago.length < 1 ? 'error' : null
        }
        sale_dispatch({ type: 'SET_STATUS_TO_FINALIZE_SALE', payload: status })
        const errorAtStartFinalizeSale = Object.values(status).includes('error') || sale_state.existsLineError
        if (errorAtStartFinalizeSale) return
        const loadVoucherNumber = await loadNextVoucherNumber()
        if (loadVoucherNumber === 'error') errorAlert('Problemas al recuperar la correlación fiscal desde AFIP. Recargue la página.')
        sale_dispatch({ type: 'SHOW_FINALIZE_SALE_MODAL' })
    }

    const buttonToStartFinalizeSale = (
        <Row align='middle' gutter={8}>
            <Col span={6}>
                <Button
                    className='btn-primary'
                    disabled={sale_state.loadingDocumentIndex ? true : false}
                    id='salesIndex_buttonToFinalizeSale'
                    onClick={startFinalizeSale}
                >
                    Finalizar venta
                </Button>
            </Col>
            {
                !sale_state.loadingDocumentIndex
                    ? null
                    : <Col span={6}><Spin /></Col>
            }
            {
                !sale_state.errorIfNotExistsProducts
                    ? null
                    : (
                        <Col span={6}>
                            <span style={{ color: 'red' }}>
                                Debes seleccionar al menos un producto.
                            </span>
                        </Col>
                    )
            }
        </Row>
    )

    // ------------- Checkbox to fractionate ------------- //
    const onChangeFractionateCheckbox = (e, line) => {
        line.fraccionar = e.target.checked
        sale_dispatch({ type: 'SET_FRACTIONED', payload: line })
    }

    const checkboxToFractionate = (line) => {
        const element = (
            <Checkbox
                checked={line.fraccionar === true ? true : false}
                disabled={line.key.startsWith('customProduct_')}
                key={line.key}
                onChange={e => onChangeFractionateCheckbox(e, line)}
                onKeyUp={setFocusWhenPressingEsc}
            />
        )
        return element
    }

    // ------------- Input discount percentage ----------- //
    const statusOfLineDiscountPercentage = (line) => {
        if (
            parseFloat(line.porcentajeDescuentoRenglon) < 0
            || parseFloat(line.porcentajeDescuentoRenglon) > 100
            || line?.porcentajeDescuentoRenglon?.toString()?.endsWith('.')
            || line?.porcentajeDescuentoRenglon?.toString()?.endsWith(',')
        ) return 'error'
        else return null
    }

    const onChangeDiscountPercent = (e, line) => {
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = sale_state.renglones.find(renglon => renglon._id === line._id).porcentajeDescuentoRenglon
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({
            type: 'SET_LINE_DISCOUNT_PERCENTAGE',
            payload: { _id: line._id, porcentajeDescuentoRenglon: fixedValue }
        })
    }

    const inputDiscountPercentage = (line) => {
        const element = (
            <div key={line.key}>
                <Input
                    allowClear
                    disabled={line.porcentajeRecargoRenglon > 0}
                    onChange={e => onChangeDiscountPercent(e, line)}
                    onKeyUp={setFocusWhenPressingEsc}
                    status={statusOfLineDiscountPercentage(line)}
                    style={{ width: '100%' }}
                    value={line.porcentajeDescuentoRenglon}
                />
                <span
                    style={{
                        color: 'red',
                        display: statusOfLineDiscountPercentage(line) === 'error' ? 'block' : 'none'
                    }}
                >
                    Escribe un porcentaje válido entre cero y 100.
                </span>
            </div>
        )
        return element
    }

    // ----------------- Input gross price --------------- //
    const inputGrossPrice = (line) => {
        const element = (
            <Input
                disabled={true}
                key={line.key}
                value={round(line.precioBruto)}
            />
        )
        return element
    }

    // ------------------ Input net price ---------------- //
    const statusOfLineNetPrice = (line) => {
        if (
            !line.precioNeto
            || line.precioNeto === ''
            || parseFloat(line.precioNeto) < 0
            || line?.precioNeto?.toString()?.endsWith('.')
            || line?.precioNeto?.toString()?.endsWith(',')
        ) return 'error'
        else return null
    }

    const onChangeFixedNetPriceCheckbox = (e, line) => {
        line.precioNetoFijo = e.target.checked
        sale_dispatch({ type: 'SET_NET_PRICE_FIXED', payload: line })
    }

    const onChangeNetPrice = (e, line) => {
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = sale_state.renglones.find(renglon => renglon._id === line._id).precioNeto
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({
            type: 'SET_NET_PRICE',
            payload: { _id: line._id, precioNeto: fixedValue }
        })
    }

    const inputNetPrice = (line) => {
        const element = (
            <Row align='middle' key={line.key}>
                <Col span={3}>
                    <Checkbox
                        onChange={e => onChangeFixedNetPriceCheckbox(e, line)}
                        onKeyUp={setFocusWhenPressingEsc}
                    />
                </Col>
                <Col span={21}>
                    <Input
                        allowClear
                        disabled={line.precioNetoFijo ? true : false}
                        onChange={e => onChangeNetPrice(e, line)}
                        onKeyUp={setFocusWhenPressingEsc}
                        status={statusOfLineNetPrice(line)}
                        style={{ width: '100%' }}
                        value={line.precioNeto}
                    />
                </Col>
                <span
                    style={{
                        color: 'red',
                        display: statusOfLineNetPrice(line) === 'error' ? 'block' : 'none'
                    }}
                >
                    Escribe un precio neto válido.
                </span>
            </Row>
        )
        return element
    }

    // -------------------- Input note ------------------- //
    const setNote = (value, lineID) => {
        sale_dispatch({ type: 'SET_LINE_NOTE', payload: { lineID: lineID, note: value } })
    }

    const inputNote = (line) => {
        const element = (
            <Space.Compact key={line.key} style={{ width: '100%' }}>
                <Input
                    addonBefore='Nota'
                    onChange={e => setNote(e.target.value, line._id)}
                    onKeyUp={setFocusWhenPressingEsc}
                    value={line.nota}
                />
                <Button
                    danger
                    onClick={() => setNote('', line._id)}
                    onKeyUp={setFocusWhenPressingEsc}
                    type='primary'
                >
                    Borrar
                </Button>
            </Space.Compact>
        )
        return element
    }

    // ------------------ Input quantity ----------------- //
    const statusOfLineQuantity = (line) => {
        if (
            !line.cantidadUnidades
            || !line.cantidadUnidadesFraccionadas
            || parseFloat(line.cantidadUnidades) < 0
            || parseFloat(line.cantidadUnidadesFraccionadas) < 0
            || line?.cantidadUnidades?.toString()?.endsWith('.')
            || line?.cantidadUnidades?.toString()?.endsWith(',')
            || line?.cantidadUnidadesFraccionadas?.toString()?.endsWith('.')
            || line?.cantidadUnidadesFraccionadas?.toString()?.endsWith(',')
        ) return 'error'
        else return null
    }

    const hideSpanOfMeasureUnity = (line) => {
        if (!line.unidadMedida) return 'none'
        const unitOfMeasureIncludesKg = line.unidadMedida.nombre.toLowerCase().includes('kilo')
        const unitOfMeasureIncludesGr = line.unidadMedida.nombre.toLowerCase().includes('gramo')
        if (unitOfMeasureIncludesKg || unitOfMeasureIncludesGr) return 'block'
        else return 'none'
    }

    const onChangeLineQuantity = (e, line) => {
        const prevLine = sale_state.renglones.find(renglon => renglon._id === line._id)
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = line.fraccionar ? prevLine.cantidadUnidadesFraccionadas : prevLine.cantidadUnidades
        const fixedValue = fixInputNumber(currentValue, prevValue)
        const cantidadUnidades = (
            line.fraccionar
                ? (parseFloat(fixedValue) / parseFloat(line.fraccionamiento))
                : fixedValue
        )
        const cantidadUnidadesFraccionadas = (
            line.fraccionar
                ? fixedValue
                : (parseFloat(fixedValue) * parseFloat(line.fraccionamiento))
        )
        sale_dispatch({
            type: 'SET_LINE_QUANTITY',
            payload: { _id: line._id, cantidadUnidades, cantidadUnidadesFraccionadas }
        })
    }

    const inputQuantity = (line) => {
        const element = (
            <Row gutter={8} key={line.key}>
                <Col span={16}>
                    <Input
                        allowClear
                        disabled={line.precioNetoFijo === true ? true : false}
                        onChange={e => onChangeLineQuantity(e, line)}
                        onKeyUp={setFocusWhenPressingEsc}
                        status={statusOfLineQuantity(line)}
                        style={{ width: '100%' }}
                        value={line.fraccionar ? line.cantidadUnidadesFraccionadas : line.cantidadUnidades}
                    />
                </Col>
                <Col span={8}>
                    {line.fraccionar ? <p>/ {line.fraccionamiento}</p> : null}
                </Col>
                <span
                    style={{ textAlign: 'end', display: hideSpanOfMeasureUnity(line) }}
                >
                    {line.cantidadKg} kg {round(line.cantidadg)} g
                </span>
                <span
                    style={{
                        color: 'red',
                        display: statusOfLineQuantity(line) === 'error' ? 'block' : 'none'
                    }}
                >
                    Escribe una cantidad válida.
                </span>
            </Row>
        )
        return element
    }

    // ------------ Input surcharge percentage ----------- //
    const statusOfLineSurchargePercentage = (line) => {
        if (
            parseFloat(line.porcentajeRecargoRenglon) < 0
            || line?.porcentajeRecargoRenglon?.toString()?.endsWith('.')
            || line?.porcentajeRecargoRenglon?.toString()?.endsWith(',')
        ) return 'error'
        else return null
    }

    const onChangeSurchargePercent = (e, line) => {
        const currentValue = fixInputNumberValue(e.target.value)
        const prevValue = sale_state.renglones.find(renglon => renglon._id === line._id).porcentajeRecargoRenglon
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({
            type: 'SET_LINE_SURCHARGE_PERCENTAGE',
            payload: { _id: line._id, porcentajeRecargoRenglon: fixedValue }
        })
    }

    const inputSurchargePercentage = (line) => {
        const element = (
            <div key={line.key}>
                <Input
                    allowClear
                    disabled={line.porcentajeDescuentoRenglon > 0}
                    onKeyUp={setFocusWhenPressingEsc}
                    status={statusOfLineSurchargePercentage(line)}
                    style={{ width: '100%' }}
                    onChange={e => onChangeSurchargePercent(e, line)}
                    value={line.porcentajeRecargoRenglon}
                />
                <span
                    style={{
                        color: 'red',
                        display: statusOfLineSurchargePercentage(line) === 'error' ? 'block' : 'none'
                    }}
                >
                    Escribe un porcentaje válido.
                </span>
            </div>
        )
        return element
    }

    // ----------------- Input unit price ---------------- //
    const inputUnitPrice = (line) => {
        const element = (
            <Input
                disabled={true}
                key={line.key}
                value={line.cantidadUnidades > 0 ? line.precioUnitario : 0}
            />
        )
        return element
    }

    // ----------- Table of products for sale ------------ //
    const columns = [
        {
            dataIndex: 'saleProducts_fractionate',
            render: (_, line) => checkboxToFractionate(line),
            title: 'Fracc.'
        },
        {
            dataIndex: 'saleProducts_name',
            render: (_, line) => line.nombre,
            title: 'Producto',
            width: 300
        },
        {
            dataIndex: 'saleProducts_quantity',
            render: (_, line) => inputQuantity(line),
            title: 'Cantidad'
        },
        {
            dataIndex: 'saleProducts_unitPrice',
            render: (_, line) => inputUnitPrice(line),
            title: 'Prec. U.'
        },
        {
            dataIndex: 'saleProducts_discountPercentage',
            render: (_, line) => inputDiscountPercentage(line),
            title: '% Descuento'
        },
        {
            dataIndex: 'saleProducts_surchargePercentage',
            render: (_, line) => inputSurchargePercentage(line),
            title: '% Recargo'
        },
        {
            dataIndex: 'saleProducts_grossPrice',
            render: (_, line) => inputGrossPrice(line),
            title: 'Precio bruto'
        },
        {
            dataIndex: 'saleProducts_netPrice',
            render: (_, line) => inputNetPrice(line),
            title: 'Precio neto'
        },
        {
            dataIndex: 'saleProducts_actions',
            render: (_, line) => actionsOfProductToSale(line),
            title: 'Quitar'
        }
    ]

    const tableOfProductsForSale = (
        <Table
            columns={columns}
            dataSource={sale_state.renglones}
            expandable={{ expandedRowRender: renglon => inputNote(renglon) }}
            pagination={false}
            rowKey='_id'
            size='small'
            tableLayout='auto'
            width={'100%'}
        />
    )


    return (
        <>
            {
                sale_state.loadingView
                    ? <Spin />
                    : (
                        <>
                            {
                                sale_state.loadingFinalizeSale
                                    ? <Spin />
                                    : (
                                        <Row gutter={[0, 8]} id='salesIndex'>
                                            <Col span={24}>
                                                <Header />
                                            </Col>
                                            <Col span={24}>
                                                {tableOfProductsForSale}
                                            </Col>
                                            <Col span={24}>
                                                {buttonToStartFinalizeSale}
                                            </Col>
                                        </Row>
                                    )
                            }
                            <FinalizeSaleModal />
                            <div id='voucher' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
                            <div id='ticket' style={{ width: '303px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
                        </>
                    )
            }
        </>
    )
}

export default Ventas