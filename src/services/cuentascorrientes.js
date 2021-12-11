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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/cuentas_corrientes?page=${page}&limit=${limit}&filters=${filters}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/cuentas_corrientes/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const getByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/cuentas_corrientes/name/${name}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const save = async(customer) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/customers`, customer, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const edit = async(cuentaCorriente) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/cuentas_corrientes/${cuentaCorriente._id}`, cuentaCorriente, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const deleteCuentaCorriente = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/cuentas_corrientes/${id}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const cuentascorrientes = {
    getAll,
    getById,
    getByName,
    save,
    edit,
    deleteCuentaCorriente
}

export default cuentascorrientes;