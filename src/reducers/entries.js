// Helpers
import helpers from '../helpers'
import dayjs from 'dayjs'

// Imports Destructuring
const { localFormat } = helpers.dateHelper
const { roundTwoDecimals } = helpers.mathHelper


const actions = {
    CALCULATE_TOTAL_COST: 'CALCULATE_TOTAL_COST',
    CLEAN_INPUTS: 'CLEAN_INPUTS',
    CLEAN_STATE: 'CLEAN_STATE',
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    DELETE_ID: 'DELETE_ID',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_DATE: 'SET_DATE',
    SET_DESCRIPTION: 'SET_DESCRIPTION',
    SET_ENTRY: 'SET_ENTRY',
    SET_FORMATTED_DATE: 'SET_FORMATTED_DATE',
    SET_LOADING: 'SET_LOADING',
    SET_NET_PROFIT: 'SET_NET_PROFIT',
    SET_PRODUCT: 'SET_PRODUCT',
    SET_PRODUCT_BARCODE: 'SET_PRODUCT_BARCODE',
    SET_PRODUCT_NAME: 'SET_PRODUCT_NAME',
    SET_PRODUCT_QUANTITY: 'SET_PRODUCT_QUANTITY',
    SET_QUANTITY: 'SET_QUANTITY'
}

const formatDate = (dateToFormat) => {
    const formattedDate = dayjs(localFormat(dateToFormat), ['DD/MM/YYYY'])
    return formattedDate
}

const initialState = {
    _id: null,
    date: null, // loaded by useEffect on first render of view
    description: '',
    formattedDate: null, // loaded by useEffect on first render of view
    loading: true,
    netProfit: 0,
    products: [],
    quantity: 0,
    totalCost: 0
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CALCULATE_TOTAL_COST:
            const totalCost = roundTwoDecimals(
                state.products.reduce(
                    (acc, item) =>
                        acc + (
                            item.cantidadesEntrantes
                                ? item.precioUnitario * item.cantidadesEntrantes
                                : 0
                        ), 0
                )
            )
            return {
                ...state,
                totalCost: totalCost
            }
        case actions.CLEAN_INPUTS:
            return {
                ...state,
                date: new Date(),
                description: '',
                formattedDate: formatDate(new Date())
            }
        case actions.CLEAN_STATE:
            return initialState
        case actions.DELETE_ALL_PRODUCTS:
            return {
                ...state,
                products: []
            }
        case actions.DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(product => product._id !== action.payload)
            }
        case actions.SET_DATE:
            return {
                ...state,
                date: action.payload
            }
        case actions.SET_DESCRIPTION:
            return {
                ...state,
                description: action.payload
            }
        case actions.SET_ENTRY:
            return {
                ...state,
                _id: action.payload._id,
                date: action.payload.fecha,
                description: action.payload.descripcion,
                formattedDate: formatDate(action.payload.fecha),
                products: action.payload.productos,
                quantity: action.payload.cantidad,
                totalCost: action.payload.costoTotal
            }
        case actions.SET_FORMATTED_DATE:
            const formattedDate = formatDate(action.payload)
            return {
                ...state,
                formattedDate: formattedDate
            }
        case actions.DELETE_ID:
            return {
                ...state,
                _id: null
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case actions.SET_NET_PROFIT:
            const netProfit = 0
            return {
                ...state,
                netProfit: netProfit
            }
        case actions.SET_PRODUCT:
            if (state.products.find(product => product._id === action.payload._id)) return state
            action.payload.cantidadesEntrantes = 0
            return {
                ...state,
                products: [...state.products, action.payload]
            }
        case actions.SET_PRODUCT_BARCODE:
            const fixedProductsBarcode = state.products.map(product => {
                if (product._id === action.payload.productID) {
                    product.codigoBarras = action.payload.barcode
                }
                return product
            })
            return {
                ...state,
                products: fixedProductsBarcode
            }
        case actions.SET_PRODUCT_NAME:
            const fixedProductsName = state.products.map(product => {
                if (product._id === action.payload.productID) {
                    product.nombre = action.payload.name
                }
                return product
            })
            return {
                ...state,
                products: fixedProductsName
            }
        case actions.SET_PRODUCT_QUANTITY:
            const fixedProductsQuantity = state.products.map(product => {
                if (product._id === action.payload.productID) {
                    product.cantidadesEntrantes = action.payload.quantity
                }
                return product
            })
            return {
                ...state,
                products: fixedProductsQuantity
            }
        case actions.SET_QUANTITY:
            const quantity = state.products.reduce((acc, item) => acc + item.cantidadesEntrantes, 0)
            return {
                ...state,
                quantity: quantity
            }
        default:
            return state
    }
}

const entries = {
    actions,
    initialState,
    reducer
}

export default entries