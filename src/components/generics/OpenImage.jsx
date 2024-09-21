import React from 'react'

const OpenImage = ({ alt, imageUrl }) => {
    return (
        <a
            href={imageUrl}
            rel='noreferrer'
            target='_blank'
        >
            <img
                alt={alt}
                crossOrigin='anonymous'
                height='70'
                src={imageUrl}
                style={{ cursor: 'pointer' }}
                width='70'
            />
        </a>
    )
}

export default OpenImage