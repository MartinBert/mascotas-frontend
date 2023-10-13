import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateSalesAreasContext = createContext()
const { initialState, reducer } = reducers.salesAreas

const useSalesAreasContext = () => {
    return useContext(CreateSalesAreasContext)
}

const SalesAreasContext = ({ children }) => {
    const [
        salesAreas_state,
        salesAreas_dispatch
    ] = useReducer(reducer, initialState)

    return (
        <CreateSalesAreasContext.Provider
            value={[salesAreas_state, salesAreas_dispatch]}
        >
            {children}
        </CreateSalesAreasContext.Provider>
    )
}

const SalesAreas = {
    SalesAreasContext,
    useSalesAreasContext
}

export default SalesAreas