// Helpers
import dayjs from 'dayjs'


const actions = {
    CLEAR_STATE: 'CLEAR_STATE',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    HIDE_FIX_STATISTICS_MODAL: 'HIDE_FIX_STATISTICS_MODAL',
    HIDE_NULL_RECORDS: 'HIDE_NULL_RECORDS',
    SAVE_DAILY_STATISTICS: 'SAVE_DAILY_STATISTICS',
    SET_DAILY_STATISTICS_RECORDS: 'SET_DAILY_STATISTICS_RECORDS',
    SET_LOADING: 'SET_LOADING',
    SET_LOADING_SAVING_OPERATION: 'SET_LOADING_SAVING_OPERATION',
    SET_LOADING_UPDATING_RECORDS: 'SET_LOADING_UPDATING_RECORDS',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_REFERENCE_STATISTICS: 'SET_REFERENCE_STATISTICS',
    SHOW_FIX_STATISTICS_MODAL: 'SHOW_FIX_STATISTICS_MODAL',
    SHOW_NULL_RECORDS: 'SHOW_NULL_RECORDS',
    UPDATE_DATE_PICKERS_VALUES: 'UPDATE_DATE_PICKERS_VALUES'
}

const initialState = {
    dailyStatistics_paginatedList: null,
    dailyStatistics_totalRecords: 0,
    datePickersValues: {
        day_datePicker: null,
        day_rangePicker: null,
        month_datePicker: null,
        month_rangePicker: null
    },
    fixStatisticsModalIsVisible: false,
    loading: true,
    loadingSavingOperation: false,
    loadingUpdatingRecords: false,
    paginationParams: {
        filters: null,
        limit: 10,
        page: 1
    },
    params: {
        concept: '',
        dailyExpense: 0,
        dailyIncome: 0,
        dailyProfit: 0,
        date: null,
        dateString: null
    },
    referenceStatistics: {
        concept: '',
        dailyProfit: 0,
        dateString: null
    },
    showNullRecords: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_STATE:
            return initialState
        case actions.CLEAR_INPUTS:
            return {
                ...state,
                params: {
                    ...state.params,
                    concept: '',
                    dailyExpense: 0,
                    dailyIncome: 0,
                    dailyProfit: 0
                }
            }
        case actions.HIDE_FIX_STATISTICS_MODAL:
            return {
                ...state,
                fixStatisticsModalIsVisible: false
            }
        case actions.HIDE_NULL_RECORDS:
            return {
                ...state,
                showNullRecords: false
            }
        case actions.SAVE_DAILY_STATISTICS:
            return {
                ...state,
                params: {
                    ...state.params,
                    concept: action.payload.concept,
                    dailyExpense: action.payload.dailyExpense,
                    dailyIncome: action.payload.dailyIncome,
                    dailyProfit: action.payload.dailyIncome - action.payload.dailyExpense
                }
            }
        case actions.SET_DAILY_STATISTICS_RECORDS:
            return {
                ...state,
                dailyStatistics_paginatedList: action.payload.docs,
                dailyStatistics_totalRecords: parseInt(action.payload.totalDocs),
                loading: false
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_LOADING_SAVING_OPERATION:
            return {
                ...state,
                loadingSavingOperation: action.payload
            }
        case actions.SET_LOADING_UPDATING_RECORDS:
            return {
                ...state,
                loadingUpdatingRecords: action.payload
            }
        case actions.SET_PAGINATION_PARAMS:
            return {
                ...state,
                paginationParams: action.payload
            }
        case actions.SET_REFERENCE_STATISTICS:
            const referenceStatistics = {
                concept: action.payload.concept,
                dailyProfit: action.payload.dailyProfit,
                dateString: action.payload.dateString
            }
            return {
                ...state,
                params: {
                    ...state.params,
                    date: action.payload.date,
                    dateString: action.payload.dateString
                },
                referenceStatistics: referenceStatistics
            }
        case actions.SHOW_FIX_STATISTICS_MODAL:
            return {
                ...state,
                fixStatisticsModalIsVisible: true
            }
        case actions.SHOW_NULL_RECORDS:
            return {
                ...state,
                showNullRecords: true
            }
        case actions.UPDATE_DATE_PICKERS_VALUES:
            const pickerType = action.payload.pickerType
            const pickerValue = action.payload.pickerValue
            const updatedValues = {
                day_datePicker: pickerType === 'day_datePicker' && pickerValue !== ''
                    ? dayjs(pickerValue, 'DD-MM-YYYY')
                    : '',
                day_rangePicker: pickerType === 'day_rangePicker' && !pickerValue.includes('')
                    ? [dayjs(pickerValue[0], 'DD-MM-YYYY'), dayjs(pickerValue[1], 'DD-MM-YYYY')]
                    : ['', ''],
                month_datePicker: pickerType === 'month_datePicker' && pickerValue !== ''
                    ? dayjs(pickerValue, 'MM-YYYY')
                    : '',
                month_rangePicker: pickerType === 'month_rangePicker' && !pickerValue.includes('')
                    ? [dayjs(pickerValue[0], 'MM-YYYY'), dayjs(pickerValue[1], 'MM-YYYY')]
                    : ['', '']
            }
            return {
                ...state,
                datePickersValues: updatedValues
            }
        default:
            return state
    }
}

const dailyBusinessStatistics = {
    actions,
    initialState,
    reducer
}

export default dailyBusinessStatistics