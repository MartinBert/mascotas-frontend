import { createContext, useReducer, useContext } from 'react'
import storeReducer from './reducer'

const CreateStoreContext = createContext()
const { actions, initialState, params, reducer } = storeReducer

const useStoreContext = () => {
    return useContext(CreateStoreContext)
}

const StoreContext = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const providerValue = { actions, dispatch, params, state }
    
    return (
        <CreateStoreContext.Provider value={providerValue}>
            {children}
        </CreateStoreContext.Provider>
    )
}

const Store = {
    StoreContext,
    useStoreContext
}

export default Store