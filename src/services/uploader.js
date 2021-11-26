import axios from 'axios';

const uploadImage = async(obj) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/uploader`, obj, {
            file: obj
        });
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const uploader = {
    uploadImage
}

export default uploader;