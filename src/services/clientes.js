import axios from 'axios';
const token = localStorage.getItem('token');
const headers = {headers: {Authorization: token}};
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear();
    }
}

const getAll = async(params) => {
    const {page, limit, filters} = params;
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(cliente) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/clientes`, cliente, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(cliente) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/clientes/${cliente._id}`, cliente, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteCliente = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/clientes/${id}`, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const clientes = {
    getAll,
    getById,
    getByName,
    save,
    edit,
    deleteCliente
}

export default clientes;