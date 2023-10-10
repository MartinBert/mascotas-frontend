import React from 'react'
import { Button } from 'antd'
import contexts from '../../../contexts'
const { useEntriesContext } = contexts.Entries


const CleanFields = () => {
    const [, entries_dispatch] = useEntriesContext()

    const cleanFields = () => {
        entries_dispatch({ type: 'CLEAN_INPUTS' })
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