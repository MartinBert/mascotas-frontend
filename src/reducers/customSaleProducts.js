import helpers from '../helpers'
const { roundTwoDecimals } = helpers.mathHelper

const initialState = {
    customProductModalIsVisible: false,
    listOfCustomProductModalIsVisible: false,
    customSaleProducts: []
}

const actions = {
    DELETE_ALL_CUSTOM_PRODUCTS: 'DELETE_ALL_CUSTOM_PRODUCTS',
    DELETE_CUSTOM_PRODUCT: 'DELETE_CUSTOM_PRODUCT',
    HIDE_CUSTOM_PRODUCT_MODAL: 'HIDE_CUSTOM_PRODUCT_MODAL',
    HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL',
    SET_CUSTOM_PRODUCT: 'SET_CUSTOM_PRODUCT',
    SHOW_CUSTOM_PRODUCT_MODAL: 'SHOW_CUSTOM_PRODUCT_MODAL',
    SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL: 'SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.DELETE_ALL_CUSTOM_PRODUCTS:
            return {
                ...state,
                customSaleProducts: []
            }
        case actions.DELETE_CUSTOM_PRODUCT:
            return {
                ...state,
                customSaleProducts: state.customSaleProducts
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
        case actions.SET_CUSTOM_PRODUCT:
            if (state.customSaleProducts.find(product => product._id === action.payload._id)) return state;
            return {
                ...state,
                customSaleProducts: state.customSaleProducts.concat({
                    _id: action.payload._id,
                    codigoBarras: action.payload._id,
                    ivaVenta: roundTwoDecimals(action.payload.unitPrice * action.payload.percentageIVA / 100),
                    key: action.payload._id,
                    nombre: action.payload.concept,
                    precioVenta: action.payload.unitPrice,
                    porcentajeIvaVenta: action.payload.percentageIVA,
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

const customSaleProducts = {
    actions,
    initialState,
    reducer
}

export default customSaleProducts