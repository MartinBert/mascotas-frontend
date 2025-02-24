import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const deleteCliente = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/clientes/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(cliente) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/clientes/${cliente._id}`, cliente, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const editAll = async (clients) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const lotsLimit = 5
        const loopLimit = clients.length / lotsLimit
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = clients.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.put(`${process.env.REACT_APP_API_REST}/clientes/clients/edit_all`, lot, headers)
            responseData.push(response.data)
        }
        const response = {
            code: 200,
            data: responseData,
            status: 'OK'
        }
        return response
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAll = async() => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAllByFilters = async (filters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes?filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async(ids) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/clientes?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(cliente) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/clientes`, cliente, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const clientes = {
    deleteCliente,
    edit,
    editAll,
    findAll,
    findAllByFilters,
    findById,
    findMultipleIds,
    findPaginated,
    save,
}

export default clientes