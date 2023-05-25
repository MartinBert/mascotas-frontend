// React Components and Hooks
import React from 'react'

// Design Components
import { Modal, Row, Col, Input, Select } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Imports Destructurings
const { useSaleContext } = contextProviders.SaleContextProvider
const { Option } = Select


const ProductSelectionModal = () => {
    const saleContext = useSaleContext()
    const [sale_state, sale_dispatch] = saleContext

    return (
        <Modal
            title='Agregar descuento o recargo a la factura'
            open={sale_state.discountSurchargeModalVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            onOk={() => {
                sale_dispatch({ type: 'HIDE_DISCOUNT_SURCHARGE_MODAL' })
            }}
            width={1200}
        >
            <Row justify='space between' gutter={16}>
                <Col span={6}>
                    <Select
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION', payload: e })
                            // sale_dispatch({
                            //     type: (sale_state.discountSurchargeModalOperation === 'discount') ? 'SET_GLOBAL_DISCOUNT_PERCENT' : 'SET_GLOBAL_SURCHARGE_PERCENT',
                            //     payload: (!e.target.value) ? 0 : parseFloat(e.target.value)
                            // })
                            sale_dispatch({ type: 'SET_TOTAL' })
                        }}
                        value={sale_state.discountSurchargeModalOperation}
                    >
                        <Option value='discount'>Descuento</Option>
                        <Option value='surcharge'>Recargo</Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <Input
                        color='primary'
                        type='number'
                        placeholder='Ingrese el porcentaje de modificación'
                        onChange={(e) => {
                            sale_dispatch({
                                type: (sale_state.discountSurchargeModalOperation === 'discount') ? 'SET_GLOBAL_DISCOUNT_PERCENT' : 'SET_GLOBAL_SURCHARGE_PERCENT',
                                payload: (!e.target.value) ? 0 : parseFloat(e.target.value)
                            })
                            // sale_dispatch({
                            //     type: (sale_state.discountSurchargeModalOperation === 'discount') ? 'SET_GLOBAL_SURCHARGE_PERCENT' : 'SET_GLOBAL_DISCOUNT_PERCENT',
                            //     payload: 0
                            // })
                            sale_dispatch({ type: 'SET_TOTAL' })
                        }}
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default ProductSelectionModal