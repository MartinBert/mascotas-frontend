import axios from 'axios';
import FormData from 'form-data';

const uploadImage = async(data) => {
    const bodyMultiPart = new FormData();
    bodyMultiPart.append('file', data);
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/uploads`, bodyMultiPart, {
            'Content-Type' : 'multipart/form-data'
        })
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getImageUrl = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/uploads/${id}`)
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const deleteImage = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/uploads/${id}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const uploader = {
    uploadImage,
    getImageUrl,
    deleteImage
}

export default uploader;