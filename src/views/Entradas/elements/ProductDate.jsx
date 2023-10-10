import React, { useEffect } from 'react'
import { DatePicker } from 'antd'
import contexts from '../../../contexts'
const { useEntriesContext } = contexts.Entries


const ProductDate = () => {
    const [entries_state, entries_dispatch] = useEntriesContext()

    useEffect(() => {
        entries_dispatch({ type: 'SET_DATE', payload: new Date() })
        entries_dispatch({ type: 'SET_FORMATTED_DATE', payload: new Date() })
    }, [])

    const setDate = (e) => {
        const newDate = (!e) ? new Date() : new Date(e.$d)
        entries_dispatch({ type: 'SET_DATE', payload: newDate })
        entries_dispatch({ type: 'SET_FORMATTED_DATE', payload: newDate })
    }

    return (
        <DatePicker
            name='fecha'
            format={['DD/MM/YYYY']}
            onChange={e => setDate(e)}
            style={{ width: '100%' }}
            value={entries_state.formattedDate}
        />
    )
}

export default ProductDate