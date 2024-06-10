import helpers from '../helpers'
const { roundTwoDecimals } = helpers.mathHelper

const actions = {
    CLEAR_LINE_PARAMS: 'CLEAR_LINE_PARAMS',
    CLEAR_PARAMS_OF_INPUTS: 'CLEAR_PARAMS_OF_INPUTS',
    DELETE_ALL_CUSTOM_PRODUCTS: 'DELETE_ALL_CUSTOM_PRODUCTS',
    DELETE_CUSTOM_PRODUCT: 'DELETE_CUSTOM_PRODUCT',
    HIDE_CUSTOM_PRODUCT_MODAL: 'HIDE_CUSTOM_PRODUCT_MODAL',
    HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL',
    SET_CUSTOM_PRODUCT: 'SET_CUSTOM_PRODUCT',
    SAVE_PARAMS: 'SAVE_PARAMS',
    SET_INPUT_STATUS: 'SET_INPUT_STATUS',
    SET_PARAMS_OF_INPUTS: 'SET_PARAMS_OF_INPUTS',
    SET_QUANTITY_OF_NOT_SAVED_CUSTOM_PRODUCTS: 'SET_QUANTITY_OF_NOT_SAVED_CUSTOM_PRODUCTS',
    SET_QUANTITY_OF_SAVED_CUSTOM_PRODUCTS: 'SET_QUANTITY_OF_SAVED_CUSTOM_PRODUCTS',
    SHOW_CUSTOM_PRODUCT_MODAL: 'SHOW_CUSTOM_PRODUCT_MODAL',
    SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL: 'SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL'
}

const initialState = {
    customProductModalIsVisible: false,
    inputStatus: {
        concept: null,
        percentageIVA: null,
        unitPrice: null
    },
    listOfCustomProductModalIsVisible: false,
    params: {
        _id: '',
        concept: '',
        percentageIVA: '0',
        profit: 0,
        unitPrice: ''
    },
    paramsInputs: {
        concept: '',
        percentageIVA: '0',
        unitPrice: ''
    },
    quantityOfNotSavedCustomProducts: 0,
    quantityOfSavedCustomProducts: 0,
    saleCustomProducts: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLEAR_LINE_PARAMS:
            return {
                ...state,
                inputStatus: {
                    concept: null,
                    percentageIVA: null,
                    unitPrice: null
                },
                params: {
                    ...state.params,
                    concept: '',
                    percentageIVA: '0',
                    profit: 0,
                    unitPrice: ''
                },
                paramsInputs: {
                    concept: '',
                    percentageIVA: '0',
                    unitPrice: ''
                }
            }
        case actions.CLEAR_PARAMS_OF_INPUTS:
            return {
                ...state,
                paramsInputs: {
                    concept: '',
                    percentageIVA: '0',
                    unitPrice: ''
                }
            }
        case actions.DELETE_ALL_CUSTOM_PRODUCTS:
            return {
                ...state,
                saleCustomProducts: []
            }
        case actions.DELETE_CUSTOM_PRODUCT:
            return {
                ...state,
                saleCustomProducts: state.saleCustomProducts
                    .filter(customProduct => customProduct._id !== action.payload)
                    .map((customProduct, index) => {
                        customProduct = {
                            ...customProduct,
                            _id: 'customProduct_' + (1 + index),
                            codigoBarras: 'customProduct_' + (1 + index),
                            key: 'customProduct_' + (1 + index)
                        }
                        return customProduct
                    })
            }
        case actions.HIDE_CUSTOM_PRODUCT_MODAL:
            return {
                ...state,
                customProductModalIsVisible: false
            }
        case actions.HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL:
            return {
                ...state,
                listOfCustomProductModalIsVisible: false
            }
        case actions.SAVE_PARAMS:
            return {
                ...state,
                params: action.payload
            }
        case actions.SET_INPUT_STATUS:
            return {
                ...state,
                inputStatus: action.payload
            }
        case actions.SET_PARAMS_OF_INPUTS:
            return {
                ...state,
                paramsInputs: action.payload
            }
        case actions.SET_QUANTITY_OF_NOT_SAVED_CUSTOM_PRODUCTS:
            return {
                ...state,
                quantityOfNotSavedCustomProducts: action.payload
            }
        case actions.SET_QUANTITY_OF_SAVED_CUSTOM_PRODUCTS:
            return {
                ...state,
                quantityOfSavedCustomProducts: action.payload
            }
        case actions.SET_CUSTOM_PRODUCT:
            const percentageIVA = parseFloat(action.payload.percentageIVA)
            const unitPrice = parseFloat(action.payload.unitPrice)
            if (state.saleCustomProducts.find(product => product._id === action.payload._id)) return state
            const ivaVenta = roundTwoDecimals(unitPrice * percentageIVA / 100)
            return {
                ...state,
                saleCustomProducts: state.saleCustomProducts.concat({
                    _id: action.payload._id,
                    codigoBarras: action.payload._id,
                    ivaVenta: ivaVenta,
                    key: action.payload._id,
                    nombre: action.payload.concept,
                    precioVenta: unitPrice,
                    porcentajeIvaVenta: percentageIVA,
                    profit: unitPrice - parseFloat(ivaVenta),
                    unidadMedida: { fraccionamiento: 1, nombre: 'Unid.' }
                })
            }
        case actions.SHOW_CUSTOM_PRODUCT_MODAL:
            return {
                ...state,
                customProductModalIsVisible: true
            }
        case actions.SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL:
            return {
                ...state,
                listOfCustomProductModalIsVisible: true
            }
        default:
            return state;
    }
}

const saleCustomProducts = {
    actions,
    initialState,
    reducer
}

export default saleCustomProducts