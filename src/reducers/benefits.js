const actions = {
    SET_FILTER_BY_DESCRIPTION: 'SET_FILTER_BY_DESCRIPTION',
    SET_FILTER_BY_TITLE: 'SET_FILTER_BY_TITLE',
    SET_LIMIT: 'SET_LIMIT',
    SET_LOADING: 'SET_LOADING',
    SET_PAGE: 'SET_PAGE',
    SET_RECORDS_TO_RENDER: 'SET_RECORDS_TO_RENDER',

    SET_STATUS_OF_cantidadDeComprasParaActivacion: 'SET_STATUS_OF_cantidadDeComprasParaActivacion',
    SET_STATUS_OF_montoFijoDeBonificacion: 'SET_STATUS_OF_montoFijoDeBonificacion',
    SET_STATUS_OF_porcentajeDeBonificacion: 'SET_STATUS_OF_porcentajeDeBonificacion',
    SET_STATUS_OF_conceptoDeBonificacion: 'SET_STATUS_OF_conceptoDeBonificacion',
    SET_STATUS_OF_TITLE: 'SET_STATUS_OF_TITLE',
    SET_STATUS_OF_DESCRIPTION: 'SET_STATUS_OF_DESCRIPTION',

    SET_VALUE_OF_cantidadDeComprasParaActivacion: 'SET_VALUE_OF_cantidadDeComprasParaActivacion',
    SET_VALUE_OF_montoFijoDeBonificacion: 'SET_VALUE_OF_montoFijoDeBonificacion',
    SET_VALUE_OF_porcentajeDeBonificacion: 'SET_VALUE_OF_porcentajeDeBonificacion',
    SET_VALUE_OF_conceptoDeBonificacion: 'SET_VALUE_OF_conceptoDeBonificacion',
    SET_VALUE_OF_TITLE: 'SET_VALUE_OF_TITLE',
    SET_VALUE_OF_DESCRIPTION: 'SET_VALUE_OF_DESCRIPTION',
}

const initialState = {
    benefit: {
        cantidadDeComprasParaActivacion: { status: null, value: 0 },
        montoFijoDeBonificacion: { status: null, value: 0 },
        porcentajeDeBonificacion: { status: null, value: 0 },
        conceptoDeBonificacion: { status: null, value: '' },
        title: { status: null, value: '' },
        description: { status: null, value: '' },
    },
    loading: true,
    paginationParams: {
        filters: {
            description: null,
            title: null
        },
        limit: 10,
        page: 1
    },
    recordsToRender: [],
    totalRecordsQuantity: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_FILTER_BY_DESCRIPTION:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        description: action.payload
                    }
                }
            }
        case actions.SET_FILTER_BY_TITLE:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    filters: {
                        ...state.paginationParams.filters,
                        title: action.payload
                    }
                }
            }
        case actions.SET_LIMIT:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    limit: action.payload
                }
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_PAGE:
            return {
                ...state,
                paginationParams: {
                    ...state.paginationParams,
                    page: action.payload
                }
            }
        case actions.SET_RECORDS_TO_RENDER:
            return {
                ...state,
                recordsToRender: action.payload.docs,
                totalRecordsQuantity: action.payload.totalDocs
            }
        case actions.SET_STATUS_OF_cantidadDeComprasParaActivacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    cantidadDeComprasParaActivacion: {
                        ...state.benefit.cantidadDeComprasParaActivacion,
                        status: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_montoFijoDeBonificacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    montoFijoDeBonificacion: {
                        ...state.benefit.montoFijoDeBonificacion,
                        status: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_porcentajeDeBonificacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    porcentajeDeBonificacion: {
                        ...state.benefit.porcentajeDeBonificacion,
                        status: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_conceptoDeBonificacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    conceptoDeBonificacion: {
                        ...state.benefit.conceptoDeBonificacion,
                        status: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_DESCRIPTION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    description: {
                        ...state.benefit.description,
                        status: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_TITLE:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    title: {
                        ...state.benefit.title,
                        status: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_cantidadDeComprasParaActivacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    cantidadDeComprasParaActivacion: {
                        ...state.benefit.cantidadDeComprasParaActivacion,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_montoFijoDeBonificacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    montoFijoDeBonificacion: {
                        ...state.benefit.montoFijoDeBonificacion,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_porcentajeDeBonificacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    porcentajeDeBonificacion: {
                        ...state.benefit.porcentajeDeBonificacion,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_conceptoDeBonificacion:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    conceptoDeBonificacion: {
                        ...state.benefit.conceptoDeBonificacion,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_DESCRIPTION:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    description: {
                        ...state.benefit.description,
                        value: action.payload
                    }
                }
            }
        case actions.SET_VALUE_OF_TITLE:
            return {
                ...state,
                benefit: {
                    ...state.benefit,
                    title: {
                        ...state.benefit.title,
                        value: action.payload
                    }
                }
            }
        default:
            return state
    }
}

const benefits = {
    initialState,
    reducer,
}

export default benefits