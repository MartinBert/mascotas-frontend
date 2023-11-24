const actions = {
    CLEAN_STATE: 'CLEAN_STATE',
    CALCULATE_DAILY_STATISTICS: 'CALCULATE_DAILY_STATISTICS',
}

const initialState = {
    dailyExpense: 0,
    dailyIncome: 0,
    dailyProfit: 0,
    date: new Date()
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAN_STATE:
            return initialState
        case actions.CALCULATE_DAILY_STATISTICS:
            const dailyExpense = action.payload.dailyExpense
            const dailyIncome = action.payload.dailyIncome
            const dailyProfit = action.payload.dailyProfit
            return {
                ...state,
                dailyExpense: dailyExpense,
                dailyIncome: dailyIncome,
                dailyProfit: dailyProfit
            }
        default:
            return state;
    }
}

const dailyBusinessStatistics = {
    actions,
    initialState,
    reducer
}

export default dailyBusinessStatistics