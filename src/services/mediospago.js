import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const deleteMedioPago = async(id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/mediospago/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(mediopago) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/mediospago/${mediopago._id}`, mediopago, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAll = async() => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async(id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/${id}`, headers)
        return response
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findByName = async(name) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/name/${name}`, headers)
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

const findPaginated = async (params) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    const { page, limit, filters } = params
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(mediopago) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/mediospago`, mediopago, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const mediospago = {
    deleteMedioPago,
    edit,
    findAll,
    findById,
    findByName,
    findMultipleIds,
    findPaginated,
    save
}

export default mediospago