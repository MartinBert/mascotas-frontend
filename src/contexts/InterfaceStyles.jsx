import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateInterfaceStylesContext = createContext()
const { initialState, reducer } = reducers.interfaceStyles

const useInterfaceStylesContext = () => {
    return useContext(CreateInterfaceStylesContext)
}

const InterfaceStylesContext = ({ children }) => {
    const [interfaceStyles_state, interfaceStyles_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateInterfaceStylesContext.Provider value={[interfaceStyles_state, interfaceStyles_dispatch]}>
            {children}
        </CreateInterfaceStylesContext.Provider>
    )
}

const InterfaceStyles = {
    InterfaceStylesContext,
    useInterfaceStylesContext
}

export default InterfaceStyles