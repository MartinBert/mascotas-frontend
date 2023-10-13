// React Components and Hooks
import React from 'react'

// Design Components
import { Input } from 'antd'


const FilterByName = ({ updateFilters }) => {
    return (
        <Input
            color='primary'
            name='nombre'
            onChange={e => updateFilters(e)}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
        />
    )
}

export default FilterByName