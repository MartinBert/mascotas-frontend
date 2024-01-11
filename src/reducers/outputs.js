// Helpers
import helpers from '../helpers'
import dayjs from 'dayjs'

// Imports Destructuring
const { localFormat, simpleDateWithHours } = helpers.dateHelper
const { roundTwoDecimals } = helpers.mathHelper


const actions = {
    CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY: 'CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    CLEAN_STATE: 'CLEAN_STATE',
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    DESELECT_ALL_EXCEL_OPTIONS: 'DESELECT_ALL_EXCEL_OPTIONS',
    HIDE_DETAILS_MODAL: 'HIDE_DETAILS_MODAL',
    SELECT_ALL_EXCEL_OPTIONS: 'SELECT_ALL_EXCEL_OPTIONS',
    SET_DATA_FOR_DETAILS_MODAL: 'SET_DATA_FOR_DETAILS_MODAL',
    SET_OUTPUTS_FOR_EXCEL_REPORT: 'SET_OUTPUTS_FOR_EXCEL_REPORT',
    SET_OUTPUTS_FOR_RENDER: 'SET_OUTPUTS_FOR_RENDER',
    SET_EXCEL_OPTIONS: 'SET_EXCEL_OPTIONS',
    SET_LOADING: 'SET_LOADING',
    SET_PAGINATION_PARAMS: 'SET_PAGINATION_PARAMS',
    SET_PARAMS: 'SET_PARAMS',
    SET_PRODUCT: 'SET_PRODUCT'
}

const formatDate = (dateToFormat) => {
    const formattedDate = dayjs(localFormat(dateToFormat), ['DD/MM/YYYY'])
    return formattedDate
}

const initialState = {
    activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }],
    allExcelTitles: [
        'Usuario',
        'Fecha',
        'Descripción',
        'Productos',
        'Ganancia Neta'
    ],
    dataForDetailsModal: null,
    datePickerValue: formatDate(new Date()),
    detailsModalVisibility: false,
    outputsForExcelReport: [],
    outputsForRender: null,
    outputsTotalQuantity: 0,
    loading: true,
    paginationParams: {
        filters: {
            descripcion: null,
            fecha: null,
            fechaString: null,
            gananciaNeta: null
        },
        limit: 10,
        page: 1
    },
    params: {
        descripcion: '-- Sin descripción --',
        fecha: new Date(),
        fechaString: simpleDateWithHours(new Date()),
        cantidad: 0,
        gananciaNeta: 0,
        productos: [],
        usuario: null
    },
    rangePickerValueForExcelReport: null
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY:
            const cantidad = state.params.productos.reduce((acc, item) => acc + item.cantidadesSalientes, 0)
            const gananciaNeta = roundTwoDecimals(
                state.params.productos.reduce(
                    (acc, item) =>
                        acc + (
                            item.cantidadesSalientes
                                ? item.precioUnitario * item.cantidadesSalientes
                                : 0
                        ), 0
                )
            )
            return {
                ...state,
                params: { ...state.params, cantidad, gananciaNeta }
            }
        case actions.CLEAR_INPUTS:
            return {
                ...state,
                datePickerValue: formatDate(new Date()),
                params: {
                    ...state.params,
                    descripcion: '-- Sin descripción --',
                    fecha: new Date(),
                    fechaString: simpleDateWithHours(new Date()),
                }
            }
        case actions.CLEAN_STATE:
            return initialState
        case actions.DELETE_ALL_PRODUCTS:
            return {
                ...state,
                params: { ...state.params, productos: [] }
            }
        case actions.DELETE_PRODUCT:
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: state.params.productos.filter(
                        product => product._id !== action.payload
                    )
                }
            }
        case actions.DESELECT_ALL_EXCEL_OPTIONS:
            const notAllOptions = state.activeExcelOptions.filter(option => option.value !== 'todas')
            const optionsValues = notAllOptions.map(option => option.value)
            const fixedOptions = optionsValues.includes('fecha')
                ? notAllOptions
                : [{ disabled: true, label: 'Fecha', value: 'fecha' }].concat(notAllOptions)
            return {
                ...state,
                activeExcelOptions: fixedOptions
            }
        case actions.HIDE_DETAILS_MODAL:
            return {
                ...state,
                detailsModalVisibility: false
            }
        case actions.SELECT_ALL_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }]
            }
        case actions.SET_DATA_FOR_DETAILS_MODAL:
            return {
                ...state,
                dataForDetailsModal: action.payload,
                detailsModalVisibility: true
            }
        case actions.SET_OUTPUTS_FOR_EXCEL_REPORT:
            const rangePickerValue = action.payload.rangePickerValueForExcelReport
            return {
                ...state,
                outputsForExcelReport: action.payload.outputsForExcelReport,
                rangePickerValueForExcelReport: rangePickerValue.includes('')
                    ? ['', '']
                    : [dayjs(rangePickerValue[0], 'DD-MM-YYYY'), dayjs(rangePickerValue[1], 'DD-MM-YYYY')]
            }
        case actions.SET_OUTPUTS_FOR_RENDER:
            return {
                ...state,
                outputsForRender: action.payload.docs,
                outputsTotalQuantity: parseInt(action.payload.totalDocs),
                loading: false
            }
        case actions.SET_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: action.payload
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_PAGINATION_PARAMS:
            return {
                ...state,
                paginationParams: action.payload
            }
        case actions.SET_PARAMS:
            return {
                ...state,
                datePickerValue: formatDate(action.payload.fecha),
                params: action.payload
            }
        case actions.SET_PRODUCT:
            if (state.params.productos.find(product => product._id === action.payload._id)) return state
            action.payload.cantidadesSalientes = 0
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: [...state.params.productos, action.payload]
                }
            }
        default:
            return state
    }
}

const outputs = {
    actions,
    initialState,
    reducer
}

export default outputs