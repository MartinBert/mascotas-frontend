import React, { useEffect, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import api from '../../services';
import graphics from '../../components/graphics';

const { Spinner } = graphics;

const OpenImage = ({title, imageId}) => {
    const [imageUrl, setImageUrl] = useState();
     
    useEffect(() => {
        const fetchImageUrl = async() => {
            const response = await api.uploader.getImageUrl(imageId)
            setImageUrl(response);
        } 
        fetchImageUrl()
    })

    return (
        (imageUrl ? 
            <a href={imageUrl} target='_blank' rel="noreferrer">
                <FaImage
                    title={title} 
                    style={{cursor: 'pointer'}}
                />
            </a>
        :   <Spinner/> 
        )
    )
}

export default OpenImage;