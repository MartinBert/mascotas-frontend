// React Components and Hooks
import React from 'react'

// Design Components
import { Input } from 'antd'


const FilterByProductcode = ({ updateFilters }) => {
    return (
        <Input
            color='primary'
            name='codigoProducto'
            onChange={e => updateFilters(e)}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
        />
    )
}

export default FilterByProductcode