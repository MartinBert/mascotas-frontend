import helpers from '../helpers'


const path = 'sales'

const countRecords = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.countRecords }
    const response = await processService(props)
    return response
}

const deletePropsFromAllLines = async (propsToDelete) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: propsToDelete, path, service: services.deletePropsFromAllLines }
    const response = await processService(props)
    return response
}

const edit = async (records) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: records, path, service: services.edit }
    const response = await processService(props)
    return response
}

const findAll = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findAll }
    const response = await processService(props)
    return response
}

const findAllByFilters = async (filters) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: filters, path, service: services.findAllByFilters }
    const response = await processService(props)
    return response
}

const findById = async (id) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: id, path, service: services.findById }
    const response = await processService(props)
    return response
}

const findLastIndex = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findLastIndex }
    const response = await processService(props)
    return response
}

const findLastVoucherNumber = async (code) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: code, path, service: services.findLastVoucherNumber }
    const response = await processService(props)
    return response
}

const findNewer = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findNewer }
    const response = await processService(props)
    return response
}

const findNewerFiscalSale = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findNewerFiscalSale }
    const response = await processService(props)
    return response
}

const findOldest = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findOldest }
    const response = await processService(props)
    return response
}

const findOldestFiscalSale = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findOldestFiscalSale }
    const response = await processService(props)
    return response
}

const findPaginated = async (paginationParams) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: paginationParams, path, service: services.findPaginated }
    const response = await processService(props)
    return response
}

const remove = async (ids) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: ids, path, service: services.remove }
    const response = await processService(props)
    return response
}

const removeProps = async (propsArray) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: propsArray, path, service: services.removeProps }
    const response = await processService(props)
    return response
}

const save = async (records, tenantId = null, newlyUser = false) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: records, path, service: services.save }
    if (newlyUser) props.newlyUser = newlyUser
    if (tenantId) props.tenantId = tenantId
    const response = await processService(props)
    return response
}

const sales = {
    countRecords,
    deletePropsFromAllLines,
    edit,
    findAll,
    findAllByFilters,
    findById,
    findLastIndex,
    findLastVoucherNumber,
    findNewer,
    findNewerFiscalSale,
    findOldest,
    findOldestFiscalSale,
    findPaginated,
    remove,
    removeProps,
    save
}

export default sales