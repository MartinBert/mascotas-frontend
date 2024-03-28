// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import icons from '../../components/icons'
import InputHidden from '../../components/generics/InputHidden'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Button, Checkbox, Col, Input, Modal, Row, Select, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useProductsContext } = contexts.Products
const { decimalPercent, roundToMultiple, roundTwoDecimals } = helpers.mathHelper
const { ifNotNumber } = helpers.stringHelper.regExp
const { Delete } = icons


const PriceModificatorModal = () => {
    const [products_state, products_dispatch] = useProductsContext()

    // ------------- Fetch Brands and Types -------------- //
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
            type: 'SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: { allBrands, allBrandsNames, allTypes, allTypesNames }
        })
    }

    useEffect(() => { loadBrandsAndTypes() }, [])

    // ----------- Button to cancel modifies ------------- //
    const cancelModifies = () => {
        products_dispatch({ type: 'CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL' })
    }

    const buttonToCancelModifies = (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                className='btn-secondary'
                onClick={cancelModifies}
                style={{ width: '50%' }}
            >
                Cancelar
            </Button>
        </div>
    )

    // -------------- Button to check page --------------- //
    const checkPage = () => {
        const products = products_state.priceModificatorModal.productsToRender.products
        products_dispatch({
            type: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
            payload: { check: true, products }
        })
    }

    const buttonToCheckPage = (
        <Button
            className='btn-primary'
            onClick={checkPage}
            style={{ width: '100%' }}
        >
            Marcar página
        </Button>
    )

    // ------------- Button to clear filters ------------- //
    const clearFilters = () => {
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams,
            filters: {
                codigoBarras: null,
                codigoProducto: null,
                marca: [],
                nombre: null,
                rubro: []
            },
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: paginationParams
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

    // ------------- Button to save modifies ------------- //
    const saveModifies = () => {
        products_dispatch({ type: 'SET_LOADING', payload: true })
        const modificationQuantity = products_state.priceModificatorModal.priceModificationQuantity
        const modificationSign = products_state.priceModificatorModal.priceModificationSign
        const modificationType = products_state.priceModificatorModal.priceModificationType
        const modificationValue = modificationSign === '+'
            ? modificationQuantity
            : (-1) * modificationQuantity
        const productsToModify = products_state.priceModificatorModal.productsToModify.products

        if (!modificationType) return errorAlert(
            'Debe seleccionar el tipo de modificación a aplicar en el precio de los productos.'
        )
        if (modificationValue === 0) return errorAlert('El valor de la modificación debe ser mayor que 0.')
        if (productsToModify.length < 1) return errorAlert(
            'Debe seleccionar al menos 1 producto para modificar su precio...'
        )

        for (let product of productsToModify) {
            const decimalIvaCompra = decimalPercent(parseFloat(product.porcentajeIvaCompra))
            const decimalIvaVenta = decimalPercent(parseFloat(product.porcentajeIvaVenta))
            const decimalMargenGanancia = decimalPercent(parseFloat(product.margenGanancia))
            const decimalMargenGananciaFraccionado = decimalPercent(parseFloat(product.margenGananciaFraccionado))

            const newPrecioUnitario = modificationType === 'Porcentual'
                ? roundTwoDecimals(Number(product.precioUnitario) * (1 + decimalPercent(modificationValue)))
                : roundTwoDecimals(Number(product.precioUnitario) + Number(modificationValue))
            const newGananciaNeta = roundTwoDecimals(newPrecioUnitario * decimalMargenGanancia)
            const newGananciaNetaFraccionado = roundTwoDecimals(newPrecioUnitario * decimalMargenGananciaFraccionado)
            const newIvaCompra = roundTwoDecimals(newPrecioUnitario - (newPrecioUnitario / (1 + decimalIvaCompra)))
            const newIvaVenta = roundTwoDecimals(newPrecioUnitario * decimalIvaVenta)
            const newPrecioVentaSinRedondear = roundTwoDecimals(newPrecioUnitario + newIvaVenta + newGananciaNeta)
            const newPrecioVenta = roundToMultiple(newPrecioVentaSinRedondear, 10)
            const newPrecioVentaFraccionadoSinRedondear = roundTwoDecimals(newPrecioUnitario + newIvaVenta + newGananciaNetaFraccionado)
            const newPrecioVentaFraccionado = roundToMultiple(newPrecioVentaFraccionadoSinRedondear, 10)

            product.precioUnitario = newPrecioUnitario
            product.ivaCompra = newIvaCompra
            product.ivaVenta = newIvaVenta
            product.gananciaNeta = newGananciaNeta + newPrecioVenta - newPrecioVentaSinRedondear
            product.gananciaNetaFraccionado = newGananciaNetaFraccionado + newPrecioVentaFraccionado - newPrecioVentaFraccionadoSinRedondear
            product.precioVenta = newPrecioVenta
            product.precioVentaFraccionado = newPrecioVentaFraccionado
            api.productos.edit(product)
        }
        products_dispatch({ type: 'CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL' })
        successAlert('Los precios fueron modificados!').then(() => { window.location.reload() })
    }

    const buttonToSaveModifies = (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                className='btn-primary'
                onClick={saveModifies}
                style={{ width: '50%' }}
            >
                Aceptar
            </Button>
        </div>
    )

    // ------------- Button to uncheck page -------------- //
    const uncheckPage = () => {
        const products = products_state.priceModificatorModal.productsToRender.products
        products_dispatch({
            type: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
            payload: { check: false, products }
        })
    }

    const buttonToUncheckPage = (
        <Button
            className='btn-secondary'
            onClick={uncheckPage}
            style={{ width: '100%' }}
        >
            Desmarcar página
        </Button>
    )

    // ----------- Input to filter by Barcode ------------ //
    const onChangeBarcode = (e) => {
        const filters = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams.filters,
            codigoBarras: e.target.value
        }
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams,
            filters,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
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
            value={products_state.priceModificatorModal.productsToRender.paginationParams.filters.codigoBarras}
        />
    )

    // ------------ Input to filter by Name -------------- //
    const onChangeName = (e) => {
        const filters = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams,
            filters,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
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
            value={products_state.priceModificatorModal.productsToRender.paginationParams.filters.nombre}
        />
    )

    // --------- Input to filter by Product code --------- //
    const onChangeProductCode = (e) => {
        const filters = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams.filters,
            codigoProducto: e.target.value
        }
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams,
            filters,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
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
            value={products_state.priceModificatorModal.productsToRender.paginationParams.filters.codigoProducto}
        />
    )

    // ------- Input price modification quantity --------- //
    const changeQuantity = (e) => {
        const value = e.target.value.replace(ifNotNumber, '')
        const newPrice = value === '' ? 0 : parseFloat(value)
        products_dispatch({ type: 'SET_PRICE_MODIFICATION_QUANTITY', payload: newPrice })
    }

    const changeSign = (e) => {
        products_dispatch({ type: 'SET_PRICE_MODIFICATION_SIGN', payload: e })
    }

    const modificationSigns = [
        { value: '+' },
        { value: '-' }
    ]

    const inputPriceModificationQuantity = (
        <Row>
            <Col span={6}>
                <Select
                    color='primary'
                    onChange={changeSign}
                    options={modificationSigns}
                    style={{ width: '100%' }}
                    value={products_state.priceModificatorModal.priceModificationSign}
                />
            </Col>
            <Col span={18}>
                <Input
                    color='primary'
                    placeholder='Porcentaje o monto fijo de modificación'
                    onChange={changeQuantity}
                    value={products_state.priceModificatorModal.priceModificationQuantity}
                />
            </Col>
        </Row>
    )

    // ------- Select  price modification type ----------- //
    const changeModificationType = (e) => {
        products_dispatch({ type: 'SET_PRICE_MODIFICATION_TYPE', payload: e })
    }

    const modificationTypes = [
        { value: 'Porcentual' },
        { value: 'Monto fijo' }
    ]

    const selectPriceModificationType = (
        <Select
            onChange={changeModificationType}
            options={modificationTypes}
            placeholder='Tipo de modificación'
            style={{ width: '100%' }}
            value={products_state.priceModificatorModal.priceModificationType}
        />
    )

    // ------------ Select to filter By Brand ------------ //
    const changeBrands = (e) => {
        const brands = products_state.priceModificatorModal.productsToRender.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = []
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = products_state.priceModificatorModal.productsToRender.brandsForSelect.allBrands
                .filter(brand => eventValues.includes(brand.nombre))
            selectedBrandsNames = brands.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: { selectedBrands, selectedBrandsNames }
        })
    }

    const selectBrands = (e) => {
        if (e.value === 'Todas las marcas') products_dispatch({
            type: 'SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR'
        })
        else products_dispatch({
            type: 'DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR'
        })
    }

    const selectToFilterByBrand = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeBrands}
            onSelect={selectBrands}
            options={products_state.priceModificatorModal.productsToRender.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={products_state.priceModificatorModal.productsToRender.brandsForSelect.selectedBrandsNames}
        />
    )

    // ------------ Select to filter by type ------------- //
    const changeTypes = (e) => {
        const types = products_state.priceModificatorModal.productsToRender.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = products_state.priceModificatorModal.productsToRender.typesForSelect.allTypes
                .filter(type => eventValues.includes(type.nombre))
            selectedTypesNames = types.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        products_dispatch({
            type: 'SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: { selectedTypes, selectedTypesNames }
        })
    }

    const selectTypes = (e) => {
        if (e.value === 'Todos los rubros') products_dispatch({
            type: 'SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR'
        })
        else products_dispatch({
            type: 'DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR'
        })
    }

    const selectToFilterByType = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeTypes}
            onSelect={selectTypes}
            options={products_state.priceModificatorModal.productsToRender.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={products_state.priceModificatorModal.productsToRender.typesForSelect.selectedTypesNames}
        />
    )

    // ---------- Table of products to modify ------------ //
    const removeProductFromModification = (product) => {
        products_dispatch({
            type: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
            payload: { check: false, products: [product] }
        })
    }

    const setLimitOfProductsToModify = (val) => {
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToModify.paginationParams,
            limit: parseInt(val)
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR',
            payload: paginationParams
        })
    }

    const setPageOfProductsToModify = (e) => {
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToModify.paginationParams,
            page: parseInt(e)
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR',
            payload: paginationParams
        })
    }

    const formatDataOfProductsToModify = [
        {
            dataIndex: 'priceModificatorModal_productsToModify_productName',
            render: (_, product) => product.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'priceModificatorModal_productsToModify_productCode',
            render: (_, product) => product.codigoProducto,
            title: 'Cód. barras'
        },
        {
            dataIndex: 'priceModificatorModal_productsToModify_actions',
            render: (_, product) => (
                <div onClick={() => removeProductFromModification(product)}>
                    <Delete />
                </div>
            ),
            title: 'Quitar producto'
        },
    ]

    const tableOfProductsToModify = (
        <Table
            columns={formatDataOfProductsToModify}
            dataSource={products_state.priceModificatorModal.productsToModify.products}
            pagination={{
                defaultCurrent: products_state.priceModificatorModal.productsToModify.paginationParams.page,
                defaultPageSize: products_state.priceModificatorModal.productsToRender.paginationParams.limit,
                limit: products_state.priceModificatorModal.productsToModify.paginationParams.limit,
                pageSize: products_state.priceModificatorModal.productsToRender.paginationParams.limit,
                total: products_state.priceModificatorModal.productsToModify.quantityOfProductsToModify,
                showSizeChanger: false,
                onChange: e => setPageOfProductsToModify(e),
                onShowSizeChange: (e, val) => setLimitOfProductsToModify(val)
            }}
            rowKey='_id'
            size='small'
            tableLayout='auto'
            title={() => 'Artículos seleccionados'}
            width={'100%'}
        />
    )

    // ---------- Table of products to render ------------ //
    const addProductToModification = (product) => {
        const productsToModifyIDs = products_state.priceModificatorModal.productsToModify.products.map(
            product => product._id
        )
        const isProductChecked = productsToModifyIDs.includes(product._id)
        if (isProductChecked) {
            products_dispatch({
                type: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
                payload: { check: false, products: [product] }
            })
        } else {
            products_dispatch({
                type: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
                payload: { check: true, products: [product] }
            })
        }
    }

    const loadProductsToRender = async () => {
        const params = formatFindParams(products_state.priceModificatorModal.productsToRender.paginationParams)
        const response = await api.productos.findPaginated(params)
        products_dispatch({
            type: 'SET_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: response
        })
    }

    useEffect(() => {
        loadProductsToRender()
    }, [
        products_state.priceModificatorModal.modalVisibility,
        products_state.priceModificatorModal.productsToRender.paginationParams
    ])

    const setLimitOfProductsToRender = (val) => {
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams,
            limit: parseInt(val)
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: paginationParams
        })
    }

    const setPageOfProductsToRender = (e) => {
        const paginationParams = {
            ...products_state.priceModificatorModal.productsToRender.paginationParams,
            page: parseInt(e)
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
            payload: paginationParams
        })
    }

    const formatDataOfProductsToRender = [
        {
            dataIndex: 'priceModificatorModal_productsToRender_productName',
            render: (_, product) => product.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'priceModificatorModal_productsToRender_productCode',
            render: (_, product) => product.codigoProducto,
            title: 'Cód prod.'
        },
        {
            dataIndex: 'priceModificatorModal_productsToRender_actions',
            render: (_, product) => (
                <Row style={{ display: 'inline-flex' }}>
                    <Checkbox
                        onChange={() => addProductToModification(product)}
                        checked={
                            products_state.priceModificatorModal.productsToModify.products
                                .find(item => item._id === product._id)
                        }
                    />
                </Row>
            ),
            title: 'Agregar'
        }
    ]

    const tableOfProductsToRender = (
        <Table
            columns={formatDataOfProductsToRender}
            dataSource={products_state.priceModificatorModal.productsToRender.products}
            loading={products_state.priceModificatorModal.productsToRender.loading}
            pagination={{
                defaultCurrent: products_state.priceModificatorModal.productsToRender.paginationParams.page,
                defaultPageSize: products_state.priceModificatorModal.productsToRender.paginationParams.limit,
                limit: products_state.priceModificatorModal.productsToRender.paginationParams.limit,
                pageSize: products_state.priceModificatorModal.productsToRender.paginationParams.limit,
                total: products_state.priceModificatorModal.productsToRender.quantityOfProductsToRender,
                showSizeChanger: false,
                onChange: e => setPageOfProductsToRender(e),
                onShowSizeChange: (e, val) => setLimitOfProductsToRender(val)
            }}
            rowKey='_id'
            size='small'
            tableLayout='auto'
            title={() => 'Tabla de selección de artículos'}
            width={'100%'}
        />
    )

    // ---------------- Title of filters ----------------- //
    const titleOfFilters = <h3>Filtrar artículos</h3>

    // --------------- Title of modifies ----------------- //
    const titleOfModifies = <h3>Modificaciones</h3>


    const productsRender = [
        {
            element: buttonToCancelModifies,
            name: 'product_buttonToCancelModifies',
            order: { lg: 17, md: 17, sm: 17, xl: 17, xs: 17, xxl: 17 }
        },
        {
            element: buttonToCheckPage,
            name: 'product_buttonToCheckPage',
            order: { lg: 13, md: 13, sm: 13, xl: 13, xs: 13, xxl: 13 }
        },
        {
            element: buttonToClearFilters,
            name: 'product_cleanFilters',
            order: { lg: 14, md: 14, sm: 11, xl: 14, xs: 11, xxl: 14 }
        },
        {
            element: buttonToSaveModifies,
            name: 'product_buttonToSaveModifies',
            order: { lg: 18, md: 18, sm: 18, xl: 18, xs: 18, xxl: 18 }
        },
        {
            element: buttonToUncheckPage,
            name: 'product_buttonToUncheckPage',
            order: { lg: 11, md: 11, sm: 14, xl: 11, xs: 14, xxl: 11 }
        },
        {
            element: <InputHidden />,
            name: 'product_inputHidden_1',
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        },
        {
            element: <InputHidden />,
            name: 'product_inputHidden_2',
            order: { lg: 9, md: 9, sm: 12, xl: 9, xs: 12, xxl: 9 }
        },
        {
            element: inputToFilterByBarcode,
            name: 'product_inputToFilterByBarcode',
            order: { lg: 6, md: 6, sm: 7, xl: 6, xs: 7, xxl: 6 }
        },
        {
            element: inputToFilterByName,
            name: 'product_filterByName',
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 }
        },
        {
            element: inputToFilterByProductCode,
            name: 'product_inputToFilterByProductCode',
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 }
        },
        {
            element: inputPriceModificationQuantity,
            name: 'product_inputPriceModificationQuantity',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: selectPriceModificationType,
            name: 'product_selectModificationType',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: selectToFilterByBrand,
            name: 'product_selectToFilterByBrand',
            order: { lg: 10, md: 10, sm: 9, xl: 10, xs: 9, xxl: 10 }
        },
        {
            element: selectToFilterByType,
            name: 'product_selectToFilterByType',
            order: { lg: 12, md: 12, sm: 10, xl: 12, xs: 10, xxl: 12 }
        },
        {
            element: tableOfProductsToModify,
            name: 'product_tableOfProductsToModify',
            order: { lg: 16, md: 16, sm: 16, xl: 16, xs: 16, xxl: 16 }
        },
        {
            element: tableOfProductsToRender,
            name: 'product_tableOfProductsToRender',
            order: { lg: 15, md: 15, sm: 15, xl: 15, xs: 15, xxl: 15 }
        },
        {
            element: titleOfFilters,
            name: 'product_titleOfFilters',
            order: { lg: 2, md: 2, sm: 5, xl: 2, xs: 5, xxl: 2 }
        },
        {
            element: titleOfModifies,
            name: 'product_titleOfModifies',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Modal
            open={products_state.priceModificatorModal.modalVisibility}
            footer={null}
            width={1200}
            closable={false}
        >
            <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
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
            </Row>
        </Modal>
    )
}

export default PriceModificatorModal