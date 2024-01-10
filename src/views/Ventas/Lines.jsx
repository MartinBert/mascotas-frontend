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

    const deleteProduct = (productID) => {
        saleProducts_dispatch({ type: 'DELETE_PRODUCT', payload: productID })
    }

    const columns = [
        {
            key: 'columna_fraccionar',
            title: 'Fracc.',
            render: (product) => (
                <Checkbox
                    checked={product.fraccionar === true ? true : false}
                    disabled={product._id.startsWith('customProduct_')}
                    onChange={e => {
                        product.fraccionar = e.target.checked
                        sale_dispatch({ type: 'SET_FRACTIONED', payload: product })
                        sale_dispatch({ type: 'SET_TOTAL' })
                    }}
                />
            ),
        },
        {
            key: 'columna_producto',
            title: 'Producto',
            dataIndex: 'nombre',
            width: 300
        },
        {
            key: 'columna_cantidad',
            title: 'Cantidad',
            render: (product) => (
                <>
                    <Row gutter={8}>
                        <Col span={16}>
                            <Input
                                color='primary'
                                type='number'
                                placeholder='Cantidad'
                                disabled={product.precioNetoFijo === true ? true : false}
                                value={product.fraccionar === true ? round(product.cantidadUnidades) : roundTwoDecimals(product.cantidadUnidades)}
                                onChange={(e) => {
                                    sale_dispatch({
                                        type: 'SET_LINE_QUANTITY',
                                        payload: {
                                            _id: product._id,
                                            cantidadUnidades: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                                        },
                                    })
                                    sale_dispatch({ type: 'SET_TOTAL' })
                                }}
                            />
                        </Col>
                        {
                            (product.fraccionar)
                                ?
                                <Col span={8}>
                                    <p>/ {product.fraccionamiento}</p>
                                </Col>
                                : null
                        }
                    </Row>
                    <Row
                        align='middle'
                        hidden={
                            (!product.unidadMedida)
                                ? true
                                : (
                                    ((product.unidadMedida).toLowerCase()).includes('kilo')
                                    || ((product.unidadMedida).toLowerCase()).includes('gramo')
                                )
                                    ? false
                                    : true
                        }
                    >
                        <span>{product.cantidadKg} kg {round(product.cantidadg)} g</span>
                    </Row>
                </>
            ),
        },
        {
            key: 'columna_preciounitario',
            title: 'Prec. U.',
            render: (product) => (
                <Input
                    color='primary'
                    type='number'
                    placeholder='Prec. U.'
                    value={product.cantidadUnidades > 0 ? product.precioUnitario : 0}
                    disabled={true}
                />
            ),
        },
        {
            key: 'columna_porcentajedescuento',
            title: '% Descuento',
            render: (product) => (
                <Input
                    color='primary'
                    type='number'
                    placeholder='Porc. descuento'
                    value={product.porcentajeDescuentoRenglon}
                    disabled={product.porcentajeRecargoRenglon > 0}
                    onChange={(e) => {
                        sale_dispatch({
                            type: 'SET_LINE_DISCOUNT_PERCENT',
                            payload: {
                                _id: product._id,
                                porcentajeDescuentoRenglon: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                            },
                        })
                        sale_dispatch({ type: 'SET_TOTAL' })
                    }}
                />
            ),
        },
        {
            key: 'columna_porcentajerecargo',
            title: '% Recargo',
            render: (product) => (
                <Input
                    color='primary'
                    type='number'
                    placeholder='Porc. recargo'
                    value={product.porcentajeRecargoRenglon}
                    disabled={product.porcentajeDescuentoRenglon > 0}
                    onChange={(e) => {
                        sale_dispatch({
                            type: 'SET_LINE_SURCHARGE_PERCENT',
                            payload: {
                                _id: product._id,
                                porcentajeRecargoRenglon: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                            },
                        })
                        sale_dispatch({ type: 'SET_TOTAL' })
                    }}
                />
            ),
        },
        {
            key: 'columna_preciobruto',
            title: 'Precio bruto',
            render: (product) => (
                <Input
                    color='primary'
                    type='number'
                    placeholder='Precio bruto'
                    value={roundTwoDecimals(product.precioBruto)}
                    disabled={true}
                />
            ),
        },
        {
            key: 'columna_precioneto',
            title: 'Precio neto',
            render: (product) => (
                <Row align='middle'>
                    <Col span={3}>
                        <Checkbox onChange={(e) => {
                            product.precioNetoFijo = e.target.checked
                            sale_dispatch({ type: 'SET_NET_PRICE_FIXED', payload: product })
                            sale_dispatch({ type: 'SET_TOTAL' })
                        }} />
                    </Col>
                    <Col span={21}>
                        <Input
                            color='primary'
                            type='number'
                            placeholder='Total'
                            disabled={product.precioNetoFijo === true ? true : false}
                            value={product.precioNeto}
                            onChange={(e) => {
                                sale_dispatch({
                                    type: 'SET_NET_PRICE',
                                    payload: {
                                        _id: product._id,
                                        precioNeto: e.target.value.length > 0 ? parseFloat(e.target.value) : 0,
                                    },
                                })
                                sale_dispatch({ type: 'SET_TOTAL' })
                            }} />
                    </Col>
                </Row>
            )
        },
        {
            key: 'columna_quitar',
            title: 'Quitar',
            render: (product) => (
                <Col
                    align='middle'
                    onClick={() => deleteProduct(product._id)}
                >
                    <Delete />
                </Col>
            ),
        },
    ]

    useEffect(() => {
        sale_dispatch({ type: 'SET_LINES', payload: saleProducts_state.params.products })
        sale_dispatch({ type: 'SET_PRODUCTS', payload: saleProducts_state.params.products })
        sale_dispatch({ type: 'SET_TOTAL' })
    }, [sale_dispatch, saleProducts_state.params.products])

    const setNote = (value, lineID) => {
        sale_dispatch({
            type: 'SET_LINE_NOTE',
            payload: {
                note: value,
                lineID: lineID
            }
        })
    }

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
