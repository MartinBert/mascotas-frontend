const actions = {
    PRODUCT_SELECTOR_SET_LOADING: 'PRODUCT_SELECTOR_SET_LOADING',
    PRODUCT_SELECTOR_SET_OPTIONS: 'PRODUCT_SELECTOR_SET_OPTIONS',
}

const initialState = {
    productSelector: {
        loading: false,
        options: [],
        selectedValue: ''
    }
}

const params = {
    productSelector: {
        searchParams: {
            barCode: 'barCode',
            name: 'name',
            productCode: 'productCode'
        }
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.PRODUCT_SELECTOR_SET_LOADING:
            return {
                ...state,
                productSelector: {
                    ...state.productSelector,
                    loading: action.payload
                }
            }
        case actions.PRODUCT_SELECTOR_SET_OPTIONS:
            return {
                ...state,
                productSelector: {
                    ...state.productSelector,
                    options: action.payload
                }
            }
        default:
            return state
    }
}

const genericComponents = {
    actions,
    initialState,
    params,
    reducer,
}

export default genericComponents