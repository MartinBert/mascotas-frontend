// React Components and Hooks
import React from 'react'

// Design Components
import { Input } from 'antd'


const FilterByBarcode = ({ updateFilters }) => {
    return (
        <Input
            color='primary'
            name='codigoBarras'
            onChange={e => updateFilters(e)}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
        />
    )
}

export default FilterByBarcode