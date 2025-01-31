import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const countRecords = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/recordsInfo/quantity`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/salidas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deletePropsFromAll = async (propsToDelete) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/salidas/outputs/delete_props_from_all`, propsToDelete, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async (salida) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/salidas`, salida, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const editAll = async (outputs) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const lotsLimit = 5
        const loopLimit = outputs.length / lotsLimit
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = outputs.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.put(`${process.env.REACT_APP_API_REST}/salidas/outputs/edit_all`, lot, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAllByFilters = async (filters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas?filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async (ids) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findNewerRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/recordsInfo/newer`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findOldestRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas/recordsInfo/oldest`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findPaginated = async (params) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const { page, limit, filters } = params
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/salidas?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async (salida) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/salidas`, salida, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const salidas = {
    countRecords,
    deleteById,
    deletePropsFromAll,
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

export default salidas