// Helpers
import dayjs from 'dayjs'


const actions = {
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    CLEAR_STATE: 'CLEAR_STATE',
    HIDE_STATISTICS_DETAIL_MODAL: 'HIDE_STATISTICS_DETAIL_MODAL',
    HIDE_FIX_STATISTICS_MODAL: 'HIDE_FIX_STATISTICS_MODAL',
    HIDE_NULL_RECORDS: 'HIDE_NULL_RECORDS',
    SAVE_DAILY_STATISTICS: 'SAVE_DAILY_STATISTICS',
    SET_DAILY_STATISTICS_RECORDS: 'SET_DAILY_STATISTICS_RECORDS',
    SET_EXPENSES_TO_VIEW_DETAILS: 'SET_EXPENSES_TO_VIEW_DETAILS',
    SET_INCOMES_TO_VIEW_DETAILS: 'SET_INCOMES_TO_VIEW_DETAILS',
    SET_LOADING: 'SET_LOADING',
    SET_LOADING_SAVING_OPERATION: 'SET_LOADING_SAVING_OPERATION',
    SET_LOADING_UPDATING_RECORDS: 'SET_LOADING_UPDATING_RECORDS',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_VIEW_DETAILS: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_VIEW_DETAILS',
    SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_VIEW_DETAILS: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_VIEW_DETAILS',
    SET_REFERENCE_STATISTICS: 'SET_REFERENCE_STATISTICS',
    SET_STATISTIC_TO_VIEW_DETAILS: 'SET_STATISTIC_TO_VIEW_DETAILS',
    SHOW_FIX_STATISTICS_MODAL: 'SHOW_FIX_STATISTICS_MODAL',
    SHOW_NULL_RECORDS: 'SHOW_NULL_RECORDS',
    UPDATE_DATE_PICKERS_VALUES: 'UPDATE_DATE_PICKERS_VALUES'
}

const initialState = {
    datePickersValues: {
        day_datePicker: null,
        day_rangePicker: null,
        month_datePicker: null,
        month_rangePicker: null
    },
    detailsModal: {
        tableOfExpenses: {
            expenses: [],
            loading: true,
            paginationParams: {
                limit: 5,
                page: 1
            },
            totalExpensesRecord: 0
        },
        tableOfIncomes: {
            incomes: [],
            loading: true,
            paginationParams: {
                limit: 5,
                page: 1
            },
            totalIncomesRecord: 0
        },
        statisticToViewDetails: null,
        visibility: false
    },
    fixStatisticsModalIsVisible: false,
    loading: true,
    loadingSavingOperation: false,
    loadingUpdatingRecords: false,
    paginationParams: {
        filters: {
            dailyProfit: { $ne: 0 },
            date: null,
            dateString: null
        },
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
    recordsToRender: null,
    referenceStatistics: {
        concept: '',
        dailyProfit: 0,
        dateString: null
    },
    showNullRecords: false,
    totalRecords: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_FILTERS:
            return {
                ...state,
                datePickersValues: {
                    day_datePicker: null,
                    day_rangePicker: null,
                    month_datePicker: null,
                    month_rangePicker: null
                },
                paginationParams: {
                    filters: {
                        dailyProfit: { $ne: 0 },
                        date: null,
                        dateString: null
                    },
                    limit: 10,
                    page: 1
                }
            }
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
        case actions.CLEAR_STATE:
            return initialState
        case actions.HIDE_STATISTICS_DETAIL_MODAL:
            return {
                ...state,
                detailsModal: {
                    ...state.detailsModal,
                    statisticToViewDetails: null,
                    visibility: false
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
                recordsToRender: action.payload.docs,
                totalRecords: parseInt(action.payload.totalDocs),
                loading: false
            }
        case actions.SET_EXPENSES_TO_VIEW_DETAILS:
            return {
                ...state,
                detailsModal: {
                    ...state.detailsModal,
                    tableOfExpenses: {
                        ...state.detailsModal.tableOfExpenses,
                        expenses: action.payload.expenses,
                        loading: false,
                        totalExpensesRecord: action.payload.totalExpensesRecord
                    }
                }
            }
        case actions.SET_INCOMES_TO_VIEW_DETAILS:
            return {
                ...state,
                detailsModal: {
                    ...state.detailsModal,
                    tableOfIncomes: {
                        ...state.detailsModal.tableOfIncomes,
                        incomes: action.payload.incomes,
                        loading: false,
                        totalIncomesRecord: action.payload.totalIncomesRecord
                    }
                }
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
        case actions.SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_VIEW_DETAILS:
            return {
                ...state,
                detailsModal: {
                    ...state.detailsModal,
                    tableOfExpenses: {
                        ...state.detailsModal.tableOfExpenses,
                        paginationParams: action.payload
                    }
                }
            }
        case actions.SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_VIEW_DETAILS:
            return {
                ...state,
                detailsModal: {
                    ...state.detailsModal,
                    tableOfIncomes: {
                        ...state.detailsModal.tableOfIncomes,
                        paginationParams: action.payload
                    }
                }
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
        case actions.SET_STATISTIC_TO_VIEW_DETAILS:
            return {
                ...state,
                detailsModal: {
                    ...state.detailsModal,
                    statisticToViewDetails: action.payload,
                    visibility: true
                }
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
            if (!pickerType) return
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