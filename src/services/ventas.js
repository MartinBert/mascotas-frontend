import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const countRecords = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/recordsInfo/quantity`, headers)
        return response.data
    } catch (err) {
        console.error(err)
    }
}

const deleteById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/ventas/${id}`, headers)
        return response.data.message
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deletePropsFromAll = async (propsToDelete) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/ventas/sales/delete_props_from_all`, propsToDelete, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deletePropsFromAllLines = async (propsToDelete) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/ventas/sales/lines/delete_props_from_all`, propsToDelete, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async (venta) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/ventas/${venta._id}`, venta, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const editAll = async (sales) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const lotsLimit = 5
        const loopLimit = sales.length / lotsLimit
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = sales.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.put(`${process.env.REACT_APP_API_REST}/ventas/sales/edit_all`, lot, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAllByFilters = async (filters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/getAllByFilters?filters=${filters}`, headers)
        return response
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findLastIndex = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/last/index/number`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findLastVoucherNumber = async (code) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/last/voucher/number/${code}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async (ids) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findNewerRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/recordsInfo/newer`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findNewerSale = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/salesInfo/newer`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findOldestRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/recordsInfo/oldest`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findOldestSale = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/salesInfo/oldest`, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async (venta) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/ventas`, venta, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const saveAll = async (sales) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const lotsLimit = 10
        const loopLimit = sales.length / lotsLimit
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = sales.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.post(`${process.env.REACT_APP_API_REST}/ventas/sales/save_all`, lot, headers)
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

const ventas = {
    countRecords,
    deleteById,
    deletePropsFromAll,
    deletePropsFromAllLines,
    edit,
    editAll,
    findAll,
    findAllByFilters,
    findById,
    findLastIndex,
    findLastVoucherNumber,
    findMultipleIds,
    findNewerRecord,
    findNewerSale,
    findOldestRecord,
    findOldestSale,
    findPaginated,
    save,
    saveAll
}

export default ventas