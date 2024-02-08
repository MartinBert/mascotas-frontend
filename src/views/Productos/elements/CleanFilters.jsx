// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Button } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const CleanFilters = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const clearFilters = () => {
        const filters = {
            nombre: null,
            codigoBarras: null,
            codigoProducto: null,
            marca: [],
            rubro: []
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
        products_dispatch({
            type: 'SET_BRANDS_FOR_EXCEL_REPORT',
            payload: [{ value: 'Todas las marcas' }]
        })
        products_dispatch({
            type: 'SET_TYPES_FOR_EXCEL_REPORT',
            payload: [{ value: 'Todos los rubros' }]
        })
    }

    return (
        <Button
            danger
            onClick={clearFilters}
            style={{ width: '100%' }}
            type='primary'
        >
            Limpiar filtros
        </Button>
    )
}

export default CleanFilters