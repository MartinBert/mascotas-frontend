import React from 'react'
import { Button } from 'antd'


const ButtonForm = (props) => {
    const {
        buttonType, // 'cancel' || 'restart' || 'save'
        onClick // function
    } = props

    const getButtonProps = () => {
        let danger = false
        let label = 'Configurar'
        let type = 'primary'
        switch (buttonType) {
            case 'cancel':
                danger = true
                label = 'Cancelar'
                type = 'primary'
                break
            case 'restart':
                danger = true
                label = 'Reiniciar'
                type = 'default'
                break
            case 'save':
                danger = false
                label = 'Guardar'
                type = 'primary'
                break
            default:
                break
        }
        const data = { danger, label, type }
        return data
    }


    return (
        <Button
            danger={getButtonProps().danger}
            onClick={onClick}
            style={{ width: '100%' }}
            type={getButtonProps().type}
        >
            {getButtonProps().label}
        </Button>
    )
}

export default ButtonForm