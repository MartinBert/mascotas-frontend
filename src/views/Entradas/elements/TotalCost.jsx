import React, { useEffect } from 'react'
import contexts from '../../../contexts'
const { useEntriesContext } = contexts.Entries


const TotalCost = () => {
  const [entries_state, entries_dispatch] = useEntriesContext()

  useEffect(() => {
    entries_dispatch({ type: 'CALCULATE_TOTAL_COST' })
  }, [entries_state.quantity, entries_state.products])

  return (
    <h1>Neto Total: {entries_state.totalCost}</h1>
  )
}

export default TotalCost