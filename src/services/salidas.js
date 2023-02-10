import axios from 'axios'
const token = localStorage.getItem('token')
const headers = {headers: {Authorization: token}}
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const findAll = async(params) => {
    try {
        if (!params) {
            const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas`, headers)
            return response.data
        } else {
            const { page, limit, filters } = params
            const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas?page=${page}&limit=${limit}&filters=${filters}`, headers)
            return response.data
        }
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findByDates = async (params) => {
    const { initialDate, finalDate } = params
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas?initialDate=${initialDate}&finalDate=${finalDate}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async(id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async(ids) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(salida) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/salidas`, salida, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(salida) => {
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/salidas`, salida, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async(id) => {
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/salidas/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const salidas = {
    findAll,
    findByDates,
    findById,
    findMultipleIds,
    save,
    edit,
    deleteById
}

export default salidas