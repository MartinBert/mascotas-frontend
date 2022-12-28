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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/documentos?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/documentos/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findMultipleIds = async(ids) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/multiple/idList?ids=${JSON.stringify(ids)}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/documentos/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(documento) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/documentos`, documento, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(documento) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/documentos/${documento._id}`, documento, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteDocumento = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/documentos/${id}`, headers);
        return response.data.message;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const documentos = {
    findAll,
    findById,
    findMultipleIds,
    findByName,
    save,
    edit,
    deleteDocumento
}

export default documentos;