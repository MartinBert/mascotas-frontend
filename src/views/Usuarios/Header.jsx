
import React from 'react';
import { Row, Col, Button, Input} from 'antd';
import { Link } from 'react-router-dom';

const Header = ({setFilters}) => {
    return(
        <Row>           
            <Col span={24}>
                <Row align="end">
                    <Col span={4}>
                        <Link to="/usuarios/nuevo">
                            <Button className="btn-primary"> 
                                Nuevo    
                            </Button>
                        </Link>
                    </Col>
                    <Col span={16}></Col>
                    <Col span={4}>
                        <Input 
                            type="primary" 
                            placeholder="Buscar por nombre de usuario"
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
