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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/unidadesmedida?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/unidadesmedida/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/unidadesmedida/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(unidadmedida) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/unidadesmedida`, unidadmedida, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(unidadmedida) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/unidadesmedida/${unidadmedida._id}`, unidadmedida, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteUnidadMedida = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/unidadesmedida/${id}`, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const unidadesmedida = {
    getAll,
    getById,
    getByName,
    save,
    edit,
    deleteUnidadMedida
}

export default unidadesmedida;