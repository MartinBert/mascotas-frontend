import { createContext, useContext, useReducer } from 'react'
import reducers from '../reducers'

const CreatePrivateRouteContext = createContext()
const { initialState, reducer } = reducers.privateRoute

const usePrivateRouteContext = () => {
    return useContext(CreatePrivateRouteContext)
}

const PrivateRouteContext = ({ children }) => {
    const [privateRoute_state, privateRoute_dispatch] = useReducer(reducer, initialState)
    return (
        <CreatePrivateRouteContext.Provider value={[privateRoute_state, privateRoute_dispatch]}>
            {children}
        </CreatePrivateRouteContext.Provider>
    )
}

const PrivateRoute = {
    PrivateRouteContext,
    usePrivateRouteContext
}

export default PrivateRoute