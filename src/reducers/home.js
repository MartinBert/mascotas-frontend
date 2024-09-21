const actions = {
    SET_ACTIVE_STEP: 'SET_ACTIVE_STEP',
    SET_DEV_PASSWORD: 'SET_DEV_PASSWORD',
    SET_DEV_TOOLS_TO_RENDER: 'SET_DEV_TOOLS_TO_RENDER',
    SET_FILTERS: 'SET_FILTERS',
    SET_IS_ACTIVE_STEP_COMPLETED: 'SET_IS_ACTIVE_STEP_COMPLETED',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_SELECTS_OPTIONS_FOR_STEP_2_FISCAL_CONDITIONS: 'SET_SELECTS_OPTIONS_FOR_STEP_2_FISCAL_CONDITIONS',
    SET_SELECTS_OPTIONS_FOR_STEP_2_SALE_POINTS: 'SET_SELECTS_OPTIONS_FOR_STEP_2_SALE_POINTS',
    SET_VISIBILITY_OF_DEV_TOOLS: 'SET_VISIBILITY_OF_DEV_TOOLS',
    SET_VISIBILITY_OF_FIRST_STEPS: 'SET_VISIBILITY_OF_FIRST_STEPS'
}

const initialState = {
    devPassword: null,
    devToolsToRender: [],
    firstSteps: {
        activeStep: 0,
        isActiveStepCompleted: false,
        selectsOptionsForStep2: {
            fiscalConditions: [],
            salePoints: []
        }
    },
    loading: false,
    paginationParams: {
        filters: {
            description: null
        },
        limit: 5,
        page: 1
    },
    visibilityOfDevTools: false,
    visibilityOfFirstSteps: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_ACTIVE_STEP:
            return {
                ...state,
                firstSteps: {
                    ...state.firstSteps,
                    activeStep: action.payload
                }
            }
        case actions.SET_DEV_PASSWORD:
            return {
                ...state,
                devPassword: action.payload
            }
        case actions.SET_DEV_TOOLS_TO_RENDER:
            return {
                ...state,
                devToolsToRender: action.payload
            }
        case actions.SET_FILTERS:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: action.payload
                }
            }
        case actions.SET_IS_ACTIVE_STEP_COMPLETED:
            return {
                ...state,
                firstSteps: {
                    ...state.firstSteps,
                    isActiveStepCompleted: action.payload
                }
            }
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
        case actions.SET_SELECTS_OPTIONS_FOR_STEP_2_FISCAL_CONDITIONS:
            return {
                ...state,
                firstSteps: {
                    ...state.firstSteps,
                    selectsOptionsForStep2: {
                        ...state.firstSteps.selectsOptionsForStep2,
                        fiscalConditions: action.payload
                    }
                }
            }
        case actions.SET_SELECTS_OPTIONS_FOR_STEP_2_SALE_POINTS:
            return {
                ...state,
                firstSteps: {
                    ...state.firstSteps,
                    selectsOptionsForStep2: {
                        ...state.firstSteps.selectsOptionsForStep2,
                        salePoints: action.payload
                    }
                }
            }
        case actions.SET_VISIBILITY_OF_DEV_TOOLS:
            return {
                ...state,
                visibilityOfDevTools: action.payload
            }
        case actions.SET_VISIBILITY_OF_FIRST_STEPS:
            return {
                ...state,
                visibilityOfFirstSteps: action.payload
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