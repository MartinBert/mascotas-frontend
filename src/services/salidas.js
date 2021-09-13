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

const salidas = {
    getAll,
    getById
}

export default salidas;