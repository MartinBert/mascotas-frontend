import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductOutputsContext = createContext()
const { initialState, reducer } = reducers.productOutputs

const useProductOutputsContext = () => {
    return useContext(CreateProductOutputsContext)
}

const ProductOutputsContext = ({ children }) => {
    const [productOutputs_state, productOutputs_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateProductOutputsContext.Provider value={[productOutputs_state, productOutputs_dispatch]}>
            {children}
        </CreateProductOutputsContext.Provider>
    )
}

const ProductOutputs = {
    ProductOutputsContext,
    useProductOutputsContext
}

export default ProductOutputs