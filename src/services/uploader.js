import axios from 'axios'
import FormData from 'form-data'
// var FormData = require('form-data')

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const deleteImage = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token'), 'Content-Type':'application/json'}}
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/uploads/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const getImageUrl = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token'), 'Content-Type':'application/json'}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/uploads/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const uploadImage = async(data) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    const bodyMultiPart = new FormData()
    bodyMultiPart.append('file', data)
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/uploads`, bodyMultiPart, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const uploader = {
    deleteImage,
    getImageUrl,
    uploadImage
}

export default uploader