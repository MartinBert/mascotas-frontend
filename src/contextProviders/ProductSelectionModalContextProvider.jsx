import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductSelectionModalContext = createContext()
const { initialState, reducer } = reducers.productSelectionModal

const useProductSelectionModalContext = () => {
    return useContext(CreateProductSelectionModalContext)
}

const ProductSelectionModalContext = ({ children }) => {
    const [product_state, product_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateProductSelectionModalContext.Provider value={[product_state, product_dispatch]}>
            {children}
        </CreateProductSelectionModalContext.Provider>
    )
}

const ProductSelectionModalContextProvider = {
    ProductSelectionModalContext,
    useProductSelectionModalContext
}

export default ProductSelectionModalContextProvider