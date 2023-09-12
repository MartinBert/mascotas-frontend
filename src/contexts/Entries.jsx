import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductEntriesContext = createContext()
const { initialState, reducer } = reducers.entries

const useEntriesContext = () => {
    return useContext(CreateProductEntriesContext)
}

const EntriesContext = ({ children }) => {
    const [entries_state, entries_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateProductEntriesContext.Provider value={[entries_state, entries_dispatch]}>
            {children}
        </CreateProductEntriesContext.Provider>
    )
}

const Entries = {
    EntriesContext,
    useEntriesContext
}

export default Entries