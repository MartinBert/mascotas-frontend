// React Components and Hooks
import React, { useEffect } from 'react'

// Custom components
import { errorAlert } from '../../components/alerts'

// Custom Constexts
import contexts from '../../contexts'

// Design Components
import { Button, Checkbox, Col, Input, Modal, Row, Select, Spin, Table } from 'antd'

// Helpers
import actions from '../../actions'
import helpers from '../../helpers'

// Services
import api from '../../services'
import InputHidden from '../../components/generics/InputHidden'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useAuthContext } = contexts.Auth
const { useProductsContext } = contexts.Products
const { useSalesAreasContext } = contexts.SalesAreas
const { generateExcel } = helpers.excel
const { decimalPercent, roundToMultiple, roundTwoDecimals } = helpers.mathHelper
const { createProductsCataloguePdf } = helpers.pdfHelper


const ExportProductListModal = () => {
    const [auth_state, auth_dispatch] = useAuthContext()
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

    const loadUserData = async () => {
        const userId = localStorage.getItem('userId')
        const loggedUser = await api.usuarios.findById(userId)
        auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })
    }

    useEffect(() => {
        loadBrandsAndTypes()
        loadUserData()
        // eslint-disable-next-line
    }, [])

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
    const fixProductValues = (product) => {
        const fractionament = product.unidadMedida?.fraccionamiento ?? 1
        const decimalDiscountOfArea = salesAreas_state.selectedSalesArea[0].discountPercentage
        const decimalSurchargeOfArea = salesAreas_state.selectedSalesArea[0].surchargePercentage
        const parameter = decimalSurchargeOfArea - decimalDiscountOfArea
        const margenGanancia = product.margenGanancia + parameter
        const margenGananciaFraccionado = product.margenGananciaFraccionado + parameter
        const unfractionedSalePrice = product.precioUnitario * (1 + decimalPercent(margenGanancia)) + product.ivaVenta
        const fractionedSalePrice = product.precioUnitario * (1 + decimalPercent(margenGananciaFraccionado)) + product.ivaVenta
        const salePricePerUnit = (fractionament < 1000) ? fractionedSalePrice / fractionament : fractionedSalePrice * 1000 / fractionament
        const gananciaNeta = unfractionedSalePrice - product.precioUnitario - product.ivaVenta
        const gananciaNetaFraccionado = fractionedSalePrice - product.precioUnitario - product.ivaVenta
        const saleProfitPerUnit = (fractionament < 1000) ? gananciaNetaFraccionado / fractionament : gananciaNetaFraccionado * 1000 / fractionament
        const fixedProduct = {
            ...product,
            gananciaNeta,
            gananciaNetaFraccionado,
            margenGanancia,
            margenGananciaFraccionado,
            precioVenta: roundToMultiple(unfractionedSalePrice, 10),
            precioVentaFraccionado: roundToMultiple(fractionedSalePrice, 10),
            salePricePerUnit: roundToMultiple(salePricePerUnit, 10),
            saleProfitPerUnit: roundTwoDecimals(saleProfitPerUnit)
        }
        return fixedProduct
    }

    const generateHeaders = () => {
        const exportWithImages = products_state.exportProductList.imageOptionIsChecked
        const selectedHeaders = products_state.exportProductList.exportOptionsSelected.map(option => option.label)
        let headers = selectedHeaders.includes('Todas')
            ? products_state.exportProductList.exportOptions.map(option => option.label).filter(option => option !== 'Todas')
            : selectedHeaders
        if (exportWithImages) headers = ['Ilustración', ...headers]
        return headers
    }

    const formatLines = async (headers) => {
        const processedLines = []
        for await (let product of products_state.exportProductList.productsToExport) {
            const activeOptions = []
            if (headers.includes('Ilustración')) {
                const imageID = product.imagenes.length > 0 ? product.imagenes[0]._id : null
                if (imageID) {
                    const imageUrl = await api.uploader.getImageUrl(imageID)
                    activeOptions.push(imageUrl)
                } else activeOptions.push('-')
            }
            if (headers.includes('Producto')) activeOptions.push(product.nombre ? product.nombre : '-')
            if (headers.includes('Rubro')) activeOptions.push(product.rubro ? product.rubro.nombre : '-')
            if (headers.includes('Marca')) activeOptions.push(product.marca ? product.marca.nombre : '-')
            if (headers.includes('Cód. producto')) activeOptions.push(product.codigoProducto ? product.codigoProducto : '-')
            if (headers.includes('Cód. barras')) activeOptions.push(product.codigoBarras ? product.codigoBarras : '-')
            if (headers.includes('% IVA compra')) activeOptions.push(product.porcentajeIvaCompra ? '% ' + product.porcentajeIvaCompra : '-')
            if (headers.includes('IVA compra ($)')) activeOptions.push(product.ivaCompra ? product.ivaCompra : '-')
            if (headers.includes('Precio de lista ($)')) activeOptions.push(product.precioUnitario ? product.precioUnitario : '-')
            if (headers.includes('% IVA venta')) activeOptions.push(product.porcentajeIvaVenta ? '% ' + product.porcentajeIvaVenta : '-')
            if (headers.includes('IVA venta ($)')) activeOptions.push(product.ivaVenta ? product.ivaVenta : '-')
            if (headers.includes('% Ganancia')) activeOptions.push(product.margenGanancia ? '% ' + fixProductValues(product).margenGanancia : '-')
            if (headers.includes('Precio de venta ($)')) activeOptions.push(product.precioVenta ? fixProductValues(product).precioVenta : '-')
            if (headers.includes('Ganancia por venta ($)')) activeOptions.push(product.gananciaNeta ? fixProductValues(product).gananciaNeta : '-')
            if (headers.includes('% Ganancia fraccionada')) activeOptions.push(product.margenGananciaFraccionado ? '% ' + fixProductValues(product).margenGananciaFraccionado : '-- Sin fraccionar --')
            if (headers.includes('Precio de venta fraccionada ($)')) activeOptions.push(product.precioVentaFraccionado ? fixProductValues(product).precioVentaFraccionado : '-- Sin fraccionar --')
            if (headers.includes('Ganancia venta fraccionada ($)')) activeOptions.push(product.gananciaNetaFraccionado ? fixProductValues(product).gananciaNetaFraccionado : '-- Sin fraccionar --')
            if (headers.includes('Precio de venta por unidad fraccionada ($)')) activeOptions.push(product.precioVentaFraccionado && product.unidadMedida ? fixProductValues(product).salePricePerUnit : '-- Sin fraccionar --')
            if (headers.includes('Ganancia venta por unidad fraccionada ($)')) activeOptions.push(product.gananciaNetaFraccionado && product.unidadMedida ? fixProductValues(product).saleProfitPerUnit : '-- Sin fraccionar --')
            if (headers.includes('Stock')) activeOptions.push(product.cantidadStock ? product.cantidadStock : '-')
            if (headers.includes('Stock fraccionado')) activeOptions.push(product.cantidadFraccionadaStock ? product.cantidadFraccionadaStock : '-- Sin fraccionar --')
            if (headers.includes('Unidad de medida')) activeOptions.push(product.unidadMedida ? product.unidadMedida.nombre : '-- Sin fraccionar --')
            if (headers.includes('Fraccionamiento')) activeOptions.push(product.unidadMedida ? product.unidadMedida.fraccionamiento : '-- Sin fraccionar --')
            processedLines.push(activeOptions)
        }
        return processedLines
    }

    const exportExcel = async () => {
        const headers = generateHeaders()
        const lines = await formatLines(headers)
        const nameOfDocument = 'Lista de productos'
        const nameOfSheet = 'Hoja de productos'
        const result = await generateExcel(headers, lines, nameOfSheet, nameOfDocument)
        return { isCreated: result.isCreated, docType: 'excel' }
    }

    const exportPdf = async () => {
        const brands = products_state.exportProductList.brandsForSelect.selectedBrandsNames.map(brand => brand.value)
        const enterprise = auth_state.user.empresa
        const headers = generateHeaders()
        const renglones = await formatLines(headers)
        const salesArea = salesAreas_state.selectedSalesAreaName.value
        const types = products_state.exportProductList.typesForSelect.selectedTypesNames.map(type => type.value)
        const data = { brands, enterprise, headers, renglones, salesArea, types }
        const result = await createProductsCataloguePdf(data)
        return { isCreated: result.isCreated, docType: 'pdf' }
    }

    const exportProductList = async () => {
        products_dispatch({ type: 'SET_LOADING_OF_MODAL_IN_EXPORT_PRODUCT_LIST_MODAL', payload: true })
        const allDocumentsTypes = products_state.exportProductList.documentOptions.map(doc => doc.value)
        const [documentTypeSelected] = products_state.exportProductList.documentOptionsSelected
        if (!allDocumentsTypes.includes(documentTypeSelected)) return errorAlert('Seleccione el formato del documento a exportar (excel, pdf, etc...).')
        let response
        if (documentTypeSelected === 'excel') response = await exportExcel()
        else response = await exportPdf()
        if (!response.isCreated) return errorAlert(`No se pudo generar el catálogo en formato "${response.docType}". Inténtelo de nuevo o utilice otro formato.`)
        products_dispatch({ type: 'SET_LOADING_OF_MODAL_IN_EXPORT_PRODUCT_LIST_MODAL', payload: false })
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
            <Col span={20}>
                Exportar con ilustraciones
            </Col>
            <Col span={4} style={{ textAlign: 'end' }}>
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
                    disabled={products_state.exportProductList.documentOptionsSelected[0] === 'pdf'}
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
        if (findSalesAreas.docs.length === 0) return
        salesAreas_dispatch({ type: 'SET_ALL_SALES_AREAS', payload: findSalesAreas.docs })
    }

    useEffect(() => {
        loadSalesAreas()
        // eslint-disable-next-line
    }, [])

    const changeSalesArea = async (e) => {
        const filters = JSON.stringify({ name: e })
        const findSalesArea = await api.zonasdeventas.findAllByFilters(filters)
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
        const dataForExport = await api.productos.findAllByFilters(findParamsForRender.filters)
        const data = {
            productsToExport: dataForExport.docs,
            productsToRender: dataForRender.docs,
            quantityOfProducts: dataForExport.totalDocs
        }
        products_dispatch({ type: 'SET_PRODUCTS_TO_EXPORT_PRODUCT_LIST_MODAL', payload: data })
    }

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line
    }, [products_state.exportProductList.paginationParams])

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
            render: (_, product) => product.nombre,
            title: 'Producto'
        },
        {
            dataIndex: 'product_barCode',
            render: (_, product) => product.codigoBarras,
            title: 'Código de barras'
        },
        {
            dataIndex: 'product_productCode',
            render: (_, product) => product.codigoProducto,
            title: 'Código de producto'
        },
        {
            dataIndex: 'product_salePrice',
            render: (_, product) => product.precioVenta,
            title: 'Precio de venta'
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
            order: { lg: 14, md: 14, sm: 13, xl: 14, xs: 13, xxl: 14 }
        },
        {
            element: checkboxToExportWithImages,
            order: { lg: 9, md: 9, sm: 5, xl: 9, xs: 5, xxl: 9 }
        },
        {
            element: < InputHidden />,
            order: { lg: 11, md: 11, sm: 6, xl: 11, xs: 6, xxl: 11 }
        },
        {
            element: < InputHidden />,
            order: { lg: 13, md: 13, sm: 14, xl: 13, xs: 14, xxl: 13 }
        },
        {
            element: inputToFilterByBarcode,
            order: { lg: 6, md: 6, sm: 10, xl: 6, xs: 10, xxl: 6 }
        },
        {
            element: inputToFilterByName,
            order: { lg: 4, md: 4, sm: 8, xl: 4, xs: 8, xxl: 4 }
        },
        {
            element: inputToFilterByProductCode,
            order: { lg: 8, md: 8, sm: 9, xl: 8, xs: 9, xxl: 8 }
        },
        {
            element: selectDocumentOptionsToExportProductList,
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: selectOptionsToExportProductList,
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        },
        {
            element: selectToFilterByBrand,
            order: { lg: 10, md: 10, sm: 11, xl: 10, xs: 11, xxl: 10 }
        },
        {
            element: selectToFilterByType,
            order: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12, xxl: 12 }
        },
        {
            element: selectToSalesAreas,
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: titleOfExportOptions,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: titleOfFilters,
            order: { lg: 2, md: 2, sm: 7, xl: 2, xs: 7, xxl: 2 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    const spinStyle = {
        height: document.getElementById('exportProductListModalRender')?.clientHeight ?? null,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
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
            {
                products_state.exportProductList.loadingOfModal
                    ? <div style={spinStyle}><Spin /></div>
                    : (
                        <div id='exportProductListModalRender'>
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
                        </div>
                    )
            }
            <div id='catalogue' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
        </Modal>
    )
}

export default ExportProductListModal