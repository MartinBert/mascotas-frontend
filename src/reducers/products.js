const actions = {
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    CLEAR_FILTERS_IN_EXPORT_PRODUCT_LIST_MODAL: 'CLEAR_FILTERS_IN_EXPORT_PRODUCT_LIST_MODAL',
    CLEAR_FILTERS_IN_PRICE_MODIFICATOR_MODAL: 'CLEAR_FILTERS_IN_PRICE_MODIFICATOR_MODAL',
    CLEAR_FILTERS_IN_STOCK_HISTORY: 'CLEAR_FILTERS_IN_STOCK_HISTORY',
    CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL: 'CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL',
    DESELECT_ALL_BRANDS: 'DESELECT_ALL_BRANDS',
    DESELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST: 'DESELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST',
    DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    DESELECT_ALL_EXCEL_OPTIONS: 'DESELECT_ALL_EXCEL_OPTIONS',
    DESELECT_ALL_TYPES: 'DESELECT_ALL_TYPES',
    DESELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST: 'DESELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST',
    DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    HIDE_EXPORT_PRODUCT_LIST_MODAL: 'HIDE_EXPORT_PRODUCT_LIST_MODAL',
    HIDE_PRICE_MODIFICATOR_MODAL: 'HIDE_PRICE_MODIFICATOR_MODAL',
    HIDE_PRODUCT_DETAILS_MODAL: 'HIDE_PRODUCT_DETAILS_MODAL',
    HIDE_FIX_STOCK_HISTORY_MODAL: 'HIDE_FIX_STOCK_HISTORY_MODAL',
    HIDE_PRODUCT_STOCK_HISTORY_MODAL: 'HIDE_PRODUCT_STOCK_HISTORY_MODAL',
    SELECT_ACTIVE_EXCEL_OPTIONS: 'SELECT_ACTIVE_EXCEL_OPTIONS',
    SELECT_ALL_BRANDS: 'SELECT_ALL_BRANDS',
    SELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST: 'SELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST',
    SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SELECT_ALL_EXCEL_OPTIONS: 'SELECT_ALL_EXCEL_OPTIONS',
    SELECT_ALL_TYPES: 'SELECT_ALL_TYPES',
    SELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST: 'SELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST',
    SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SELECT_BRANDS: 'SELECT_BRANDS',
    SELECT_BRANDS_FOR_EXPORT_PRODUCT_LIST: 'SELECT_BRANDS_FOR_EXPORT_PRODUCT_LIST',
    SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SELECT_DOCUMENT_OPTIONS_IN_EXPORT_PRODUCT_LIST: 'SELECT_DOCUMENT_OPTIONS_IN_EXPORT_PRODUCT_LIST',
    SELECT_IMAGE_OPTION_FOR_EXPORT_PRODUCT_LIST: 'SELECT_IMAGE_OPTION_FOR_EXPORT_PRODUCT_LIST',
    SELECT_TYPES: 'SELECT_TYPES',
    SELECT_TYPES_FOR_EXPORT_PRODUCT_LIST: 'SELECT_TYPES_FOR_EXPORT_PRODUCT_LIST',
    SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SET_BRANDS_AND_TYPES: 'SET_BRANDS_AND_TYPES',
    SET_BRANDS_AND_TYPES_FOR_EXPORT_PRODUCT_LIST: 'SET_BRANDS_AND_TYPES_FOR_EXPORT_PRODUCT_LIST',
    SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SET_LOADING: 'SET_LOADING',
    SET_LOADING_OF_MODAL_IN_EXPORT_PRODUCT_LIST_MODAL: 'SET_LOADING_OF_MODAL_IN_EXPORT_PRODUCT_LIST_MODAL',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL: 'SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL',
    SET_PAGINATION_PARAMS_IN_PRODUCT_STOCK_HISTORY_MODAL: 'SET_PAGINATION_PARAMS_IN_PRODUCT_STOCK_HISTORY_MODAL',
    SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_MODIFY_IN_PRICE_MODIFICATOR',
    SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SET_PARAMS_IN_FIX_STOCK_HISTORY_MODAL: 'SET_PARAMS_IN_FIX_STOCK_HISTORY_MODAL',
    SET_PRICE_MODIFICATION_QUANTITY: 'SET_PRICE_MODIFICATION_QUANTITY',
    SET_PRICE_MODIFICATION_SIGN: 'SET_PRICE_MODIFICATION_SIGN',
    SET_PRICE_MODIFICATION_TYPE: 'SET_PRICE_MODIFICATION_TYPE',
    SET_PRODUCT_FOR_DETAILS_MODAL: 'SET_PRODUCT_FOR_DETAILS_MODAL',
    SET_PRODUCT_IN_PRODUCT_STOCK_HISTORY_MODAL: 'SET_PRODUCT_IN_PRODUCT_STOCK_HISTORY_MODAL',
    SET_PRODUCTS_FOR_PRICE_MODIFICATION: 'SET_PRODUCTS_FOR_PRICE_MODIFICATION',
    SET_PRODUCTS_TO_EXPORT_PRODUCT_LIST_MODAL: 'SET_PRODUCTS_TO_EXPORT_PRODUCT_LIST_MODAL',
    SET_PRODUCTS_TO_RENDER_IN_INDEX: 'SET_PRODUCTS_TO_RENDER_IN_INDEX',
    SET_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR: 'SET_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR',
    SET_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY: 'SET_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY',
    SET_STOCK_HISTORY_TO_FIX: 'SET_STOCK_HISTORY_TO_FIX',
    SET_STOCK_HISTORY_TO_RENDER: 'SET_STOCK_HISTORY_TO_RENDER',
    SET_TITLES_VALUES_IN_PRODUCT_STOCK_HISTORY_MODAL: 'SET_TITLES_VALUES_IN_PRODUCT_STOCK_HISTORY_MODAL',
    SHOW_EXPORT_PRODUCT_LIST_MODAL: 'SHOW_EXPORT_PRODUCT_LIST_MODAL',
    SHOW_PRICE_MODIFICATOR_MODAL: 'SHOW_PRICE_MODIFICATOR_MODAL',
}

