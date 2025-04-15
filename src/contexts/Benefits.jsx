import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateBenefitsContext = createContext()
const {
    actions: benefits_actions,
    initialState,
    paramsStatus: benefits_paramStatus,
    reducer
} = reducers.benefits

const useBenefitsContext = () => {
    return useContext(CreateBenefitsContext)
}

const BenefitsContext = ({ children }) => {
    const [benefits_state, benefits_dispatch] = useReducer(reducer, initialState)
    const providerValue = {
        benefits_actions,
        benefits_dispatch,
        benefits_paramStatus,
        benefits_state
    }
    
    return (
        <CreateBenefitsContext.Provider value={providerValue}>
            {children}
        </CreateBenefitsContext.Provider>
    )
}

const Benefits = {
    BenefitsContext,
    useBenefitsContext
}

export default Benefits