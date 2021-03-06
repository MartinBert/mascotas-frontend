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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/empresas?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/empresas/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/empresas/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(empresa) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/empresas`, empresa, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(empresa) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/empresas/${empresa._id}`, empresa, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteEmpresa = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/empresas/${id}`, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const empresas = {
    findAll,
    findById,
    findByName,
    save,
    edit,
    deleteEmpresa
}

export default empresas;