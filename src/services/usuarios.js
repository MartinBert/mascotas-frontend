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

const save = async(usuario) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/usuarios`, usuario);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const edit = async(usuario) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/usuarios/${usuario._id}`, usuario);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const deleteUsuario = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/usuarios/${id}`);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const usuarios = {
    getAll,
    getById,
    save,
    edit,
    deleteUsuario
}

export default usuarios;