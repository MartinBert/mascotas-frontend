import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductEntriesContext = createContext()
const { initialState, reducer } = reducers.productEntries

const useProductEntriesContext = () => {
    return useContext(CreateProductEntriesContext)
}

const ProductEntriesContext = ({ children }) => {
    const [productEntries_state, productEntries_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateProductEntriesContext.Provider value={[productEntries_state, productEntries_dispatch]}>
            {children}
        </CreateProductEntriesContext.Provider>
    )
}

const ProductEntries = {
    ProductEntriesContext,
    useProductEntriesContext
}

export default ProductEntries