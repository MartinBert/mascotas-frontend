import axios from 'axios'
import { errorAlert } from '../components/alerts'
import mathHelper from './mathHelper'

const { round } = mathHelper
const lotsLimit = 5

const services = {
    countRecords: 'countRecords',
    edit: 'edit',
    findAll: 'findAll',
    findAllByFilters: 'findAllByFilters',
    findAllForCatalogue: 'findAllForCatalogue',
    findAllUsers: 'findAllUsers',
    findById: 'findById',
    findLastIndex: 'findLastIndex',
    findLastVoucherNumber: 'findLastVoucherNumber',
    findNewer: 'findNewer',
    findNewerSale: 'findNewerSale',
    findOldest: 'findOldest',
    findOldestSale: 'findOldestSale',
    findPaginated: 'findPaginated',
    modifyStock: 'modifyStock',
    remove: 'remove',
    removeProps: 'removeProps',
    save: 'save'
}

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const getMetadata = (newlyUser = null, tenantIdInRequest = null) => {
    const tenantId = tenantIdInRequest ?? localStorage.getItem('tenantId') ?? null
    const token = localStorage.getItem('token') ?? null
    const metadata = {
        headers: {
            Authorization: token,
            newlyUser,
            tenantId
        }
    }
    return metadata
}

const processService = async (props) => {
    const { service, ...caseProps } = props
    const newlyUser = caseProps.newlyUser ?? null
    const tenantIdInRequest = caseProps.tenantId ?? null
    const { headers } = getMetadata(newlyUser, tenantIdInRequest)
    caseProps.headers = headers

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
        case services.findAllForCatalogue:
            response = await processFindAllForCatalogue(caseProps)
            break
        case services.findAllUsers:
            response = await processFindAllUsers(caseProps)
            break
        case services.findById:
            response = await processFindById(caseProps)
            break
        case services.findLastIndex:
            response = await processFindLastIndex(caseProps)
            break
        case services.findLastVoucherNumber:
            response = await processFindLastVoucherNumber(caseProps)
            break
        case services.findNewer:
            response = await processFindNewer(caseProps)
            break
        case services.findNewerSale:
            response = await processFindNewerSale(caseProps)
            break
        case services.findOldest:
            response = await processFindOldest(caseProps)
            break
        case services.findOldestSale:
            response = await processFindOldestSale(caseProps)
            break
        case services.findPaginated:
            response = await processFindPaginated(caseProps)
            break
        case services.modifyStock:
            response = await processModifyStock(caseProps)
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
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/countRecords`, reqConfig)
        return response.data
    } catch (err) {
        console.error(err)
    }
}

const processEdit = async (caseProps) => {
    try {
        const { data, headers, path } = caseProps
        const records = Array.isArray(data) ? data : [data]
        const loopLimit = Math.ceil(records.length / lotsLimit)
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = records.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const reqConfig = { headers }
            const response = await axios.put(`${process.env.REACT_APP_API_REST}/${path}/records/edit`, lot, reqConfig)
            responseData.push(response.data)
        }
        const response = {
            code: 200,
            data: responseData.length === 1 ? responseData[0].data : responseData,
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
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findAll`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindAllByFilters = async (caseProps) => {
    try {
        const { data: filters, headers, path } = caseProps
        const reqConfig = { headers, params: { filters } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findAllByFilters`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindAllForCatalogue = async (caseProps) => {
    try {
        const { data: filters, headers, path } = caseProps
        const reqConfig = { headers, params: { filters } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findAllForCatalogue`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindAllUsers = async (caseProps) => {
    try {
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findAllUsers`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindById = async (caseProps) => {
    try {
        const { data: id, headers, path } = caseProps
        const reqConfig = { headers, params: { id } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findById`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindLastIndex = async (caseProps) => {
    try {
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findLastIndex`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindLastVoucherNumber = async (caseProps) => {
    try {
        const { data: { code }, headers, path } = caseProps
        const reqConfig = { headers, params: { code } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findLastVoucherNumber`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindNewer = async (caseProps) => {
    try {
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findNewer`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindNewerSale = async (caseProps) => {
    try {
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findNewerSale`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindOldest = async (caseProps) => {
    try {
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findOldest`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindOldestSale = async (caseProps) => {
    try {
        const { headers, path } = caseProps
        const reqConfig = { headers }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findOldestSale`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processFindPaginated = async (caseProps) => {
    try {
        const { data: { filters, limit, page }, headers, path } = caseProps
        const reqConfig = { headers, params: { filters, limit, page } }
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/${path}/records/findPaginated`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processModifyStock = async (caseProps) => {
    try {
        const { data, headers, path } = caseProps
        const stockModificationData = {
            ...data,
            product: {
                ...data.product,
                cantidadStock: round(data.product.cantidadStock),
                cantidadFraccionadaStock: round(data.product.cantidadFraccionadaStock)
            }
        }
        const reqConfig = { headers }
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/${path}/records/modifyStock`, stockModificationData, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processRemove = async (caseProps) => {
    try {
        const { data: ids, headers, path } = caseProps
        const idsOfRecords = Array.isArray(ids) ? ids : [ids]
        const loopLimit = Math.ceil(idsOfRecords.length / lotsLimit)
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const idsFromRemove = idsOfRecords.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const reqConfig = { headers }
            const response = await axios.delete(`${process.env.REACT_APP_API_REST}/${path}/records/remove`, idsFromRemove, reqConfig)
            responseData.push(response.data)
        }
        const response = {
            code: 200,
            data: responseData.length === 1 ? responseData[0].data : responseData,
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
        const { data, headers, path } = caseProps
        const propsToRemove = Array.isArray(data) ? data : [data]
        const reqConfig = { headers }
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/${path}/records/removeProps`, propsToRemove, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const processSave = async (caseProps) => {
    try {
        const { data, headers, path } = caseProps
        const records = Array.isArray(data) ? data : [data]
        const loopLimit = Math.ceil(records.length / lotsLimit)
        const responseData = []
        for (let index = 0; index < loopLimit; index++) {
            const lot = records.slice(index * lotsLimit, (index + 1) * lotsLimit)
            const reqConfig = { headers }
            const response = await axios.post(`${process.env.REACT_APP_API_REST}/${path}/records/save`, lot, reqConfig)
            responseData.push(response.data)
        }
        const response = {
            code: 200,
            data: responseData.length === 1 ? responseData[0].data : responseData,
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