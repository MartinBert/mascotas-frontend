import { createContext, useReducer, useContext, useEffect } from 'react'
import reducers from '../reducers'
// import api from '../services'

const createSaleContext = createContext()
const { initialState, reducer } = reducers.saleReducer

const useSaleContext = () => {
    return useContext(createSaleContext)
}

const SaleContext = ({ children }) => {
    const [sale_state, sale_dispatch] = useReducer(reducer, initialState)
    useEffect(() => {
        // console.log(sale_state)
    }, [sale_state])

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