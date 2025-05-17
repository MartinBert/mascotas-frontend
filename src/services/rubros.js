import helpers from '../helpers'


const path = 'types'

const countRecords = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.countRecords }
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

const findNewer = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findNewer }
    const response = await processService(props)
    return response
}

const findOldest = async () => {
    const { processService, services } = helpers.servicesHelper
    const props = { path, service: services.findOldest }
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

const save = async (records) => {
    const { processService, services } = helpers.servicesHelper
    const props = { data: records, path, service: services.save }
    const response = await processService(props)
    return response
}

const types = {
    countRecords,
    edit,
    findAll,
    findAllByFilters,
    findById,
    findNewer,
    findOldest,
    findPaginated,
    remove,
    removeProps,
    save
}

export default types