import React from 'react'
import { Button } from 'antd'
import contexts from '../../../contexts'
const { useEntriesContext } = contexts.Entries


const CleanProducts = () => {
    const [, entries_dispatch] = useEntriesContext()

    const cleanProducts = () => {
        entries_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
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