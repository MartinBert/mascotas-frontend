import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}


const findAll = async(params) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
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
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
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
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/${id}`, headers)
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

const save = async(salida) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/salidas`, salida, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(salida) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/salidas`, salida, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
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