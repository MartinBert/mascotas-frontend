// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Row, AutoComplete } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { nullifyFilters } = actions.paginationParams
const { useProductsContext } = contexts.Products
const { regExp } = helpers.stringHelper
const { ifSpecialCharacter } = regExp


const Header = () => {
    const [products_state, products_dispatch] = useProductsContext()

    // ----------------------------- Load brands and types ------------------------------ //
    const loadBrandsAndTypes = async () => {
        const findBrands = await api.marcas.findAll()
        const findTypes = await api.rubros.findAll()
        products_dispatch({
            type: 'SET_BRANDS_AND_TYPES',
            payload: { allBrands: findBrands.docs, allTypes: findTypes.docs }
        })
    }
    useEffect(() => { loadBrandsAndTypes() }, [])

    // ---------------------------------- Set filters ----------------------------------- //

    // ---------- Button to clear filters ---------- //
    const clearFilters = () => {
        const filters = nullifyFilters(products_state.paginationParams.filters)
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
        products_dispatch({ type: 'SET_ACTIVE_BRAND', payload: { value: null } })
        products_dispatch({ type: 'SET_ACTIVE_TYPE', payload: { value: null } })
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

    const dispatchFilters = (newFilters) => {
        const filters = { ...products_state.paginationParams.filters, ...newFilters }
        const paginationParams = { ...products_state.paginationParams, filters, page: 1 }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    // -------- Filter products by BAR CODE -------- //
    const onChangeBarCode = (e) => {
        const barCodeFilter = e.target.value === ''
            ? null
            : e.target.value.replace(ifSpecialCharacter, '')
        const filters = { codigoBarras: barCodeFilter }
        dispatchFilters(filters)
    }

    const filterByBarCode = (
        <Input
            color='primary'
            onChange={onChangeBarCode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.codigoBarras}
        />
    )

    // --------- Filter products by BRAND ---------- //
    const filterBrandOption = (inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

    const onClearBrand = () => {
        const filters = { marca: null }
        dispatchFilters(filters)
    }

    const onChangeBrand = (e) => {
        products_dispatch({ type: 'SET_ACTIVE_BRAND', payload: { value: e } })
    }

    const onSelectBrand = async (e) => {
        const findBrand = await api.marcas.findByName(e)
        const brand = findBrand.docs[0]
        const brandFilter = brand ?? null
        const filters = { marca: brandFilter }
        dispatchFilters(filters)
    }

    const filterByBrand = (
        <AutoComplete
            allowClear
            filterOption={filterBrandOption}
            onClear={onClearBrand}
            onChange={onChangeBrand}
            onSelect={onSelectBrand}
            options={products_state.brandsForSelectOptions.allBrands}
            placeholder='Buscar por marca'
            style={{ width: '100%' }}
            value={products_state.brandsForSelectOptions.selectedBrand}
        />
    )

    // ---------- Filter products by NAME ---------- //
    const onChangeName = (e) => {
        const nameFilter = e.target.value === ''
            ? null
            : e.target.value.replace(ifSpecialCharacter, '')
        const filters = { nombre: nameFilter }
        dispatchFilters(filters)
    }

    const filterByName = (
        <Input
            color='primary'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.nombre}
        />
    )

    // ------ Filter products by PRODUCT CODE ------ //
    const onChangeProductCode = (e) => {
        const productCodeFilter = e.target.value === ''
            ? null
            : e.target.value.replace(ifSpecialCharacter, '')
        const filters = { codigoProducto: productCodeFilter }
        dispatchFilters(filters)
    }

    const filterByProductCode = (
        <Input
            color='primary'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={products_state.paginationParams.filters.codigoProducto}
        />
    )

    // ---------- Filter products by TYPE ---------- //
    const filterTypeOption = (inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

    const onClearType = () => {
        const filters = { rubro: null }
        dispatchFilters(filters)
    }

    const onChangeType = (e) => {
        products_dispatch({ type: 'SET_ACTIVE_TYPE', payload: { value: e } })
    }

    const onSelectType = async (e) => {
        const findType = await api.rubros.findByName(e)
        const type = findType.docs[0]
        const typeFilter = type ?? null
        const filters = { rubro: typeFilter }
        dispatchFilters(filters)
    }

    const filterByType = (
        <AutoComplete
            allowClear
            filterOption={filterTypeOption}
            onClear={onClearType}
            onChange={onChangeType}
            onSelect={onSelectType}
            options={products_state.typesForSelectOptions.allTypes}
            placeholder='Buscar por rubro'
            style={{ width: '100%' }}
            value={products_state.typesForSelectOptions.selectedType}
        />
    )


    const header = [
        {
            element: filterByName,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: filterByBrand,
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 }
        },
        {
            element: filterByBarCode,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: filterByType,
            order: { lg: 4, md: 4, sm: 5, xl: 4, xs: 5, xxl: 4 }
        },
        {
            element: filterByProductCode,
            order: { lg: 5, md: 5, sm: 5, xl: 5, xs: 5, xxl: 5 }
        },
        {
            element: buttonToClearFilters,
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        }
    ]

    const responsiveGrid = {
        elementsGutter: { horizontal: 24, vertical: 8 },
        headGutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row
            gutter={[
                responsiveGrid.headGutter.horizontal,
                responsiveGrid.headGutter.vertical
            ]}
        >
            <Col span={24}>
                <h2>Historial de Stock de productos</h2>
            </Col>
            <Col span={24}>
                <Row
                    gutter={[
                        responsiveGrid.elementsGutter.horizontal,
                        responsiveGrid.elementsGutter.vertical
                    ]}
                >
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
            </Col>
        </Row>
    )
}

export default Header