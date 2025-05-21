const actions = {
    SET_BUSINESS_DOCS: 'SET_BUSINESS_DOCS',
    SET_BUSINESS_LIMIT: 'SET_BUSINESS_LIMIT',
    SET_BUSINESS_LOADING: 'SET_BUSINESS_LOADING',
    SET_BUSINESS_PAGE: 'SET_BUSINESS_PAGE',
    SET_BUSINESS_TOTAL_DOCS: 'SET_BUSINESS_TOTAL_DOCS',
    SET_BUSINESS_ACTIVITY: 'SET_BUSINESS_ACTIVITY',
    SET_BUSINESS_ADRESS: 'SET_BUSINESS_ADRESS',
    SET_BUSINESS_CUIT: 'SET_BUSINESS_CUIT',
    SET_BUSINESS_EMAIL: 'SET_BUSINESS_EMAIL',
    SET_BUSINESS_FISCAL_CONDITION: 'SET_BUSINESS_FISCAL_CONDITION',
    SET_BUSINESS_GROSS_INCOME: 'SET_BUSINESS_GROSS_INCOME',
    SET_BUSINESS_LOGO: 'SET_BUSINESS_LOGO',
    SET_BUSINESS_NAME: 'SET_BUSINESS_NAME',
    SET_BUSINESS_PHONE: 'SET_BUSINESS_PHONE',
    SET_BUSINESS_SALE_POINTS: 'SET_BUSINESS_SALE_POINTS',
    SET_BUSINESS_START_ACTIVITY_DATE: 'SET_BUSINESS_START_ACTIVITY_DATE',
    SET_CLIENT_ADRESS: 'SET_CLIENT_ADRESS',
    SET_CLIENT_BUSINESS_NAME: 'SET_CLIENT_BUSINESS_NAME',
    SET_CLIENT_CITY: 'SET_CLIENT_CITY',
    SET_CLIENT_CUIT: 'SET_CLIENT_CUIT',
    SET_CLIENT_EMAIL: 'SET_CLIENT_EMAIL',
    SET_CLIENT_FISCAL_CONDITION: 'SET_CLIENT_FISCAL_CONDITION',
    SET_CLIENT_PHONE: 'SET_CLIENT_PHONE',
    SET_CLIENT_PROVINCE: 'SET_CLIENT_PROVINCE',
    SET_CLIENT_RECEIVER_DOCUMENT: 'SET_CLIENT_RECEIVER_DOCUMENT',
    SET_CLIENT_RECEIVER_IVA_CONDITION: 'SET_CLIENT_RECEIVER_IVA_CONDITION',
    SET_CLIENTS_DOCS: 'SET_CLIENTS_DOCS',
    SET_CLIENTS_LIMIT: 'SET_CLIENTS_LIMIT',
    SET_CLIENTS_LOADING: 'SET_CLIENTS_LOADING',
    SET_CLIENTS_PAGE: 'SET_CLIENTS_PAGE',
    SET_CLIENTS_TOTAL_DOCS: 'SET_CLIENTS_TOTAL_DOCS'
}

const paramsStatus = {
    error: 'error',
    null: null
}

const initialState = {
    business: {
        docs: [],
        loading: false,
        paginationParams: {
            filters: {
                description: null,
                title: null
            },
            limit: 10,
            page: 1
        },
        params: {
            actividad: '',
            condicionFiscal: '',
            cuit: '',
            direccion: '',
            email: '',
            fechaInicioActividad: '',
            ingresosBrutos: '',
            logo: '',
            puntosVenta: [],
            razonSocial: '',
            telefono: '',
        },
        totalDocs: 0
    },
    clients: {
        docs: [],
        loading: false,
        paginationParams: {
            filters: {
                razonSocial: null,
            },
            limit: 10,
            page: 1
        },
        params: {
            ciudad: '',
            cuit: '',
            condicionFiscal: '',
            direccion: '',
            documentoReceptor: '',
            email: '',
            normalizedBusinessName: '',
            provincia: '',
            razonSocial: '',
            receiverIvaCondition: '',
            telefono: ''
        },
        totalDocs: 0
    }
}

