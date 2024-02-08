const formatFindFilters = (filters) => {
    let formattedFilters
    if (!filters || typeof filters !== 'object') formattedFilters = null
    else {
        const currentFiltersKeys = Object.keys(filters)
        const currentFiltersValues = Object.values(filters)
        const filtersWithoutNulls = {}
        for (let index = 0; index < currentFiltersKeys.length; index++) {
            const key = currentFiltersKeys[index]
            const value = currentFiltersValues[index]
            const valueIsArray = Array.isArray(value)
            const valueIsNotEmptyArray = valueIsArray ? value.length > 0 : true
            if (value && valueIsNotEmptyArray) filtersWithoutNulls[key] = value
        }
        formattedFilters = Object.keys(filtersWithoutNulls).length === 0
            ? null
            : JSON.stringify(filtersWithoutNulls)
    }
    return formattedFilters
}

const formatFindParams = (paginationParams) => {
    const filters = formatFindFilters(paginationParams.filters)
    const params = {
        ...paginationParams,
        filters
    }
    return params
}

const nullifyFilters = (filters) => {
    const currentFiltersKeys = Object.keys(filters)
    const nullFilters = {}
    for (let index = 0; index < currentFiltersKeys.length; index++) {
        const key = currentFiltersKeys[index]
        nullFilters[key] = null
    }
    return nullFilters
}

const paginationParams = {
    formatFindFilters,
    formatFindParams,
    nullifyFilters
}

export default paginationParams