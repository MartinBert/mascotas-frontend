import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateSalePointContext = createContext()
const { initialState, reducer } = reducers.salePoint

const useSalePointContext = () => {
    return useContext(CreateSalePointContext)
}

const SalePointContext = ({ children }) => {
    const [salePoint_state, salePoint_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateSalePointContext.Provider value={[salePoint_state, salePoint_dispatch]}>
            {children}
        </CreateSalePointContext.Provider>
    )
}

const SalePoint = {
    SalePointContext,
    useSalePointContext
}

export default SalePoint