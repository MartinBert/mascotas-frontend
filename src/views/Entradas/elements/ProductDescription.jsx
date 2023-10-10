import React from 'react'
import { Input } from 'antd'
import contexts from '../../../contexts'
const { useEntriesContext } = contexts.Entries


const ProductDescription = () => {
    const [entries_state, entries_dispatch] = useEntriesContext()

    const setDescription = (e) => {
        entries_dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
    }

    return (
        <Input
            name='descripcion'
            placeholder='-- Sin descripción --'
            value={entries_state.description}
            onChange={e => setDescription(e)}
        />
    )
}

export default ProductDescription