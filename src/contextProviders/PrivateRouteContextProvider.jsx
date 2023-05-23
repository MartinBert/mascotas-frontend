import { createContext, useContext, useEffect, useReducer } from 'react'
import reducers from '../reducers'

const createPrivateRouteContext = createContext()
const { initialState, reducer } = reducers.privateRouteReducer

const usePrivateRouteContext = () => {
    return useContext(createPrivateRouteContext)
}

const PrivateRouteContext = ({ children }) => {
    const [privateRoute_state, privateRoute_dispatch] = useReducer(reducer, initialState)
    useEffect(() => {
        // console.log(privateRoute_state)
    }, [privateRoute_state])

    return (
        <createPrivateRouteContext.Provider value={[privateRoute_state, privateRoute_dispatch]}>
            {children}
        </createPrivateRouteContext.Provider>
    )
}

const PrivateRouteContextProvider = {
    PrivateRouteContext,
    usePrivateRouteContext
}

export default PrivateRouteContextProvider