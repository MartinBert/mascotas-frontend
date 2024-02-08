// React Components and Hooks
import React from 'react'

// Custom Constexts
import contexts from '../../../contexts'

// Design Components
import { Select } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const FilterByBrand = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const changeBrands = (e) => {
        const brands = products_state.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = products_state.brandsForSelect.allBrands
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = products_state.brandsForSelect.allBrands
                .filter(brand => eventValues.includes(brand.nombre))
            selectedBrandsNames = brands.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_BRANDS',
            payload: { selectedBrands, selectedBrandsNames }
        })
    }

    const selectBrands = (e) => {
        if (e.value === 'Todas las marcas') products_dispatch({ type: 'SELECT_ALL_BRANDS' })
        else products_dispatch({ type: 'DESELECT_ALL_BRANDS' })
    }

    return (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeBrands}
            onSelect={selectBrands}
            options={products_state.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={products_state.brandsForSelect.selectedBrandsNames}
        />
    )
}

export default FilterByBrand