const reducer = (state = initialState, action) => {
    const { payload, type } = action

    switch (type) {
        case actions.SET_BUSINESS_DOCS:
            return {
                ...state,
                business: {
                    ...state.business,
                    docs: payload
                }
            }
        case actions.SET_BUSINESS_LIMIT:
            return {
                ...state,
                business: {
                    ...state.business,
                    paginationParams: {
                        ...state.business.paginationParams,
                        limit: payload
                    }
                }
            }
        case actions.SET_BUSINESS_LOADING:
            return {
                ...state,
                business: {
                    ...state.business,
                    loading: payload
                }
            }
        case actions.SET_BUSINESS_PAGE:
            return {
                ...state,
                business: {
                    ...state.business,
                    paginationParams: {
                        ...state.business.paginationParams,
                        page: payload
                    }
                }
            }
        case actions.SET_BUSINESS_TOTAL_DOCS:
            return {
                ...state,
                business: {
                    ...state.business,
                    totalDocs: payload
                }
            }
        case actions.SET_BUSINESS_ACTIVITY:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        actividad: payload
                    }
                }
            }
        case actions.SET_BUSINESS_ADRESS:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        direccion: payload
                    }
                }
            }
        case actions.SET_BUSINESS_CUIT:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        cuit: payload
                    }
                }
            }
        case actions.SET_BUSINESS_EMAIL:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        email: payload
                    }
                }
            }
        case actions.SET_BUSINESS_FISCAL_CONDITION:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        condicionFiscal: payload
                    }
                }
            }
        case actions.SET_BUSINESS_GROSS_INCOME:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        ingresosBrutos: payload
                    }
                }
            }
        case actions.SET_BUSINESS_LOGO:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        logo: payload
                    }
                }
            }
        case actions.SET_BUSINESS_NAME:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        razonSocial: payload
                    }
                }
            }
        case actions.SET_BUSINESS_PHONE:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        telefono: payload
                    }
                }
            }
        case actions.SET_BUSINESS_SALE_POINTS:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        puntosVenta: [payload]
                    }
                }
            }
        case actions.SET_BUSINESS_START_ACTIVITY_DATE:
            return {
                ...state,
                business: {
                    ...state.business,
                    params: {
                        ...state.business.params,
                        fechaInicioActividad: payload
                    }
                }
            }
        case actions.SET_CLIENT_ADRESS:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        direccion: payload
                    }
                }
            }
        case actions.SET_CLIENT_BUSINESS_NAME:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        razonSocial: payload
                    }
                }
            }
        case actions.SET_CLIENT_CITY:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        ciudad: payload
                    }
                }
            }
        case actions.SET_CLIENT_CUIT:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        cuit: payload
                    }
                }
            }
        case actions.SET_CLIENT_EMAIL:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        email: payload
                    }
                }
            }
        case actions.SET_CLIENT_FISCAL_CONDITION:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        condicionFiscal: payload
                    }
                }
            }
        case actions.SET_CLIENT_PHONE:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        telefono: payload
                    }
                }
            }
        case actions.SET_CLIENT_PROVINCE:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        provincia: payload
                    }
                }
            }
        case actions.SET_CLIENT_RECEIVER_DOCUMENT:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        documentoReceptor: payload
                    }
                }
            }
        case actions.SET_CLIENT_RECEIVER_IVA_CONDITION:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    params: {
                        ...state.clients.params,
                        receiverIvaCondition: payload
                    }
                }
            }
        case actions.SET_CLIENTS_DOCS:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    docs: payload
                }
            }
        case actions.SET_CLIENTS_LIMIT:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    paginationParams: {
                        ...state.clients.paginationParams,
                        limit: payload
                    }
                }
            }
        case actions.SET_CLIENTS_LOADING:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    loading: payload
                }
            }
        case actions.SET_CLIENTS_PAGE:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    paginationParams: {
                        ...state.clients.paginationParams,
                        page: payload
                    }
                }
            }
        case actions.SET_CLIENTS_TOTAL_DOCS:
            return {
                ...state,
                clients: {
                    ...state.clients,
                    totalDocs: payload
                }
            }
        default:
            return state
    }
}

const storeReducer = {
    actions,
    initialState,
    paramsStatus,
    reducer,
}

export default storeReducer