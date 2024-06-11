const actions = {
    CLEAR_MODIFIES: 'CLEAR_MODIFIES',
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    DELETE_PRODUCTS_TO_SELECT: 'DELETE_PRODUCTS_TO_SELECT',
    DESELECT_ALL_BRANDS: 'DESELECT_ALL_BRANDS',
    DESELECT_ALL_TYPES: 'DESELECT_ALL_TYPES',
    HIDE_PRODUCT_MODAL: 'HIDE_PRODUCT_MODAL',
    SELECT_ALL_BRANDS: 'SELECT_ALL_BRANDS',
    SELECT_ALL_TYPES: 'SELECT_ALL_TYPES',
    SELECT_BRANDS: 'SELECT_BRANDS',
    SELECT_TYPES: 'SELECT_TYPES',
    SET_BRANDS_AND_TYPES: 'SET_BRANDS_AND_TYPES',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PRODUCTS_TO_RENDER: 'SET_PRODUCTS_TO_RENDER',
    SET_PRODUCTS_TO_SELECT: 'SET_PRODUCTS_TO_SELECT',
    SET_REFS: 'SET_REFS',
    SHOW_PRODUCT_MODAL: 'SHOW_PRODUCT_MODAL'
}

const initialState = {
    refs: {
        buttonToCancel: null,
        buttonToCheckPage: null,
        buttonToRestartFilters: null,
        buttonToSave: null,
        buttonToUncheckPage: null,
        inputToFilterByBarcode: null,
        inputToFilterbyName: null,
        inputToFilterByProductCode: null,
        selectToFilterByBrands: null,
        selectToFilterByTypes: null,
        titleOfActions: null,
        titleOfFilters: null
    },
    brandsForSelect: {
        allBrands: [],
        allBrandsNames: [],
        selectedBrand: [],
        selectedBrandsNames: [{ value: 'Todas las marcas' }]
    },
    loading: true,
    paginationParams: {
        filters: {
            codigoBarras: null,
            codigoProducto: null,
            marca: [],
            nombre: null,
            rubro: []
        },
        limit: 5,
        page: 1
    },
    productsToRender: [],
    productsToSelect: [],
    totalProducts: 0,
    typesForSelect: {
        allTypes: [],
        allTypesNames: [],
        selectedTypes: [],
        selectedTypesNames: [{ value: 'Todos los rubros' }],
    },
    visibility: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_MODIFIES:
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrand: [],
                    selectedBrandsNames: [{ value: 'Todas las marcas' }]
                },
                loading: true,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        codigoBarras: null,
                        codigoProducto: null,
                        marca: [],
                        nombre: null,
                        rubro: []
                    },
                    limit: 5,
                    page: 1
                },
                productsToSelect: [],
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedType: [],
                    selectedTypesNames: [{ value: 'Todos los rubros' }]
                },
                visibility: false
            }
        case actions.CLEAR_FILTERS:
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrand: [],
                    selectedBrandsNames: [{ value: 'Todas las marcas' }]
                },
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        codigoBarras: null,
                        codigoProducto: null,
                        marca: [],
                        nombre: null,
                        rubro: []
                    },
                    page: 1
                },
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedType: [],
                    selectedTypesNames: [{ value: 'Todos los rubros' }]
                }
            }
        case actions.DESELECT_ALL_BRANDS:
            const notAllBrandsNames = state.brandsForSelect.selectedBrandsNames
                .filter(brandName => brandName.value !== 'Todas las marcas')
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrandsNames: notAllBrandsNames
                }
            }
        case actions.DESELECT_ALL_TYPES:
            const notAllTypesNames = state.typesForSelect.selectedTypesNames
                .filter(typeName => typeName.value !== 'Todos los rubros')
            return {
                ...state,
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedTypesNames: notAllTypesNames
                }
            }
        case actions.HIDE_PRODUCT_MODAL:
            return {
                ...state,
                visibility: false
            }
        case actions.SELECT_ALL_BRANDS:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        marca: []
                    }
                },
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrands: state.brandsForSelect.allBrands,
                    selectedBrandsNames: [{ value: 'Todas las marcas' }]
                }
            }
        case actions.SELECT_ALL_TYPES:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        rubro: []
                    }
                },
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedTypes: state.typesForSelect.allTypes,
                    selectedTypesNames: [{ value: 'Todos los rubros' }]
                }
            }
        case actions.SELECT_BRANDS:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        marca: action.payload.selectedBrands
                    }
                },
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrands: action.payload.selectedBrands,
                    selectedBrandsNames: action.payload.selectedBrandsNames
                }
            }
        case actions.SELECT_TYPES:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        rubro: action.payload.selectedTypes
                    }
                },
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedTypes: action.payload.selectedTypes,
                    selectedTypesNames: action.payload.selectedTypesNames
                }
            }
        case actions.SET_BRANDS_AND_TYPES:
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    allBrands: action.payload.allBrands,
                    allBrandsNames: action.payload.allBrandsNames
                },
                typesForSelect: {
                    ...state.typesForSelect,
                    allTypes: action.payload.allTypes,
                    allTypesNames: action.payload.allTypesNames
                }
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
        case actions.SET_PRODUCTS_TO_RENDER:
            return {
                ...state,
                loading: false,
                productsToRender: action.payload.docs,
                totalProducts: action.payload.totalDocs
            }
        case actions.SET_PRODUCTS_TO_SELECT:
            return {
                ...state,
                productsToSelect: action.payload
            }
        case actions.SET_REFS:
            return {
                ...state,
                refs: action.payload
            }
        case actions.SHOW_PRODUCT_MODAL:
            return {
                ...state,
                visibility: true
            }
        default:
            return state;
    }
}

const productSelectionModal = {
    initialState,
    actions,
    reducer
}

export default productSelectionModal