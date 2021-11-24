import React from 'react';
import { useParams } from 'react-router-dom';

const Imagenes = () => {
    const { image } = useParams();
    return (
        <img src={'/images/'+image} alt="Mascota feliz"/>
    )
}

export default Imagenes;