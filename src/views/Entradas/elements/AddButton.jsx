import React from 'react'
import { Button } from 'antd'
import contexts from '../../../contexts'
const { useProductSelectionModalContext } = contexts.ProductSelectionModal


const AddButton = () => {
    const [, productSelectionModal_dispatch] = useProductSelectionModalContext()

    const openModal = () => {
        productSelectionModal_dispatch({ type: 'SHOW_PRODUCT_MODAL' })
    }

    return (
        <Button
            className='btn-primary'
            onClick={() => openModal()}
        >
            Añadir producto
        </Button>
    )
}

export default AddButton