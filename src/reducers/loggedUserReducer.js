const initialState = {
    user: null,
    loading: true,
}

const actions = {
    LOAD_USER: 'LOAD_USER',
    SET_LOADING: 'SET_LOADING'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOAD_USER:
            return {
                ...state,
                user: action.payload
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: !state.loading
            }
        default:
            return state;
    }
}

const getNamedStates = () => {
    return {
        userInitialState: initialState,
        userReducer: reducer,
        userActions: actions
    }
}

const loggedUserReducer = {
    initialState,
    actions,
    reducer,
    getNamedStates
}

export default loggedUserReducer;