// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Constexts
import contexts from '../../contexts'

// Design Components
import { Button, Checkbox, Col, Input, Modal, Row, Select, Table } from 'antd'

// Helpers
import actions from '../../actions'
import helpers from '../../helpers'

// Services
import api from '../../services'
import InputHidden from '../../components/generics/InputHidden'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useProductsContext } = contexts.Products
const { useSalesAreasContext } = contexts.SalesAreas
const { exportSimpleExcel } = helpers.excel
const { roundToMultiple, roundTwoDecimals } = helpers.mathHelper
const { productsCatalogue } = helpers.pdfHelper


const ExportProductListModal = () => {
    const [products_state, products_dispatch] = useProductsContext()
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()

    const loadBrandsAndTypes = async () => {
        const findBrands = await api.marcas.findAll()
        const findTypes = await api.rubros.findAll()
        const allBrands = findBrands.docs
        const allBrandsNames = allBrands.length < 1
            ? []
            : [{ value: 'Todas las marcas' }].concat(allBrands.map(brand => {
                return { value: brand.nombre }
            }))
        const allTypes = findTypes.docs
        const allTypesNames = allTypes.length < 1
            ? []
            : [{ value: 'Todos los rubros' }].concat(allTypes.map(type => {
                return { value: type.nombre }
            }))
        products_dispatch({
            type: 'SET_BRANDS_AND_TYPES_FOR_EXPORT_PRODUCT_LIST',
            payload: { allBrands, allBrandsNames, allTypes, allTypesNames }
        })
    }

    useEffect(() => { loadBrandsAndTypes() }, [])

    // ---------------- Button to cancel ----------------- //
    const cancel = () => {
        products_dispatch({ type: 'HIDE_EXPORT_PRODUCT_LIST_MODAL' })
    }

    const buttonToCancel = (
        <Button
            danger
            onClick={cancel}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // ------------ Button to clear filters -------------- //
    const clearFilters = () => {
        products_dispatch({ type: 'CLEAR_FILTERS_IN_EXPORT_PRODUCT_LIST_MODAL' })
    }

    const buttonToClearFilters = (
        <Button
            danger
            onClick={clearFilters}
            style={{ width: '100%' }}
            type='primary'
        >
            Reiniciar filtros
        </Button>
    )

    // --------- Button to export product list ----------- //
    const sumSalesAreaPercentage = (param) => {
        const fixedParam = param
            - salesAreas_state.selectedSalesArea[0].discountPercentage
            + salesAreas_state.selectedSalesArea[0].surchargePercentage
        return fixedParam
    }

    const addSalesAreaPercentage = (param) => {
        const fixedParam = param * (1
            - salesAreas_state.selectedSalesArea[0].discountDecimal
            + salesAreas_state.selectedSalesArea[0].surchargeDecimal
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
        for await (let product of products_state.exportProductList.productsToExport) {
            const activeOptions = []
            if (columnHeaders.includes('Ilustración')) {
                const imageID = product.imagenes.length > 0 ? product.imagenes[0]._id : null
                if (imageID) {
                    const imageUrl = await api.uploader.getImageUrl(imageID)
                    activeOptions.push(imageUrl)
                } else activeOptions.push('-')
            }
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

    const exportProductList = async () => {
        const nameOfDocument = 'Lista de productos'
        const nameOfSheet = 'Hoja de productos'
        const exportWithImages = products_state.exportProductList.imageOptionIsChecked
        const selectedHeaders = products_state.exportProductList.exportOptionsSelected.map(option => option.label)
        let columnHeaders = selectedHeaders.includes('Todas')
            ? products_state.exportProductList.exportOptions.map(option => option.label).filter(option => option !== 'Todas')
            : selectedHeaders
        if (exportWithImages) columnHeaders = ['Ilustración', ...columnHeaders]
        const lines = await processExcelLines(columnHeaders)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const buttonToExportProductList = (
        <Button
            onClick={exportProductList}
            style={{ width: '100%' }}
            type='primary'
        >
            Exportar
        </Button>
    )

    // --------- Checkbox to Export With Images ---------- //
    const onChangeCheckbox = (e) => {
        const isChecked = e.target.checked
        products_dispatch({ type: 'SELECT_IMAGE_OPTION_FOR_EXPORT_PRODUCT_LIST', payload: isChecked })
    }

    const checkboxToExportWithImages = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Exportar con ilustraciones
            </Col>
            <Col span={16}>
                <Checkbox
                    onChange={onChangeCheckbox}
                    checked={products_state.exportProductList.imageOptionIsChecked}
                >
                </Checkbox>
            </Col>
        </Row>
    )

    // ----------- Input to filter by barcode ------------ //
    const onChangeBarCode = (e) => {
        const filters = {
            ...products_state.exportProductList.paginationParams.filters,
            codigoBarras: e.target.value
        }
        const paginationParams = { ...products_state.exportProductList.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL', payload: paginationParams })
    }

    const inputToFilterByBarcode = (
        <Input
            color='primary'
            name='codigoBarras'
            onChange={onChangeBarCode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={products_state.exportProductList.paginationParams.filters.codigoBarras}
        />
    )

    // ------------ Input to filter by name --------------- //
    const onChangeName = (e) => {
        const filters = {
            ...products_state.exportProductList.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = { ...products_state.exportProductList.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL', payload: paginationParams })
    }

    const inputToFilterByName = (
        <Input
            color='primary'
            name='nombre'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={products_state.exportProductList.paginationParams.filters.nombre}
        />
    )

    // -------- Input to filter by product code ----------- //
    const onChangeProductCode = (e) => {
        const filters = {
            ...products_state.exportProductList.paginationParams.filters,
            codigoProducto: e.target.value
        }
        const paginationParams = { ...products_state.exportProductList.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL', payload: paginationParams })
    }

    const inputToFilterByProductCode = (
        <Input
            color='primary'
            name='codigoProducto'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={products_state.exportProductList.paginationParams.filters.codigoProducto}
        />
    )

    // -- Select document options to export product list - //
    const changeDocumentOptions = (e) => {
        products_dispatch({ type: 'SELECT_DOCUMENT_OPTIONS_IN_EXPORT_PRODUCT_LIST', payload: [e] })
    }

    const selectDocumentOptionsToExportProductList = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Tipo de documento
            </Col>
            <Col span={16}>
                <Select
                    onChange={changeDocumentOptions}
                    options={products_state.exportProductList.documentOptions}
                    style={{ width: '100%' }}
                    value={products_state.exportProductList.documentOptionsSelected}
                />
            </Col>
        </Row>
    )

    // ------ Select options to export product list ------ //
    const changeExportOptions = (e) => {
        const eventValues = e.map(eventOption => eventOption.value)
        let selectedOptions
        if (e.length === 0) selectedOptions = [{ disabled: false, label: 'Todas', value: 'todas' }]
        else {
            selectedOptions = products_state.exportProductList.exportOptions
                .filter(option => eventValues.includes(option.value))
        }
        products_dispatch({ type: 'SELECT_ACTIVE_EXCEL_OPTIONS', payload: selectedOptions })
    }

    const selectExportOptions = (e) => {
        if (e.value === 'todas') products_dispatch({ type: 'SELECT_ALL_EXCEL_OPTIONS' })
        else products_dispatch({ type: 'DESELECT_ALL_EXCEL_OPTIONS' })
    }

    const selectOptionsToExportProductList = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Opciones a exportar
            </Col>
            <Col span={16}>
                <Select
                    allowClear
                    labelInValue
                    mode='multiple'
                    onChange={changeExportOptions}
                    onSelect={selectExportOptions}
                    options={products_state.exportProductList.exportOptions}
                    placeholder='Elige una opción'
                    style={{ width: '100%' }}
                    value={products_state.exportProductList.exportOptionsSelected}
                />
            </Col>
        </Row>
    )

    // ----------- Select to filter by brand ------------- //
    const changeBrands = (e) => {
        const brands = products_state.exportProductList.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = []
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = products_state.exportProductList.brandsForSelect.allBrands
                .filter(brand => eventValues.includes(brand.nombre))
            selectedBrandsNames = brands.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_BRANDS_FOR_EXPORT_PRODUCT_LIST',
            payload: { selectedBrands, selectedBrandsNames }
        })
    }

    const selectBrands = (e) => {
        if (e.value === 'Todas las marcas') products_dispatch({ type: 'SELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST' })
        else products_dispatch({ type: 'DESELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST' })
    }

    const selectToFilterByBrand = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeBrands}
            onSelect={selectBrands}
            options={products_state.exportProductList.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={products_state.exportProductList.brandsForSelect.selectedBrandsNames}
        />
    )

    // ------------- Select to filter by type ------------- //
    const changeTypes = (e) => {
        const types = products_state.exportProductList.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = products_state.exportProductList.typesForSelect.allTypes
                .filter(type => eventValues.includes(type.nombre))
            selectedTypesNames = types.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_TYPES_FOR_EXPORT_PRODUCT_LIST',
            payload: { selectedTypes, selectedTypesNames }
        })
    }

    const selectTypes = (e) => {
        if (e.value === 'Todos los rubros') products_dispatch({ type: 'SELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST' })
        else products_dispatch({ type: 'DESELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST' })
    }

    const selectToFilterByType = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeTypes}
            onSelect={selectTypes}
            options={products_state.exportProductList.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={products_state.exportProductList.typesForSelect.selectedTypesNames}
        />
    )

    // ------------ Select to sales areas ---------------- //
    const loadSalesAreas = async () => {
        const findSalesAreas = await api.zonasdeventas.findAll()
        salesAreas_dispatch({ type: 'SET_ALL_SALES_AREAS', payload: findSalesAreas.docs })
    }

    useEffect(() => { loadSalesAreas() }, [])

    const changeSalesArea = async (e) => {
        const findSalesArea = await api.zonasdeventas.findByName(e)
        salesAreas_dispatch({ type: 'SET_SELECTED_SALES_AREA', payload: findSalesArea.docs })
    }

    const selectToSalesAreas = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Zona de venta
            </Col>
            <Col span={16}>
                <Select
                    onChange={changeSalesArea}
                    options={salesAreas_state.allSalesAreasNames}
                    style={{ width: '100%' }}
                    value={salesAreas_state.selectedSalesAreaName}
                />
            </Col>
        </Row>
    )

    // --------- Table of products to export ------------- //
    const fetchProducts = async () => {
        const findParamsForRender = formatFindParams(products_state.exportProductList.paginationParams)
        const dataForRender = await api.productos.findPaginated(findParamsForRender)
        const dataForExport = await api.productos.findAllFiltered(findParamsForRender.filters)
        const data = {
            productsToExport: dataForExport.docs,
            productsToRender: dataForRender.docs,
            quantityOfProducts: dataForExport.totalDocs
        }
        products_dispatch({ type: 'SET_PRODUCTS_TO_EXPORT_PRODUCT_LIST_MODAL', payload: data })
    }

    useEffect(() => { fetchProducts() }, [products_state.exportProductList.paginationParams])

    const setPageAndLimitForTableOfProductsToExport = (page, limit) => {
        const paginationParams = {
            ...products_state.exportProductList.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL', payload: paginationParams })
    }

    const columnsForTableOfProductsToExport = [
        {
            dataIndex: 'product_name',
            open: true,
            render: (_, product) => product.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'product_productCode',
            open: true,
            render: (_, product) => product.codigoProducto,
            title: 'Codigo de producto'
        },
        {
            dataIndex: 'product_barCode',
            open: true,
            render: (_, product) => product.codigoBarras,
            title: 'Codigo de barras'
        }
    ]

    const tableOfProductsToExport = (
        <Table
            columns={columnsForTableOfProductsToExport}
            dataSource={products_state.exportProductList.productsToRender}
            loading={products_state.exportProductList.loading}
            pagination={{
                defaultCurrent: products_state.exportProductList.paginationParams.page,
                defaultPageSize: products_state.exportProductList.paginationParams.limit,
                limit: products_state.exportProductList.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimitForTableOfProductsToExport(page, limit),
                pageSizeOptions: [5, 10],
                showSizeChanger: true,
                total: products_state.exportProductList.quantityOfProducts
            }}
            rowKey='_id'
            size='small'
            tableLayout='auto'
            width={'100%'}
        />
    )

    // ------------ Title of export options -------------- //
    const titleOfExportOptions = <h3>Opciones de exportación</h3>

    // --------------- Title of filters ------------------ //
    const titleOfFilters = <h3>Filtrar productos</h3>


    const itemsToRender = [
        {
            element: buttonToClearFilters,
            order: { lg: 14, md: 14, sm: 14, xl: 14, xs: 14, xxl: 14 }
        },
        {
            element: checkboxToExportWithImages,
            order: { lg: 7, md: 7, sm: 7, xl: 7, xs: 7, xxl: 7 }
        },
        {
            element: < InputHidden />,
            order: { lg: 11, md: 11, sm: 11, xl: 11, xs: 11, xxl: 11 }
        },
        {
            element: < InputHidden />,
            order: { lg: 13, md: 13, sm: 13, xl: 13, xs: 13, xxl: 13 }
        },
        {
            element: inputToFilterByBarcode,
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        },
        {
            element: inputToFilterByName,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: inputToFilterByProductCode,
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 }
        },
        {
            element: selectDocumentOptionsToExportProductList,
            order: { lg: 9, md: 9, sm: 9, xl: 9, xs: 9, xxl: 9 }
        },
        {
            element: selectOptionsToExportProductList,
            order: { lg: 5, md: 5, sm: 5, xl: 5, xs: 5, xxl: 5 }
        },
        {
            element: selectToFilterByBrand,
            order: { lg: 10, md: 10, sm: 10, xl: 10, xs: 10, xxl: 10 }
        },
        {
            element: selectToFilterByType,
            order: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12, xxl: 12 }
        },
        {
            element: selectToSalesAreas,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: titleOfExportOptions,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: titleOfFilters,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={products_state.exportProductList.modalVisibility}
            title='Exportar lista de productos'
            width={1200}
        >
            <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
                {
                    itemsToRender.map((item, index) => {
                        return (
                            <Col
                                key={'exportProductList_' + index}
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
            </Row>
            {tableOfProductsToExport}
            <Row gutter={8} justify='space-between'>
                <Col span={12}>
                    {buttonToCancel}
                </Col>
                <Col span={12}>
                    {buttonToExportProductList}
                </Col>
            </Row>
        </Modal>
    )
}

export default ExportProductListModal