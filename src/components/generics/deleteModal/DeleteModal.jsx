// React Components and Hooks
import React from 'react'

// Design Components
import { Modal } from 'antd'

// Custom Contexts
import contexts from '../../../contexts'

// Imports Destructuring
const { useDeleteModalContext } = contexts.DeleteModal


const DeleteModal = ({ title }) => {
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()

    const cancelDeletion = () => {
        deleteModal_dispatch({ type: 'HIDE_DELETE_MODAL' })
    }

    const confirmDeletion = () => {
        deleteModal_dispatch({ type: 'SET_CONFIRM_DELETION', payload: true })
        deleteModal_dispatch({ type: 'HIDE_DELETE_MODAL' })
    }

    return (
        <Modal
            title={title}
            open={deleteModal_state.modalIsVisible}
            onCancel={cancelDeletion}
            onOk={confirmDeletion}
            width={800}
        >
            <h3>Esta acción eliminará el registro, ¿desea continuar?</h3>
        </Modal>
    )
}

export default DeleteModal