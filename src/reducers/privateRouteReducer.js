const initialState = {
    openSubmenuKey: [],
    openKey: []
}

const actions = {
    SET_OPEN_SUBMENU_KEY: 'SET_OPEN_SUBMENU_KEY',
    SET_OPEN_KEY: 'SET_OPEN_KEY'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_OPEN_SUBMENU_KEY:
            return {
                ...state,
                openSubmenuKey: action.payload 
            }
        case actions.SET_OPEN_KEY:
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
    actions,
    reducer
}

export default privateRouteReducer