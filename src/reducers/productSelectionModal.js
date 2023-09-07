const initialState = {
    productModalIsVisible: false,
    selectionLimit: 100000000
}

const actions = {
    CLEAN_STATE: 'CLEAN_STATE',
    HIDE_PRODUCT_MODAL: 'HIDE_PRODUCT_MODAL',
    SET_SELECTION_LIMIT: 'SET_SELECTION_LIMIT',
    SHOW_PRODUCT_MODAL: 'SHOW_PRODUCT_MODAL'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAN_STATE:
            return {
                productModalIsVisible: false,
                selectionLimit: 100000000
            }
        case actions.HIDE_PRODUCT_MODAL:
            return {
                ...state,
                productModalIsVisible: false
            }
        case actions.SET_SELECTION_LIMIT:
            return {
                ...state,
                selectionLimit: action.payload
            }
        case actions.SHOW_PRODUCT_MODAL:
            return {
                ...state,
                productModalIsVisible: true
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