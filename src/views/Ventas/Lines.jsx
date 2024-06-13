// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import icons from '../../components/icons'

// Design Components
import { Button, Checkbox, Col, Input, Row, Space, Table } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Imports Destructurings
const { useSaleContext } = contexts.Sale
const { useSaleProductsContext } = contexts.SaleProducts
const { round, roundTwoDecimals } = helpers.mathHelper
const { Delete } = icons


const Lines = () => {
    const [sale_state, sale_dispatch] = useSaleContext()
    const [saleProducts_state, saleProducts_dispatch] = useSaleProductsContext()

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

    const deleteProduct = (line) => {
        saleProducts_dispatch({ type: 'DELETE_PRODUCTS', payload: [line] })
    }

    const onChangeDiscountPercent = (e, line) => {
        sale_dispatch({
            type: 'SET_LINE_DISCOUNT_PERCENT',
            payload: {
                _id: line._id,
                porcentajeDescuentoRenglon: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
            }
        })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onChangeFixedNetPriceCheckbox = (e, line) => {
        line.precioNetoFijo = e.target.checked
        sale_dispatch({ type: 'SET_NET_PRICE_FIXED', payload: line })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onChangeFractionateCheckbox = (e, line) => {
        line.fraccionar = e.target.checked
        sale_dispatch({ type: 'SET_FRACTIONED', payload: line })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onChangeLineQuantity = (e, line) => {
        sale_dispatch({
            type: 'SET_LINE_QUANTITY',
            payload: {
                _id: line._id,
                cantidadUnidades: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
            }
        })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onChangeNetPrice = (e, line) => {
        sale_dispatch({
            type: 'SET_NET_PRICE',
            payload: {
                _id: line._id,
                precioNeto: e.target.value.length > 0 ? parseFloat(e.target.value) : 0,
            }
        })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const onChangeSurchargePercent = (e, line) => {
        sale_dispatch({
            type: 'SET_LINE_SURCHARGE_PERCENT',
            payload: {
                _id: line._id,
                porcentajeRecargoRenglon: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
            }
        })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const setNote = (value, lineID) => {
        sale_dispatch({
            type: 'SET_LINE_NOTE',
            payload: { lineID: lineID, note: value }
        })
    }

    const hideSpanOfMeasureUnity = (line) => {
        if (!line.unidadMedida) return true
        if (
            line.unidadMedida.toLowerCase().includes('kilo')
            || line.unidadMedida.toLowerCase().includes('gramo')
        ) return false
        else return true
    }

    const columns = [
        {
            dataIndex: 'saleProducts_fractionate',
            render: (_, line) => (
                <Checkbox
                    checked={line.fraccionar === true ? true : false}
                    disabled={line._id.startsWith('customProduct_')}
                    onChange={e => onChangeFractionateCheckbox(e, line)}
                    onKeyUp={setFocusWhenPressingEsc}
                />
            ),
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
            render: (_, line) => (
                <>
                    <Row gutter={8}>
                        <Col span={16}>
                            <Input
                                color='primary'
                                type='number'
                                placeholder='Cantidad'
                                disabled={line.precioNetoFijo === true ? true : false}
                                value={line.fraccionar === true ? round(line.cantidadUnidades) : roundTwoDecimals(line.cantidadUnidades)}
                                onChange={e => onChangeLineQuantity(e, line)}
                                onKeyUp={setFocusWhenPressingEsc}
                            />
                        </Col>
                        {
                            line.fraccionar
                                ? <Col span={8}><p>/ {line.fraccionamiento}</p></Col>
                                : null
                        }
                    </Row>
                    <Row
                        align='middle'
                        hidden={hideSpanOfMeasureUnity(line)}
                    >
                        <span>{line.cantidadKg} kg {round(line.cantidadg)} g</span>
                    </Row>
                </>
            ),
            title: 'Cantidad'
        },
        {
            dataIndex: 'saleProducts_unitPrice',
            render: (_, line) => (
                <Input
                    color='primary'
                    type='number'
                    onKeyUp={setFocusWhenPressingEsc}
                    placeholder='Prec. U.'
                    value={line.cantidadUnidades > 0 ? line.precioUnitario : 0}
                    disabled={true}
                />
            ),
            title: 'Prec. U.'
        },
        {
            dataIndex: 'saleProducts_discountPercentage',
            render: (_, line) => (
                <Input
                    color='primary'
                    type='number'
                    placeholder='Porc. descuento'
                    value={line.porcentajeDescuentoRenglon}
                    disabled={line.porcentajeRecargoRenglon > 0}
                    onChange={e => onChangeDiscountPercent(e, line)}
                    onKeyUp={setFocusWhenPressingEsc}
                />
            ),
            title: '% Descuento'
        },
        {
            dataIndex: 'saleProducts_surchargePercentage',
            render: (_, line) => (
                <Input
                    color='primary'
                    type='number'
                    onKeyUp={setFocusWhenPressingEsc}
                    placeholder='Porc. recargo'
                    value={line.porcentajeRecargoRenglon}
                    disabled={line.porcentajeDescuentoRenglon > 0}
                    onChange={e => onChangeSurchargePercent(e, line)}
                />
            ),
            title: '% Recargo'
        },
        {
            dataIndex: 'saleProducts_grossPrice',
            render: (_, line) => (
                <Input
                    color='primary'
                    disabled={true}
                    placeholder='Precio bruto'
                    value={roundTwoDecimals(line.precioBruto)}
                    type='number'
                />
            ),
            title: 'Precio bruto'
        },
        {
            dataIndex: 'saleProducts_netPrice',
            render: (_, line) => (
                <Row align='middle'>
                    <Col span={3}>
                        <Checkbox
                            onChange={e => onChangeFixedNetPriceCheckbox(e, line)}
                            onKeyUp={setFocusWhenPressingEsc}
                        />
                    </Col>
                    <Col span={21}>
                        <Input
                            color='primary'
                            type='number'
                            placeholder='Total'
                            disabled={line.precioNetoFijo === true ? true : false}
                            value={line.precioNeto}
                            onChange={e => onChangeNetPrice(e, line)}
                            onKeyUp={setFocusWhenPressingEsc}
                        />
                    </Col>
                </Row>
            ),
            title: 'Precio neto'
        },
        {
            dataIndex: 'saleProducts_actions',
            render: (_, line) => (
                <div
                    align='middle'
                    onClick={e => deleteProduct(line)}
                >
                    <Delete />
                </div>
            ),
            title: 'Quitar'
        }
    ]

    useEffect(() => {
        sale_dispatch({ type: 'SET_LINES', payload: saleProducts_state.params.productos })
        sale_dispatch({ type: 'SET_PRODUCTS', payload: saleProducts_state.params.productos })
        sale_dispatch({ type: 'SET_TOTAL' })
    }, [saleProducts_state.params.productos])


    return (
        <Table
            columns={columns}
            dataSource={sale_state.renglones}
            expandable={{
                expandedRowRender: renglon => (
                    <Space.Compact
                        style={{ width: '100%' }}
                    >
                        <Input
                            addonBefore='Nota'
                            key={renglon._id}
                            onChange={e => setNote(e.target.value, renglon._id)}
                            value={renglon.nota}
                        />
                        <Button
                            danger
                            onClick={() => setNote('', renglon._id)}
                            type='primary'
                        >
                            Borrar
                        </Button>
                    </Space.Compact>
                ),
            }}
            pagination={false}
            rowKey={renglon => renglon._id}
            size='small'
            tableLayout='auto'
            width={'100%'}
        />
    )
}

export default Lines