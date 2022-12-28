import React from 'react';

const OpenImage = ({alt, imageUrl}) => {
    return (
        <a href={imageUrl} target='_blank' rel='noreferrer'>
            <img style={{cursor: 'pointer'}} width='70' height='70' src={imageUrl} alt={alt}/>
        </a>
    )
}

export default OpenImage;