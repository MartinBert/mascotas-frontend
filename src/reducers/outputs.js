// Helpers
import helpers from '../helpers'
import dayjs from 'dayjs'

// Imports Destructuring
const { localFormat, simpleDateWithHours } = helpers.dateHelper
const { round } = helpers.mathHelper


const actions = {
    CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY: 'CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY',
    CLEAN_STATE: 'CLEAN_STATE',
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
    SET_PRODUCTS: 'SET_PRODUCTS',
    SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE',
    SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME',
    SET_REFS: 'SET_REFS'
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
        'Ganancia',
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
        descripcion: '',
        fecha: new Date(),
        fechaString: simpleDateWithHours(new Date()),
        cantidad: 0,
        gananciaNeta: 0,
        ingreso: 0,
        productos: [],
        usuario: null
    },
    rangePickerValueForExcelReport: null,
    refs: {
        buttonToCancel: null,
        buttonToSave: null,
        datePicker: null,
        inputDescription: null,
        selectToAddProductByBarcode: null,
        selectToAddProductByName: null
    },
    selectToAddProductByBarcode: {
        options: [],
        selectedValue: null
    },
    selectToAddProductByName: {
        options: [],
        selectedValue: null
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY:
            const cantidad = state.params.productos.reduce((acc, item) => acc + parseFloat(item.cantidadesSalientes), 0)
            const gananciaNeta = round(
                state.params.productos.reduce(
                    (acc, item) =>
                        acc + (
                            parseFloat(item.cantidadesSalientes)
                                ? (parseFloat(item.precioVenta) - parseFloat(item.precioUnitario)) * parseFloat(item.cantidadesSalientes)
                                : 0
                        ), 0
                )
            )
            const ingreso = round(
                state.params.productos.reduce(
                    (acc, item) =>
                        acc + (
                            parseFloat(item.cantidadesSalientes)
                                ? parseFloat(item.precioVenta) * parseFloat(item.cantidadesSalientes)
                                : 0
                        ), 0
                )
            )
            return {
                ...state,
                params: { ...state.params, cantidad, ingreso, gananciaNeta }
            }
        case actions.CLEAN_STATE:
            return initialState
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
        case actions.SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE:
            return {
                ...state,
                selectToAddProductByBarcode: {
                    ...state.selectToAddProductByBarcode,
                    options: action.payload
                }
            }
        case actions.SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME:
            return {
                ...state,
                selectToAddProductByName: {
                    ...state.selectToAddProductByName,
                    options: action.payload
                }
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
        case actions.SET_PRODUCTS:
            const productos = action.payload.map(product => {
                if (product.cantidadesSalientes) return product
                else return { ...product, cantidadesSalientes: 0 }
            })
            return {
                ...state,
                params: {
                    ...state.params,
                    productos
                }
            }
        case actions.SET_REFS:
            return {
                ...state,
                refs: action.payload
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