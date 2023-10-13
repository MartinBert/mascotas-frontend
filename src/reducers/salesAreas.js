// Helpers
import helpers from '../helpers'

// Imports Destructuring
const { roundTwoDecimals } = helpers.mathHelper

const actions = {
    CLEAN_SALES_AREA_STATE: 'CLEAN_SALES_AREA_STATE',
    CLEAN_STATE: 'CLEAN_STATE',
    EDIT_SALES_AREA: 'EDIT_SALES_AREA',
    SET_ALL_SALES_AREAS: 'SET_ALL_SALES_AREAS',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATED_SALES_AREAS: 'SET_PAGINATED_SALES_AREAS',
    TOTAL_QUANTITY_OF_SALES_AREAS: 'TOTAL_QUANTITY_OF_SALES_AREAS'
}

const initialState = {
    allSalesAreas: null,
    currentSalesArea: {
        description: null,
        discountDecimal: 0,
        discountPercentage: 0,
        name: null,
        surchargeDecimal: 0,
        surchargePercentage: 0
    },
    loading: true,
    paginatedSalesAreas: null,
    totalQuantityOfSalesAreas: 0
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAN_SALES_AREA_STATE:
            return {
                ...state,
                currentSalesArea: initialState.currentSalesArea
            }
        case actions.CLEAN_STATE:
            return initialState
        case actions.EDIT_SALES_AREA:
            return {
                ...state,
                currentSalesArea: {
                    ...action.payload,
                    discountDecimal: roundTwoDecimals(action.payload.discountPercentage / 100),
                    surchargeDecimal: roundTwoDecimals(action.payload.surchargePercentage / 100),
                },
                loading: true
            }
        case actions.SET_ALL_SALES_AREAS:
            return {
                ...state,
                allSalesAreas: action.payload
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_PAGINATED_SALES_AREAS:
            return {
                ...state,
                paginatedSalesAreas: action.payload
            }
        case actions.TOTAL_QUANTITY_OF_SALES_AREAS:
            return {
                ...state,
                totalQuantityOfSalesAreas: action.payload
            }
        default:
            return state
    }
}

const salesAreas = {
    initialState,
    actions,
    reducer
}

export default salesAreas