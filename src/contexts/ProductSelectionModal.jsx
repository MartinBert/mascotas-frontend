import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductSelectionModalContext = createContext()
const { initialState, reducer } = reducers.productSelectionModal

const useProductSelectionModalContext = () => {
    return useContext(CreateProductSelectionModalContext)
}

const ProductSelectionModalContext = ({ children }) => {
    const [
        productSelectionModal_state,
        productSelectionModal_dispatch
    ] = useReducer(reducer, initialState)

    return (
        <CreateProductSelectionModalContext.Provider
            value={[productSelectionModal_state, productSelectionModal_dispatch]}>
            {children}
        </CreateProductSelectionModalContext.Provider>
    )
}

const ProductSelectionModal = {
    ProductSelectionModalContext,
    useProductSelectionModalContext
}

export default ProductSelectionModal