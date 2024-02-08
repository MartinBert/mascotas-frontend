// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Input } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const FilterByBarcode = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const onChangeBarCode = (e) => {
        const filters = {
            ...products_state.paginationParams.filters,
            codigoBarras: e.target.value
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    return (
        <Input
            color='primary'
            name='codigoBarras'
            onChange={onChangeBarCode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.codigoBarras}
        />
    )
}

export default FilterByBarcode