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
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_SALES_AREAS_TO_RENDER: 'SET_SALES_AREAS_TO_RENDER',
    SET_SELECTED_SALES_AREA: 'SET_SELECTED_SALES_AREA',
}

const initialState = {
    allSalesAreas: [],
    allSalesAreasNames: [],
    currentSalesArea: {
        description: null,
        discountDecimal: 0,
        discountPercentage: 0,
        name: null,
        surchargeDecimal: 0,
        surchargePercentage: 0
    },
    loading: true,
    paginatedSalesAreas: [],
    paginationParams: {
        filters: {
            name: null
        },
        limit: 10,
        page: 1
    },
    selectedSalesArea: [],
    selectedSalesAreaName: [],
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
            const defaultSalesArea = action.payload.filter(salesArea => salesArea.name === 'Default')
            const defaultSalesAreaName = { value: defaultSalesArea[0].name }
            return {
                ...state,
                allSalesAreas: action.payload,
                allSalesAreasNames: action.payload.map(salesArea => { return { value: salesArea.name } }),
                selectedSalesArea: defaultSalesArea,
                selectedSalesAreaName: defaultSalesAreaName
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
        case actions.SET_SALES_AREAS_TO_RENDER:
            return {
                ...state,
                loading: false,
                paginatedSalesAreas: action.payload.docs,
                totalQuantityOfSalesAreas: action.payload.totalDocs
            }
        case actions.SET_SELECTED_SALES_AREA:
            const selectedSalesAreaName = { value: action.payload[0].name }
            return {
                ...state,
                selectedSalesArea: action.payload,
                selectedSalesAreaName
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