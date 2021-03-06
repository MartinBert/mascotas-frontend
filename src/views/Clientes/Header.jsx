
import React from 'react';
import { Row, Col, Input} from 'antd';
import { Link } from 'react-router-dom';

const Header = ({setFilters}) => {
    return(
        <Row>
            
            <Col span={24}>
                <Row align="end">
                    <Col span={4}>
                        <button 
                            className="btn-primary"> 
                            <Link to="/clientes/nuevo">
                                Nuevo    
                            </Link>
                        </button>
                    </Col>
                    <Col span={16}></Col>
                    <Col span={4}>
                        <Input 
                            type="primary" 
                            placeholder="Buscar cliente"
                            onChange={(e) => { setFilters(JSON.stringify({
                                razonSocial: e.target.value,
                            }))}}
                        /> 
                    </Col>
                </Row>
            </Col>
        </Row>
    ) 
}

export default Header
