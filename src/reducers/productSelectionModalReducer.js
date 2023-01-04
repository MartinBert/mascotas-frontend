const initialState = {
    open: false,
    selectionLimit: 100000000,
    selectedProducts: []
}

const actions = {
    SET_PRODUCT: 'SET_PRODUCT',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SHOW_MODAL: 'SHOW_MODAL',
    HIDE_MODAL: 'HIDE_MODAL',
    SET_SELECTION_LIMIT: 'SET_SELECTION_LIMIT',
    CLEAN_PRODUCT_LIST: 'CLEAN_PRODUCT_LIST',
    CLEAN_STATE: 'CLEAN_STATE'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_PRODUCT:
            if(state.selectedProducts.find(product => product._id === action.payload._id)) return state;
            return {
                ...state,
                selectedProducts: [
                    ...state.selectedProducts,
                    action.payload
                ]
            }
        case actions.DELETE_PRODUCT:
            return {
                ...state,
                selectedProducts:  state.selectedProducts.filter(product => product._id !== action.payload._id)
            }
        case actions.SHOW_MODAL:
            return {
                ...state,
                open: true
            }
        case actions.HIDE_MODAL:
            return {
                ...state,
                open: false
            }
        case actions.SET_SELECTION_LIMIT:
            return {
                ...state,
                selectionLimit: action.payload
            }
        case actions.CLEAN_PRODUCT_LIST:
            return {
                ...state,
                selectedProducts: []
            }
        case actions.CLEAN_STATE:
            return {
                open: false,
                selectionLimit: null,
                selectedProducts: []
            }
        default:
            return state;
    }
}

const getNamedStates = () => {
    return {
        productInitialState: initialState,
        productReducer: reducer,
        productActions: actions
    }
}

const productSelectionModalReducer = {
    initialState,
    actions,
    reducer,
    getNamedStates
}

export default productSelectionModalReducer;