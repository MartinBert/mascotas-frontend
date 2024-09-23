const initialState = {
    existsBrands: false,
    existsEntries: false,
    existsOutputs: false,
    existsProducts: false,
    existsSales: false,
    existsTypes: false
}

const actions = {
    SET_EXISTS_BRANDS: 'SET_EXISTS_BRANDS',
    SET_EXISTS_ENTRIES: 'SET_EXISTS_ENTRIES',
    SET_EXISTS_OUTPUTS: 'SET_EXISTS_OUTPUTS',
    SET_EXISTS_PRODUCTS: 'SET_EXISTS_PRODUCTS',
    SET_EXISTS_SALES: 'SET_EXISTS_SALES',
    SET_EXISTS_TYPES: 'SET_EXISTS_TYPES',
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_EXISTS_BRANDS:
            return {
                ...state,
                existsBrands: action.payload
            }
        case actions.SET_EXISTS_ENTRIES:
            return {
                ...state,
                existsEntries: action.payload
            }
        case actions.SET_EXISTS_OUTPUTS:
            return {
                ...state,
                existsOutputs: action.payload
            }
        case actions.SET_EXISTS_PRODUCTS:
            return {
                ...state,
                existsProducts: action.payload
            }
        case actions.SET_EXISTS_SALES:
            return {
                ...state,
                existsSales: action.payload
            }
        case actions.SET_EXISTS_TYPES:
            return {
                ...state,
                existsTypes: action.payload
            }
        default:
            return state
    }
}

const renderConditions = {
    initialState,
    reducer,
}

export default renderConditions