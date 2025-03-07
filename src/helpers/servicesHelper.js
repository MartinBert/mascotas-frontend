import axios from 'axios'
import { errorAlert } from '../components/alerts'

const lotsLimit = 5

const services = {
    countRecords: 'countRecords',
    edit: 'edit',
    findAll: 'findAll',
    findAllByFilters: 'findAllByFilters',
    findById: 'findById',
    findNewer: 'findNewer',
    findOldest: 'findOldest',
    findPaginated: 'findPaginated',
    remove: 'remove',
    removeProps: 'removeProps',
    save: 'save'
}

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const processService = async (props) => {
    const { service, ...caseProps } = props
    let response
    switch (service) {
        case services.countRecords:
            response = await processCountRecords(caseProps)
            break
        case services.edit:
            response = await processEdit(caseProps)
            break
        case services.findAll:
            response = await processFindAll(caseProps)
            break
        case services.findAllByFilters:
            response = await processFindAllByFilters(caseProps)
            break
        case services.findById:
            response = await processFindById(caseProps)
            break
        case services.findNewer:
            response = await processFindNewer(caseProps)
            break
        case services.findOldest:
            response = await processFindOldest(caseProps)
            break
        case services.findPaginated:
            response = await processFindPaginated(caseProps)
            break
        case services.remove:
            response = await processRemove(caseProps)
            break
        case services.removeProps:
            response = await processRemoveProps(caseProps)
            break
        case services.save:
            response = await processSave(caseProps)
            break
        default:
            response = null
            break
    }
    if (!response) {
        errorAlert('Configuración incorrecta del servicio. Contacte a su proveedor.')
        return response
    } else {
        return response
    }
}


const processCountRecords = async (caseProps) => {
    try {
        const { path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/getTotalQuantity`, headers)
        return response.data
    } catch (err) {
        console.error(err)
    }
}

const processEdit = async (caseProps) => {
    try {
        const { data, path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const records = Array.isArray(data) ? data : [data]
        const loopLimit = Math.ceil(records.length / lotsLimit)
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = records.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.put(`${process.env.REACT_APP_API_REST}/${path}/records/edit`, lot, headers)
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

const processFindAll = async (caseProps) => {
    try {
        const { path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findAll`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindAllByFilters = async (caseProps) => {
    try {
        const { data: filters, path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findAllByFilters?filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindById = async (caseProps) => {
    try {
        const { data: id, path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findById/${id}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindNewer = async (caseProps) => {
    try {
        const { path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findNewer`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindOldest = async (caseProps) => {
    try {
        const { path } = caseProps
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findOldest`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindPaginated = async (caseProps) => {
    try {
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const { data: { page, limit, filters }, path } = caseProps
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findPaginated?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processRemove = async (caseProps) => {
    try {
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const { data: ids, path } = caseProps
        const idOfRecords = Array.isArray(ids) ? ids : [ids]
        const loopLimit = Math.ceil(idOfRecords.length / lotsLimit)
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = idOfRecords.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.delete(`${process.env.REACT_APP_API_REST}/${path}/records/remove`, lot, headers)
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

const processRemoveProps = async (caseProps) => {
    try {
        const { data, path } = caseProps
        const propsToDelete = Array.isArray(data) ? data : [data]
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/${path}/records/removeProps`, propsToDelete, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processSave = async (caseProps) => {
    try {
        const headers = { headers: { Authorization: localStorage.getItem('token') } }
        const { data, path } = caseProps
        const records = Array.isArray(data) ? data : [data]
        const loopLimit = Math.ceil(records.length / lotsLimit)
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = records.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const response = await axios.post(`${process.env.REACT_APP_API_REST}/${path}/records/save`, lot, headers)
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

const servicesHelper = {
    processService,
    services
}

export default servicesHelper