
// React Components and Hooks
import React from 'react'
import { Link } from 'react-router-dom'

// Design Components
import { Row, Col, Input } from 'antd'


const Header = ({ setFilters }) => {

    return (
        <Row>
            <Col span={24}>
                <Row align='end'>
                    <Col span={4}>
                        <Link to='/rubros/nuevo'>
                            <button className='btn-primary'>
                                Nuevo
                            </button>
                        </Link>
                    </Col>
                    <Col span={16}></Col>
                    <Col span={4}>
                        <Input
                            type='primary'
                            placeholder='Buscar rubro'
                            onChange={(e) => {
                                setFilters(JSON.stringify({
                                    nombre: e.target.value,
                                }))
                            }}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Header
