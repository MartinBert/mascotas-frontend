import React from 'react';
import { FaFilePdf } from 'react-icons/fa';

const PrintPdf = () => {
    return (
        <FaFilePdf
            title='Imprimir' 
            style={{cursor: 'pointer'}}
            color='#1890ff'
        />
    )
}

export default PrintPdf;