import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateGenericComponentsContext = createContext()
const {
    actions: genericComponents_actions,
    initialState,
    params: genericComponents_params,
    reducer
} = reducers.genericComponents

const useGenericComponentsContext = () => {
    return useContext(CreateGenericComponentsContext)
}

const GenericComponentsContext = ({ children }) => {
    const [genericComponents_state, genericComponents_dispatch] = useReducer(reducer, initialState)
    const providerValue = {
        genericComponents_actions,
        genericComponents_dispatch,
        genericComponents_params,
        genericComponents_state
    }

    return (
        <CreateGenericComponentsContext.Provider value={providerValue}>
            {children}
        </CreateGenericComponentsContext.Provider>
    )
}

const GenericComponents = {
    GenericComponentsContext,
    useGenericComponentsContext
}

export default GenericComponents