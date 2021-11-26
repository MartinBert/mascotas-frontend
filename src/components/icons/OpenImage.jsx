import React, { useEffect, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import api from '../../services';
import graphics from '../graphics';

const { Spinner } = graphics;

const OpenImage = ({title, imageId}) => {
    const [imageUrl, setImageUrl] = useState();
     
    useEffect(() => {
        const fetchImageUrl = async() => {
            console.log('IMAGE ID: ' + imageId);
            const response = await api.uploader.getImageUrl(imageId)
            setImageUrl(response);
        } 
        fetchImageUrl()
    })

    return (
        (imageUrl ? 
            <a href={imageUrl} target='_blank'>
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