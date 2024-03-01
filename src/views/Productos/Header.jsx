// React Components and Hooks
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { GenericAutocomplete } from '../../components/generics'
import InputHidden from '../../components/generics/InputHidden'

// Custom Constexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Row, Select } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import PriceModificatorModal from './PriceModificatorModal'

// Imports Destructuring
const { useProductsContext } = contexts.Products
const { useSalesAreasContext } = contexts.SalesAreas
const { exportSimpleExcel } = helpers.excel
const { roundToMultiple, roundTwoDecimals } = helpers.mathHelper


const Header = () => {
    const navigate = useNavigate()
    const [products_state, products_dispatch] = useProductsContext()
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()


    // ------------ Button to Modify Prices -------------- //
    const openPriceModificatorModal = () => {
        products_dispatch({ type: 'SHOW_PRICE_MODIFICATOR_MODAL' })
    }

    const buttonToModifyPrices = (
        <Button
            className='btn-primary'
            onClick={openPriceModificatorModal}
        >
            Modificar precios
        </Button>
    )

    // ------------- Button to New Product --------------- //
    const redirectToForm = () => navigate('/productos/nuevo')

    const buttonToNewProduct = (
        <Button
            className='btn-primary'
            onClick={redirectToForm}
        >
            Nuevo
        </Button>
    )

    // ------------------ Clear Filters ------------------ //
    const clearFilters = () => {
        const filters = {
            nombre: null,
            codigoBarras: null,
            codigoProducto: null,
            marca: [],
            rubro: []
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
        products_dispatch({
            type: 'SET_BRANDS_FOR_EXCEL_REPORT',
            payload: [{ value: 'Todas las marcas' }]
        })
        products_dispatch({
            type: 'SET_TYPES_FOR_EXCEL_REPORT',
            payload: [{ value: 'Todos los rubros' }]
        })
    }

    const buttonToClearFilters = (
        <Button
            danger
            onClick={clearFilters}
            style={{ width: '100%' }}
            type='primary'
        >
            Limpiar filtros
        </Button>
    )

    // ------------------ Export Excel ------------------- //
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

    const processExcelLines = async (columnHeaders) => {
        const processedLines = []
        for await (let product of products_state.productsForExcelReport) {
            const activeOptions = []

            // if (columnHeaders.includes('Ilustración')) {
            //     const imageID = product.imagenes.length > 0 ? product.imagenes[0]._id : null
            //     if (imageID) {
            //         const imageUrl = await api.uploader.getImageUrl(imageID)
            //         activeOptions.push(
            //             <img
            //                 crossOrigin='anonymous'
            //                 height='70'
            //                 src={imageUrl}
            //                 width='70'
            //             />
            //         )
            //     } else activeOptions.push('-')
            // }

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
        const lines = await processExcelLines(columnHeaders)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const buttonToExportExcel = (
        <Button
            className='btn-primary'
            onClick={exportExcel}
        >
            Exportar Excel
        </Button>
    )

    // -------------- Export Excel Options --------------- //
    const selectOptions = [
        { disabled: false, label: 'Todas', value: 'todas' },
        // { disabled: false, label: 'Ilustración', value: 'imagenes' },
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

    const selectToExportExcelOptions = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Opciones a exportar
            </Col>
            <Col span={16}>
                <Select
                    allowClear
                    labelInValue
                    mode='multiple'
                    onChange={changeExcelOptions}
                    onSelect={selectExcelOptions}
                    options={selectOptions}
                    placeholder='Elige una opción'
                    style={{ width: '100%' }}
                    value={products_state.activeExcelOptions}
                />
            </Col>
        </Row>
    )

    // --------------- Filter By Barcode ----------------- //
    const onChangeBarCode = (e) => {
        const filters = {
            ...products_state.paginationParams.filters,
            codigoBarras: e.target.value
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByBarcode = (
        <Input
            color='primary'
            name='codigoBarras'
            onChange={onChangeBarCode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.codigoBarras}
        />
    )

    // ---------------- Filter By Brand ------------------ //
    const changeBrands = (e) => {
        const brands = products_state.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = []
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = products_state.brandsForSelect.allBrands
                .filter(brand => eventValues.includes(brand.nombre))
            selectedBrandsNames = brands.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_BRANDS',
            payload: { selectedBrands, selectedBrandsNames }
        })
    }

    const selectBrands = (e) => {
        if (e.value === 'Todas las marcas') products_dispatch({ type: 'SELECT_ALL_BRANDS' })
        else products_dispatch({ type: 'DESELECT_ALL_BRANDS' })
    }

    const selectToFilterByBrand = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeBrands}
            onSelect={selectBrands}
            options={products_state.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={products_state.brandsForSelect.selectedBrandsNames}
        />
    )

    // ----------------- Filter By Type ------------------ //
    const changeTypes = (e) => {
        const types = products_state.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = products_state.typesForSelect.allTypes
                .filter(type => eventValues.includes(type.nombre))
            selectedTypesNames = types.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_TYPES',
            payload: { selectedTypes, selectedTypesNames }
        })
    }

    const selectTypes = (e) => {
        if (e.value === 'Todos los rubros') products_dispatch({ type: 'SELECT_ALL_TYPES' })
        else products_dispatch({ type: 'DESELECT_ALL_TYPES' })
    }

    const selectToFilterByType = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeTypes}
            onSelect={selectTypes}
            options={products_state.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={products_state.typesForSelect.selectedTypesNames}
        />
    )

    // ---------------- Filter By Name ------------------- //
    const onChangeName = (e) => {
        const filters = {
            ...products_state.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByName = (
        <Input
            color='primary'
            name='nombre'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.nombre}
        />
    )

    // ------------ Filter By Product Code --------------- //
    const onChangeProductCode = (e) => {
        const filters = {
            ...products_state.paginationParams.filters,
            codigoProducto: e.target.value
        }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByProductCode = (
        <Input
            color='primary'
            name='codigoProducto'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.codigoProducto}
        />
    )

    // ------------ Select to Sales Areas ---------------- //
    useEffect(() => {
        const findSalesAreas = async () => {
            const salesAreas = await api.zonasdeventas.findByName('Default')
            salesAreas_dispatch({ type: 'EDIT_SALES_AREA', payload: salesAreas.docs[0] })
        }
        findSalesAreas()
    }, [])

    const selectToSalesAreas = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Zona de venta
            </Col>
            <Col span={16}>
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
            </Col>
        </Row>
    )


    const productsRender = [
        {
            element: buttonToClearFilters,
            name: 'product_cleanFilters',
            order: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12, xxl: 12 }
        },
        {
            element: buttonToExportExcel,
            name: 'product_exportExcel',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: selectToExportExcelOptions,
            name: 'product_exportExcelOptions',
            order: { lg: 9, md: 9, sm: 5, xl: 9, xs: 5, xxl: 9 }
        },
        {
            element: buttonToModifyPrices,
            name: 'product_modifyPrices',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: buttonToNewProduct,
            name: 'product_newProduct',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: inputToFilterByBarcode,
            name: 'product_filterByBarcode',
            order: { lg: 4, md: 4, sm: 8, xl: 4, xs: 8, xxl: 4 }
        },
        {
            element: inputToFilterByName,
            name: 'product_filterByName',
            order: { lg: 2, md: 2, sm: 7, xl: 2, xs: 7, xxl: 2 }
        },
        {
            element: inputToFilterByProductCode,
            name: 'product_filterByProductcode',
            order: { lg: 6, md: 6, sm: 9, xl: 6, xs: 9, xxl: 6 }
        },
        {
            element: <InputHidden />,
            name: 'product_inputHidden_1',
            order: { lg: 11, md: 11, sm: 6, xl: 11, xs: 6, xxl: 11 }
        },
        {
            element: selectToFilterByBrand,
            name: 'product_filterByBrand',
            order: { lg: 8, md: 8, sm: 10, xl: 8, xs: 10, xxl: 8 }
        },
        {
            element: selectToFilterByType,
            name: 'product_filterByCategory',
            order: { lg: 10, md: 10, sm: 11, xl: 10, xs: 11, xxl: 10 }
        },
        {
            element: selectToSalesAreas,
            name: 'product_selectSalesArea',
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Row
            gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
            justify='space-around'
        >
            {
                productsRender.map(item => {
                    return (
                        <Col
                            key={item.name}
                            lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                            md={{ order: item.order.md, span: responsiveGrid.span.md }}
                            sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                            xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                            xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                            xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                        >
                            {item.element}
                        </Col>
                    )
                })
            }
            <PriceModificatorModal />
        </Row>
    )
}

export default Header