// React Components and Hooks
import React from 'react'

// Design Components
import { Button } from 'antd'


const ModifyPrices = ({ setPriceModalVisible }) => {

    return (
        <Button
            className='btn-primary'
            onClick={() => setPriceModalVisible(true)}
        >
            Modificar precios
        </Button>
    )
}

export default ModifyPrices