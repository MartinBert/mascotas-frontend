const initialState = {
    darknessBackgroundPrimaryColor: '',
    darknessBackgroundSecondaryColor: '',
    darknessButtonsPrimaryColor: '',
    darknessButtonsSecondaryColor: '',
    isDarknessActive: true,
    lightBackgroundPrimaryColor: '',
    lightBackgroundSecondaryColor: '',
    lightButtonsPrimaryColor: '',
    lightButtonsSecondaryColor: '',
    typeOfStatisticsView: ''
}

const actions = {
    LOAD_STYLES: 'LOAD_STYLES',
    SET_DARKNESS_ACTIVE: 'SET_DARKNESS_ACTIVE',
    SET_DARKNESS_BACKGROUND_PRIMARY_COLOR: 'SET_DARKNESS_BACKGROUND_PRIMARY_COLOR',
    SET_DARKNESS_BACKGROUND_SECONDARY_COLOR: 'SET_DARKNESS_BACKGROUND_SECONDARY_COLOR',
    SET_DARKNESS_BUTTONS_PRIMARY_COLOR: 'SET_DARKNESS_BUTTONS_PRIMARY_COLOR',
    SET_DARKNESS_BUTTONS_SECONDARY_COLOR: 'SET_DARKNESS_BUTTONS_SECONDARY_COLOR',
    SET_LIGHT_BACKGROUND_PRIMARY_COLOR: 'SET_LIGHT_BACKGROUND_PRIMARY_COLOR',
    SET_LIGHT_BACKGROUND_SECONDARY_COLOR: 'SET_LIGHT_BACKGROUND_SECONDARY_COLOR',
    SET_LIGHT_BUTTONS_PRIMARY_COLOR: 'SET_LIGHT_BUTTONS_PRIMARY_COLOR',
    SET_LIGHT_BUTTONS_SECONDARY_COLOR: 'SET_LIGHT_BUTTONS_SECONDARY_COLOR',
    SET_TYPE_OF_STATISTICS_VIEW: 'SET_TYPE_OF_STATISTICS_VIEW'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOAD_STYLES:
            return {
                ...state,
                darknessBackgroundPrimaryColor: action.payload?.darknessBackgroundPrimaryColor ?? '#17202a',
                darknessBackgroundSecondaryColor: action.payload?.darknessBackgroundSecondaryColor ?? '#66685f',
                darknessButtonsPrimaryColor: action.payload?.darknessButtonsPrimaryColor ?? '#e4ead9',
                darknessButtonsSecondaryColor: action.payload?.darknessButtonsSecondaryColor ?? '#cddaa5',
                isDarknessActive: action.payload?.isDarknessActive ?? false,
                lightBackgroundPrimaryColor: action.payload?.lightBackgroundPrimaryColor ?? '#e4ead9',
                lightBackgroundSecondaryColor: action.payload?.lightBackgroundSecondaryColor ?? '#cddaa5',
                lightButtonsPrimaryColor: action.payload?.lightButtonsPrimaryColor ?? '#17202a',
                lightButtonsSecondaryColor: action.payload?.lightButtonsSecondaryColor ?? '#66685f',
            }
        case actions.SET_DARKNESS_ACTIVE:
            return {
                ...state,
                isDarknessActive: action.payload
            }
        case actions.SET_DARKNESS_BACKGROUND_PRIMARY_COLOR:
            return {
                ...state,
                darknessBackgroundPrimaryColor: action.payload
            }
        case actions.SET_DARKNESS_BACKGROUND_SECONDARY_COLOR:
            return {
                ...state,
                darknessBackgroundSecondaryColor: action.payload
            }
        case actions.SET_DARKNESS_BUTTONS_PRIMARY_COLOR:
            return {
                ...state,
                darknessButtonsPrimaryColor: action.payload
            }
        case actions.SET_DARKNESS_BUTTONS_SECONDARY_COLOR:
            return {
                ...state,
                darknessButtonsSecondaryColor: action.payload
            }
        case actions.SET_LIGHT_BACKGROUND_PRIMARY_COLOR:
            return {
                ...state,
                lightBackgroundPrimaryColor: action.payload
            }
        case actions.SET_LIGHT_BACKGROUND_SECONDARY_COLOR:
            return {
                ...state,
                lightBackgroundSecondaryColor: action.payload
            }
        case actions.SET_LIGHT_BUTTONS_PRIMARY_COLOR:
            return {
                ...state,
                lightButtonsPrimaryColor: action.payload
            }
        case actions.SET_LIGHT_BUTTONS_SECONDARY_COLOR:
            return {
                ...state,
                lightButtonsSecondaryColor: action.payload
            }
        case actions.SET_TYPE_OF_STATISTICS_VIEW:
            return {
                ...state,
                typeOfStatisticsView: action.payload
            }
        default:
            return state
    }
}

const interfaceStyles = {
    actions,
    initialState,
    reducer
}

export default interfaceStyles