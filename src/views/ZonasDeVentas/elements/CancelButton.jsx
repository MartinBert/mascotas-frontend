import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'


const CancelButton = () => {
    const navigate = useNavigate()

    const redirectToSalidas = () => {
        navigate('/salidas')
    }

    return (
        <Button
            danger
            onClick={() => redirectToSalidas()}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )
}

export default CancelButton