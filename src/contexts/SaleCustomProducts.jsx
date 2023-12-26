import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateSaleCustomProductsContext = createContext()
const { initialState, reducer } = reducers.saleCustomProducts

const useSaleCustomProductsContext = () => {
    return useContext(CreateSaleCustomProductsContext)
}

const SaleCustomProductsContext = ({ children }) => {
    const [customProducts_state, customProducts_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateSaleCustomProductsContext.Provider value={[customProducts_state, customProducts_dispatch]}>
            {children}
        </CreateSaleCustomProductsContext.Provider>
    )
}

const SaleCustomProducts = {
    SaleCustomProductsContext,
    useSaleCustomProductsContext
}

export default SaleCustomProducts