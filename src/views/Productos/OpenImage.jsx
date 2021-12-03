import React, { useEffect } from 'react';
import { FaImage } from 'react-icons/fa';

const OpenImage = ({title, imageUrl}) => {
    useEffect(() => {
        console.log(imageUrl);
    })
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