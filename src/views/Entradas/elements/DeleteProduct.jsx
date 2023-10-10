import React from 'react'
import contexts from '../../../contexts'
import icons from '../../../components/icons'
const { useEntriesContext } = contexts.Entries
const { Delete } = icons


const DeleteProduct = ({ product }) => {
    const [, entries_dispatch] = useEntriesContext()
  
    const deleteProduct = (productID) => {
      entries_dispatch({ type: 'DELETE_PRODUCT', payload: productID })
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