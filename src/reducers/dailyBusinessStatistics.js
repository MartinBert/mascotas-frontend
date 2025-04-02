// Helpers
import dayjs from 'dayjs'
import helpers from '../helpers'

const { numberOrderDate } = helpers.dateHelper


const actions = {
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    CLEAR_STATE: 'CLEAR_STATE',
    HIDE_BALANCE_VIEW_MODAL: 'HIDE_BALANCE_VIEW_MODAL',
    HIDE_FIX_STATISTICS_MODAL: 'HIDE_FIX_STATISTICS_MODAL',
    HIDE_NULL_RECORDS: 'HIDE_NULL_RECORDS',
    HIDE_SALES_VIEW_MODAL: 'HIDE_SALES_VIEW_MODAL',
    SAVE_DAILY_STATISTICS: 'SAVE_DAILY_STATISTICS',
    SET_DAILY_STATISTICS_RECORDS: 'SET_DAILY_STATISTICS_RECORDS',
    SET_EXPENSES_TO_BALANCE_VIEW: 'SET_EXPENSES_TO_BALANCE_VIEW',
    SET_INCOMES_TO_BALANCE_VIEW: 'SET_INCOMES_TO_BALANCE_VIEW',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_BALANCE_VIEW: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_BALANCE_VIEW',
    SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_BALANCE_VIEW: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_BALANCE_VIEW',
    SET_PAGINATION_PARAMS_OF_TABLE_OF_SALES_IN_SALES_VIEW: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_SALES_IN_SALES_VIEW',
    SET_PERIOD_PROFIT: 'SET_PERIOD_PROFIT',
    SET_REFERENCE_STATISTICS: 'SET_REFERENCE_STATISTICS',
    SET_SALES_TO_SALES_VIEW: 'SET_SALES_TO_SALES_VIEW',
    SET_SALES_VIEW_TOTALS: 'SET_SALES_VIEW_TOTALS',
    SET_STATISTIC_TO_BALANCE_VIEW: 'SET_STATISTIC_TO_BALANCE_VIEW',
    SET_STATISTIC_TO_SALES_VIEW: 'SET_STATISTIC_TO_SALES_VIEW',
    SHOW_FIX_STATISTICS_MODAL: 'SHOW_FIX_STATISTICS_MODAL',
    SHOW_NULL_RECORDS: 'SHOW_NULL_RECORDS',
    UPDATE_DATE_PICKERS_VALUES: 'UPDATE_DATE_PICKERS_VALUES'
}

