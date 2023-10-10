// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../../components/alerts'
import icons from '../../../components/icons'

// Custom Contexts
import actions from '../../../actions'
import contexts from '../../../contexts'

// Services
import api from '../../../services'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { Delete } = icons

const findEntryToDelete = async (entryID) => {
    const findEntry = await api.entradas.findById(entryID)
    const entry = findEntry.data
    return entry
}

const fixStock = async (entryToDelete) => {
    for (let productOfEntry of entryToDelete.productos) {
        const findProduct = await api.productos.findById(productOfEntry._id)
        const product = await findProduct.data
        await api.productos.modifyStock({
            product,
            isIncrement: false,
            quantity: productOfEntry.cantidadesEntrantes
        })
    }
}


const DeleteEntry = () => {
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()

    const deleteEntry = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'OK') {
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const entryToDelete = await findEntryToDelete(deleteModal_state.entityID)
            fixStock(entryToDelete)
            await api.entradas.deleteById(deleteModal_state.entityID)
                .then(deleteModal_dispatch({ type: 'CLEAN_STATE' }))
        }
    }

    useEffect(() => {
        deleteEntry()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    return <Delete />
}

export default DeleteEntry