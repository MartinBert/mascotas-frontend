import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateRenderConditionsContext = createContext()
const { initialState, reducer } = reducers.renderConditions

const useRenderConditionsContext = () => {
    return useContext(CreateRenderConditionsContext)
}

const RenderConditionsContext = ({ children }) => {
    const [renderConditions_state, renderConditions_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateRenderConditionsContext.Provider value={[renderConditions_state, renderConditions_dispatch]}>
            {children}
        </CreateRenderConditionsContext.Provider>
    )
}

const RenderConditions = {
    RenderConditionsContext,
    useRenderConditionsContext
}

export default RenderConditions