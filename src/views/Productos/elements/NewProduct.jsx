// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Design Components
import { Button } from 'antd'


const NewProduct = () => {
    const navigate = useNavigate()

    const redirectToForm = () => {
        navigate('/productos/nuevo')
    }

    return (
        <Button
            className='btn-primary'
            onClick={() => redirectToForm()}
            
        >
            Nuevo
        </Button>
    )
}

export default NewProduct