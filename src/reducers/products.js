const actions = {
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL: 'CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL',
    DESELECT_ALL_BRANDS: 'DESELECT_ALL_BRANDS',
    DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    DESELECT_ALL_EXCEL_OPTIONS: 'DESELECT_ALL_EXCEL_OPTIONS',
    DESELECT_ALL_TYPES: 'DESELECT_ALL_TYPES',
    DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    HIDE_PRICE_MODIFICATOR_MODAL: 'HIDE_PRICE_MODIFICATOR_MODAL',
    HIDE_PRODUCT_DETAILS_MODAL: 'HIDE_PRODUCT_DETAILS_MODAL',
    HIDE_PRODUCT_STOCK_HISTORY_MODAL: 'HIDE_PRODUCT_STOCK_HISTORY_MODAL',
    SELECT_ALL_BRANDS: 'SELECT_ALL_BRANDS',
    SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_ALL_EXCEL_OPTIONS: 'SELECT_ALL_EXCEL_OPTIONS',
    SELECT_ALL_TYPES: 'SELECT_ALL_TYPES',
    SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_BRANDS: 'SELECT_BRANDS',
    SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_TYPES: 'SELECT_TYPES',
    SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_ACTIVE_BRAND: 'SET_ACTIVE_BRAND',
    SET_ACTIVE_TYPE: 'SET_ACTIVE_TYPE',
    SET_BRANDS_AND_TYPES: 'SET_BRANDS_AND_TYPES',
    SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_BRANDS_FOR_EXCEL_REPORT: 'SET_BRANDS_FOR_EXCEL_REPORT',
    SET_EXCEL_OPTIONS: 'SET_EXCEL_OPTIONS',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR',
    SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_PRICE_MODIFICATION_QUANTITY: 'SET_PRICE_MODIFICATION_QUANTITY',
    SET_PRICE_MODIFICATION_SIGN: 'SET_PRICE_MODIFICATION_SIGN',
    SET_PRICE_MODIFICATION_TYPE: 'SET_PRICE_MODIFICATION_TYPE',
    SET_PRODUCT_FOR_DETAILS_MODAL: 'SET_PRODUCT_FOR_DETAILS_MODAL',
    SET_PRODUCT_FOR_STOCK_HISTORY_MODAL: 'SET_PRODUCT_FOR_STOCK_HISTORY_MODAL',
    SET_PRODUCTS_FOR_PRICE_MODIFICATION: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
    SET_PRODUCTS_FOR_EXCEL_REPORT: 'SET_PRODUCTS_FOR_EXCEL_REPORT',
    SET_PRODUCTS_FOR_RENDER: 'SET_PRODUCTS_FOR_RENDER',
    SET_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SET_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_STOCK_HISTORY_FOR_RENDER: 'SET_STOCK_HISTORY_FOR_RENDER',
    SET_STOCK_HISTORY_PAGINATION_PARAMS: 'SET_STOCK_HISTORY_PAGINATION_PARAMS',
    SET_TYPES_FOR_EXCEL_REPORT: 'SET_TYPES_FOR_EXCEL_REPORT',
    SHOW_PRICE_MODIFICATOR_MODAL: 'SHOW_PRICE_MODIFICATOR_MODAL'
}

