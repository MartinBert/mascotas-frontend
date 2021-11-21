import axios from 'axios';

const getAll = async(params) => {
    const {page, limit, filters} = params;
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/rubros?page=${page}&limit=${limit}&filters=${filters}`);
        console.log(response);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/rubros/${id}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const getByName = async(name) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/rubros/name/${name}`);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const save = async(rubro) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/rubros`, rubro);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const edit = async(rubro) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/rubros/${rubro._id}`, rubro);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const deleteRubro = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/rubros/${id}`);
        return response.data.message;
    }catch(err){
        console.error(err);
    }
}

const rubros = {
    getAll,
    getById,
    getByName,
    save,
    edit,
    deleteRubro
}

export default rubros;