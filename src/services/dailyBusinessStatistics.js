import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const deleteDailyBusinessStatistics = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/daily_business_statistics/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async (dailyBusinessStatistics) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/daily_business_statistics/${dailyBusinessStatistics._id}`, dailyBusinessStatistics, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAll = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findByDate = async (dateFilters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics?filters=${dateFilters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async (id) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findByImport = async (importFilters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics?filters=${importFilters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findNewerRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics/recordsInfo/newer`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findOldestRecord = async (params) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics/recordsInfo/oldest`, headers)
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
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async (dailyBusinessStatistics) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/daily_business_statistics`, dailyBusinessStatistics, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const dailyBusinessStatistics = {
    deleteDailyBusinessStatistics,
    edit,
    findAll,
    findByDate,
    findById,
    findByImport,
    findNewerRecord,
    findOldestRecord,
    findPaginated,
    save
}

export default dailyBusinessStatistics