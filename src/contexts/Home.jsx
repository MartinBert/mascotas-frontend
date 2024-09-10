import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateHomeContext = createContext()
const { initialState, reducer } = reducers.home

const useHomeContext = () => {
    return useContext(CreateHomeContext)
}

const HomeContext = ({ children }) => {
    const [home_state, home_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateHomeContext.Provider value={[home_state, home_dispatch]}>
            {children}
        </CreateHomeContext.Provider>
    )
}

const Home = {
    HomeContext,
    useHomeContext
}

export default Home