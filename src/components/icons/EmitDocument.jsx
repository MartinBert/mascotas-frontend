import React from 'react'
import { FaPrint } from 'react-icons/fa'

const EmitDocument = () => {
    return (
        <FaPrint
            title='Emitir Documento' 
            style={{ cursor: 'pointer', fontSize: '20px' }}
            color='#ffb300'
        />
    )
}

export default EmitDocument