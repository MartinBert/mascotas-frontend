// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Design Components
import { Button, Col, Input, Row } from 'antd'


const Header = ({ filters, setFilters }) => {
    const navigate = useNavigate()

    const redirectToForm = () => {
        navigate('/zonasdeventas/nuevo')
    }

    const updateFilters = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Row
            justify='space-between'
        >
            <Col span={4}>
                <Button
                    className='btn-primary'
                    onClick={() => redirectToForm()}
                >
                    Nuevo
                </Button>
            </Col>
            <Col span={4}>
                <Input
                    name='name'
                    onChange={e => updateFilters(e)}
                    placeholder='Buscar por nombre de zona'
                    type='primary'
                />
            </Col>
        </Row>
    )
}

export default Header
