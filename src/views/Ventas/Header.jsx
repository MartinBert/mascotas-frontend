
import React from 'react';
import { Row, Col, Input} from 'antd';

const Header = ({setFilters}) => {
    return(
        <Row gutter={8}>
            <Col span={24}>
                <Row align="end">
                    <Col span={4}>
                        <button className="btn-primary"> 
                            Buscar productos   
                        </button>
                    </Col>
                    <Col span={4}>
                        <button className="btn-primary"> 
                            Agregar descuento/recargo
                        </button>
                    </Col>
                    <Col span={12}></Col>
                    <Col span={4}>
                        <Input 
                            type="primary" 
                            placeholder="Buscar venta"
                            onChange={(e) => { setFilters(JSON.stringify({
                                nombre: e.target.value,
                            }))}}
                        /> 
                    </Col>
                </Row>
            </Col>
        </Row>
    ) 
}

export default Header
