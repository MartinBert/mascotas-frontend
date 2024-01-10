const formatFindParams = (paginationParams) => {
    let formattedFilters
    const currentFilters = paginationParams.filters
    if (!currentFilters || typeof currentFilters !== 'object') formattedFilters = null
    else {
        const currentFiltersKeys = Object.keys(currentFilters)
        const currentFiltersValues = Object.values(currentFilters)
        const filtersWithoutNulls = {}
        for (let index = 0; index < currentFiltersKeys.length; index++) {
            const key = currentFiltersKeys[index]
            const value = currentFiltersValues[index]
            if(value) filtersWithoutNulls[key] = value
        }
        formattedFilters = Object.keys(filtersWithoutNulls).length === 0
            ? null
            : JSON.stringify(filtersWithoutNulls)
    }
    const params = {
        ...paginationParams,
        filters: formattedFilters
    }
    return params
}

const paginationParams = {
    formatFindParams
}

export default paginationParams