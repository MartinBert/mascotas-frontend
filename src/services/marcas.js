import axios from 'axios';
const token = localStorage.getItem('token');
const headers = {headers: {Authorization: token}};
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear();
    }
}

const findAll = async(params) => {
    const {page, limit, filters} = params;
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/marcas?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/marcas/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/marcas/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(marca) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/marcas`, marca, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(marca) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/marcas/${marca._id}`, marca, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteMarca = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/marcas/${id}`, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const marcas = {
    findAll,
    findById,
    findByName,
    save,
    edit,
    deleteMarca
}

export default marcas;