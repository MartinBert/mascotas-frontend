import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateBenefitsContext = createContext()
const { initialState, reducer } = reducers.benefits

const useBenefitsContext = () => {
    return useContext(CreateBenefitsContext)
}

const BenefitsContext = ({ children }) => {
    const [benefits_state, benefits_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateBenefitsContext.Provider value={[benefits_state, benefits_dispatch]}>
            {children}
        </CreateBenefitsContext.Provider>
    )
}

const Benefits = {
    BenefitsContext,
    useBenefitsContext
}

export default Benefits