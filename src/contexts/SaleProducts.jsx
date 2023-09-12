import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateSaleProductsContext = createContext()
const { initialState, reducer } = reducers.saleProducts

const useSaleProductsContext = () => {
    return useContext(CreateSaleProductsContext)
}

const SaleProductsContext = ({ children }) => {
    const [saleProducts_state, saleProducts_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateSaleProductsContext.Provider value={[saleProducts_state, saleProducts_dispatch]}>
            {children}
        </CreateSaleProductsContext.Provider>
    )
}

const SaleProducts = {
    SaleProductsContext,
    useSaleProductsContext
}

export default SaleProducts