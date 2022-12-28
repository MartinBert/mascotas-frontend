import React from 'react';
import { FaEye } from 'react-icons/fa';

const Details = ({title}) => {
    return (
        <FaEye 
            title={title} 
            style={{cursor: 'pointer'}}
            color='#1890ff'
        />
    )
}

export default Details;