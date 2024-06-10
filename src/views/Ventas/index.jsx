// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'
import { ProductSelectionModal } from '../../components/generics'

// Design Components
import { Button, Col, Row, Spin } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Services
import api from '../../services'

// Views
import CustomLineModal from './CustomLineModal'
import Header from './Header'
import DiscountSurchargeModal from './DiscountSurchargeModal'
import FinalizeSaleModal from './FinalizeSaleModal'
import Lines from './Lines'
import ListCustomLinesModal from './ListCustomLinesModal'

// Imports Destructurings
const { useSaleContext } = contexts.Sale


const Ventas = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    const loadData = async () => {

        // Refs data
        const refs = {
            ref_autocompleteClient: sale_state.loadingView ? null : document.getElementById('autocompleteClient'),
            ref_autocompleteDocument: sale_state.loadingView ? null : document.getElementById('autocompleteDocument'),
            ref_autocompletePaymentMethod: sale_state.loadingView ? null : document.getElementById('autocompletePaymentMethod'),
            ref_autocompletePaymentPlan: sale_state.loadingView ? null : document.getElementById('autocompletePaymentPlan'),
            ref_buttonToAddCustomProduct: sale_state.loadingView ? null : document.getElementById('buttonToAddCustomProduct'),
            ref_buttonToFinalizeSale: sale_state.loadingView ? null : document.getElementById('buttonToFinalizeSale'),
            ref_buttonToOpenProductSelectionModal: sale_state.loadingView ? null : document.getElementById('buttonToOpenProductSelectionModal'),
            ref_buttonToSaveAddedCustomProducts: sale_state.loadingView ? null : document.getElementById('buttonToSaveAddedCustomProducts'),
            ref_buttonToSaveCustomProduct: sale_state.loadingView ? null : document.getElementById('buttonToSaveCustomProduct'),
            ref_buttonToSaveDiscountSurchargeModal: sale_state.loadingView ? null : document.getElementById('buttonToSaveDiscountSurchargeModal'),
            ref_buttonToSaveFinalizeSale: sale_state.loadingView ? null : document.getElementById('buttonToSaveFinalizeSale'),
            ref_datePicker: sale_state.loadingView ? null : document.getElementById('datePicker'),
            ref_inputConceptOfCustomProduct: sale_state.loadingView ? null : document.getElementById('inputConceptOfCustomProduct'),
            ref_inputPercentageIVAOfCustomProduct: sale_state.loadingView ? null : document.getElementById('inputPercentageIVAOfCustomProduct'),
            ref_inputPercentageOfDiscountAndSurchargeModal: sale_state.loadingView ? null : document.getElementById('inputPercentageOfDiscountAndSurchargeModal'),
            ref_inputUnitPriceOfCustomProduct: sale_state.loadingView ? null : document.getElementById('inputUnitPriceOfCustomProduct'),
            ref_selectPercentageTypeOfDiscountAndSurchargeModal: sale_state.loadingView ? null : document.getElementById('selectPercentageTypeOfDiscountAndSurchargeModal')
        }
        sale_dispatch({ type: 'SET_REFS', payload: refs })

        // User data
        const userId = localStorage.getItem('userId')
        const loggedUser = await api.usuarios.findById(userId)
        sale_dispatch({ type: 'SET_COMPANY', payload: loggedUser.empresa })
        sale_dispatch({ type: 'SET_SALE_POINT', payload: loggedUser.puntoVenta })
        sale_dispatch({ type: 'SET_USER', payload: loggedUser })

        // Voucher data
        const lastIndex = await api.ventas.findLastIndex()
        sale_dispatch({ type: 'SET_INDEX', payload: lastIndex + 1 })

    }

    useEffect(() => { loadData() }, [])

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

    const openFinalizeSaleModal = () => {
        checkState()
            .then(result => {
                if (result === 'OK') return sale_dispatch({ type: 'SHOW_FINALIZE_SALE_MODAL' })
                return errorAlert(result)
            })
    }

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
                                        <Row>
                                            <Col span={24}>
                                                <Header />
                                            </Col>
                                            <Col span={24}>
                                                <Lines />
                                            </Col>
                                            <Col span={24} style={{ marginTop: '1%' }}>
                                                <Row>
                                                    <Col span={6}>
                                                        <Button
                                                            className='btn-primary'
                                                            id='buttonToFinalizeSale'
                                                            onClick={openFinalizeSaleModal}
                                                        >
                                                            Finalizar venta
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    )
                            }
                            <CustomLineModal />
                            <DiscountSurchargeModal />
                            <FinalizeSaleModal />
                            <ListCustomLinesModal />
                            <ProductSelectionModal />
                            <div id='voucher' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
                            <div id='ticket' style={{ width: '303px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
                        </>
                    )
            }
        </>
    )
}

export default Ventas
