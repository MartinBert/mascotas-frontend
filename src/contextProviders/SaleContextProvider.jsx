import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const createSaleContext = createContext()
const { initialState, reducer } = reducers.saleReducer

const useSaleContext = () => {
    return useContext(createSaleContext)
}

const SaleContext = ({ children }) => {
    const [sale_state, sale_dispatch] = useReducer(reducer, initialState)

    return (
        <createSaleContext.Provider value={[sale_state, sale_dispatch]}>
            {children}
        </createSaleContext.Provider>
    )
}

const SaleContextProvider = {
    SaleContext,
    useSaleContext
}

export default SaleContextProvider