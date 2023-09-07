const initialState = {
    products: []
}

const actions = {
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_PRODUCT: 'SET_PRODUCT'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.DELETE_ALL_PRODUCTS:
            return {
                ...state,
                products: []
            }
        case actions.DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(product => product._id !== action.payload)
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
        default:
            return state;
    }
}

const productOutputs = {
    initialState,
    actions,
    reducer,
}

export default productOutputs