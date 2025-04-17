const actions = {
    REMOVE_PRODUCT_OF_PRODUCTS_BONUS: 'REMOVE_PRODUCT_OF_PRODUCTS_BONUS',
    RESTART_PARAMS: 'RESTART_PARAMS',
    SET_FILTER_BY_DESCRIPTION: 'SET_FILTER_BY_DESCRIPTION',
    SET_FILTER_BY_TITLE: 'SET_FILTER_BY_TITLE',
    SET_LIMIT: 'SET_LIMIT',
    SET_LOADING: 'SET_LOADING',
    SET_PAGE: 'SET_PAGE',
    SET_RECORDS_TO_RENDER: 'SET_RECORDS_TO_RENDER',
    SET_STATUS_OF_ACTIVE_BENEFITS: 'SET_STATUS_OF_ACTIVE_BENEFITS',
    SET_STATUS_OF_DESCRIPTION: 'SET_STATUS_OF_DESCRIPTION',
    SET_STATUS_OF_FIXED_AMOUNT_BONUS: 'SET_STATUS_OF_FIXED_AMOUNT_BONUS',
    SET_STATUS_OF_PERCENTAGE_BONUS: 'SET_STATUS_OF_PERCENTAGE_BONUS',
    SET_STATUS_OF_PRODUCTS_BONUS: 'SET_STATUS_OF_PRODUCTS_BONUS',
    SET_STATUS_OF_PURCHASE_AMOUNT_FOR_ACTIVATION: 'SET_STATUS_OF_PURCHASE_AMOUNT_FOR_ACTIVATION',
    SET_STATUS_OF_PURCHASE_CONDITIONS_FOR_ACTIVATION: 'SET_STATUS_OF_PURCHASE_CONDITIONS_FOR_ACTIVATION',
    SET_STATUS_OF_PURCHASE_QUANTITY_FOR_ACTIVATION: 'SET_STATUS_OF_PURCHASE_QUANTITY_FOR_ACTIVATION',
    SET_STATUS_OF_TITLE: 'SET_STATUS_OF_TITLE',
    SET_VALUE_OF_DESCRIPTION: 'SET_VALUE_OF_DESCRIPTION',
    SET_VALUE_OF_FIXED_AMOUNT_BONUS: 'SET_VALUE_OF_FIXED_AMOUNT_BONUS',
    SET_VALUE_OF_PERCENTAGE_BONUS: 'SET_VALUE_OF_PERCENTAGE_BONUS',
    SET_VALUE_OF_PRODUCTS_BONUS: 'SET_VALUE_OF_PRODUCTS_BONUS',
    SET_VALUE_OF_PURCHASE_AMOUNT_FOR_ACTIVATION: 'SET_VALUE_OF_PURCHASE_AMOUNT_FOR_ACTIVATION',
    SET_VALUE_OF_PURCHASE_AMOUNT_CONDITION_FOR_ACTIVATION: 'SET_VALUE_OF_PURCHASE_AMOUNT_CONDITION_FOR_ACTIVATION',
    SET_VALUE_OF_PURCHASE_QUANTITY_CONDITION_FOR_ACTIVATION: 'SET_VALUE_OF_PURCHASE_QUANTITY_CONDITION_FOR_ACTIVATION',
    SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION: 'SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION',
    SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS: 'SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS',
    SET_VALUE_OF_TITLE: 'SET_VALUE_OF_TITLE'
}

const paramsStatus = {
    error: 'error',
    null: null
}

