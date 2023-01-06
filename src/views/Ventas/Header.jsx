import React, { useEffect } from 'react'
import { Row, Col, Select, Spin } from 'antd'
import {
    ProductSelectionModal,
    GenericAutocomplete,
} from '../../components/generics'
import api from '../../services'
import { errorAlert } from '../../components/alerts'

const { Option } = Select

const Header = ({
    productState,
    productDispatch,
    productActions,
    actions,
    dispatch,
    state,
}) => {
    const { SHOW_MODAL } = productActions
    const {
        LOADING_DOCUMENT_INDEX,
        SHOW_DISCOUNT_SURCHARGE_MODAL,
        SET_CLIENT,
        SET_DOCUMENT,
        SET_VOUCHER_NUMBERS,
        SET_PAYMENT_METHODS,
        SET_PAYMENT_PLANS,
        SET_TOTAL
    } = actions

    useEffect(() => {
        if (!state.documento) return
        dispatch({ type: LOADING_DOCUMENT_INDEX })
        let attemps = 0
        dispatch({ type: SET_TOTAL })

        const fetchLastFiscalVoucherNumber = async () => {
            const lastVoucherNumber = await api.afip.findLastVoucherNumber(
                state.empresaCuit,
                state.puntoVentaNumero,
                state.documentoCodigo
            )
            if (lastVoucherNumber === undefined && attemps < 10) return setTimeout(() => {
                attemps++
                return fetchLastFiscalVoucherNumber()
            }, 500)
            if (lastVoucherNumber === undefined) return errorAlert('No se pudo recuperar la correlación de AFIP del último comprobante emitido, intente nuevamente más tarde.').then(() => { window.location.reload() })
            const nextVoucher = lastVoucherNumber + 1
            dispatch({ type: SET_VOUCHER_NUMBERS, payload: nextVoucher })
            dispatch({ type: LOADING_DOCUMENT_INDEX })
        }

        const fetchLastNoFiscalVoucherNumber = async () => {
            const lastVoucherNumber = await api.ventas.findLastVoucherNumber(state.documentoCodigo)
            if (lastVoucherNumber === undefined && attemps < 10) return setTimeout(() => {
                attemps++
                return fetchLastNoFiscalVoucherNumber()
            }, 500)
            if (lastVoucherNumber === undefined) return errorAlert('No se pudo recuperar la correlación de comprobantes, intente más tarde.').then(() => { window.location.reload() })
            const nextVoucher = lastVoucherNumber + 1
            dispatch({ type: SET_VOUCHER_NUMBERS, payload: nextVoucher })
            dispatch({ type: LOADING_DOCUMENT_INDEX })
        }

        (state.documentoFiscal) ? fetchLastFiscalVoucherNumber() : fetchLastNoFiscalVoucherNumber()
    },
        //eslint-disable-next-line
        [state.documento]
    )

    return (
        <Row>
            <Col span={24}>
                <Row gutter={8}>
                    <Col xl={4} lg={6} md={6}>
                        <button
                            className='btn-primary'
                            onClick={() => {
                                productDispatch({ type: SHOW_MODAL })
                            }}
                        >
                            Productos
                        </button>
                    </Col>
                    <Col xl={4} lg={6} md={6}>
                        <button
                            className='btn-primary'
                            onClick={() => {
                                dispatch({
                                    type: SHOW_DISCOUNT_SURCHARGE_MODAL
                                })
                            }}
                        >
                            Descuento/Recargo
                        </button>
                    </Col>
                    <Col xl={16} lg={12} md={12}>
                        {(state.porcentajeDescuentoGlobal !== 0 || state.porcentajeRecargoGlobal !== 0)
                            ? <span style={{ textAlign: 'right' }}>
                                {state.porcentajeDescuentoGlobal !== 0
                                    ? <h1>Descuento de {state.porcentajeDescuentoGlobal}% aplicado a toda la factura</h1>
                                    : <h1>Recargo de {state.porcentajeRecargoGlobal}% aplicado a toda la factura</h1>}</span>
                            : null}
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xl={6} lg={6} md={12}>
                        <GenericAutocomplete
                            label='Cliente'
                            modelToFind='cliente'
                            keyToCompare='razonSocial'
                            controller='clientes'
                            selectedSearch={state.cliente}
                            dispatch={dispatch}
                            action={SET_CLIENT}
                            returnCompleteModel={true}
                        />
                    </Col>
                    <Col xl={6} lg={6} md={12}>
                        <GenericAutocomplete
                            label='Documento'
                            modelToFind='documento'
                            keyToCompare='nombre'
                            controller='documentos'
                            selectedSearch={state.documento}
                            dispatch={dispatch}
                            action={SET_DOCUMENT}
                            returnCompleteModel={true}
                        />
                    </Col>
                    <Col xl={6} lg={6} md={12}>
                        {(state.loadingDocumentIndex) ? <span><Spin />Procesando...</span> : null}
                    </Col>
                    <Col xl={6} lg={6} md={12}>
                        <span style={{ textAlign: 'right' }}>
                            <h1>Neto Total: {state.total}</h1>
                        </span>
                    </Col>
                    <Col xl={6} lg={8} md={8}>
                        <GenericAutocomplete
                            label='Medio de pago'
                            modelToFind='mediopago'
                            keyToCompare='nombre'
                            controller='mediospago'
                            selectedSearch={state.mediosPago}
                            dispatch={dispatch}
                            action={SET_PAYMENT_METHODS}
                            returnCompleteModel={true}
                        />
                    </Col>
                    <Col xl={6} lg={8} md={8}>
                        <Select
                            onChange={e => {
                                dispatch({ type: SET_PAYMENT_PLANS, payload: [e] })
                                dispatch({ type: SET_TOTAL })
                            }}
                            style={{ width: '100%' }}
                        >
                            {(state.planesPagoToSelect)
                                ? state.planesPagoToSelect.map(item => <Option key={item._id} value={JSON.stringify(item)}>{item.nombre}</Option>)
                                : null
                            }
                        </Select>
                    </Col>
                </Row>
            </Col>
            <ProductSelectionModal
                state={productState}
                dispatch={productDispatch}
                actions={productActions}
            />
        </Row>
    )
}

export default Header
