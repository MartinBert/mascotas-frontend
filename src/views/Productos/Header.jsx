// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import InputHidden from '../../components/generics/InputHidden'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Row, Select } from 'antd'

// Imports Destructuring
const { useProductsContext } = contexts.Products


const Header = () => {
    const navigate = useNavigate()
    const [products_state, products_dispatch] = useProductsContext()

    // ------------- Button to clear filters ------------- //
    const clearFilters = () => {
        products_dispatch({ type: 'CLEAR_FILTERS' })
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

    // --------- Button to create a new product ---------- //
    const redirectToForm = () => navigate('/productos/nuevo')

    const buttonToNewProduct = (
        <Button
            className='btn-primary'
            onClick={redirectToForm}
        >
            Nuevo Producto
        </Button>
    )

    // ------------ Button to modify prices -------------- //
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

    // --- Button to open modal to export product list --- //
    const openExportProductListModal = async () => {
        products_dispatch({ type: 'SHOW_EXPORT_PRODUCT_LIST_MODAL' })
    }

    const buttonToExportProductList = (
        <Button
            className='btn-primary'
            onClick={openExportProductListModal}
        >
            Exportar Lista de Productos
        </Button>
    )

    // ----------- Input to filter by barcode ------------ //
    const onChangeBarCode = (e) => {
        const filters = {
            ...products_state.index.paginationParams.filters,
            codigoBarras: e.target.value
        }
        const paginationParams = { ...products_state.index.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByBarcode = (
        <Input
            color='primary'
            name='codigoBarras'
            onChange={onChangeBarCode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={products_state.index.paginationParams.filters.codigoBarras}
        />
    )

    // ------------ Input to filter by name -------------- //
    const onChangeName = (e) => {
        const filters = {
            ...products_state.index.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = { ...products_state.index.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByName = (
        <Input
            color='primary'
            name='nombre'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={products_state.index.paginationParams.filters.nombre}
        />
    )

    // -------- Input to filter by product code ---------- //
    const onChangeProductCode = (e) => {
        const filters = {
            ...products_state.index.paginationParams.filters,
            codigoProducto: e.target.value
        }
        const paginationParams = { ...products_state.index.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByProductCode = (
        <Input
            color='primary'
            name='codigoProducto'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={products_state.index.paginationParams.filters.codigoProducto}
        />
    )

    // ------------ Select to filter by brand ------------ //
    const changeBrands = (e) => {
        const brands = products_state.index.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = []
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = products_state.index.brandsForSelect.allBrands
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
            options={products_state.index.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={products_state.index.brandsForSelect.selectedBrandsNames}
        />
    )

    // ------------- Select to filter by type ------------ //
    const changeTypes = (e) => {
        const types = products_state.index.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = products_state.index.typesForSelect.allTypes
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
            options={products_state.index.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={products_state.index.typesForSelect.selectedTypesNames}
        />
    )

    // ---------------- Title of actions ----------------- //
    const titleOfActions = <h3>Acciones</h3>

    // ----------------- Title of filters ------------------ //
    const titleOfFilters = <h3>Filtrar productos</h3>


    const itemsToRender = [
        {
            element: buttonToClearFilters,
            order: { lg: 9, md: 9, sm: 5, xl: 9, xs: 5, xxl: 9 }
        },
        {
            element: buttonToExportProductList,
            order: { lg: 6, md: 6, sm: 4, xl: 6, xs: 4, xxl: 6 }
        },
        {
            element: buttonToModifyPrices,
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: buttonToNewProduct,
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: <InputHidden />,
            order: { lg: 11, md: 11, sm: 6, xl: 11, xs: 6, xxl: 11 }
        },
        {
            element: inputToFilterByBarcode,
            order: { lg: 5, md: 5, sm: 10, xl: 5, xs: 10, xxl: 5 }
        },
        {
            element: inputToFilterByName,
            order: { lg: 4, md: 4, sm: 8, xl: 4, xs: 8, xxl: 4 }
        },
        {
            element: inputToFilterByProductCode,
            order: { lg: 7, md: 7, sm: 9, xl: 7, xs: 9, xxl: 7 }
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
            element: titleOfActions,
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

    return (
        <Row
            gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
            justify='space-around'
        >
            {
                itemsToRender.map((item, index) => {
                    return (
                        <Col
                            key={'products_header_' + index}
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
    )
}

export default Header