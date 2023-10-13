// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Button } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Imports Destructuring
const { useSalesAreasContext } = contexts.SalesAreas
const { exportSimpleExcel } = helpers.excel
const { roundToMultiple, roundTwoDecimals } = helpers.mathHelper


const ExportExcel = ({ productosToReport }) => {
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
        return {saleProfit, saleFractionedProfit}
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

    const processExcelLines = async (productosToReport) => {
        const processedLines = []
        for await (let product of productosToReport) {
            processedLines.push([
                (product.nombre) ? product.nombre : '-',
                (product.rubro) ? product.rubro.nombre : '-',
                (product.marca) ? product.marca.nombre : '-',
                (product.codigoProducto) ? product.codigoProducto : '-',
                (product.codigoBarras) ? product.codigoBarras : '-',
                (product.porcentajeIvaCompra) ? '% ' + product.porcentajeIvaCompra : '-',
                (product.ivaCompra) ? product.ivaCompra : '-',
                (product.precioUnitario) ? product.precioUnitario : '-',
                (product.porcentajeIvaVenta) ? '% ' + product.porcentajeIvaVenta : '-',
                (product.ivaVenta) ? product.ivaVenta : '-',
                (product.margenGanancia) ? '% ' + sumSalesAreaPercentage(product.margenGanancia) : '-',
                (product.precioVenta) ? addSalesAreaPercentage(product.precioVenta) : '-',
                (product.gananciaNeta) ? calculateSaleProfit(product).saleProfit : '-',
                (product.margenGananciaFraccionado) ? '% ' + sumSalesAreaPercentage(product.margenGananciaFraccionado) : '-- Sin fraccionar --',
                (product.precioVentaFraccionado) ? addSalesAreaPercentage(product.precioVentaFraccionado) : '-- Sin fraccionar --',
                (product.gananciaNetaFraccionado) ? calculateSaleProfit(product).saleFractionedProfit : '-- Sin fraccionar --',
                (product.precioVentaFraccionado && product.unidadMedida) ? calculateSalePricePerUnit(product) : '-- Sin fraccionar --',
                (product.gananciaNetaFraccionado && product.unidadMedida) ? calculateSaleProfitPerUnit(product) : '-- Sin fraccionar --',
                (product.cantidadStock) ? product.cantidadStock : '-',
                (product.cantidadFraccionadaStock) ? product.cantidadFraccionadaStock : '-- Sin fraccionar --',
                (product.unidadMedida) ? product.unidadMedida.nombre : '-- Sin fraccionar --',
                (product.unidadMedida) ? product.unidadMedida.fraccionamiento : '-- Sin fraccionar --',
            ])
        }
        return processedLines
    }

    const exportExcel = async () => {
        const nameOfSheet = 'Hoja de productos'
        const nameOfDocument = 'Lista de productos'
        const columnHeaders = [
            'Producto',
            'Rubro',
            'Marca',
            'Cód. producto',
            'Cód. barras',
            '% IVA compra',
            'IVA compra ($)',
            'Precio de lista ($)',
            '% IVA venta',
            'IVA venta ($)',
            'Porcentaje ganancia',
            'Precio de venta ($)',
            'Ganancia venta ($)',
            'Porcentaje ganancia fraccionada',
            'Precio de venta fraccionada ($)',
            'Ganancia venta fraccionada ($)',
            'Precio de venta por unidad fraccionada ($)',
            'Ganancia venta por unidad fraccionada ($)',
            'Stock',
            'Stock fraccionado',
            'Unidad de medida',
            'Fraccionamiento',
        ]
        const lines = await processExcelLines(productosToReport)
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