import { createContext, useReducer, useContext } from 'react'
import reducers from '../reducers'

const CreateDeleteModalContext = createContext()
const { initialState, reducer } = reducers.deleteModal

const useDeleteModalContext = () => {
    return useContext(CreateDeleteModalContext)
}

const DeleteModalContext = ({ children }) => {
    const [deleteModal_state, deleteModal_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateDeleteModalContext.Provider value={[deleteModal_state, deleteModal_dispatch]}>
            {children}
        </CreateDeleteModalContext.Provider>
    )
}

const DeleteModal = {
    DeleteModalContext,
    useDeleteModalContext
}

export default DeleteModal