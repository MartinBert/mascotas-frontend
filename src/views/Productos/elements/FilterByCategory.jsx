// React Components and Hooks
import React from 'react'

// Custom Components
import { GenericAutocomplete } from '../../../components/generics'


const FilterByCategory = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <GenericAutocomplete
            label='Filtrar por rubros'
            modelToFind='rubro'
            keyToCompare='nombre'
            controller='rubros'
            setResultSearch={setSelectedCategory}
            selectedSearch={selectedCategory}
            returnCompleteModel={true}
            styles={{ backgroundColor: '#fff' }}
        />
    )
}

export default FilterByCategory