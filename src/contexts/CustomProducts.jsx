import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateCustomProductsContext = createContext()
const { initialState, reducer } = reducers.customSaleProducts

const useCustomProductsContext = () => {
    return useContext(CreateCustomProductsContext)
}

const CustomProductsContext = ({ children }) => {
    const [customProducts_state, customProducts_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateCustomProductsContext.Provider value={[customProducts_state, customProducts_dispatch]}>
            {children}
        </CreateCustomProductsContext.Provider>
    )
}

const CustomProducts = {
    CustomProductsContext,
    useCustomProductsContext
}

export default CustomProducts