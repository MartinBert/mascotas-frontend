// React Components and Hooks
import React from 'react'

// Custom Components
import { GenericAutocomplete } from '../../../components/generics'


const FilterByBrand = ({ selectedBrand, setSelectedBrand}) => {
    return (
        <GenericAutocomplete
            label='Filtrar por marcas'
            modelToFind='marca'
            keyToCompare='nombre'
            controller='marcas'
            setResultSearch={setSelectedBrand}
            selectedSearch={selectedBrand}
            returnCompleteModel={true}
            styles={{ backgroundColor: '#fff' }}
        />
    )
}

export default FilterByBrand