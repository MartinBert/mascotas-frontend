import React from 'react'
import contexts from '../../../contexts'
import icons from '../../../components/icons'
const { useOutputsContext } = contexts.Outputs
const { Delete } = icons


const DeleteProduct = ({ product }) => {
  const [, outputs_dispatch] = useOutputsContext()

  const deleteProduct = (productID) => {
    outputs_dispatch({ type: 'DELETE_PRODUCT', payload: productID })
  }

  return (
    <div
      onClick={() => deleteProduct(product._id)}
    >
      <Delete />
    </div>
  )
}

export default DeleteProduct