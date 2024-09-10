const actions = {
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_VISIBILITY_OF_DEV_TOOLS_TABLE: 'SET_VISIBILITY_OF_DEV_TOOLS_TABLE'
}

const initialState = {
    loading: false,
    paginationParams: {
        filters: {
            description: null
        },
        limit: 5,
        page: 1
    },
    visibilityOfDevToolsTable: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_PAGINATION_PARAMS:
            return {
                ...state,
                paginationParams: action.payload
            }
        case actions.SET_VISIBILITY_OF_DEV_TOOLS_TABLE:
            return {
                ...state,
                visibilityOfDevToolsTable: action.payload
            }
        default:
            return state;
    }
}

const home = {
    actions,
    initialState,
    reducer
}

export default home