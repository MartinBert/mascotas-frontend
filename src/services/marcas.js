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

const marcas = {
    getAll,
    getById,
    getByName
}

export default marcas;