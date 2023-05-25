// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'

// Design Components
import { Row, Col, Spin } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Services
import api from '../../services'

// Views
import Header from './Header'
import DiscountSurchargeModal from './DiscountSurchargeModal'
import FinalizeSaleModal from './FinalizeSaleModal'
import Lines from './Lines'

// Imports Destructurings
const { useSaleContext } = contextProviders.SaleContextProvider


const Ventas = () => {
    const saleContext = useSaleContext()
    const [sale_state, sale_dispatch] = saleContext

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId')
            const loggedUser = await api.usuarios.findById(userId)
            sale_dispatch({ type: 'SET_COMPANY', payload: loggedUser.empresa })
            sale_dispatch({ type: 'SET_SALE_POINT', payload: loggedUser.puntoVenta })
            sale_dispatch({ type: 'SET_USER', payload: loggedUser })
        }

        const fetchLastVoucherIndex = async () => {
            const lastIndex = await api.ventas.findLastIndex()
            sale_dispatch({ type: 'SET_INDEX', payload: lastIndex + 1 })
        }

        fetchUser()
        fetchLastVoucherIndex()
    },
        //eslint-disable-next-line
        [])

    useEffect(() => {
        if (sale_state.fechaEmision) return
        sale_dispatch({ type: 'SET_DATES' })
    },
        //eslint-disable-next-line
        [])

    const checkState = async () => {
        const result = new Promise(resolve => {
            if (!sale_state.renglones || sale_state.renglones.length < 1) resolve('Debe seleccionar al menos un producto para realizar la venta.')
            if (!sale_state.cliente) resolve('Debe seleccionar un cliente para realizar la venta.')
            if (!sale_state.documento) resolve('Debe indicar el documento/comprobante de la operación.')
            if (!sale_state.mediosPago || sale_state.mediosPago.length < 1) resolve('Debe seleccionar al menos un medio de pago para realizar la venta.')
            if (!sale_state.planesPago || sale_state.planesPago.length < 1) resolve('Debe seleccionar al menos un plan de pago para realizar la venta.')
            resolve('OK')
        })
        return await result
    }

    return (
        <>
            {
                (!sale_state.loadingView)
                    ?
                    <Row>
                        <Col span={24}>
                            <Header />
                        </Col>
                        <Col span={24}>
                            <Lines />
                        </Col>
                        <Col span={6} style={{ marginTop: '25px' }}>
                            <button
                                className='btn-primary'
                                onClick={() => {
                                    checkState()
                                        .then(result => {
                                            if (result === 'OK') return sale_dispatch({ type: 'SHOW_FINALIZE_SALE_MODAL' })
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