const initialState = {
    benefit: {
        activeBenefits: { message: '', status: null, value: { fixedAmountBonus: false, percentageBonus: false, productsBonus: false } },
        description: { message: '', status: null, value: '' },
        fixedAmountBonus: { message: '', status: null, value: '' },
        percentageBonus: { message: '', status: null, value: '' },
        productsBonus: { message: '', status: null, value: [] }, // value type: { id: product._id, name: product.nombre, quantity: number }[]
        purchaseAmountForActivation: { message: '', status: null, value: '' },
        purchaseConditionsForActivation: { message: '', status: null, value: { amount: false, quantity: false } },
        purchaseQuantityForActivation: { message: '', status: null, value: '' },
        title: { message: '', status: null, value: '' }
    },
    loading: false,
    paginationParams: {
        filters: {
            description: null,
            title: null
        },
        limit: 10,
        page: 1
    },
    recordsToRender: [],
    totalRecordsQuantity: 0
}

const reducer = (state = initialState, action) => {
    let updatedProducts

    switch (action.type) {
        case actions.REMOVE_PRODUCT_OF_PRODUCTS_BONUS:
            const remainingProducts = state.benefit.productsBonus.value
                .filter(product => product.id !== action.payload)
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    activeBenefits: {
                        ...state.benefit.activeBenefits,
                        message: '',
                        status: paramsStatus.null,
                        value: {
                            ...state.benefit.activeBenefits.value,
                            productsBonus: remainingProducts.length === 0 ? false : true
                        }
                    },
                    productsBonus: {
                        ...state.benefit.productsBonus,
                        message: '',
                        status: paramsStatus.null,
                        value: remainingProducts
                    }
                }
            }
        case actions.RESTART_PARAMS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    activeBenefits: { message: '', status: null, value: { fixedAmountBonus: false, percentageBonus: false, productsBonus: false } },
                    description: { message: '', status: null, value: '' },
                    fixedAmountBonus: { message: '', status: null, value: '' },
                    percentageBonus: { message: '', status: null, value: '' },
                    productsBonus: { message: '', status: null, value: [] },
                    purchaseAmountForActivation: { message: '', status: null, value: '' },
                    purchaseConditionsForActivation: { message: '', status: null, value: { amount: false, quantity: false } },
                    purchaseQuantityForActivation: { message: '', status: null, value: '' },
                    title: { message: '', status: null, value: '' }
                }
            }
        case actions.SET_FILTER_BY_DESCRIPTION:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        description: action.payload
                    }
                }
            }
        case actions.SET_FILTER_BY_TITLE:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        title: action.payload
                    }
                }
            }
        case actions.SET_LIMIT:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    limit: action.payload
                }
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_PAGE:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    page: action.payload
                }
            }
        case actions.SET_RECORDS_TO_RENDER:
            return {
                ...state,
                loading: false,
                recordsToRender: action.payload.docs,
                totalRecordsQuantity: action.payload.totalDocs
            }
        case actions.SET_STATUS_OF_ACTIVE_BENEFITS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    activeBenefits: {
                        ...state.benefit.activeBenefits,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_DESCRIPTION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    description: {
                        ...state.benefit.description,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_FIXED_AMOUNT_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    fixedAmountBonus: {
                        ...state.benefit.fixedAmountBonus,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_PERCENTAGE_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    percentageBonus: {
                        ...state.benefit.percentageBonus,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_PRODUCTS_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    productsBonus: {
                        ...state.benefit.productsBonus,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_PURCHASE_AMOUNT_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseAmountForActivation: {
                        ...state.benefit.purchaseAmountForActivation,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_PURCHASE_CONDITIONS_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseConditionsForActivation: {
                        ...state.benefit.purchaseConditionsForActivation,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_PURCHASE_QUANTITY_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseQuantityForActivation: {
                        ...state.benefit.purchaseQuantityForActivation,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_STATUS_OF_TITLE:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    title: {
                        ...state.benefit.title,
                        message: action.payload.message,
                        status: action.payload.status
                    }
                }
            }
        case actions.SET_VALUE_OF_DESCRIPTION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    description: {
                        ...state.benefit.description,
                        message: '',
                        status: paramsStatus.null,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_FIXED_AMOUNT_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    activeBenefits: {
                        ...state.benefit.activeBenefits,
                        message: '',
                        status: paramsStatus.null,
                        value: {
                            ...state.benefit.activeBenefits.value,
                            fixedAmountBonus: action.payload.length === 0 ? false : true
                        }
                    },
                    fixedAmountBonus: {
                        ...state.benefit.fixedAmountBonus,
                        message: '',
                        status: paramsStatus.null,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_PERCENTAGE_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    activeBenefits: {
                        ...state.benefit.activeBenefits,
                        message: '',
                        status: paramsStatus.null,
                        value: {
                            ...state.benefit.activeBenefits.value,
                            percentageBonus: action.payload.length === 0 ? false : true
                        }
                    },
                    percentageBonus: {
                        ...state.benefit.percentageBonus,
                        message: '',
                        status: paramsStatus.null,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_PRODUCTS_BONUS:
            const productAdded = { id: action.payload._id, name: action.payload.nombre, quantity: 0 }
            updatedProducts = [...state.benefit.productsBonus.value, productAdded]
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    activeBenefits: {
                        ...state.benefit.activeBenefits,
                        message: '',
                        status: paramsStatus.null,
                        value: {
                            ...state.benefit.activeBenefits.value,
                            productsBonus: updatedProducts.length === 0 ? false : true
                        }
                    },
                    productsBonus: {
                        ...state.benefit.productsBonus,
                        message: '',
                        status: paramsStatus.null,
                        value: updatedProducts
                    }
                }
            }
        case actions.SET_VALUE_OF_PURCHASE_AMOUNT_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseConditionsForActivation: {
                        ...state.benefit.purchaseConditionsForActivation,
                        message: '',
                        status: paramsStatus.null
                    },
                    purchaseAmountForActivation: {
                        ...state.benefit.purchaseAmountForActivation,
                        message: '',
                        status: paramsStatus.null,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_PURCHASE_AMOUNT_CONDITION_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseAmountForActivation: {
                        ...state.benefit.purchaseAmountForActivation,
                        message: '',
                        status: paramsStatus.null,
                        value: ''
                    },
                    purchaseConditionsForActivation: {
                        ...state.benefit.purchaseConditionsForActivation,
                        message: '',
                        status: paramsStatus.null,
                        value: {
                            ...state.benefit.purchaseConditionsForActivation.value,
                            amount: action.payload
                        }
                    }
                }
            }
        case actions.SET_VALUE_OF_PURCHASE_QUANTITY_CONDITION_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseConditionsForActivation: {
                        ...state.benefit.purchaseConditionsForActivation,
                        message: '',
                        status: paramsStatus.null,
                        value: {
                            ...state.benefit.purchaseConditionsForActivation.value,
                            quantity: action.payload
                        }
                    },
                    purchaseQuantityForActivation: {
                        ...state.benefit.purchaseQuantityForActivation,
                        message: '',
                        status: paramsStatus.null,
                        value: ''
                    }
                }
            }
        case actions.SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseConditionsForActivation: {
                        ...state.benefit.purchaseConditionsForActivation,
                        message: '',
                        status: paramsStatus.null
                    },
                    purchaseQuantityForActivation: {
                        ...state.benefit.purchaseQuantityForActivation,
                        message: '',
                        status: paramsStatus.null,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS:
            updatedProducts = state.benefit.productsBonus.value
                .map(product => {
                    let updatedProduct
                    if (product.id === action.payload.id) updatedProduct = action.payload
                    else updatedProduct = product
                    return updatedProduct
                })
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    productsBonus: {
                        ...state.benefit.productsBonus,
                        message: '',
                        status: paramsStatus.null,
                        value: updatedProducts
                    }
                }
            }
        case actions.SET_VALUE_OF_TITLE:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    title: {
                        ...state.benefit.title,
                        message: '',
                        status: paramsStatus.null,
                        value: action.payload
                    }
                }
            }
        default:
            return state
    }
}

const benefits = {
    actions,
    initialState,
    paramsStatus,
    reducer,
}

export default benefits