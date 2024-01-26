const initialState = {
    params: {
        productos: []
    }
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
                params: { ...state.params, productos: [] }
            }
        case actions.DELETE_PRODUCT:
            const productsRemaining = state.params.productos
                .filter(product => product._id !== action.payload)
                .filter(product => !(product._id.startsWith('customProduct_')))

            const customProductsRemaining = state.params.productos
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
                params: { 
                    ...state.params,
                    productos: productsRemaining.concat(customProductsRemaining)
                }
            }
        case actions.SET_PRODUCT:
            if (state.params.productos.find(product => product._id === action.payload._id)) return state;
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: [
                        ...state.params.productos,
                        action.payload
                    ]
                }
            }
        case actions.UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS:
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: state.params.productos.concat(action.payload)
                }
            }
        default:
            return state;
    }
}

const saleProducts = {
    initialState,
    actions,
    reducer
}

export default saleProducts