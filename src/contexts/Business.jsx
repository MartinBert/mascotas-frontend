import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateBusinessContext = createContext()
const { initialState, reducer } = reducers.business

const useBusinessContext = () => {
    return useContext(CreateBusinessContext)
}

const BusinessContext = ({ children }) => {
    const [business_state, business_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateBusinessContext.Provider value={[business_state, business_dispatch]}>
            {children}
        </CreateBusinessContext.Provider>
    )
}

const Business = {
    BusinessContext,
    useBusinessContext
}

export default Business