// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Input } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const FilterByName = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const onChangeName = (e) => {
        const filters = {
            ...products_state.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    return (
        <Input
            color='primary'
            name='nombre'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.nombre}
        />
    )
}

export default FilterByName