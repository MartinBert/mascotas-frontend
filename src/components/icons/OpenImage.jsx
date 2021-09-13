import React from 'react';
import { FaImage } from 'react-icons/fa';

const OpenImage = ({title}) => {
    return (
        <FaImage
            title={title} 
            style={{cursor: 'pointer'}}
        />
    )
}

export default OpenImage;