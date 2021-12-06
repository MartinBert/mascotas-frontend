import axios from 'axios';
import FormData from 'form-data';
const token = localStorage.getItem('token');
const headers = {headers: {Authorization: token, 'Content-Type':'application/json'}};
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear();
    }
}

const uploadImage = async(data) => {
    const bodyMultiPart = new FormData();
    bodyMultiPart.append('file', data);
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/uploads`, bodyMultiPart, headers)
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getImageUrl = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/uploads/${id}`, headers)
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteImage = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/uploads/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const uploader = {
    uploadImage,
    getImageUrl,
    deleteImage
}

export default uploader;