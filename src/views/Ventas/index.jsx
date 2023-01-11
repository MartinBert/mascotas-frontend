import React, { useEffect, useReducer } from 'react';
import Header from './Header';
import reducers from '../../reducers';
import DiscountSurchargeModal from './DiscountSurchargeModal';
import FinalizeSaleModal from './FinalizeSaleModal';
import Lines from './Lines';
import api from '../../services';
import { Row, Col, Spin } from 'antd';
import { errorAlert } from '../../components/alerts';

const { productInitialState, productReducer, productActions } = reducers.productSelectionModalReducer.getNamedStates();
const { initialState, reducer, actions } = reducers.saleReducer;

const Ventas = ({ userState }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [productState, productDispatch] = useReducer(
        productReducer,
        productInitialState
    );
    const { SET_COMPANY, SET_SALE_POINT, SET_DATES, SHOW_FINALIZE_SALE_MODAL, SET_INDEX, SET_USER } = actions;

    useEffect(() => {
        dispatch({ type: SET_COMPANY, payload: userState.user.empresa });
        dispatch({ type: SET_SALE_POINT, payload: userState.user.puntoVenta });
        dispatch({ type: SET_USER, payload: userState.user })
        const fetchLastVoucherIndex = async () => {
            const lastIndex = await api.ventas.findLastIndex();
            dispatch({ type: SET_INDEX, payload: lastIndex + 1 })
        }
        fetchLastVoucherIndex();
    },
        //eslint-disable-next-line
        []);

    useEffect(() => {
        if (state.fechaEmision) return;
        dispatch({ type: SET_DATES });
    },
        //eslint-disable-next-line
        []);

    const checkState = async () => {
        const result = new Promise(resolve => {
            if (!state.renglones || state.renglones.length < 1) resolve('Debe seleccionar al menos un producto para realizar la venta.')
            if (!state.cliente) resolve('Debe seleccionar un cliente para realizar la venta.')
            if (!state.documento) resolve('Debe indicar el documento/comprobante de la operación.')
            if (!state.mediosPago || state.mediosPago.length < 1) resolve('Debe seleccionar al menos un medio de pago para realizar la venta.')
            if (!state.planesPago || state.planesPago.length < 1) resolve('Debe seleccionar al menos un plan de pago para realizar la venta.')
            resolve('OK')
        })
        return await result;
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
                                actions={actions}
                                dispatch={dispatch}
                                state={state}
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
                                            return errorAlert(result);
                                        })
                                }}
                            >
                                Finalizar venta
                            </button>
                        </Col>
                    </Row>

                    : <Spin />
            }
            <DiscountSurchargeModal
                state={state}
                dispatch={dispatch}
                actions={actions}
            />
            <FinalizeSaleModal
                state={state}
                dispatch={dispatch}
                actions={actions}
                userState={userState}
            />
            <div id='voucher' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
            <div id='ticket' style={{ width: '303px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
        </>
    );
};

export default Ventas;
