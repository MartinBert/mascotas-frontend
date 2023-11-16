import { createContext, useReducer, useContext } from 'react'
import reducers from './../reducers'

const CreateFiscalNoteModalContext = createContext()
const { initialState, reducer } = reducers.fiscalNoteModal

const useFiscalNoteModalContext = () => {
    return useContext(CreateFiscalNoteModalContext)
}

const FiscalNoteModalContext = ({ children }) => {
    const [fiscalNoteModal_state, fiscalNoteModal_dispatch] = useReducer(reducer, initialState)

    return (
        <CreateFiscalNoteModalContext.Provider value={[fiscalNoteModal_state, fiscalNoteModal_dispatch]}>
            {children}
        </CreateFiscalNoteModalContext.Provider>
    )
}

const FiscalNoteModal = {
    FiscalNoteModalContext,
    useFiscalNoteModalContext
}

export default FiscalNoteModal