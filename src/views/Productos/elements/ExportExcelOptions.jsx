// React Components and Hooks
import React from 'react'

// Custom Constexts
import contexts from '../../../contexts'

// Design Components
import { Select } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const ExportExcelOptions = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const selectOptions = [
        { disabled: false, label: 'Todas', value: 'todas' },
        { disabled: true, label: 'Producto', value: 'producto' },
        { disabled: false, label: 'Rubro', value: 'rubro' },
        { disabled: false, label: 'Marca', value: 'marca' },
        { disabled: false, label: 'Cód. producto', value: 'codigoProducto' },
        { disabled: false, label: 'Cód. barras', value: 'codigoBarras' },
        { disabled: false, label: '% IVA compra', value: 'porcentajeIvaCompra' },
        { disabled: false, label: 'IVA compra ($)', value: 'ivaCompra' },
        { disabled: false, label: 'Precio de lista ($)', value: 'precioUnitario' },
        { disabled: false, label: '% IVA venta', value: 'porcentajeIvaVenta' },
        { disabled: false, label: 'IVA venta ($)', value: 'ivaVenta' },
        { disabled: false, label: '% Ganancia', value: 'margenGanancia' },
        { disabled: false, label: 'Precio de venta ($)', value: 'precioVenta' },
        { disabled: false, label: 'Ganancia por venta ($)', value: 'gananciaNeta' },
        { disabled: false, label: '% Ganancia fraccionada', value: 'margenGananciaFraccionado' },
        { disabled: false, label: 'Precio de venta fraccionada ($)', value: 'precioVentaFraccionado' },
        { disabled: false, label: 'Ganancia venta fraccionada ($)', value: 'gananciaNetaFraccionado' },
        { disabled: false, label: 'Precio de venta por unidad fraccionada ($)', value: 'precioVentaUnitarioFraccionado' },
        { disabled: false, label: 'Ganancia venta por unidad fraccionada ($)', value: 'gananciaNetaUnitarioFraccionado' },
        { disabled: false, label: 'Stock', value: 'cantidadStock' },
        { disabled: false, label: 'Stock fraccionado', value: 'cantidadFraccionadaStock' },
        { disabled: false, label: 'Unidad de medida', value: 'unidadMedida' },
        { disabled: false, label: 'Fraccionamiento', value: 'fraccionamiento' }
    ]

    const changeExcelOptions = (e) => {
        let selectedOptions
        if (e.length === 0) selectedOptions = [{ disabled: false, label: 'Todas', value: 'todas' }]
        else {
            selectedOptions = selectOptions.map(option => {
                const eventValues = e.map(eventOption => eventOption.value)
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({ type: 'SET_EXCEL_OPTIONS', payload: selectedOptions })
    }

    const selectExcelOptions = (e) => {
        if (e.value === 'todas') products_dispatch({ type: 'SELECT_ALL_EXCEL_OPTIONS' })
        else products_dispatch({ type: 'DESELECT_ALL_EXCEL_OPTIONS' })
    }

    return (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeExcelOptions}
            onSelect={selectExcelOptions}
            options={selectOptions}
            placeholder='Elige una opción'
            style={{width: '100%'}}
            value={products_state.activeExcelOptions}
        />
    )
}

export default ExportExcelOptions