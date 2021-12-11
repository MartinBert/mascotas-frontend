import React from 'react';
import { FaTrash } from 'react-icons/fa';

const Delete = () => {
    return (
        <FaTrash
            size={20}
            title="Eliminar"
            style={{cursor: 'pointer'}}
            color="#ff4d4f"
        />
    )
}

export default Delete;