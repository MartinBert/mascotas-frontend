const initialState = {
    products: []
}

const actions = {
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_PRODUCT: 'SET_PRODUCT',
    UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS: 'UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.DELETE_ALL_PRODUCTS:
            return {
                ...state,
                products: []
            }
        case actions.DELETE_PRODUCT:
            const productsRemaining = state.products
                .filter(product => product._id !== action.payload)
                .filter(product => !(product._id.startsWith('customProduct_')))

            const customProductsRemaining = state.products
                .filter(product => product._id !== action.payload)
                .filter(product => product._id.startsWith('customProduct_'))
                .map((customProduct, index) => {
                    customProduct = {
                        ...customProduct,
                        _id: 'customProduct_' + (1 + index),
                        codigoBarras: 'customProduct_' + (1 + index),
                        key: 'customProduct_' + (1 + index)
                    }
                    return customProduct
                })

            return {
                ...state,
                products: productsRemaining.concat(customProductsRemaining)
            }
        case actions.SET_PRODUCT:
            if (state.products.find(product => product._id === action.payload._id)) return state;
            return {
                ...state,
                products: [
                    ...state.products,
                    action.payload
                ]
            }
        case actions.UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS:
            return {
                ...state,
                products: state.products.concat(action.payload)
            }
        default:
            return state;
    }
}

const products = {
    initialState,
    actions,
    reducer
}

export default products