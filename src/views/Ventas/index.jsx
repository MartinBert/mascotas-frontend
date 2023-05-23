// React Components and Hooks
import React, { useEffect, useReducer } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Services
import api from '../../services'

// Views
import Header from './Header'
import reducers from '../../reducers'
import DiscountSurchargeModal from './DiscountSurchargeModal'
import FinalizeSaleModal from './FinalizeSaleModal'
import Lines from './Lines'

// Design Components
import { Row, Col, Spin } from 'antd'

// Imports Destructurings
const { useLoggedUserContext } = contextProviders.LoggedUserContextProvider
const { productInitialState, productReducer, productActions } = reducers.productSelectionModalReducer.getNamedStates()
const { initialState, reducer, actions } = reducers.saleReducer
const {
    SET_COMPANY,
    SET_SALE_POINT,
    SET_DATES,
    SHOW_FINALIZE_SALE_MODAL,
    SET_INDEX,
    SET_USER
} = actions


const Ventas = () => {

    const loggedUserContext = useLoggedUserContext()
    const [ loggedUser_state ] = loggedUserContext
    const [state, dispatch] = useReducer(reducer, initialState)
    const [productState, productDispatch] = useReducer(
        productReducer,
        productInitialState
    )

    useEffect(() => {
        dispatch({ type: SET_COMPANY, payload: loggedUser_state.user.empresa })
        dispatch({ type: SET_SALE_POINT, payload: loggedUser_state.user.puntoVenta })
        dispatch({ type: SET_USER, payload: loggedUser_state.user })
        const fetchLastVoucherIndex = async () => {
            const lastIndex = await api.ventas.findLastIndex()
            dispatch({ type: SET_INDEX, payload: lastIndex + 1 })
        }
        fetchLastVoucherIndex()
    },
        //eslint-disable-next-line
        [])

    useEffect(() => {
        if (state.fechaEmision) return
        dispatch({ type: SET_DATES })
    },
        //eslint-disable-next-line
        [])

    const checkState = async () => {
        const result = new Promise(resolve => {
            if (!state.renglones || state.renglones.length < 1) resolve('Debe seleccionar al menos un producto para realizar la venta.')
            if (!state.cliente) resolve('Debe seleccionar un cliente para realizar la venta.')
            if (!state.documento) resolve('Debe indicar el documento/comprobante de la operación.')
            if (!state.mediosPago || state.mediosPago.length < 1) resolve('Debe seleccionar al menos un medio de pago para realizar la venta.')
            if (!state.planesPago || state.planesPago.length < 1) resolve('Debe seleccionar al menos un plan de pago para realizar la venta.')
            resolve('OK')
        })
        return await result
    }

    return (
        <>
            {
                (!state.loadingView)
                    ?
                    <Row>
                        <Col span={24}>
                            <Header
                                productState={productState}
                                productDispatch={productDispatch}
                                productActions={productActions}
                            />
                        </Col>
                        <Col span={24}>
                            <Lines
                                productState={productState}
                                productDispatch={productDispatch}
                                productActions={productActions}
                                state={state}
                                dispatch={dispatch}
                                actions={actions}
                            />
                        </Col>
                        <Col span={6} style={{ marginTop: '25px' }}>
                            <button
                                className='btn-primary'
                                onClick={() => {
                                    checkState()
                                        .then(result => {
                                            if (result === 'OK') return dispatch({ type: SHOW_FINALIZE_SALE_MODAL })
                                            return errorAlert(result)
                                        })
                                }}
                            >
                                Finalizar venta
                            </button>
                        </Col>
                    </Row>

                    : <Spin />
            }
            <DiscountSurchargeModal />
            <FinalizeSaleModal />
            <div id='voucher' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
            <div id='ticket' style={{ width: '303px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
        </>
    )
}

export default Ventas
