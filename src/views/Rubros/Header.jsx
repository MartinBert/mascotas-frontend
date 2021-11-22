
import React from 'react';
import { Row, Col, Button, Input} from 'antd';
import { Link } from 'react-router-dom';

const Header = ({setFilters}) => {
    return(
        <Row>
            <Col span={24}>
                <Button type="primary"> 
                    <Link to="/rubros/nuevo">
                        Nuevo    
                    </Link>
                </Button>
            </Col>
            <Col span={24}>
                <Row align="end">
                    <Col>
                        <Input 
                            type="primary" 
                            placeholder="Buscar rubro"
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