const initialState = {
    detailsModal: {
        modalVisibility: false,
        product: null,
    },
    exportProductList: {
        brandsForSelect: {
            allBrands: [],
            allBrandsNames: [],
            selectedBrand: [],
            selectedBrandsNames: [{ value: 'Todas las marcas' }]
        },
        documentOptions: [{ value: 'excel' }, { value: 'pdf' }],
        documentOptionsSelected: ['pdf'],
        exportOptions: [
            { disabled: false, label: 'Todas', value: 'todas' },
            { disabled: true, label: 'Producto', value: 'producto' },
            { disabled: false, label: 'Rubro', value: 'rubro' },
            { disabled: false, label: 'Marca', value: 'marca' },
            { disabled: false, label: 'Cód. producto', value: 'codigoProducto' },
            { disabled: false, label: 'Cód. barras', value: 'codigoBarras' },
            { disabled: false, label: '% IVA compra', value: 'porcentajeIvaCompra' },
            { disabled: false, label: 'IVA compra ($)', value: 'ivaCompra' },
            { disabled: false, label: 'Precio de lista ($)', value: 'precioUnitario' },
            { disabled: false, label: '% IVA venta', value: 'porcentajeIvaVenta' },
            { disabled: false, label: 'IVA venta ($)', value: 'ivaVenta' },
            { disabled: false, label: '% Ganancia', value: 'margenGanancia' },
            { disabled: false, label: 'Precio de venta ($)', value: 'precioVenta' },
            { disabled: false, label: 'Ganancia por venta ($)', value: 'gananciaNeta' },
            { disabled: false, label: '% Ganancia fraccionada', value: 'margenGananciaFraccionado' },
            { disabled: false, label: 'Precio de venta fraccionada ($)', value: 'precioVentaFraccionado' },
            { disabled: false, label: 'Ganancia venta fraccionada ($)', value: 'gananciaNetaFraccionado' },
            { disabled: false, label: 'Precio de venta por unidad fraccionada ($)', value: 'precioVentaUnitarioFraccionado' },
            { disabled: false, label: 'Ganancia venta por unidad fraccionada ($)', value: 'gananciaNetaUnitarioFraccionado' },
            { disabled: false, label: 'Stock', value: 'cantidadStock' },
            { disabled: false, label: 'Stock fraccionado', value: 'cantidadFraccionadaStock' },
            { disabled: false, label: 'Unidad de medida', value: 'unidadMedida' },
            { disabled: false, label: 'Fraccionamiento', value: 'fraccionamiento' }
        ],
        exportOptionsSelected: [
            { disabled: false, label: 'Rubro', value: 'rubro' },
            { disabled: false, label: 'Marca', value: 'marca' },
            { disabled: false, label: 'Producto', value: 'producto' },
            { disabled: false, label: 'Cód. producto', value: 'codigoProducto' },
            { disabled: false, label: 'Cód. barras', value: 'codigoBarras' },
            { disabled: false, label: 'Precio de venta ($)', value: 'precioVenta' }
        ],
        imageOptionIsChecked: false,
        loading: true,
        loadingOfModal: false,
        modalVisibility: false,
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
        productsToExport: [],
        productsToRender: [],
        quantityOfProducts: 0,
        typesForSelect: {
            allTypes: [],
            allTypesNames: [],
            selectedTypes: [],
            selectedTypesNames: [{ value: 'Todos los rubros' }],
        }
    },
    index: {
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
            limit: 7,
            page: 1
        },
        productsToRender: [],
        productsTotalRecords: 0,
        typesForSelect: {
            allTypes: [],
            allTypesNames: [],
            selectedTypes: [],
            selectedTypesNames: [{ value: 'Todos los rubros' }],
        }
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
    stockHistory: {
        fixStockHistoryModal: {
            params: {
                date: null,
                dateString: null,
                entries: null,
                itIsAManualCorrection: true,
                outputs: null,
                product: null
            },
            product: null,
            stockHistoryToFix: null,
            modalVisibility: false
        },
        productStockHistoryModal: {
            flowValues: {
                entriesOfPreviousFortnight: 0,
                entriesOfPreviousMonth: 0,
                entriesOfPreviousWeek: 0,
                outputsOfPreviousFortnight: 0,
                outputsOfPreviousMonth: 0,
                outputsOfPreviousWeek: 0,
            },
            loading: true,
            paginationParams: {
                filters: {
                    dateString: null,
                    product: null
                },
                limit: 5,
                page: 1
            },
            product: null,
            recordsForRender: [],
            totalRecords: 0,
            modalVisibility: false
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
            totalProducts: 0,
            typesForSelect: {
                allTypes: [],
                allTypesNames: [],
                selectedTypes: [],
                selectedTypesNames: [{ value: 'Todos los rubros' }],
            }
        }
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_FILTERS:
            return {
                ...state,
                index: {
                    ...state.index,
                    brandsForSelect: {
                        ...state.index.brandsForSelect,
                        selectedBrand: [],
                        selectedBrandsNames: [{ value: 'Todas las marcas' }]
                    },
                    paginationParams: {
                        ...state.index.paginationParams,
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
                        ...state.index.typesForSelect,
                        selectedType: [],
                        selectedTypesNames: [{ value: 'Todos los rubros' }]
                    }
                }
            }
        case actions.CLEAR_FILTERS_IN_EXPORT_PRODUCT_LIST_MODAL:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    brandsForSelect: {
                        ...state.priceModificatorModal.productsToRender.brandsForSelect,
                        selectedBrand: [],
                        selectedBrandsNames: [{ value: 'Todas las marcas' }]
                    },
                    paginationParams: {
                        ...state.priceModificatorModal.productsToRender.paginationParams,
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
                        ...state.priceModificatorModal.productsToRender.typesForSelect,
                        selectedType: [],
                        selectedTypesNames: [{ value: 'Todos los rubros' }]
                    }
                }
            }
        case actions.CLEAR_FILTERS_IN_PRICE_MODIFICATOR_MODAL:
            return {
                ...state,
                priceModificatorModal: {
                    ...state.priceModificatorModal,
                    productsToRender: {
                        ...state.priceModificatorModal.productsToRender,
                        brandsForSelect: {
                            ...state.priceModificatorModal.productsToRender.brandsForSelect,
                            selectedBrand: [],
                            selectedBrandsNames: [{ value: 'Todas las marcas' }]
                        },
                        paginationParams: {
                            ...state.priceModificatorModal.productsToRender.paginationParams,
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
                            ...state.priceModificatorModal.productsToRender.typesForSelect,
                            selectedType: [],
                            selectedTypesNames: [{ value: 'Todos los rubros' }]
                        }
                    }
                }
            }
        case actions.CLEAR_FILTERS_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        brandsForSelect: {
                            ...state.stockHistory.productsToRender.brandsForSelect,
                            selectedBrand: [],
                            selectedBrandsNames: [{ value: 'Todas las marcas' }]
                        },
                        paginationParams: {
                            ...state.stockHistory.productsToRender.paginationParams,
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
                            ...state.stockHistory.productsToRender.typesForSelect,
                            selectedType: [],
                            selectedTypesNames: [{ value: 'Todos los rubros' }]
                        }
                    }
                }
            }
        case actions.CLEAR_STATE_OF_PRICE_MODIFICATOR_MODAL:
            return {
                ...state,
                priceModificatorModal: initialState.priceModificatorModal
            }
        case actions.DESELECT_ALL_BRANDS:
            const notAllBrandsNames = state.index.brandsForSelect.selectedBrandsNames
                .filter(brandName => brandName.value !== 'Todas las marcas')
            return {
                ...state,
                index: {
                    ...state.index,
                    brandsForSelect: {
                        ...state.index.brandsForSelect,
                        selectedBrandsNames: notAllBrandsNames
                    }
                }
            }
        case actions.DESELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST:
            const notAllBrandsNamesForExportProductList = state.exportProductList.brandsForSelect.selectedBrandsNames
                .filter(brandName => brandName.value !== 'Todas las marcas')
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    brandsForSelect: {
                        ...state.exportProductList.brandsForSelect,
                        selectedBrandsNames: notAllBrandsNamesForExportProductList
                    }
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
        case actions.DESELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            const notAllBrandsNamesForProductsToRenderInStockHistory =
                state.stockHistory.productsToRender.brandsForSelect.selectedBrandsNames
                    .filter(brandName => brandName.value !== 'Todas las marcas')
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        brandsForSelect: {
                            ...state.stockHistory.productsToRender.brandsForSelect,
                            selectedBrandsNames: notAllBrandsNamesForProductsToRenderInStockHistory
                        }
                    }
                }
            }
        case actions.DESELECT_ALL_EXCEL_OPTIONS:
            const notAllOptions = state.exportProductList.exportOptionsSelected.filter(option => option.value !== 'todas')
            const optionsValues = notAllOptions.map(option => option.value)
            const fixedOptions = optionsValues.includes('producto')
                ? notAllOptions
                : [{ disabled: true, label: 'Producto', value: 'producto' }].concat(notAllOptions)
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    exportOptionsSelected: fixedOptions
                }
            }
        case actions.DESELECT_ALL_TYPES:
            const notAllTypesNames = state.index.typesForSelect.selectedTypesNames
                .filter(typeName => typeName.value !== 'Todos los rubros')
            return {
                ...state,
                index: {
                    ...state.index,
                    typesForSelect: {
                        ...state.index.typesForSelect,
                        selectedTypesNames: notAllTypesNames
                    }
                }
            }
        case actions.DESELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST:
            const notAllTypesNamesForExportProductList = state.exportProductList.typesForSelect.selectedTypesNames
                .filter(typeName => typeName.value !== 'Todos los rubros')
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    typesForSelect: {
                        ...state.exportProductList.typesForSelect,
                        selectedTypesNames: notAllTypesNamesForExportProductList
                    }
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
        case actions.DESELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            const notAllTypesNamesForProductsToRenderInStockHistory =
                state.stockHistory.productsToRender.typesForSelect.selectedTypesNames
                    .filter(typeName => typeName.value !== 'Todos los rubros')
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        typesForSelect: {
                            ...state.stockHistory.productsToRender.typesForSelect,
                            selectedTypesNames: notAllTypesNamesForProductsToRenderInStockHistory
                        }
                    }
                }
            }
        case actions.HIDE_EXPORT_PRODUCT_LIST_MODAL:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    modalVisibility: false
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
                detailsModal: {
                    ...state.detailsModal,
                    modalVisibility: false,
                    product: null
                }
            }
        case actions.HIDE_FIX_STOCK_HISTORY_MODAL:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    fixStockHistoryModal: {
                        ...state.stockHistory.fixStockHistoryModal,
                        params: {
                            date: null,
                            dateString: null,
                            entries: null,
                            itIsAManualCorrection: true,
                            outputs: null,
                            product: null
                        },
                        product: null,
                        stockHistoryToFix: null,
                        modalVisibility: false
                    }
                }
            }
        case actions.HIDE_PRODUCT_STOCK_HISTORY_MODAL:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productStockHistoryModal: {
                        ...state.stockHistory.productStockHistoryModal,
                        paginationParams: {
                            ...state.stockHistory.productStockHistoryModal.paginationParams,
                            filters: {
                                ...state.stockHistory.productStockHistoryModal.paginationParams.filters,
                                product: null
                            }
                        },
                        product: null,
                        modalVisibility: false
                    }
                }
            }
        case actions.SELECT_ALL_BRANDS:
            return {
                ...state,
                index: {
                    ...state.index,
                    paginationParams: {
                        ...state.index.paginationParams,
                        filters: {
                            ...state.index.paginationParams.filters,
                            marca: []
                        }
                    },
                    brandsForSelect: {
                        ...state.index.brandsForSelect,
                        selectedBrands: state.index.brandsForSelect.allBrands,
                        selectedBrandsNames: [{ value: 'Todas las marcas' }]
                    }
                }
            }
        case actions.SELECT_ALL_BRANDS_FOR_EXPORT_PRODUCT_LIST:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    paginationParams: {
                        ...state.exportProductList.paginationParams,
                        filters: {
                            ...state.exportProductList.paginationParams.filters,
                            marca: []
                        }
                    },
                    brandsForSelect: {
                        ...state.exportProductList.brandsForSelect,
                        selectedBrands: state.exportProductList.brandsForSelect.allBrands,
                        selectedBrandsNames: [{ value: 'Todas las marcas' }]
                    }
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
        case actions.SELECT_ALL_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        brandsForSelect: {
                            ...state.stockHistory.productsToRender.brandsForSelect,
                            selectedBrands: state.stockHistory.productsToRender.brandsForSelect.allBrands,
                            selectedBrandsNames: [{ value: 'Todas las marcas' }]
                        },
                        paginationParams: {
                            ...state.stockHistory.paginationParams,
                            filters: {
                                ...state.stockHistory.productsToRender.paginationParams.filters,
                                marca: []
                            }
                        }
                    }
                }
            }
        case actions.SELECT_ALL_EXCEL_OPTIONS:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    exportOptionsSelected: [{ disabled: false, label: 'Todas', value: 'todas' }]
                }
            }
        case actions.SELECT_ALL_TYPES:
            return {
                ...state,
                index: {
                    ...state.index,
                    paginationParams: {
                        ...state.index.paginationParams,
                        filters: {
                            ...state.index.paginationParams.filters,
                            rubro: []
                        }
                    },
                    typesForSelect: {
                        ...state.index.typesForSelect,
                        selectedTypes: state.index.typesForSelect.allTypes,
                        selectedTypesNames: [{ value: 'Todos los rubros' }]
                    }
                }
            }
        case actions.SELECT_ALL_TYPES_FOR_EXPORT_PRODUCT_LIST:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    paginationParams: {
                        ...state.exportProductList.paginationParams,
                        filters: {
                            ...state.exportProductList.paginationParams.filters,
                            rubro: []
                        }
                    },
                    typesForSelect: {
                        ...state.exportProductList.typesForSelect,
                        selectedTypes: state.exportProductList.typesForSelect.allTypes,
                        selectedTypesNames: [{ value: 'Todos los rubros' }]
                    }
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
        case actions.SELECT_ALL_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        paginationParams: {
                            ...state.stockHistory.productsToRender.paginationParams,
                            filters: {
                                ...state.stockHistory.productsToRender.paginationParams.filters,
                                rubro: []
                            }
                        },
                        typesForSelect: {
                            ...state.stockHistory.productsToRender.typesForSelect,
                            selectedTypes: state.stockHistory.productsToRender.brandsForSelect.allTypes,
                            selectedTypesNames: [{ value: 'Todos los rubros' }]
                        }
                    }
                }
            }
        case actions.SELECT_ACTIVE_EXCEL_OPTIONS:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    exportOptionsSelected: action.payload
                }
            }
        case actions.SELECT_BRANDS:
            return {
                ...state,
                index: {
                    ...state.index,
                    paginationParams: {
                        ...state.index.paginationParams,
                        filters: {
                            ...state.index.paginationParams.filters,
                            marca: action.payload.selectedBrands
                        }
                    },
                    brandsForSelect: {
                        ...state.index.brandsForSelect,
                        selectedBrands: action.payload.selectedBrands,
                        selectedBrandsNames: action.payload.selectedBrandsNames
                    }
                }
            }
        case actions.SELECT_BRANDS_FOR_EXPORT_PRODUCT_LIST:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    paginationParams: {
                        ...state.exportProductList.paginationParams,
                        filters: {
                            ...state.exportProductList.paginationParams.filters,
                            marca: action.payload.selectedBrands
                        }
                    },
                    brandsForSelect: {
                        ...state.exportProductList.brandsForSelect,
                        selectedBrands: action.payload.selectedBrands,
                        selectedBrandsNames: action.payload.selectedBrandsNames
                    }
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
        case actions.SELECT_BRANDS_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        brandsForSelect: {
                            ...state.stockHistory.productsToRender.brandsForSelect,
                            selectedBrands: action.payload.selectedBrands,
                            selectedBrandsNames: action.payload.selectedBrandsNames
                        },
                        paginationParams: {
                            ...state.stockHistory.productsToRender.paginationParams,
                            filters: {
                                ...state.stockHistory.productsToRender.paginationParams.filters,
                                marca: action.payload.selectedBrands
                            }
                        }
                    }
                }
            }
        case actions.SELECT_DOCUMENT_OPTIONS_IN_EXPORT_PRODUCT_LIST:
            const [typeDoc] = action.payload
            const exportOptionsIfPdf = [
                { disabled: false, label: 'Rubro', value: 'rubro' },
                { disabled: false, label: 'Marca', value: 'marca' },
                { disabled: false, label: 'Producto', value: 'producto' },
                { disabled: false, label: 'Cód. producto', value: 'codigoProducto' },
                { disabled: false, label: 'Cód. barras', value: 'codigoBarras' },
                { disabled: false, label: 'Precio de venta ($)', value: 'precioVenta' },
            ]
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    documentOptionsSelected: action.payload,
                    exportOptionsSelected: typeDoc === 'pdf'
                        ? exportOptionsIfPdf
                        : [{ disabled: false, label: 'Todas', value: 'todas' },]
                }
            }
        case actions.SELECT_IMAGE_OPTION_FOR_EXPORT_PRODUCT_LIST:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    imageOptionIsChecked: action.payload
                }
            }
        case actions.SELECT_TYPES:
            return {
                ...state,
                index: {
                    ...state.index,
                    paginationParams: {
                        ...state.index.paginationParams,
                        filters: {
                            ...state.index.paginationParams.filters,
                            rubro: action.payload.selectedTypes
                        }
                    },
                    typesForSelect: {
                        ...state.index.typesForSelect,
                        selectedTypes: action.payload.selectedTypes,
                        selectedTypesNames: action.payload.selectedTypesNames
                    }
                }
            }
        case actions.SELECT_TYPES_FOR_EXPORT_PRODUCT_LIST:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    paginationParams: {
                        ...state.exportProductList.paginationParams,
                        filters: {
                            ...state.exportProductList.paginationParams.filters,
                            rubro: action.payload.selectedTypes
                        }
                    },
                    typesForSelect: {
                        ...state.exportProductList.typesForSelect,
                        selectedTypes: action.payload.selectedTypes,
                        selectedTypesNames: action.payload.selectedTypesNames
                    }
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
        case actions.SELECT_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        typesForSelect: {
                            ...state.stockHistory.productsToRender.typesForSelect,
                            selectedTypes: action.payload.selectedTypes,
                            selectedTypesNames: action.payload.selectedTypesNames
                        },
                        paginationParams: {
                            ...state.stockHistory.productsToRender.paginationParams,
                            filters: {
                                ...state.stockHistory.productsToRender.paginationParams.filters,
                                rubro: action.payload.selectedTypes
                            }
                        }
                    }
                }
            }
        case actions.SET_BRANDS_AND_TYPES:
            return {
                ...state,
                index: {
                    ...state.index,
                    brandsForSelect: {
                        ...state.index.brandsForSelect,
                        allBrands: action.payload.allBrands,
                        allBrandsNames: action.payload.allBrandsNames
                    },
                    typesForSelect: {
                        ...state.index.typesForSelect,
                        allTypes: action.payload.allTypes,
                        allTypesNames: action.payload.allTypesNames
                    }
                }
            }
        case actions.SET_BRANDS_AND_TYPES_FOR_EXPORT_PRODUCT_LIST:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    brandsForSelect: {
                        ...state.index.brandsForSelect,
                        allBrands: action.payload.allBrands,
                        allBrandsNames: action.payload.allBrandsNames
                    },
                    typesForSelect: {
                        ...state.index.typesForSelect,
                        allTypes: action.payload.allTypes,
                        allTypesNames: action.payload.allTypesNames
                    }
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
        case actions.SET_BRANDS_AND_TYPES_FOR_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        brandsForSelect: {
                            ...state.stockHistory.productsToRender.brandsForSelect,
                            allBrands: action.payload.allBrands,
                            allBrandsNames: action.payload.allBrandsNames
                        },
                        typesForSelect: {
                            ...state.stockHistory.productsToRender.typesForSelect,
                            allTypes: action.payload.allTypes,
                            allTypesNames: action.payload.allTypesNames
                        }
                    }
                }
            }
        case actions.SET_LOADING:
            return {
                ...state,
                index: {
                    ...state.index,
                    loading: action.payload
                }
            }
        case actions.SET_LOADING_OF_MODAL_IN_EXPORT_PRODUCT_LIST_MODAL:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    loadingOfModal: action.payload
                }
            }
        case actions.SET_PAGINATION_PARAMS:
            return {
                ...state,
                index: {
                    ...state.index,
                    paginationParams: action.payload
                }
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
        case actions.SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_PRICE_MODIFICATOR:
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
        case actions.SET_PAGINATION_PARAMS_OF_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        paginationParams: action.payload
                    }
                }
            }
        case actions.SET_PAGINATION_PARAMS_IN_EXPORT_PRODUCT_LIST_MODAL:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    paginationParams: action.payload
                }
            }
        case actions.SET_PAGINATION_PARAMS_IN_PRODUCT_STOCK_HISTORY_MODAL:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productStockHistoryModal: {
                        ...state.stockHistory.productStockHistoryModal,
                        paginationParams: action.payload
                    }
                }
            }
        case actions.SET_PARAMS_IN_FIX_STOCK_HISTORY_MODAL:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    fixStockHistoryModal: {
                        ...state.stockHistory.fixStockHistoryModal,
                        params: action.payload
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
                detailsModal: {
                    ...state.detailsModal,
                    modalVisibility: true,
                    product: action.payload
                }
            }
        case actions.SET_PRODUCT_IN_PRODUCT_STOCK_HISTORY_MODAL:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productStockHistoryModal: {
                        ...state.stockHistory.productStockHistoryModal,
                        paginationParams: {
                            ...state.stockHistory.productStockHistoryModal.paginationParams,
                            filters: {
                                ...state.stockHistory.productStockHistoryModal.paginationParams.filters,
                                product: action.payload
                            }
                        },
                        product: action.payload,
                        modalVisibility: true
                    }
                }
            }
        case actions.SET_PRODUCTS_TO_EXPORT_PRODUCT_LIST_MODAL:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    loading: false,
                    productsToExport: action.payload.productsToExport,
                    productsToRender: action.payload.productsToRender,
                    quantityOfProducts: action.payload.quantityOfProducts
                }
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
        case actions.SET_PRODUCTS_TO_RENDER_IN_INDEX:
            return {
                ...state,
                index: {
                    ...state.index,
                    loading: false,
                    productsToRender: action.payload.docs,
                    productsTotalRecords: action.payload.totalDocs
                }
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
        case actions.SET_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productsToRender: {
                        ...state.stockHistory.productsToRender,
                        loading: false,
                        products: action.payload.docs,
                        totalProducts: action.payload.totalDocs
                    }
                }
            }
        case actions.SET_STOCK_HISTORY_TO_FIX:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    fixStockHistoryModal: {
                        ...state.stockHistory.fixStockHistoryModal,
                        product: state.stockHistory.productStockHistoryModal.product,
                        stockHistoryToFix: action.payload,
                        modalVisibility: true
                    }
                }
            }
        case actions.SET_STOCK_HISTORY_TO_RENDER:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productStockHistoryModal: {
                        ...state.stockHistory.productStockHistoryModal,
                        loading: false,
                        recordsForRender: action.payload.docs,
                        totalRecords: action.payload.totalDocs
                    }
                }
            }
        case actions.SET_TITLES_VALUES_IN_PRODUCT_STOCK_HISTORY_MODAL:
            return {
                ...state,
                stockHistory: {
                    ...state.stockHistory,
                    productStockHistoryModal: {
                        ...state.stockHistory.productStockHistoryModal,
                        flowValues: action.payload
                    }
                }
            }
        case actions.SHOW_EXPORT_PRODUCT_LIST_MODAL:
            return {
                ...state,
                exportProductList: {
                    ...state.exportProductList,
                    modalVisibility: true
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