const initialState = {
    datePickersValues: {
        day_datePicker: null,
        day_rangePicker: null,
        month_datePicker: null,
        month_rangePicker: null,
        profit_rangePicker: null
    },
    fixStatisticsModalIsVisible: false,
    loading: true,
    paginationParams: {
        filters: {
            balanceViewProfit: { $ne: 0 },
            date: null,
            dateString: null,
            salesViewProfit: { $ne: 0 }
        },
        limit: 10,
        page: 1
    },
    params: {
        balanceViewExpense: 0,
        balanceViewIncome: 0,
        balanceViewProfit: 0,
        concept: '',
        date: null,
        dateOrder: null,
        dateString: null,
        salesViewExpense: 0,
        salesViewIncome: 0,
        salesViewProfit: 0
    },
    periodProfit: null,
    recordsToRender: null,
    referenceStatistics: {
        concept: '',
        balanceViewProfit: 0,
        dateString: null
    },
    showNullRecords: false,
    statisticsView: {
        balanceView: {
            tableOfExpenses: {
                expenses: [],
                loading: true,
                paginationParams: {
                    limit: 5,
                    page: 1
                },
                totalExpensesRecords: 0
            },
            tableOfIncomes: {
                incomes: [],
                loading: true,
                paginationParams: {
                    limit: 5,
                    page: 1
                },
                totalIncomesRecords: 0
            },
            statisticToViewDetails: null,
            modalVisibility: false
        },
        salesView: {
            modalVisibility: false,
            statisticToViewDetails: null,
            tableOfSales: {
                sales: [],
                loading: true,
                paginationParams: {
                    limit: 5,
                    page: 1
                },
                totalSalesRecords: 0
            },
            totalExpense: 0,
            totalProfit: 0,
            totalSalePrices: 0
        }
    },
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
                        balanceViewProfit: { $ne: 0 },
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
                    balanceViewExpense: 0,
                    balanceViewIncome: 0,
                    balanceViewProfit: 0
                }
            }
        case actions.CLEAR_STATE:
            return initialState
        case actions.HIDE_BALANCE_VIEW_MODAL:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    balanceView: {
                        ...state.statisticsView.balanceView,
                        statisticToViewDetails: null,
                        modalVisibility: false
                    }
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
        case actions.HIDE_SALES_VIEW_MODAL:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    salesView: {
                        ...state.statisticsView.salesView,
                        statisticToViewDetails: null,
                        modalVisibility: false
                    }
                }
            }
        case actions.SAVE_DAILY_STATISTICS:
            return {
                ...state,
                params: {
                    ...state.params,
                    concept: action.payload.concept,
                    balanceViewExpense: action.payload.balanceViewExpense,
                    balanceViewIncome: action.payload.balanceViewIncome,
                    balanceViewProfit: action.payload.balanceViewIncome - action.payload.balanceViewExpense
                }
            }
        case actions.SET_DAILY_STATISTICS_RECORDS:
            return {
                ...state,
                recordsToRender: action.payload.docs,
                totalRecords: parseInt(action.payload.totalDocs),
                loading: false
            }
        case actions.SET_EXPENSES_TO_BALANCE_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    balanceView: {
                        ...state.statisticsView.balanceView,
                        tableOfExpenses: {
                            ...state.statisticsView.balanceView.tableOfExpenses,
                            expenses: action.payload.expenses,
                            loading: false,
                            totalExpensesRecords: action.payload.totalExpensesRecords
                        }
                    }
                }
            }
        case actions.SET_INCOMES_TO_BALANCE_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    balanceView: {
                        ...state.statisticsView.balanceView,
                        tableOfIncomes: {
                            ...state.statisticsView.balanceView.tableOfIncomes,
                            incomes: action.payload.incomes,
                            loading: false,
                            totalIncomesRecords: action.payload.totalIncomesRecords
                        }
                    }
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
        case actions.SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_BALANCE_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    balanceView: {
                        ...state.statisticsView.balanceView,
                        tableOfExpenses: {
                            ...state.statisticsView.balanceView.tableOfExpenses,
                            paginationParams: action.payload
                        }
                    }
                }
            }
        case actions.SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_BALANCE_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    balanceView: {
                        ...state.statisticsView.balanceView,
                        tableOfIncomes: {
                            ...state.statisticsView.balanceView.tableOfIncomes,
                            paginationParams: action.payload
                        }
                    }
                }
            }
        case actions.SET_PAGINATION_PARAMS_OF_TABLE_OF_SALES_IN_SALES_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    salesView: {
                        ...state.statisticsView.salesView,
                        tableOfSales: {
                            ...state.statisticsView.salesView.tableOfSales,
                            paginationParams: action.payload
                        }
                    }
                }
            }
        case actions.SET_PERIOD_PROFIT:
            return {
                ...state,
                periodProfit: action.payload
            }
        case actions.SET_REFERENCE_STATISTICS:
            const referenceStatistics = {
                concept: action.payload.concept,
                balanceViewProfit: action.payload.balanceViewProfit,
                dateString: action.payload.dateString,
                salesViewProfit: action.payload.salesViewProfit
            }
            return {
                ...state,
                params: {
                    ...state.params,
                    date: action.payload.date,
                    dateOrder: numberOrderDate(action.payload.dateString.substring(0, 10)),
                    dateString: action.payload.dateString
                },
                referenceStatistics
            }
        case actions.SET_SALES_TO_SALES_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    salesView: {
                        ...state.statisticsView.salesView,
                        tableOfSales: {
                            ...state.statisticsView.salesView.tableOfSales,
                            sales: action.payload.sales,
                            loading: false,
                            totalSalesRecords: action.payload.totalSalesRecords
                        }
                    }
                }
            }
        case actions.SET_SALES_VIEW_TOTALS:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    salesView: {
                        ...state.statisticsView.salesView,
                        totalExpense: action.payload.totalSalesViewExpense,
                        totalProfit: action.payload.totalSalesViewProfit,
                        totalSalePrices: action.payload.totalSalesViewSalePrices
                    }
                }
            }
        case actions.SET_STATISTIC_TO_BALANCE_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    balanceView: {
                        ...state.statisticsView.balanceView,
                        statisticToViewDetails: action.payload,
                        modalVisibility: true
                    }
                }
            }
        case actions.SET_STATISTIC_TO_SALES_VIEW:
            return {
                ...state,
                statisticsView: {
                    ...state.statisticsView,
                    salesView: {
                        ...state.statisticsView.salesView,
                        statisticToViewDetails: action.payload,
                        modalVisibility: true
                    }
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
                    : ['', ''],
                profit_rangePicker: pickerType === 'profit_rangePicker' && !pickerValue.includes('')
                    ? [dayjs(pickerValue[0], 'DD-MM-YYYY'), dayjs(pickerValue[1], 'DD-MM-YYYY')]
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