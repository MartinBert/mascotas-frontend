import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}


const findAll = async (params) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try {
        if (!params) {
            const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas`, headers)
            return response.data
        } else {
            const { page, limit, filters } = params
            const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas?page=${page}&limit=${limit}&filters=${filters}`, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas?initialDate=${initialDate}&finalDate=${finalDate}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async (id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async (ids) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async (entrada) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/entradas`, entrada, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async (entrada) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/entradas`, entrada, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async (id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/entradas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const entradas = {
    findAll,
    findByDates,
    findById,
    findMultipleIds,
    save,
    edit,
    deleteById
}

export default entradas