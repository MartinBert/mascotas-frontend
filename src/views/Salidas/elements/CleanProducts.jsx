import React from 'react'
import { Button } from 'antd'
import contexts from '../../../contexts'
const { useOutputsContext } = contexts.Outputs


const CleanProducts = () => {
    const [, outputs_dispatch] = useOutputsContext()

    const cleanProducts = () => {
        outputs_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
    }

    return (
        <Button
            className='btn-primary'
            onClick={() => cleanProducts()}
        >
            Borrar productos
        </Button>
    )
}

export default CleanProducts