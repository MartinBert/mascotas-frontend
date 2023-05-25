
// React Components and Hooks
import React from 'react'
import { Link } from 'react-router-dom'

// Styles
import '../../index.css'

// Design Components
import { Row, Col, Button, Input} from 'antd'


const Header = ({setFilters}) => {
    return(
        <Row>
            <Col span={24}>
                <Row align='end'>
                    <Col span={20}>
                        <Button 
                            className='btn-primary-bg'> 
                            <Link to='/cuentasCorrientes/nuevo'>
                                Nuevo    
                            </Link>
                        </Button>
                    </Col>
                    <Col span={4}>
                        <Input 
                            type='primary' 
                            placeholder='Buscar cuenta corriente'
                            onChange={(e) => { setFilters(JSON.stringify({
                                cliente: e.target.value,
                            }))}}
                        /> 
                    </Col>
                </Row>
            </Col>
        </Row>
    ) 
}

export default Header
