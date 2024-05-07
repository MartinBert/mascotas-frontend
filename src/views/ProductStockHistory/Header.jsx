// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import InputHidden from '../../components/generics/InputHidden'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Row, Select } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useProductsContext } = contexts.Products
const { regExp } = helpers.stringHelper
const { ifSpecialCharacter } = regExp


const Header = () => {
    const [products_state, products_dispatch] = useProductsContext()

    // ----------------------------- Load brands and types ------------------------------ //
    const loadBrandsAndTypes = async () => {
        const findBrands = await api.marcas.findAll()
        const findTypes = await api.rubros.findAll()
        const allBrands = findBrands.docs
        const allBrandsNames = allBrands.length < 0
            ? []
            : [{ value: 'Todas las marcas' }].concat(allBrands.map(brand => {
                return { value: brand.nombre }
            }))
        const allTypes = findTypes.docs
        const allTypesNames = allTypes.length < 0
            ? []
            : [{ value: 'Todos los rubros' }].concat(allTypes.map(type => {
                return { value: type.nombre }
            }))
        products_dispatch({
            type: 'SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
            payload: { allBrands, allBrandsNames, allTypes, allTypesNames }
        })
    }

    useEffect(() => { loadBrandsAndTypes() }, [])

    // ------------- Button to clear filters ------------- //
    const clearFilters = () => {
        products_dispatch({ type: 'CLEAR_FILTERS_IN_STOCK_HISTORY' })
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

    // ----------- Input to filter by Barcode ------------ //
    const onChangeBarcode = (e) => {
        const filters = {
            ...products_state.stockHistory.productsToRender.paginationParams.filters,
            codigoBarras: e.target.value.replace(ifSpecialCharacter, '')
        }
        const paginationParams = {
            ...products_state.stockHistory.productsToRender.paginationParams,
            filters,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
            payload: paginationParams
        })
    }

    const inputToFilterByBarcode = (
        <Input
            color='primary'
            name='codigoBarras'
            onChange={onChangeBarcode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={products_state.stockHistory.productsToRender.paginationParams.filters.codigoBarras}
        />
    )

    // ------------ Input to filter by Name -------------- //
    const onChangeName = (e) => {
        const filters = {
            ...products_state.stockHistory.productsToRender.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = {
            ...products_state.stockHistory.productsToRender.paginationParams,
            filters,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
            payload: paginationParams
        })
    }

    const inputToFilterByName = (
        <Input
            color='primary'
            name='nombre'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={products_state.stockHistory.productsToRender.paginationParams.filters.nombre}
        />
    )

    // --------- Input to filter by Product code --------- //
    const onChangeProductCode = (e) => {
        const filters = {
            ...products_state.stockHistory.productsToRender.paginationParams.filters,
            codigoProducto: e.target.value.replace(ifSpecialCharacter, '')
        }
        const paginationParams = {
            ...products_state.stockHistory.productsToRender.paginationParams,
            filters,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
            payload: paginationParams
        })
    }

    const inputToFilterByProductCode = (
        <Input
            color='primary'
            name='codigoProducto'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={products_state.stockHistory.productsToRender.paginationParams.filters.codigoProducto}
        />
    )

    // ------------ Select to filter By Brand ------------ //
    const changeBrands = (e) => {
        const brands = products_state.stockHistory.productsToRender.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = []
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = products_state.stockHistory.productsToRender.brandsForSelect.allBrands
                .filter(brand => eventValues.includes(brand.nombre))
            selectedBrandsNames = brands.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
            payload: { selectedBrands, selectedBrandsNames }
        })
    }

    const selectBrands = (e) => {
        if (e.value === 'Todas las marcas') products_dispatch({
            type: 'SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY'
        })
        else products_dispatch({
            type: 'DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY'
        })
    }

    const selectToFilterByBrand = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeBrands}
            onSelect={selectBrands}
            options={products_state.stockHistory.productsToRender.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={products_state.stockHistory.productsToRender.brandsForSelect.selectedBrandsNames}
        />
    )

    // ------------ Select to filter by type ------------- //
    const changeTypes = (e) => {
        const types = products_state.stockHistory.productsToRender.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = products_state.stockHistory.productsToRender.typesForSelect.allTypes
                .filter(type => eventValues.includes(type.nombre))
            selectedTypesNames = types.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
            payload: { selectedTypes, selectedTypesNames }
        })
    }

    const selectTypes = (e) => {
        if (e.value === 'Todos los rubros') products_dispatch({
            type: 'SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY'
        })
        else products_dispatch({
            type: 'DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY'
        })
    }

    const selectToFilterByType = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeTypes}
            onSelect={selectTypes}
            options={products_state.stockHistory.productsToRender.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={products_state.stockHistory.productsToRender.typesForSelect.selectedTypesNames}
        />
    )

    const titleOfHeader = <h2>Historial de stock de productos</h2>


    const header = [
        {
            element: buttonToClearFilters,
            order: { lg: 8, md: 8, sm: 2, xl: 8, xs: 2, xxl: 8 }
        },
        {
            element: <InputHidden />,
            order: { lg: 2, md: 2, sm: 8, xl: 2, xs: 8, xxl: 2 }
        },
        {
            element: inputToFilterByBarcode,
            order: { lg: 5, md: 5, sm: 4, xl: 5, xs: 4, xxl: 5 }
        },
        {
            element: inputToFilterByName,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: inputToFilterByProductCode,
            order: { lg: 7, md: 7, sm: 5, xl: 7, xs: 5, xxl: 7 }
        },
        {
            element: selectToFilterByBrand,
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 }
        },
        {
            element: selectToFilterByType,
            order: { lg: 6, md: 6, sm: 7, xl: 6, xs: 7, xxl: 6 }
        },
        {
            element: titleOfHeader,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]} >
            {
                header.map((item, index) => {
                    return (
                        <Col
                            key={'productStockHistory_header_' + index}
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