
import React from 'react';
import { Row, Col, Button, Input} from 'antd';
import { Link } from 'react-router-dom';

const Header = ({setFilters}) => {
    return(
        <Row>            
            <Col span={24}>
                <Row align="end">
                    <Col span={20}>
                        <Button 
                            style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)',
                            marginBottom: '20px', color: '#fff'}}> 
                            <Link to="/rubros/nuevo">
                                Nuevo    
                            </Link>
                        </Button>
                    </Col>
                    <Col span={4}>
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
