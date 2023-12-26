// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Button } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Imports Destructuring
const { useProductsContext } = contexts.Products
const { useSalesAreasContext } = contexts.SalesAreas
const { exportSimpleExcel } = helpers.excel
const { roundToMultiple, roundTwoDecimals } = helpers.mathHelper


const ExportExcel = ({ productosToReport }) => {
    const [products_state, products_dispatch] = useProductsContext()
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()

    const sumSalesAreaPercentage = (param) => {
        const fixedParam = param
            - salesAreas_state.currentSalesArea.discountPercentage
            + salesAreas_state.currentSalesArea.surchargePercentage
        return fixedParam
    }

    const addSalesAreaPercentage = (param) => {
        const fixedParam = param * (1
            - salesAreas_state.currentSalesArea.discountDecimal
            + salesAreas_state.currentSalesArea.surchargeDecimal
        )
        return roundToMultiple(fixedParam, 10)
    }

    const calculateSalePricePerUnit = (product) => {
        const precioVentaFraccionado = addSalesAreaPercentage(product.precioVentaFraccionado)
        const fraccionamiento = product.unidadMedida.fraccionamiento
        const salePricePerUnit = (fraccionamiento < 1000)
            ? precioVentaFraccionado / fraccionamiento
            : precioVentaFraccionado * 1000 / fraccionamiento
        const salePricePerUnitFixed = roundToMultiple(salePricePerUnit, 10)
        return salePricePerUnitFixed
    }

    const calculateSaleProfit = (product) => {
        const saleProfit = addSalesAreaPercentage(product.precioVenta)
            - product.precioUnitario
            - product.ivaVenta
        const saleFractionedProfit = addSalesAreaPercentage(product.precioVentaFraccionado)
            - product.precioUnitario
            - product.ivaVenta
        return { saleProfit, saleFractionedProfit }
    }

    const calculateSaleProfitPerUnit = (product) => {
        const fraccionamiento = product.unidadMedida.fraccionamiento
        const gananciaNetaFraccionado = calculateSaleProfit(product).saleFractionedProfit
        const saleProfitPerUnit = (fraccionamiento < 1000)
            ? gananciaNetaFraccionado / fraccionamiento
            : gananciaNetaFraccionado * 1000 / fraccionamiento
        const saleProfitPerUnitFixed = roundTwoDecimals(saleProfitPerUnit)
        return saleProfitPerUnitFixed
    }

    const processExcelLines = async (columnHeaders, productosToReport) => {
        const processedLines = []
        for await (let product of productosToReport) {
            const activeOptions = []
            if (columnHeaders.includes('Producto')) activeOptions.push(product.nombre ? product.nombre : '-')
            if (columnHeaders.includes('Rubro')) activeOptions.push(product.rubro ? product.rubro.nombre : '-')
            if (columnHeaders.includes('Marca')) activeOptions.push(product.marca ? product.marca.nombre : '-')
            if (columnHeaders.includes('Cód. producto')) activeOptions.push(product.codigoProducto ? product.codigoProducto : '-')
            if (columnHeaders.includes('Cód. barras')) activeOptions.push(product.codigoBarras ? product.codigoBarras : '-')
            if (columnHeaders.includes('% IVA compra')) activeOptions.push(product.porcentajeIvaCompra ? '% ' + product.porcentajeIvaCompra : '-')
            if (columnHeaders.includes('IVA compra ($)')) activeOptions.push(product.ivaCompra ? product.ivaCompra : '-')
            if (columnHeaders.includes('Precio de lista ($)')) activeOptions.push(product.precioUnitario ? product.precioUnitario : '-')
            if (columnHeaders.includes('% IVA venta')) activeOptions.push(product.porcentajeIvaVenta ? '% ' + product.porcentajeIvaVenta : '-')
            if (columnHeaders.includes('IVA venta ($)')) activeOptions.push(product.ivaVenta ? product.ivaVenta : '-')
            if (columnHeaders.includes('% Ganancia')) activeOptions.push(product.margenGanancia ? '% ' + sumSalesAreaPercentage(product.margenGanancia) : '-')
            if (columnHeaders.includes('Precio de venta ($)')) activeOptions.push(product.precioVenta ? addSalesAreaPercentage(product.precioVenta) : '-')
            if (columnHeaders.includes('Ganancia por venta ($)')) activeOptions.push(product.gananciaNeta ? calculateSaleProfit(product).saleProfit : '-')
            if (columnHeaders.includes('% Ganancia fraccionada')) activeOptions.push(product.margenGananciaFraccionado ? '% ' + sumSalesAreaPercentage(product.margenGananciaFraccionado) : '-- Sin fraccionar --')
            if (columnHeaders.includes('Precio de venta fraccionada ($)')) activeOptions.push(product.precioVentaFraccionado ? addSalesAreaPercentage(product.precioVentaFraccionado) : '-- Sin fraccionar --')
            if (columnHeaders.includes('Ganancia venta fraccionada ($)')) activeOptions.push(product.gananciaNetaFraccionado ? calculateSaleProfit(product).saleFractionedProfit : '-- Sin fraccionar --')
            if (columnHeaders.includes('Precio de venta por unidad fraccionada ($)')) activeOptions.push(product.precioVentaFraccionado && product.unidadMedida ? calculateSalePricePerUnit(product) : '-- Sin fraccionar --')
            if (columnHeaders.includes('Ganancia venta por unidad fraccionada ($)')) activeOptions.push(product.gananciaNetaFraccionado && product.unidadMedida ? calculateSaleProfitPerUnit(product) : '-- Sin fraccionar --')
            if (columnHeaders.includes('Stock')) activeOptions.push(product.cantidadStock ? product.cantidadStock : '-')
            if (columnHeaders.includes('Stock fraccionado')) activeOptions.push(product.cantidadFraccionadaStock ? product.cantidadFraccionadaStock : '-- Sin fraccionar --')
            if (columnHeaders.includes('Unidad de medida')) activeOptions.push(product.unidadMedida ? product.unidadMedida.nombre : '-- Sin fraccionar --')
            if (columnHeaders.includes('Fraccionamiento')) activeOptions.push(product.unidadMedida ? product.unidadMedida.fraccionamiento : '-- Sin fraccionar --')
            processedLines.push(activeOptions)
        }
        return processedLines
    }

    const exportExcel = async () => {
        const nameOfDocument = 'Lista de productos'
        const nameOfSheet = 'Hoja de productos'
        const selectedHeaders = products_state.activeExcelOptions.map(option => option.label)
        const columnHeaders = selectedHeaders.includes('Todas') ? products_state.allExcelTitles : selectedHeaders

        const lines = await processExcelLines(columnHeaders, productosToReport)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }


    return (
        <Button
            className='btn-primary'
            onClick={() => exportExcel()}
        >
            Exportar Excel
        </Button>
    )
}

export default ExportExcel