// React Components and Hooks
import React from 'react'

// Design Components
import { Modal, Row, Col, InputNumber, Select } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Imports Destructurings
const { useSaleContext } = contextProviders.SaleContextProvider
const { Option } = Select


const ProductSelectionModal = () => {
    const saleContext = useSaleContext()
    const [sale_state, sale_dispatch] = saleContext

    const changePercentage = (e) => {
        sale_dispatch({
            type: (sale_state.discountSurchargeModalOperation === 'surcharge')
                ? 'SET_GLOBAL_SURCHARGE_PERCENT'
                : 'SET_GLOBAL_DISCOUNT_PERCENT',
            payload: (!e)
                ? 0
                : e
        })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const selectTypePercentage = (e) => {
        if (e === 'surcharge') {
            sale_dispatch({
                type: 'SET_GLOBAL_SURCHARGE_PERCENT',
                payload: sale_state.porcentajeDescuentoGlobal
            })
            sale_dispatch({
                type: 'SET_GLOBAL_DISCOUNT_PERCENT',
                payload: 0
            })
        } else {
            sale_dispatch({
                type: 'SET_GLOBAL_DISCOUNT_PERCENT',
                payload: sale_state.porcentajeRecargoGlobal
            })
            sale_dispatch({
                type: 'SET_GLOBAL_SURCHARGE_PERCENT',
                payload: 0
            })
        }
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION', payload: e })
        sale_dispatch({ type: 'SET_TOTAL' })
    }
    
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
                        onChange={(e) => selectTypePercentage(e)}
                        style={{ width: '100%' }}
                        value={sale_state.discountSurchargeModalOperation}
                    >
                        <Option value='discount'>Descuento</Option>
                        <Option value='surcharge'>Recargo</Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <InputNumber
                        color='primary'
                        min={0}
                        onChange={e => changePercentage(e)}
                        placeholder='Ingrese el porcentaje de modificación'
                        style={{width: '100%'}}
                        value={
                            sale_state.porcentajeRecargoGlobal > 0
                                ? sale_state.porcentajeRecargoGlobal
                                : sale_state.porcentajeDescuentoGlobal
                        }
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default ProductSelectionModal