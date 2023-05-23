// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import icons from '../../components/icons'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Helpers
import helpers from '../../helpers'

// Design Components
import { Table, Input, Checkbox, Row, Col } from 'antd'

// Imports Destructurings
const { Delete } = icons
const { useSaleContext } = contextProviders.SaleContextProvider
const { useProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider
const { round, roundTwoDecimals } = helpers.mathHelper


const Lines = () => {

    const saleContext = useSaleContext()
    const [sale_state, sale_dispatch] = saleContext
    const productContext = useProductSelectionModalContext()
    const [product_state, product_dispatch] = productContext


    const columnsForTable = [
        {
            title: 'Fracc.',
            render: (product) => (
                <Checkbox
                    checked={product.fraccionar === true ? true : false}
                    onChange={(e) => {
                        product.fraccionar = e.target.checked
                        sale_dispatch({ type: 'SET_FRACTIONED', payload: product })
                        sale_dispatch({ type: 'SET_TOTAL' })
                    }} />
            ),
        },
        {
            title: 'Producto',
            dataIndex: 'nombre',
            width: 300
        },
        {
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
                        hidden={((product.unidadMedida).toLowerCase()).includes('kilo') || ((product.unidadMedida).toLowerCase()).includes('gramo') ? false : true}
                    >
                        <span>{product.cantidadKg} kg {round(product.cantidadg)} g</span>
                    </Row>
                </>
            ),
        },
        {
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
            title: 'Quitar',
            render: (product) => (
                <Col align='middle'
                    onClick={() => {
                        product_dispatch({ type: 'DELETE_PRODUCT', payload: product })
                    }}
                >
                    <Delete />
                </Col>
            ),
        },
    ]

    useEffect(() => {
        sale_dispatch({ type: 'SET_LINES', payload: product_state.selectedProducts })
        sale_dispatch({ type: 'SET_PRODUCTS', payload: product_state.selectedProducts })
        sale_dispatch({ type: 'SET_TOTAL' })
    },
        //eslint-disable-next-line
        [
            product_state.selectedProducts,
            sale_dispatch,
            'SET_LINES',
            'SET_PRODUCTS',
            'SET_TOTAL',
        ])

    return (
        <Table
            style={{ marginTop: '20px' }}
            width={'100%'}
            dataSource={sale_state.renglones}
            columns={columnsForTable}
            pagination={false}
            rowKey='_id'
            tableLayout='auto'
            size='small'
        />
    )
}

export default Lines
