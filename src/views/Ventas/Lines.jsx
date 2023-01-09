import React, { useEffect } from 'react'
import { Table, Input, Checkbox, Row, Col } from 'antd'
import icons from '../../components/icons'
import helpers from '../../helpers'

const { round, roundTwoDecimals } = helpers.mathHelper
const { Delete } = icons

const Lines = ({
    productState,
    productDispatch,
    productActions,
    state,
    dispatch,
    actions,
}) => {

    const { DELETE_PRODUCT } = productActions
    const {
        SET_FRACTIONED,
        SET_LINES,
        SET_LINE_DISCOUNT_PERCENT,
        SET_LINE_SURCHARGE_PERCENT,
        SET_LINE_QUANTITY,
        SET_NET_PRICE,
        SET_NET_PRICE_FIXED,
        SET_PRODUCTS,
        SET_TOTAL,
    } = actions

    const columnsForTable = [
        {
            title: 'Fracc.',
            render: (product) => (
                <Checkbox
                    checked={product.fraccionar === true ? true : false}
                    onChange={(e) => {
                        product.fraccionar = e.target.checked
                        dispatch({ type: SET_FRACTIONED, payload: product })
                        dispatch({ type: SET_TOTAL })
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
                                    dispatch({
                                        type: SET_LINE_QUANTITY,
                                        payload: {
                                            _id: product._id,
                                            cantidadUnidades: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                                        },
                                    })
                                    dispatch({ type: SET_TOTAL })
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
                    <Row align='middle'>
                        <span>{product.cantidadKg} kg  {round(product.cantidadg)} g</span>
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
                        dispatch({
                            type: SET_LINE_DISCOUNT_PERCENT,
                            payload: {
                                _id: product._id,
                                porcentajeDescuentoRenglon: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                            },
                        })
                        dispatch({ type: SET_TOTAL })
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
                        dispatch({
                            type: SET_LINE_SURCHARGE_PERCENT,
                            payload: {
                                _id: product._id,
                                porcentajeRecargoRenglon: e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                            },
                        })
                        dispatch({ type: SET_TOTAL })
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
                            dispatch({ type: SET_NET_PRICE_FIXED, payload: product })
                            dispatch({ type: SET_TOTAL })
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
                                dispatch({
                                    type: SET_NET_PRICE,
                                    payload: {
                                        _id: product._id,
                                        precioNeto: e.target.value.length > 0 ? parseFloat(e.target.value) : 0,
                                    },
                                })
                                dispatch({ type: SET_TOTAL })
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
                        productDispatch({ type: DELETE_PRODUCT, payload: product })
                    }}
                >
                    <Delete />
                </Col>
            ),
        },
    ]

    useEffect(() => {
        dispatch({ type: SET_LINES, payload: productState.selectedProducts })
        dispatch({ type: SET_PRODUCTS, payload: productState.selectedProducts })
        dispatch({ type: SET_TOTAL })
    },
        //eslint-disable-next-line
        [
            productState.selectedProducts,
            dispatch,
            SET_LINES,
            SET_PRODUCTS,
            SET_TOTAL,
        ])

    return (
        <Table
            style={{ marginTop: '20px' }}
            width={'100%'}
            dataSource={state.renglones}
            columns={columnsForTable}
            pagination={false}
            rowKey='_id'
            tableLayout='auto'
            size='small'
        />
    )
}

export default Lines
