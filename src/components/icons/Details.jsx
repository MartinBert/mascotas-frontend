import React from 'react'
import { FaEye } from 'react-icons/fa'

const Details = ({title}) => {
    return (
        <FaEye 
            title={title} 
            style={{ cursor: 'pointer', fontSize: '20px' }}
            color='#1890ff'
        />
    )
}

export default Details