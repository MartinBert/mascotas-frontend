
import React from 'react';
import { Row, Col, Button, Input} from 'antd';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'

const Header = ({setFilters}) => {
    return(
        <Row>           
            <Col span={24}>
                <Row align="end">
                    <Col span={20}>
                        <Button 
                            type='primary'
                            style={{marginBottom: '20px'}}
                            icon={<FaPlus style={{marginRight:'10px'}}/>}> 
                            <Link to="/usuarios/nuevo">
                                Nuevo    
                            </Link>
                        </Button>
                    </Col>
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
