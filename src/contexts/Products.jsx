import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductsContext = createContext()
const { initialState, reducer } = reducers.products

const useProductsContext = () => {
    return useContext(CreateProductsContext)
}

const ProductsContext = ({ children }) => {
    const [products_state, products_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateProductsContext.Provider value={[products_state, products_dispatch]}>
            {children}
        </CreateProductsContext.Provider>
    )
}

const Products = {
    ProductsContext,
    useProductsContext
}

export default Products