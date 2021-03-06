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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const findById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/${id}`, headers);
        return response;
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(mediopago) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/mediospago`, mediopago, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(mediopago) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/mediospago/${mediopago._id}`, mediopago, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteMedioPago = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/mediospago/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const mediospago = {
    findAll,
    findById,
    findMultipleIds,
    findByName,
    save,
    edit,
    deleteMedioPago
}

export default mediospago;