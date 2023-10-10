import React, { useEffect } from 'react'
import contexts from '../../../contexts'
const { useOutputsContext } = contexts.Outputs


const TotalCost = () => {
  const [outputs_state, outputs_dispatch] = useOutputsContext()

  useEffect(() => {
    outputs_dispatch({ type: 'CALCULATE_TOTAL_COST' })
  }, [outputs_state.quantity, outputs_state.products])

  return (
    <h1>Neto Total: {outputs_state.totalCost}</h1>
  )
}

export default TotalCost