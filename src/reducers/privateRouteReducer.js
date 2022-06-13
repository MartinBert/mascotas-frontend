const initialState = {
    openKeys: []
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_OPEN_SUBMENU_KEY':
            return {
                ...state,
                openKeys: action.payload 
            }
        default:
            return state
    }
}

const privateRouteReducer = {
    initialState,
    reducer
}

export default privateRouteReducer;