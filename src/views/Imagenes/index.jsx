import React from 'react';
import { useParams } from 'react-router-dom';

const Imagenes = () => {
    const { image } = useParams();
    return (
        <img src={'/images/'+image}/>
    )
}

export default Imagenes;