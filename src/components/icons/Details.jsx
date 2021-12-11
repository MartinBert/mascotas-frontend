import React from 'react';
import { FaEye } from 'react-icons/fa';

const Details = ({title}) => {
    return (
        <FaEye 
            size={22}
            title={title} 
            style={{cursor: 'pointer'}}
            color="#1890ff"            
        />
    )
}

export default Details;