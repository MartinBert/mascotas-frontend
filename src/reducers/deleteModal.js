const actions = {
    CLEAN_STATE: 'CLEAN_STATE',
    HIDE_DELETE_MODAL: 'HIDE_DELETE_MODAL',
    SET_CONFIRM_DELETION: 'SET_CONFIRM_DELETION',
    SET_ENTITY_ID: 'SET_ENTITY_ID',
    SET_LOADING: 'SET_LOADING',
    SHOW_DELETE_MODAL: 'SHOW_DELETE_MODAL'
}

const initialState = {
    confirmDeletion: false,
    entityID: null,
    modalIsVisible: false,
    loading: true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAN_STATE:
            return initialState
        case actions.HIDE_DELETE_MODAL:
            return {
                ...state,
                modalIsVisible: false
            }
        case actions.SET_CONFIRM_DELETION:
            return {
                ...state,
                confirmDeletion: action.payload
            }
        case actions.SET_ENTITY_ID:
            return {
                ...state,
                entityID: action.payload
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SHOW_DELETE_MODAL:
            return {
                ...state,
                modalIsVisible: true
            }
        default:
            return state;
    }
}

const deleteModal = {
    actions,
    initialState,
    reducer
}

export default deleteModal