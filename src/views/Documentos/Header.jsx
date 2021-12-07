
import React from 'react';
import { Row, Col, Button, Input} from 'antd';
import { Link } from 'react-router-dom';
import '../../index.css';

const Header = ({setFilters}) => {
    return(
        <Row>
            
            <Col span={24}>
                <Row align="end">
                    <Col span={20}>
                        <Button 
                            className="btn-primary-bg"> 
                            <Link to="/documentos/nuevo">
                                Nuevo    
                            </Link>
                        </Button>
                    </Col>
                    <Col span={4}>
                        <Input 
                            type="primary" 
                            placeholder="Buscar documento"
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
