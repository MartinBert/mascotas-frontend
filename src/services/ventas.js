import axios from 'axios'
const token = localStorage.getItem('token')
const headers = { headers: { Authorization: token } }
const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const findAll = async (params) => {
    try {
        if (!params) {
            const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas`, headers)
            return response.data
        } else {
            const { page, limit, filters } = params
            const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas?page=${page}&limit=${limit}&filters=${filters}`, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas?initialDate=${initialDate}&finalDate=${finalDate}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async (ids) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findLastIndex = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/last/index/number`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findLastVoucherNumber = async (code) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/ventas/last/voucher/number/${code}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async (venta) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/ventas`, venta, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async (venta) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/ventas/${venta._id}`, venta, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteVenta = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/ventas/${id}`, headers)
        return response.data.message
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const ventas = {
    findAll,
    findByDates,
    findById,
    findMultipleIds,
    findLastIndex,
    findLastVoucherNumber,
    save,
    edit,
    deleteVenta
}

export default ventas