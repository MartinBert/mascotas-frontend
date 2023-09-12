// Helpers
import helpers from '../helpers'
import dayjs from 'dayjs'

// Imports Destructuring
const { localFormat } = helpers.dateHelper

const initialState = {
    date: new Date(),
    description: '',
    formattedDate: dayjs(localFormat(new Date()), ['DD/MM/YYYY']),
    netProfit: 0,
    products: [],
    totalCost: 0
}

const actions = {
    CALCULATE_TOTAL_COST: 'CALCULATE_TOTAL_COST',
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_DATE: 'SET_DATE',
    SET_DESCRIPTION: 'SET_DESCRIPTION',
    SET_FORMATTED_DATE: 'SET_FORMATTED_DATE',
    SET_NET_PROFIT: 'SET_NET_PROFIT',
    SET_PRODUCT: 'SET_PRODUCT',
    SET_PRODUCT_BARCODE: 'SET_PRODUCT_BARCODE',
    SET_PRODUCT_NAME: 'SET_PRODUCT_NAME',
    SET_PRODUCT_QUANTITY: 'SET_PRODUCT_QUANTITY'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CALCULATE_TOTAL_COST:
            const totalCost = state.products.reduce(
                (acc, item) =>
                    acc + (
                        item.cantidadesEntrantes
                            ? item.precioUnitario * item.cantidadesEntrantes
                            : 0
                    ), 0
            )

            return {
                ...state,
                totalCost: totalCost
            }
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
        case actions.SET_FORMATTED_DATE:
            const formattedDate = dayjs(localFormat(action.payload), ['DD/MM/YYYY'])

            return {
                ...state,
                formattedDate: formattedDate
            }
        case actions.SET_NET_PROFIT:
            const netProfit = 0
            return {
                ...state,
                netProfit: netProfit
            }
        case actions.SET_PRODUCT:
            if (state.products.find(product => product._id === action.payload._id)) return state
            return {
                ...state,
                products: [
                    ...state.products,
                    action.payload
                ]
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