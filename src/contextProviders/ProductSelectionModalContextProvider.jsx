import { createContext, useReducer, useContext, useEffect } from 'react'
import reducers from '../reducers'
// import api from '../services'

const createProductSelectionModalContext = createContext()
const { initialState, reducer } = reducers.productSelectionModalReducer

const useProductSelectionModalContext = () => {
    return useContext(createProductSelectionModalContext)
}

const ProductSelectionModalContext = ({ children }) => {
    const [product_state, product_dispatch] = useReducer(reducer, initialState)
    useEffect(() => {
        // console.log(product_state)
    }, [product_state])

    return (
        <createProductSelectionModalContext.Provider value={[product_state, product_dispatch]}>
            {children}
        </createProductSelectionModalContext.Provider>
    )
}

const ProductSelectionModalContextProvider = {
    ProductSelectionModalContext,
    useProductSelectionModalContext
}

export default ProductSelectionModalContextProvider