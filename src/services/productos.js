import axios from 'axios';

const getAll = async(params) => {
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/productos?page=${page}&limit=${limit}&filters=${filters}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/productos/${id}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getByBarcode = async(barcode) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/productos/barcode/${barcode}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const deleteById = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/productos/${id}`);
        return response;
    }catch(err){
        console.error(err);
    }
}

const save = async(producto) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/productos`, producto);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const edit = async(producto) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/productos`, producto);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const productos = {
    getAll,
    getById,
    getByBarcode,
    deleteById,
    save,
    edit
}

export default productos;