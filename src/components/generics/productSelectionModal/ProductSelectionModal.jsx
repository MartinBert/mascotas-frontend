// React Components and Hooks
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Custom Components
import InputHidden from '../InputHidden'

// Custom Context Providers
import actions from '../../../actions'
import contexts from '../../../contexts'

// Design Components
import { Button, Checkbox, Col, Input, Modal, Row, Select, Table } from 'antd'
import './productSelectionModal.css'

// Services
import api from '../../../services'

// Imports Destructurings
const { formatFindParams } = actions.paginationParams
const { useEntriesContext } = contexts.Entries
const { useOutputsContext } = contexts.Outputs
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { useSaleContext } = contexts.Sale
const { useSaleProductsContext } = contexts.SaleProducts


const ProductSelectionModal = () => {
    const location = useLocation()
    const [entries_state, entries_dispatch] = useEntriesContext()
    const [outputs_state, outputs_dispatch] = useOutputsContext()
    const [productSelectionModal_state, productSelectionModal_dispatch] = useProductSelectionModalContext()
    const [sale_state] = useSaleContext()
    const [saleProducts_state, saleProducts_dispatch] = useSaleProductsContext()

    // ------------------- Load refs --------------------- //
    const loadRefs = () => {
        if (!productSelectionModal_state.visibility) return
        const refs = {
            buttonToCancel: document.getElementById('buttonToCancel'),
            buttonToCheckPage: document.getElementById('buttonToCheckPage'),
            buttonToRestartFilters: document.getElementById('buttonToRestartFilters'),
            buttonToSave: document.getElementById('buttonToSave'),
            buttonToUncheckPage: document.getElementById('buttonToUncheckPage'),
            inputToFilterByBarcode: document.getElementById('inputToFilterByBarcode'),
            inputToFilterByName: document.getElementById('inputToFilterByName'),
            inputToFilterByProductCode: document.getElementById('inputToFilterByProductCode'),
            selectToFilterByBrands: document.getElementById('selectToFilterByBrands'),
            selectToFilterByTypes: document.getElementById('selectToFilterByTypes'),
            titleOfActions: document.getElementById('titleOfActions'),
            titleOfFilters: document.getElementById('titleOfFilters')
        }
        productSelectionModal_dispatch({ type: 'SET_REFS', payload: refs })
    }

    useEffect(() => { loadRefs() }, [productSelectionModal_state.visibility])

    const validateFocus = () => {
        let correctLocation
        if (location.pathname.includes('entradas')) correctLocation = false
        else if (location.pathname.includes('salidas')) correctLocation = false
        else if (!location.pathname.includes('venta')) correctLocation = false
        else correctLocation = true
        const refs = {
            autocompleteClient: sale_state.refs.autocompleteClient,
            autocompleteDocument: sale_state.refs.autocompleteDocument,
            autocompletePaymentMethod: sale_state.refs.autocompletePaymentMethod,
            autocompletePaymentPlan: sale_state.refs.autocompletePaymentPlan,
            buttonToCancel: productSelectionModal_state.refs.buttonToCancel,
            buttonToCheckPage: productSelectionModal_state.refs.buttonToCheckPage,
            buttonToFinalizeSale: sale_state.refs.buttonToFinalizeSale,
            buttonToRestartFilters: productSelectionModal_state.refs.buttonToRestartFilters,
            buttonToSave: productSelectionModal_state.refs.buttonToSave,
            buttonToUncheckPage: productSelectionModal_state.refs.buttonToUncheckPage,
            inputToFilterByBarcode: productSelectionModal_state.refs.inputToFilterByBarcode,
            inputToFilterByName: productSelectionModal_state.refs.inputToFilterByName,
            inputToFilterByProductCode: productSelectionModal_state.refs.inputToFilterByProductCode,
            selectToFilterByBrands: productSelectionModal_state.refs.selectToFilterByBrands,
            selectToFilterByTypes: productSelectionModal_state.refs.selectToFilterByTypes,
            titleOfActions: productSelectionModal_state.refs.titleOfActions,
            titleOfFilters: productSelectionModal_state.refs.titleOfFilters
        }
        const existsRefs = !Object.values(refs).includes(null)
        const data = { correctLocation, existsRefs, refs }
        return data
    }

    // ----------- Redirect to correct state ------------- //
    const product_dispatch = (action) => {
        if (location.pathname.includes('entradas')) return entries_dispatch(action)
        if (location.pathname.includes('salidas')) return outputs_dispatch(action)
        if (location.pathname.includes('venta')) return saleProducts_dispatch(action)
    }

    const product_state = () => {
        if (location.pathname.includes('entradas')) return entries_state
        if (location.pathname.includes('salidas')) return outputs_state
        if (location.pathname.includes('venta')) return saleProducts_state
    }

    // ----------------- Redirect focus ------------------ //
    const setFocus = (e) => { // e: true when modal is open, false when is close
        const { correctLocation, existsRefs, refs } = validateFocus()
        if (!correctLocation || !existsRefs) return
        let unfilledField
        if (e) {
            if (refs.inputToFilterByName.value === '') unfilledField = refs.inputToFilterByName
            else if (refs.inputToFilterByBarcode.value === '') unfilledField = refs.inputToFilterByBarcode
            else if (refs.inputToFilterByProductCode.value === '') unfilledField = refs.inputToFilterByProductCode
            else unfilledField = refs.buttonToSave
        } else {
            if (refs.autocompleteClient.value === '') unfilledField = refs.autocompleteClient
            else if (refs.autocompleteDocument.value === '') unfilledField = refs.autocompleteDocument
            else if (refs.autocompletePaymentMethod.value === '') unfilledField = refs.autocompletePaymentMethod
            else if (refs.autocompletePaymentPlan.value === '') unfilledField = refs.autocompletePaymentPlan
            else unfilledField = refs.buttonToFinalizeSale
        }
        unfilledField.focus()
    }

    // ----------- Button to cancel modifies ------------- //
    const cancelModifies = () => {
        productSelectionModal_dispatch({ type: 'CLEAR_MODIFIES' })
    }

    const buttonToCancel = (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                className='btn-secondary'
                id='buttonToCancel'
                onClick={cancelModifies}
                style={{ width: '50%' }}
            >
                Cancelar
            </Button>
        </div>
    )

    // -------------- Button to check page --------------- //
    const checkPage = () => {
        const productsToRender = productSelectionModal_state.productsToRender
        const productsToSelect = productSelectionModal_state.productsToSelect
        const productsToSelectIDs = productsToSelect.map(product => product._id)
        const productsToAdd = productsToRender.filter(product => !productsToSelectIDs.includes(product._id))
        const newProductsToSelect = [...productsToAdd, ...productsToSelect]
        productSelectionModal_dispatch({ type: 'SET_PRODUCTS_TO_SELECT', payload: newProductsToSelect })
    }

    const buttonToCheckPage = (
        <Button
            className='btn-primary'
            id='buttonToCheckPage'
            onClick={checkPage}
            style={{ width: '100%' }}
        >
            Marcar página
        </Button>
    )

    // ------------- Button to clear filters ------------- //
    const clearFilters = () => {
        productSelectionModal_dispatch({ type: 'CLEAR_FILTERS' })
    }

    const buttonToRestartFilters = (
        <Button
            danger
            id='buttonToRestartFilters'
            onClick={clearFilters}
            style={{ width: '100%' }}
            type='primary'
        >
            Reiniciar filtros
        </Button>
    )

    // ------------ Button to save products -------------- //
    const saveProducts = () => {
        const productsToSave = productSelectionModal_state.productsToSelect
        product_dispatch({ type: 'SET_PRODUCTS', payload: productsToSave })
        productSelectionModal_dispatch({ type: 'CLEAR_MODIFIES' })
    }

    const buttonToSave = (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                className='btn-primary'
                id='buttonToSave'
                onClick={saveProducts}
                style={{ width: '50%' }}
            >
                Aceptar
            </Button>
        </div>
    )

    // ------------- Button to uncheck page -------------- //
    const uncheckPage = () => {
        const productsToRender = productSelectionModal_state.productsToRender
        const productsToSelect = productSelectionModal_state.productsToSelect
        const productsToUncheckIDs = productsToRender.map(product => product._id)
        const remainingProducts = productsToSelect.filter(product => !productsToUncheckIDs.includes(product._id))
        productSelectionModal_dispatch({ type: 'SET_PRODUCTS_TO_SELECT', payload: remainingProducts })
    }

    const buttonToUncheckPage = (
        <Button
            className='btn-secondary'
            id='buttonToUncheckPage'
            onClick={uncheckPage}
            style={{ width: '100%' }}
        >
            Desmarcar página
        </Button>
    )

    // --------------- Fetch Brands and Types ---------------- //
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
        productSelectionModal_dispatch({
            type: 'SET_BRANDS_AND_TYPES',
            payload: { allBrands, allBrandsNames, allTypes, allTypesNames }
        })
    }

    useEffect(() => { loadBrandsAndTypes() }, [])

    // ------------------ Fetch Products ------------------ //
    const fetchProducts = async () => {
        const findParams = formatFindParams(productSelectionModal_state.paginationParams)
        const data = await api.productos.findPaginated(findParams)
        productSelectionModal_dispatch({ type: 'SET_PRODUCTS_TO_RENDER', payload: data })
    }

    useEffect(() => { fetchProducts() }, [productSelectionModal_state.paginationParams])

    // --------------- Filter By Barcode ----------------- //
    const onChangeBarCode = (e) => {
        const filters = {
            ...productSelectionModal_state.paginationParams.filters,
            codigoBarras: e.target.value
        }
        const paginationParams = { ...productSelectionModal_state.paginationParams, filters, page: 1 }
        productSelectionModal_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByBarcode = (
        <Input
            color='primary'
            id='inputToFilterByBarcode'
            onChange={onChangeBarCode}
            placeholder='Buscar por código de barras'
            style={{ width: '100%' }}
            value={productSelectionModal_state.paginationParams.filters.codigoBarras}
        />
    )

    // ---------------- Filter By Brand ------------------ //
    const changeBrands = (e) => {
        const brands = productSelectionModal_state.brandsForSelect.allBrandsNames
        let selectedBrands
        let selectedBrandsNames
        if (e.length === 0) {
            selectedBrands = []
            selectedBrandsNames = [{ value: 'Todas las marcas' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedBrands = productSelectionModal_state.brandsForSelect.allBrands
                .filter(brand => eventValues.includes(brand.nombre))
            selectedBrandsNames = brands.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        productSelectionModal_dispatch({
            type: 'SELECT_BRANDS',
            payload: { selectedBrands, selectedBrandsNames }
        })
    }

    const selectBrands = (e) => {
        if (e.value === 'Todas las marcas') productSelectionModal_dispatch({ type: 'SELECT_ALL_BRANDS' })
        else productSelectionModal_dispatch({ type: 'DESELECT_ALL_BRANDS' })
    }

    const selectToFilterByBrands = (
        <Select
            allowClear
            id='selectToFilterByBrands'
            labelInValue
            mode='multiple'
            onChange={changeBrands}
            onSelect={selectBrands}
            options={productSelectionModal_state.brandsForSelect.allBrandsNames}
            style={{ width: '100%' }}
            value={productSelectionModal_state.brandsForSelect.selectedBrandsNames}
        />
    )

    // ---------------- Filter By Name ------------------- //
    const onChangeName = (e) => {
        const filters = {
            ...productSelectionModal_state.paginationParams.filters,
            nombre: e.target.value
        }
        const paginationParams = { ...productSelectionModal_state.paginationParams, filters, page: 1 }
        productSelectionModal_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByName = (
        <Input
            color='primary'
            id='inputToFilterByName'
            onChange={onChangeName}
            placeholder='Buscar por nombre'
            style={{ width: '100%' }}
            value={productSelectionModal_state.paginationParams.filters.nombre}
        />
    )

    // ------------ Filter By Product Code --------------- //
    const onChangeProductCode = (e) => {
        const filters = {
            ...productSelectionModal_state.paginationParams.filters,
            codigoProducto: e.target.value
        }
        const paginationParams = { ...productSelectionModal_state.paginationParams, filters, page: 1 }
        productSelectionModal_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByProductCode = (
        <Input
            color='primary'
            id='inputToFilterByProductCode'
            onChange={onChangeProductCode}
            placeholder='Buscar por código de producto'
            style={{ width: '100%' }}
            value={productSelectionModal_state.paginationParams.filters.codigoProducto}
        />
    )

    // ----------------- Filter By Type ------------------ //
    const changeTypes = (e) => {
        const types = productSelectionModal_state.typesForSelect.allTypesNames
        let selectedTypes
        let selectedTypesNames
        if (e.length === 0) {
            selectedTypes = []
            selectedTypesNames = [{ value: 'Todos los rubros' }]
        }
        else {
            const eventValues = e.map(eventOption => eventOption.value)
            selectedTypes = productSelectionModal_state.typesForSelect.allTypes
                .filter(type => eventValues.includes(type.nombre))
            selectedTypesNames = types.map(option => {
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        productSelectionModal_dispatch({
            type: 'SELECT_TYPES',
            payload: { selectedTypes, selectedTypesNames }
        })
    }

    const selectTypes = (e) => {
        if (e.value === 'Todos los rubros') productSelectionModal_dispatch({ type: 'SELECT_ALL_TYPES' })
        else productSelectionModal_dispatch({ type: 'DESELECT_ALL_TYPES' })
    }

    const selectToFilterByTypes = (
        <Select
            allowClear
            id='selectToFilterByTypes'
            labelInValue
            mode='multiple'
            onChange={changeTypes}
            onSelect={selectTypes}
            options={productSelectionModal_state.typesForSelect.allTypesNames}
            style={{ width: '100%' }}
            value={productSelectionModal_state.typesForSelect.selectedTypesNames}
        />
    )

    // ---------- Table of selected products ------------- //
    const loadCheckedStateOfProducts = () => {
        const currentSelectedProducts = product_state().params.productos
        const noCustomProducts = currentSelectedProducts.filter(product => !product._id.startsWith('customProduct_'))
        productSelectionModal_dispatch({ type: 'SET_PRODUCTS_TO_SELECT', payload: noCustomProducts })
    }

    useEffect(() => { loadCheckedStateOfProducts() }, [productSelectionModal_state.visibility])


    const checkProduct = (product) => {
        const previousProducts = productSelectionModal_state.productsToSelect
        const previousProductsIDs = previousProducts.map(previousProduct => previousProduct._id)
        const newProductWasSelected = previousProductsIDs.includes(product._id)
        let newSelectedProducts
        if (!newProductWasSelected) newSelectedProducts = [...previousProducts, product]
        else newSelectedProducts = previousProducts.filter(previousProduct => previousProduct._id !== product._id)
        const savedProducts = product_state().params.productos
        newSelectedProducts.map(product => {
            for (let index = 0; index < savedProducts.length; index++) {
                const savedProduct = savedProducts[index]
                if (product._id === savedProduct._id) {
                    if (savedProduct.cantidadesEntrantes) {
                        product.cantidadesEntrantes = savedProduct.cantidadesEntrantes
                    }
                    if (savedProduct.cantidadesSalientes) {
                        product.cantidadesSalientes = savedProduct.cantidadesSalientes
                    }
                }
            }
            return product
        })
        productSelectionModal_dispatch({ type: 'SET_PRODUCTS_TO_SELECT', payload: newSelectedProducts })
    }

    const onLoadRows = (product) => {
        const rowsProps = {
            onClick: e => checkProduct(product)
        }
        return rowsProps
    }

    const setPageAndLimit = (page, limit) => {
        const paginationParams = {
            ...productSelectionModal_state.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        productSelectionModal_dispatch({
            type: 'SET_PAGINATION_PARAMS',
            payload: paginationParams
        })
    }

    const setClassName = (product) => {
        const previousProducts = productSelectionModal_state.productsToSelect
        const previousProductsIDs = previousProducts.map(previousProduct => previousProduct._id)
        const productIsSelected = previousProductsIDs.includes(product._id)
        let className
        if (productIsSelected) className = 'productSelected'
        else className = 'productNotSelected'
        return className
    }

    const columns = [
        {
            dataIndex: 'productSelectionModal_productName',
            render: (_, product) => product.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'productSelectionModal_productCode',
            render: (_, product) => product.codigoProducto,
            title: 'Codigo de producto'
        },
        {
            dataIndex: 'productSelectionModal_barCode',
            render: (_, product) => product.codigoBarras,
            title: 'Codigo de barras'
        }
    ]

    const tableOfSelectedProducts = (
        <Table
            columns={columns}
            dataSource={productSelectionModal_state.productsToRender}
            loading={productSelectionModal_state.loading}
            onRow={product => onLoadRows(product)}
            pagination={{
                defaultCurrent: productSelectionModal_state.paginationParams.page,
                defaultPageSize: productSelectionModal_state.paginationParams.limit,
                limit: productSelectionModal_state.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimit(page, limit),
                pageSizeOptions: [5, 10, 15, 20],
                showSizeChanger: true,
                total: productSelectionModal_state.totalProducts
            }}
            rowClassName={product => setClassName(product)}
            rowKey='_id'
            size='small'
            tableLayout='auto'
            width={'100%'}
        />
    )

    // --------------- Title of actions ------------------ //
    const titleOfActions = <h3 id='titleOfActions'>Acciones</h3>

    // --------------- Title of filters ------------------ //
    const titleOfFilters = <h3 id='titleOfFilters'>Filtrar productos</h3>


    const itemsToRender = [
        {
            element: buttonToCheckPage,
            order: { lg: 11, md: 11, sm: 12, xl: 11, xs: 12, xxl: 11 },
            render: productSelectionModal_state.refs.buttonToCheckPage ? true : false
        },
        {
            element: buttonToRestartFilters,
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 },
            render: productSelectionModal_state.refs.buttonToRestartFilters ? true : false
        },
        {
            element: buttonToUncheckPage,
            order: { lg: 9, md: 9, sm: 11, xl: 9, xs: 11, xxl: 9 },
            render: productSelectionModal_state.refs.buttonToUncheckPage ? true : false
        },
        {
            element: <InputHidden />,
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 },
            render: productSelectionModal_state.refs.buttonToCheckPage ? true : false
        },
        {
            element: <InputHidden />,
            order: { lg: 7, md: 7, sm: 10, xl: 7, xs: 10, xxl: 7 },
            render: productSelectionModal_state.refs.buttonToCheckPage ? true : false
        },
        {
            element: inputToFilterByBarcode,
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 },
            render: productSelectionModal_state.refs.inputToFilterByBarcode ? true : false
        },
        {
            element: inputToFilterByName,
            order: { lg: 4, md: 4, sm: 5, xl: 4, xs: 5, xxl: 4 },
            render: productSelectionModal_state.refs.inputToFilterByName ? true : false
        },
        {
            element: inputToFilterByProductCode,
            order: { lg: 8, md: 8, sm: 7, xl: 8, xs: 7, xxl: 8 },
            render: productSelectionModal_state.refs.inputToFilterByProductCode ? true : false
        },
        {
            element: selectToFilterByBrands,
            order: { lg: 10, md: 10, sm: 8, xl: 10, xs: 8, xxl: 10 },
            render: productSelectionModal_state.refs.selectToFilterByBrands ? true : false
        },
        {
            element: selectToFilterByTypes,
            order: { lg: 12, md: 12, sm: 9, xl: 12, xs: 9, xxl: 12 },
            render: productSelectionModal_state.refs.selectToFilterByTypes ? true : false
        },
        {
            element: titleOfActions,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 },
            render: productSelectionModal_state.refs.titleOfActions ? true : false
        },
        {
            element: titleOfFilters,
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 },
            render: productSelectionModal_state.refs.titleOfFilters ? true : false
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Modal
            afterOpenChange={setFocus}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={productSelectionModal_state.visibility}
            width={1200}
        >
            <Row
                gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                justify='space-around'
            >
                {
                    itemsToRender
                        // .filter(item => item.render)
                        .map((item, index) => {
                            return (
                                <Col
                                    key={'productSelectionModal_item_' + index}
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
            <br />
            <Row>
                <Col span={24}>
                    {tableOfSelectedProducts}
                </Col>
            </Row>
            <Row
                gutter={8}
                justify='space-around'
            >
                <Col span={8}>
                    {buttonToCancel}
                </Col>
                <Col span={8}>
                    {buttonToSave}
                </Col>
            </Row>
        </Modal>
    )
}

export default ProductSelectionModal