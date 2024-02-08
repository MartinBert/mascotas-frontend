// React Components and Hooks
import React from 'react'

// Custom Constexts
import contexts from '../../../contexts'

// Design Components
import { Select } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const FilterByCategory = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const changeTypes = (e) => {
        const types = products_state.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = products_state.typesForSelect.allTypes
                .filter(type => eventValues.includes(type.nombre))
            selectedTypesNames = types.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_TYPES',
            payload: { selectedTypes, selectedTypesNames }
        })
    }

    const selectTypes = (e) => {
        if (e.value === 'Todos los rubros') products_dispatch({ type: 'SELECT_ALL_TYPES' })
        else products_dispatch({ type: 'DESELECT_ALL_TYPES' })
    }

    return (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeTypes}
            onSelect={selectTypes}
            options={products_state.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={products_state.typesForSelect.selectedTypesNames}
        />
    )
}

export default FilterByCategory