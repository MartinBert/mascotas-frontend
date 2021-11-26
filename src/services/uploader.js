import axios from 'axios';

const uploadImage = async(obj) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/uploads`, obj, {
            file: obj
        });
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

const uploader = {
    uploadImage,
    getImageUrl
}

export default uploader;