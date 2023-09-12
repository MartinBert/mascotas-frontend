// React Components and Hooks
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Custom Components
import { ProductSelectionModal } from '../../components/generics'
import { errorAlert, successAlert } from '../../components/alerts'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Form, Input, InputNumber, Spin, DatePicker } from 'antd'
import dayjs from 'dayjs'

// Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { Add, Delete } = icons
const { useAuthContext } = contexts.Auth
const { useEntriesContext } = contexts.Entries
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { localFormat } = helpers.dateHelper


const AddProduct = () => {
  const [, productSelectionModal_dispatch] = useProductSelectionModalContext()

  const openModal = () => {
    productSelectionModal_dispatch({ type: 'SHOW_PRODUCT_MODAL' })
  }

  return (
    <div
      onClick={() => openModal()}
    >
      <Add
        customStyle={{ width: '70px', height: '70px' }}
      />
    </div>
  )
}

const Date = () => {
  const [entries_state, entries_dispatch] = useEntriesContext()

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
      value={entries_state.formattedDate}
    />
  )
}


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


const Description = () => {
  const [entries_state, entries_dispatch] = useEntriesContext()

  const setDescription = (e) => {
    entries_dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
  }

  return (
    <Input
      name='descripcion'
      placeholder='Descripción'
      value={entries_state.description}
      onChange={e => setDescription(e)}
    />
  )
}


const ProductBarcode = ({ product }) => {
  const [, entries_dispatch] = useEntriesContext()

  const changeBarcode = (e, productID) => {
    entries_dispatch({
      type: 'SET_PRODUCT_BARCODE',
      payload: { barcode: e.target.value, productID: productID }
    })
  }

  return (
    <Input
      disabled
      value={product.codigoBarras}
      onChange={e => changeBarcode(e, product._id)}
    />
  )
}


const ProductName = ({ product }) => {
  const [, entries_dispatch] = useEntriesContext()

  const changeName = (e, productID) => {
    entries_dispatch({
      type: 'SET_PRODUCT_NAME',
      payload: { name: e.target.value, productID: productID }
    })
  }

  return (
    <Input
      disabled
      value={product.nombre}
      onChange={e => changeName(e, product._id)}
    />
  )
}

const ProductQuantity = ({ product }) => {
  const [, entries_dispatch] = useEntriesContext()

  const changeQuantity = (e, productID) => {
    entries_dispatch({
      type: 'SET_PRODUCT_QUANTITY',
      payload: { quantity: e.target.value, productID: productID }
    })
  }

  return (
    <InputNumber
      disabled
      value={product.cantidadesEntrantes}
      onChange={e => changeQuantity(e, product._id)}
    />
  )
}


const TotalCost = () => {
  const [entries_state, entries_dispatch] = useEntriesContext()

  useEffect(() => {
    entries_dispatch({ type: 'CALCULATE_TOTAL_COST' })
  }, [entries_state.quantity, entries_state.products])

  return (
    <Input
      name='costoTotal'
      placeholder='Costo total'
      value={entries_state.totalCost}
      disabled={true}
    />
  )
}

const EntradasElements = {
  AddProduct,
  Date,
  DeleteProduct,
  Description,
  ProductBarcode,
  ProductName,
  ProductQuantity,
  TotalCost
}

export default EntradasElements