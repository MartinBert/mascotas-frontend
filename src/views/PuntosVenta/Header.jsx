
// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Design Components
import { Button, Col, Input, Row } from 'antd'


const Header = ({ filters, setFilters }) => {
    const navigate = useNavigate()

    const redirectToForm = () => {
        navigate('/puntosventa/nuevo')
    }

    const updateFilters = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Row>
            <Col span={24}>
                <Row align='end'>
                    <Col span={4}>
                        <Button
                            className='btn-primary'
                            onClick={() => redirectToForm()}
                        >
                            Nuevo
                        </Button>
                    </Col>
                    <Col span={16}></Col>
                    <Col span={4}>
                        <Input
                            name='nombre'
                            onChange={e => updateFilters(e)}
                            placeholder='Buscar punto de venta'
                            type='primary'
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Header
