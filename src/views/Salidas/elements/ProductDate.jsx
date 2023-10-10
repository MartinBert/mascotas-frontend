import React, { useEffect } from 'react'
import { DatePicker } from 'antd'
import contexts from '../../../contexts'
const { useOutputsContext } = contexts.Outputs


const ProductDate = () => {
    const [outputs_state, outputs_dispatch] = useOutputsContext()

    useEffect(() => {
        outputs_dispatch({ type: 'SET_DATE', payload: new Date() })
        outputs_dispatch({ type: 'SET_FORMATTED_DATE', payload: new Date() })
    }, [])

    const setDate = (e) => {
        const newDate = (!e) ? new Date() : new Date(e.$d)
        outputs_dispatch({ type: 'SET_DATE', payload: newDate })
        outputs_dispatch({ type: 'SET_FORMATTED_DATE', payload: newDate })
    }

    return (
        <DatePicker
            name='fecha'
            format={['DD/MM/YYYY']}
            onChange={e => setDate(e)}
            style={{ width: '100%' }}
            value={outputs_state.formattedDate}
        />
    )
}

export default ProductDate