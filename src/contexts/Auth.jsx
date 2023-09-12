import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateAuthContext = createContext()
const { initialState, reducer } = reducers.auth

const useAuthContext = () => {
    return useContext(CreateAuthContext)
}

const AuthContext = ({ children }) => {
    const [auth_state, auth_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateAuthContext.Provider value={[auth_state, auth_dispatch]}>
            {children}
        </CreateAuthContext.Provider>
    )
}

const Auth = {
    AuthContext,
    useAuthContext
}

export default Auth