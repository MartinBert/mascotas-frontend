import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'


const CancelButton = () => {
    const navigate = useNavigate()

    const redirectToEntradas = () => {
        navigate('/entradas')
    }

    return (
        <Button
            danger
            onClick={() => redirectToEntradas()}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )
}

export default CancelButton