const initialState = {
    activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }],
    allExcelTitles: [
        // 'Ilustración',
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
        limit: 10,
        page: 1
    },
    priceModificatorModal: {
        modalVisibility: false,
        priceModificationQuantity: 0,
        priceModificationSign: '+',
        priceModificationType: null,
        productsToModify: {
            paginationParams: {
                limit: 5,
                page: 1
            },
            products: [],
            quantityOfProductsToModify: 0
        },
        productsToRender: {
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
            products: [],
            quantityOfProductsToRender: 0,
            typesForSelect: {
                allTypes: [],
                allTypesNames: [],
                selectedTypes: [],
                selectedTypesNames: [{ value: 'Todos los rubros' }],
            }
        }
    },
    productDetailsModalVisibility: false,
    productForDetailsModal: null,
    productForStockHistoryModal: [],
    productStockHistoryModalVisibility: false,
    productsForExcelReport: [],
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
    typesForSelect: {
        allTypes: [],
        allTypesNames: [],
        selectedTypes: [],
        selectedTypesNames: [{ value: 'Todos los rubros' }],
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_FILTERS:
            return {
                ...state,
                productDetailsModalVisibility: false,
                productForDetailsModal: null
            }
        case actions.CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL:
            return {
                ...state,
                priceModificatorModal: initialState.priceModificatorModal
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
        case actions.DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            const notAllBrandsNamesForProductsToRenderInPriceModificator =
                state.priceModificatorModal.productsToRender.brandsForSelect.selectedBrandsNames
                    .filter(brandName => brandName.value !== 'Todas las marcas')
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        brandsForSelect: {
                            ...state.priceModificatorModal.productsToRender.brandsForSelect,
                            selectedBrandsNames: notAllBrandsNamesForProductsToRenderInPriceModificator
                        }
                    }
                }
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
        case actions.DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            const notAllTypesNamesForProductsToRenderInPriceModificator =
                state.priceModificatorModal.productsToRender.typesForSelect.selectedTypesNames
                    .filter(typeName => typeName.value !== 'Todos los rubros')
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        typesForSelect: {
                            ...state.priceModificatorModal.productsToRender.typesForSelect,
                            selectedTypesNames: notAllTypesNamesForProductsToRenderInPriceModificator
                        }
                    }
                }
            }
        case actions.HIDE_PRICE_MODIFICATOR_MODAL:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    modalVisibility: false
                }
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
        case actions.SELECT_ALL_BRANDS:
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrands: state.brandsForSelect.allBrands,
                    selectedBrandsNames: [{ value: 'Todas las marcas' }]
                }
            }
        case actions.SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        brandsForSelect: {
                            ...state.priceModificatorModal.productsToRender.brandsForSelect,
                            selectedBrands: state.priceModificatorModal.productsToRender.brandsForSelect.allBrands,
                            selectedBrandsNames: [{ value: 'Todas las marcas' }]
                        },
                        paginationParams: {
                            ...state.priceModificatorModal.productsToRender.paginationParams,
                            filters: {
                                ...state.priceModificatorModal.productsToRender.paginationParams.filters,
                                marca: []
                            }
                        }
                    }
                }
            }
        case actions.SELECT_ALL_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }]
            }
        case actions.SELECT_ALL_TYPES:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                },
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedTypes: state.typesForSelect.allTypes,
                    selectedTypesNames: [{ value: 'Todos los rubros' }]
                }
            }
        case actions.SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        paginationParams: {
                            ...state.priceModificatorModal.productsToRender.paginationParams,
                            filters: {
                                ...state.priceModificatorModal.productsToRender.paginationParams.filters,
                                rubro: []
                            }
                        },
                        typesForSelect: {
                            ...state.priceModificatorModal.productsToRender.typesForSelect,
                            selectedTypes: state.priceModificatorModal.productsToRender.brandsForSelect.allTypes,
                            selectedTypesNames: [{ value: 'Todos los rubros' }]
                        }
                    }
                }
            }
        case actions.SET_ACTIVE_BRAND:
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrand: action.payload
                }
            }
        case actions.SET_ACTIVE_TYPE:
            return {
                ...state,
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedTypes: action.payload
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
        case actions.SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        brandsForSelect: {
                            ...state.priceModificatorModal.productsToRender.brandsForSelect,
                            allBrands: action.payload.allBrands,
                            allBrandsNames: action.payload.allBrandsNames
                        },
                        typesForSelect: {
                            ...state.priceModificatorModal.productsToRender.typesForSelect,
                            allTypes: action.payload.allTypes,
                            allTypesNames: action.payload.allTypesNames
                        }
                    }
                }
            }
        case actions.SET_BRANDS_FOR_EXCEL_REPORT:
            return {
                ...state,
                brandsForSelect: {
                    ...state.brandsForSelect,
                    selectedBrandsNames: action.payload
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
        case actions.SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        brandsForSelect: {
                            ...state.priceModificatorModal.productsToRender.brandsForSelect,
                            selectedBrands: action.payload.selectedBrands,
                            selectedBrandsNames: action.payload.selectedBrandsNames
                        },
                        paginationParams: {
                            ...state.priceModificatorModal.productsToRender.paginationParams,
                            filters: {
                                ...state.priceModificatorModal.productsToRender.paginationParams.filters,
                                marca: action.payload.selectedBrands
                            }
                        }
                    }
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
        case actions.SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        typesForSelect: {
                            ...state.priceModificatorModal.productsToRender.typesForSelect,
                            selectedTypes: action.payload.selectedTypes,
                            selectedTypesNames: action.payload.selectedTypesNames
                        },
                        paginationParams: {
                            ...state.priceModificatorModal.productsToRender.paginationParams,
                            filters: {
                                ...state.priceModificatorModal.productsToRender.paginationParams.filters,
                                rubro: action.payload.selectedTypes
                            }
                        }
                    }
                }
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
        case actions.SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToModify: {
                        ...state.priceModificatorModal.productsToModify,
                        paginationParams: action.payload
                    }
                }
            }
        case actions.SET_PAGINATION_PARAMS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        paginationParams: action.payload,
                        brandsForSelect: {
                            ...state.priceModificatorModal.productsToRender.brandsForSelect,
                            selectedBrand: [],
                            selectedBrandsNames: [{ value: 'Todas las marcas' }]
                        },
                        typesForSelect: {
                            ...state.priceModificatorModal.productsToRender.typesForSelect,
                            selectedTypes: [],
                            selectedTypesNames: [{ value: 'Todos los rubros' }],
                        }
                    }
                }
            }
        case actions.SET_PRICE_MODIFICATION_QUANTITY:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    priceModificationQuantity: action.payload
                }
            }
        case actions.SET_PRICE_MODIFICATION_SIGN:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    priceModificationSign: action.payload
                }
            }
        case actions.SET_PRICE_MODIFICATION_TYPE:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    priceModificationType: action.payload
                }
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
        case actions.SET_PRODUCTS_FOR_EXCEL_REPORT:
            return {
                ...state,
                productsForExcelReport: action.payload
            }
        case actions.SET_PRODUCTS_FOR_PRICE_MODIFICATION:
            const productsToModifyInState = state.priceModificatorModal.productsToModify.products
            const productsToModifyInStateIDs = productsToModifyInState.map(
                product => product._id
            )
            const newProductsToModify = action.payload.products.filter(
                product => !productsToModifyInStateIDs.includes(product._id)
            )
            const pageProductsIDs = action.payload.products.length > 0
                ? action.payload.products.map(product => product._id)
                : []
            const products = action.payload.check // True: check page, false: uncheck page
                ? productsToModifyInState.concat(newProductsToModify)
                : productsToModifyInState.filter(
                    product => !pageProductsIDs.includes(product._id)
                )
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToModify: {
                        ...state.priceModificatorModal.productsToModify,
                        products,
                        quantityOfProductsToModify: products.length
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
        case actions.SET_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        loading: false,
                        products: action.payload.docs,
                        quantityOfProductsToRender: action.payload.totalDocs
                    }
                }
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
        case actions.SET_TYPES_FOR_EXCEL_REPORT:
            return {
                ...state,
                typesForSelect: {
                    ...state.typesForSelect,
                    selectedTypesNames: action.payload
                }
            }
        case actions.SHOW_PRICE_MODIFICATOR_MODAL:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    modalVisibility: true
                }
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