import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateDailyBusinessStatisticsContext = createContext()
const { initialState, reducer } = reducers.dailyBusinessStatistics

const useDailyBusinessStatisticsContext = () => {
    return useContext(CreateDailyBusinessStatisticsContext)
}

const DailyBusinessStatisticsContext = ({ children }) => {
    const [
        dailyBusinessStatistics_state,
        dailyBusinessStatistics_dispatch
    ] = useReducer(reducer, initialState)

    return (
        <CreateDailyBusinessStatisticsContext.Provider
            value={[
                dailyBusinessStatistics_state,
                dailyBusinessStatistics_dispatch
            ]}
        >
            {children}
        </CreateDailyBusinessStatisticsContext.Provider>
    )
}

const DailyBusinessStatistics = {
    DailyBusinessStatisticsContext,
    useDailyBusinessStatisticsContext
}

export default DailyBusinessStatistics