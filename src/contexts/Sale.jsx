import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateSaleContext = createContext()
const { initialState, reducer } = reducers.sale

const useSaleContext = () => {
    return useContext(CreateSaleContext)
}

const SaleContext = ({ children }) => {
    const [sale_state, sale_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateSaleContext.Provider value={[sale_state, sale_dispatch]}>
            {children}
        </CreateSaleContext.Provider>
    )
}

const Sale = {
    SaleContext,
    useSaleContext
}

export default Sale