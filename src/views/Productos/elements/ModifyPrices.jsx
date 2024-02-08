// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Button } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const ModifyPrices = () => {
    const [, products_dispatch] = useProductsContext()

    const openPriceModificatorModal = () => {
        products_dispatch({ type: 'SHOW_PRICE_MODIFICATOR_MODAL' })
    }

    return (
        <Button
            className='btn-primary'
            onClick={openPriceModificatorModal}
        >
            Modificar precios
        </Button>
    )
}

export default ModifyPrices