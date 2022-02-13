import React from 'react';
import { FaImage } from 'react-icons/fa';

const OpenImage = ({title, imageUrl}) => {
    return (
        <a href={imageUrl} target='_blank' rel="noreferrer">
            <FaImage
                title={title} 
                style={{cursor: 'pointer'}}
            />
        </a>
    )
}

export default OpenImage;