const actions = {
    REMOVE_PRODUCT_OF_PRODUCTS_BONUS: 'REMOVE_PRODUCT_OF_PRODUCTS_BONUS',
    SET_FILTER_BY_DESCRIPTION: 'SET_FILTER_BY_DESCRIPTION',
    SET_FILTER_BY_TITLE: 'SET_FILTER_BY_TITLE',
    SET_LIMIT: 'SET_LIMIT',
    SET_LOADING: 'SET_LOADING',
    SET_PAGE: 'SET_PAGE',
    SET_RECORDS_TO_RENDER: 'SET_RECORDS_TO_RENDER',
    SET_STATUS_OF_DESCRIPTION: 'SET_STATUS_OF_DESCRIPTION',
    SET_STATUS_OF_FIXED_AMOUNT_BONUS: 'SET_STATUS_OF_FIXED_AMOUNT_BONUS',
    SET_STATUS_OF_PERCENTAGE_BONUS: 'SET_STATUS_OF_PERCENTAGE_BONUS',
    SET_STATUS_OF_PRODUCTS_BONUS: 'SET_STATUS_OF_PRODUCTS_BONUS',
    SET_STATUS_OF_PURCHASE_QUANTITY_FOR_ACTIVATION: 'SET_STATUS_OF_PURCHASE_QUANTITY_FOR_ACTIVATION',
    SET_STATUS_OF_TITLE: 'SET_STATUS_OF_TITLE',
    SET_VALUE_OF_DESCRIPTION: 'SET_VALUE_OF_DESCRIPTION',
    SET_VALUE_OF_FIXED_AMOUNT_BONUS: 'SET_VALUE_OF_FIXED_AMOUNT_BONUS',
    SET_VALUE_OF_ID_OF_PRODUCTS_BONUS: 'SET_VALUE_OF_ID_OF_PRODUCTS_BONUS',
    SET_VALUE_OF_PERCENTAGE_BONUS: 'SET_VALUE_OF_PERCENTAGE_BONUS',
    SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION: 'SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION',
    SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS: 'SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS',
    SET_VALUE_OF_TITLE: 'SET_VALUE_OF_TITLE'
}

const initialState = {
    benefit: {
        description: { status: null, value: '' },
        fixedAmountBonus: { status: null, value: 0 },
        percentageBonus: { status: null, value: 0 },
        productsBonus: { status: null, value: [] }, // value type: { id: product._id, quantity: number }[]
        purchaseQuantityForActivation: { status: null, value: 0 },
        title: { status: null, value: '' }
    },
    loading: true,
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
                    productsBonus: {
                        ...state.benefit.productsBonus,
                        value: remainingProducts
                    }
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
        case actions.SET_STATUS_OF_DESCRIPTION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    description: {
                        ...state.benefit.description,
                        status: action.payload
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
                        status: action.payload
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
                        status: action.payload
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
                        status: action.payload
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
                        status: action.payload
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
                        status: action.payload
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
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_FIXED_AMOUNT_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    fixedAmountBonus: {
                        ...state.benefit.fixedAmountBonus,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_ID_OF_PRODUCTS_BONUS:
            updatedProducts = state.benefit.productsBonus.value
                .push({ id: action.payload, quantity: 0 })
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    productsBonus: {
                        ...state.benefit.productsBonus,
                        value: updatedProducts
                    }
                }
            }
        case actions.SET_VALUE_OF_PERCENTAGE_BONUS:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    percentageBonus: {
                        ...state.benefit.percentageBonus,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    purchaseQuantityForActivation: {
                        ...state.benefit.purchaseQuantityForActivation,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS:
            updatedProducts = state.benefit.productsBonus.value
                .map(product => {
                    let updatedProduct
                    if (product.id === action.payload.id) updatedProduct = action.payload
                    else  updatedProduct = product
                    return updatedProduct
                })
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    productsBonus: {
                        ...state.benefit.productsBonus,
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
                        value: action.payload
                    }
                }
            }
        default:
            return state
    }
}

const benefits = {
    initialState,
    reducer,
}

export default benefits