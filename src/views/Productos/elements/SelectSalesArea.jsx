// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { GenericAutocomplete } from '../../../components/generics'

// Custom Constexts
import contexts from '../../../contexts'

// Services
import api from '../../../services'

// Imports Destructuring
const { useSalesAreasContext } = contexts.SalesAreas


const SelectSalesArea = () => {
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()

    useEffect(() => {
        const findSalesAreas = async () => {
            const salesAreas = await api.zonasdeventas.findByName('Reconquista')
            salesAreas_dispatch({ type: 'EDIT_SALES_AREA', payload: salesAreas.docs[0] })
        }
        findSalesAreas()
    }, [])

    return (
        <GenericAutocomplete
            action={'EDIT_SALES_AREA'}
            label='Seleccionar Zona de ventas'
            modelToFind='zonadeventa'
            keyToCompare='name'
            controller='zonasdeventas'
            dispatch={salesAreas_dispatch}
            selectedSearch={salesAreas_state.currentSalesArea}
            returnCompleteModel={true}
            styles={{ backgroundColor: '#fff' }}
        />
    )
}

export default SelectSalesArea