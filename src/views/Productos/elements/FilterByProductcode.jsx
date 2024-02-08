// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Input } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const FilterByProductcode = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const onChangeProductCode = (e) => {
        const filters = {
            ...products_state.paginationParams.filters,
            codigoProducto: e.target.value
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    return (
        <Input
            color='primary'
            name='codigoProducto'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.codigoProducto}
        />
    )
}

export default FilterByProductcode