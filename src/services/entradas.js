import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const countRecords = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/recordsInfo/quantity`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/entradas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async (entrada) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/entradas`, entrada, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const editAll = async (entries) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const lotsLimit = 5
        const loopLimit = entries.length / lotsLimit
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = entries.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.put(`${process.env.REACT_APP_API_REST}/entradas/entries/edit_all`, lot, headers)
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

const findAll = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAllByFilters = async (filters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas?filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async (ids) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findNewerRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/recordsInfo/newer`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findOldestRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas/recordsInfo/oldest`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findPaginated = async (params) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    const { page, limit, filters } = params
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/entradas?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async (entrada) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/entradas`, entrada, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const entradas = {
    countRecords,
    deleteById,
    edit,
    editAll,
    findAll,
    findAllByFilters,
    findById,
    findMultipleIds,
    findNewerRecord,
    findOldestRecord,
    findPaginated,
    save
}

export default entradas