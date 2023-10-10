import React from 'react'
import { Button } from 'antd'
import contexts from '../../../contexts'
const { useOutputsContext } = contexts.Outputs


const CleanFields = () => {
    const [, outputs_dispatch] = useOutputsContext()

    const cleanFields = () => {
        outputs_dispatch({ type: 'CLEAN_INPUTS' })
    }

    return (
        <Button
            className='btn-primary'
            onClick={() => cleanFields()}
        >
            Borrar campos
        </Button>
    )
}

export default CleanFields