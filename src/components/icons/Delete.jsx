import React from 'react'
import { FaTrash } from 'react-icons/fa'

const Delete = () => {
    return (
        <FaTrash
            color='#ff4d4f'
            style={{ cursor: 'pointer', fontSize: '20px' }}
            title='Eliminar'
        />
    )
}

export default Delete