import React from 'react';
import { Modal, Row, Col, Input, Select  } from 'antd';

const {Option} = Select;

const ProductSelectionModal = ({state, dispatch, actions}) => {
    const {
        HIDE_DISCOUNT_SURCHARGE_MODAL, 
        SET_GLOBAL_DISCOUNT_PERCENT, 
        SET_GLOBAL_SURCHARGE_PERCENT,
        SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION,
        SET_TOTAL,
    } = actions;

    return (
    <Modal 
        title='Agregar descuento o recargo a la factura'
        visible={state.discountSurchargeModalVisible}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        onOk={() => {
            dispatch({type: HIDE_DISCOUNT_SURCHARGE_MODAL})
        }}
        width={1200}
    >
        <Row justify="space between" gutter={16}>
            <Col span={6}>
                <Select
                    style={{width: '100%'}}
                    onChange={(e) => {
                        dispatch({type: SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION, payload: e})
                        dispatch({type: SET_TOTAL})
                    }}
                    value={state.discountSurchargeModalOperation}
                >
                    <Option value='discount'>Descuento</Option>
                    <Option value='surcharge'>Recargo</Option>    
                </Select> 
            </Col>
            <Col span={6}>
                <Input 
                    color="primary"
                    type="number"
                    placeholder="Ingrese el porcentaje de modificación"
                    onChange={(e) => {
                        dispatch({
                            type: (state.discountSurchargeModalOperation === 'discount') ? SET_GLOBAL_DISCOUNT_PERCENT : SET_GLOBAL_SURCHARGE_PERCENT, 
                            payload: (!e.target.value) ? 0 : parseFloat(e.target.value)
                        })
                        dispatch({
                            type: (state.discountSurchargeModalOperation === 'discount') ? SET_GLOBAL_SURCHARGE_PERCENT : SET_GLOBAL_DISCOUNT_PERCENT, 
                            payload:0
                        })
                        dispatch({type: SET_TOTAL})
                    }}
                /> 
            </Col>
        </Row>
    </Modal>
  )
}

export default ProductSelectionModal;