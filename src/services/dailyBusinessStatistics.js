import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}


const deleteAll = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/daily_business_statistics`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async (id) => {
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

const findAllByFilters = async (filters) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics?filters=${filters}`, headers)
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

const findNewerRecord = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics/recordsInfo/newer`, headers)
        return response.data[0]
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findOldestRecord = async (params) => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/daily_business_statistics/recordsInfo/oldest`, headers)
        return response.data[0]
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

const saveAll = async (dailyBusinessStatistics) => {
    try {
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const lotsLimit = 5
        const loopLimit = dailyBusinessStatistics.length / lotsLimit
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = dailyBusinessStatistics.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.post(`${process.env.REACT_APP_API_REST}/daily_business_statistics/statistics/save_all`, lot, headers)
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

const dailyBusinessStatistics = {
    deleteAll,
    deleteById,
    edit,
    findAll,
    findAllByFilters,
    findById,
    findNewerRecord,
    findOldestRecord,
    findPaginated,
    save,
    saveAll
}

export default dailyBusinessStatistics