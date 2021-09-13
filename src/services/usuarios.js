import axios from 'axios';

const getAll = async(params) => {
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/usuarios?page=${page}&limit=${limit}&filters=${filters}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/usuarios/${id}`);
        console.log(response.data)
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const usuarios = {
    getAll,
    getById
}

export default usuarios;