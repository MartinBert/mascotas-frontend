import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const createLoggedUserContext = createContext()
const { initialState, reducer } = reducers.loggedUserReducer

const useLoggedUserContext = () => {
    return useContext(createLoggedUserContext)
}

const LoggedUserContext = ({ children }) => {
    const [loggedUser_state, loggedUser_dispatch] = useReducer(reducer, initialState)

    return (
        <createLoggedUserContext.Provider value={[loggedUser_state, loggedUser_dispatch]}>
            {children}
        </createLoggedUserContext.Provider>
    )
}

const LoggedUserContextProvider = {
    LoggedUserContext,
    useLoggedUserContext
}

export default LoggedUserContextProvider