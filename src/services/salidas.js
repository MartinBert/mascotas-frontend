import axios from 'axios';

const getAll = async(params) => {
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas?page=${page}&limit=${limit}&filters=${filters}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/${id}`);
        console.log(response.data)
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const save = async(salida) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/salidas`, salida);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const edit = async(salida) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/salidas`, salida);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const deleteById = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/salidas/${id}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const salidas = {
    getAll,
    getById,
    save,
    edit,
    deleteById
}

export default salidas;