import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateProductOutputsContext = createContext()
const { initialState, reducer } = reducers.outputs

const useOutputsContext = () => {
    return useContext(CreateProductOutputsContext)
}

const OutputsContext = ({ children }) => {
    const [outputs_state, outputs_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateProductOutputsContext.Provider value={[outputs_state, outputs_dispatch]}>
            {children}
        </CreateProductOutputsContext.Provider>
    )
}

const Outputs = {
    OutputsContext,
    useOutputsContext
}

export default Outputs