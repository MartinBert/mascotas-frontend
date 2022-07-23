import axios from 'axios';
const token = localStorage.getItem('token');
const headers = {headers: {Authorization: token}};
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear();
    }
}

const findAll = async(params) => {
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(entrada) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/entradas`, entrada, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(entrada) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/entradas`, entrada, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteById = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/entradas/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const entradas = {
    findAll,
    findById,
    save,
    edit,
    deleteById
}

export default entradas;