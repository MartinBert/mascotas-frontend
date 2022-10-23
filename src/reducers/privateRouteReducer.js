const initialState = {
    openSubmenuKey: [],
    openKey: []
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_OPEN_SUBMENU_KEY':
            return {
                ...state,
                openSubmenuKey: action.payload 
            }
        case 'SET_OPEN_KEY':
            return {
                ...state,
                openKey: action.payload 
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