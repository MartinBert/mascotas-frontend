// React Components and Hooks
import React from 'react'

// Design Components
import { Button } from 'antd'


const CleanFilters = ({ cleanFilters }) => {
    return (
        <Button
            danger
            onClick={() => cleanFilters()}
            style={{ width: '100%' }}
            type='primary'
        >
            Limpiar filtros
        </Button>
    )
}

export default CleanFilters