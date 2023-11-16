import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const deleteUsuario = async(id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/usuarios/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(usuario) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/usuarios/${usuario._id}`, usuario, headers)
        return response.data.message
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAll = async() => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/usuarios`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async(id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/usuarios/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async(ids) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findPaginated = async(params) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/usuarios?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(usuario) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/usuarios`, usuario, headers)
        return response.data.message
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const usuarios = {
    deleteUsuario,
    edit,
    findAll,
    findById,
    findMultipleIds,
    findPaginated,
    save
}

export default usuarios