import React from 'react'
import { FaFilePdf } from 'react-icons/fa'

const PrintPdf = () => {
    return (
        <FaFilePdf
            title='Imprimir' 
            style={{ cursor: 'pointer', fontSize: '20px' }}
            color='#1890ff'
        />
    )
}

export default PrintPdf