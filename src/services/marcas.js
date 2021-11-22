import axios from 'axios';

const getAll = async(params) => {
    const {page, limit, filters} = params;
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/marcas?page=${page}&limit=${limit}&filters=${filters}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/marcas/${id}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/marcas/name/${name}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const save = async(marca) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/marcas`, marca);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const edit = async(marca) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/marcas/${marca._id}`, marca);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const deleteMarca = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/marcas/${id}`);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const marcas = {
    getAll,
    getById,
    getByName,
    save,
    edit,
    deleteMarca
}

export default marcas;