import React from 'react'
import { Input } from 'antd'
import contexts from '../../../contexts'
const { useOutputsContext } = contexts.Outputs


const ProductDescription = () => {
    const [outputs_state, outputs_dispatch] = useOutputsContext()

    const setDescription = (e) => {
        outputs_dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
    }

    return (
        <Input
            name='descripcion'
            placeholder='-- Sin descripción --'
            value={outputs_state.description}
            onChange={e => setDescription(e)}
        />
    )
}

export default ProductDescription