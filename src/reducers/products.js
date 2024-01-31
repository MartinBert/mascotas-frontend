const actions = {
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    DESELECT_ALL_EXCEL_OPTIONS: 'DESELECT_ALL_EXCEL_OPTIONS',
    HIDE_PRODUCT_DETAILS_MODAL: 'HIDE_PRODUCT_DETAILS_MODAL',
    HIDE_PRODUCT_STOCK_HISTORY_MODAL: 'HIDE_PRODUCT_STOCK_HISTORY_MODAL',
    SELECT_ALL_EXCEL_OPTIONS: 'SELECT_ALL_EXCEL_OPTIONS',
    SET_ACTIVE_BRAND: 'SET_ACTIVE_BRAND',
    SET_ACTIVE_TYPE: 'SET_ACTIVE_TYPE',
    SET_BRANDS_AND_TYPES: 'SET_BRANDS_AND_TYPES',
    SET_EXCEL_OPTIONS: 'SET_EXCEL_OPTIONS',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PRODUCT_FOR_DETAILS_MODAL: 'SET_PRODUCT_FOR_DETAILS_MODAL',
    SET_PRODUCT_FOR_STOCK_HISTORY_MODAL: 'SET_PRODUCT_FOR_STOCK_HISTORY_MODAL',
    SET_PRODUCTS_FOR_RENDER: 'SET_PRODUCTS_FOR_RENDER',
    SET_STOCK_HISTORY_FOR_RENDER: 'SET_STOCK_HISTORY_FOR_RENDER',
    SET_STOCK_HISTORY_PAGINATION_PARAMS: 'SET_STOCK_HISTORY_PAGINATION_PARAMS'
}

const initialState = {
    activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }],
    allExcelTitles: [
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
        '% Ganancia',
        'Precio de venta ($)',
        'Ganancia por venta ($)',
        '% Ganancia fraccionada',
        'Precio de venta fraccionada ($)',
        'Ganancia venta fraccionada ($)',
        'Precio de venta por unidad fraccionada ($)',
        'Ganancia venta por unidad fraccionada ($)',
        'Stock',
        'Stock fraccionado',
        'Unidad de medida',
        'Fraccionamiento'
    ],
    brandsForSelectOptions: {
        allBrands: [],
        selectedBrand: null
    },
    loading: true,
    paginationParams: {
        filters: {
            nombre: null,
            codigoBarras: null,
            codigoProducto: null,
            marca: null,
            rubro: null
        },
        limit: 10,
        page: 1
    },
    productDetailsModalVisibility: false,
    productForDetailsModal: null,
    productForStockHistoryModal: [],
    productStockHistoryModalVisibility: false,
    productsForRender: [],
    productsTotalRecords: 0,
    productsStockHistoryTotalRecords: 0,
    stockHistoryForRender: [],
    stockHistoryLoading: true,
    stockHistoryPaginationParams: {
        filters: {
            dateString: null,
            product: null
        },
        limit: 10,
        page: 1
    },
    stockHistoryTotalRecords: 0,
    typesForSelectOptions: {
        allTypes: [],
        selectedType: null
    },
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_FILTERS:
            return {
                ...state,
                productDetailsModalVisibility: false,
                productForDetailsModal: null
            }
        case actions.DESELECT_ALL_EXCEL_OPTIONS:
            const notAllOptions = state.activeExcelOptions.filter(option => option.value !== 'todas')
            const optionsValues = notAllOptions.map(option => option.value)
            const fixedOptions = optionsValues.includes('producto')
                ? notAllOptions
                : [{ disabled: true, label: 'Producto', value: 'producto' }].concat(notAllOptions)
            return {
                ...state,
                activeExcelOptions: fixedOptions
            }
        case actions.HIDE_PRODUCT_DETAILS_MODAL:
            return {
                ...state,
                productDetailsModalVisibility: false,
                productForDetailsModal: null
            }
        case actions.HIDE_PRODUCT_STOCK_HISTORY_MODAL:
            return {
                ...state,
                productStockHistoryModalVisibility: false,
                productForStockHistoryModal: null
            }
        case actions.SELECT_ALL_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }]
            }
        case actions.SET_ACTIVE_BRAND:
            return {
                ...state,
                brandsForSelectOptions: {
                    ...state.brandsForSelectOptions,
                    selectedBrand: action.payload
                }
            }
        case actions.SET_ACTIVE_TYPE:
            return {
                ...state,
                typesForSelectOptions: {
                    ...state.typesForSelectOptions,
                    selectedType: action.payload
                }
            }
        case actions.SET_BRANDS_AND_TYPES:
            const allBrands = action.payload.allBrands.map(brand => {
                return { value: brand.nombre }
            })
            const allTypes = action.payload.allTypes.map(type => {
                return { value: type.nombre }
            })
            return {
                ...state,
                brandsForSelectOptions: { ...state.brandsForSelectOptions, allBrands },
                typesForSelectOptions: { ...state.typesForSelectOptions, allTypes }
            }
        case actions.SET_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: action.payload
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_PAGINATION_PARAMS:
            return {
                ...state,
                paginationParams: action.payload
            }
        case actions.SET_PRODUCT_FOR_DETAILS_MODAL:
            return {
                ...state,
                productDetailsModalVisibility: true,
                productForDetailsModal: action.payload
            }
        case actions.SET_PRODUCT_FOR_STOCK_HISTORY_MODAL:
            return {
                ...state,
                productStockHistoryModalVisibility: true,
                productForStockHistoryModal: action.payload,
                stockHistoryPaginationParams: {
                    ...state.stockHistoryPaginationParams,
                    filters: {
                        ...state.stockHistoryPaginationParams.filters,
                        product: action.payload
                    }
                }
            }
        case actions.SET_PRODUCTS_FOR_RENDER:
            return {
                ...state,
                loading: false,
                productsForRender: action.payload.docs,
                productsTotalRecords: action.payload.totalDocs
            }
        case actions.SET_STOCK_HISTORY_FOR_RENDER:
            return {
                ...state,
                stockHistoryLoading: false,
                stockHistoryForRender: action.payload.docs,
                stockHistoryTotalRecords: action.payload.totalDocs
            }
        case actions.SET_STOCK_HISTORY_PAGINATION_PARAMS:
            return {
                ...state,
                stockHistoryPaginationParams: action.payload
            }
        default:
            return state
    }
}

const products = {
    initialState,
    actions,
    reducer,
}

export default products