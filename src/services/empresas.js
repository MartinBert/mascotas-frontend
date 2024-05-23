import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const deleteEmpresa = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/empresas/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(empresa) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/empresas/${empresa._id}`, empresa, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAll = async() => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/empresas`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAllByFilters = async (filters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/documentos?filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/empresas/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async(ids) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findPaginated = async(params) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/empresas?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(empresa) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/empresas`, empresa, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const empresas = {
    deleteEmpresa,
    edit,
    findAll,
    findAllByFilters,
    findById,
    findMultipleIds,
    findPaginated,
    save
}

export default empresas