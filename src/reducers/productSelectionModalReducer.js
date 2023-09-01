import helpers from '../helpers'
const { roundTwoDecimals } = helpers.mathHelper

const initialState = {
    customProductModalIsVisible: false,
    listOfCustomProductModalIsVisible: false,
    productModalIsVisible: false,
    selectionLimit: 100000000,
    selectedCustomProducts: [],
    selectedProducts: []
}

const actions = {
    DELETE_ALL_CUSTOM_PRODUCTS: 'DELETE_ALL_CUSTOM_PRODUCTS',
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    CLEAN_STATE: 'CLEAN_STATE',
    DELETE_CUSTOM_PRODUCT: 'DELETE_CUSTOM_PRODUCT',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    HIDE_CUSTOM_PRODUCT_MODAL: 'HIDE_CUSTOM_PRODUCT_MODAL',
    HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL',
    HIDE_PRODUCT_MODAL: 'HIDE_PRODUCT_MODAL',
    SET_CUSTOM_PRODUCT: 'SET_CUSTOM_PRODUCT',
    SET_PRODUCT: 'SET_PRODUCT',
    SET_SELECTION_LIMIT: 'SET_SELECTION_LIMIT',
    SHOW_CUSTOM_PRODUCT_MODAL: 'SHOW_CUSTOM_PRODUCT_MODAL',
    SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL: 'SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL',
    SHOW_PRODUCT_MODAL: 'SHOW_PRODUCT_MODAL',
    UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS: 'UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_CUSTOM_PRODUCT:
            if (state.selectedCustomProducts.find(product => product._id === action.payload._id)) return state;
            return {
                ...state,
                selectedCustomProducts: state.selectedCustomProducts.concat({
                    _id: action.payload._id,
                    nombre: action.payload.concept,
                    codigoProducto: action.payload._id,
                    codigoBarras: action.payload._id,
                    marca: action.payload.brand,
                    rubro: action.payload.productLine,
                    unidadMedida: action.payload.unitOfMeasure,
                    cantidadFraccionadaStock: 0,
                    cantidadStock: 0,
                    precioUnitario: action.payload.unitPrice,
                    margenGanancia: 0,
                    margenGananciaFraccionado: 0,
                    precioVenta: action.payload.unitPrice,
                    gananciaNeta: 0,
                    precioVentaFraccionado: action.payload.unitPrice,
                    gananciaNetaFraccionado: 0,
                    porcentajeIvaCompra: 0,
                    ivaCompra: 0,
                    porcentajeIvaVenta: action.payload.percentageIVA,
                    ivaVenta: roundTwoDecimals(action.payload.unitPrice * action.payload.percentageIVA / 100),
                    imagenes: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    __v: 0,
                    selected: true,

                    // _id: action.payload._id,
                    // cantidadFraccionadaStock: 0,
                    // cantidadStock: 0,
                    // codigoProducto: action.payload._id,
                    // codigoBarras: action.payload._id,
                    // gananciaNeta: 0,
                    // gananciaNetaFraccionado: 0,
                    // imagenes: [],
                    // ivaCompra: 0,
                    // ivaVenta: roundTwoDecimals(action.payload.unitPrice * action.payload.percentageIVA / 100),
                    // key: action.payload._id,
                    // marca: action.payload.brand,
                    // margenGanancia: 0,
                    // margenGananciaFraccionado: 0,
                    // nombre: action.payload.concept,
                    // nota: '',
                    // precioUnitario: action.payload.unitPrice,
                    // precioVenta: action.payload.unitPrice,
                    // precioVentaFraccionado: action.payload.unitPrice,
                    // porcentajeIvaCompra: 0,
                    // porcentajeIvaVenta: action.payload.percentageIVA,
                    // rubro: action.payload.productLine,
                    // selected: true,
                    // unidadMedida: action.payload.unitOfMeasure,

                    // __v: 0,
                    // createdAt: new Date(),
                    // updatedAt: new Date()
                })
            }
        case actions.SET_PRODUCT:
            if (state.selectedProducts.find(product => product._id === action.payload._id)) return state;
            return {
                ...state,
                selectedProducts: [
                    ...state.selectedProducts,
                    action.payload
                ]
            }
        case actions.DELETE_CUSTOM_PRODUCT:
            return {
                ...state,
                selectedCustomProducts: state.selectedCustomProducts
                    .filter(customProduct => customProduct._id !== action.payload)
                    .map((customProduct, index) => {
                        customProduct = {
                            ...customProduct,
                            _id: 'customProduct_' + (1 + index),
                            key: 'customProduct_' + (1 + index)
                        }
                        return customProduct
                    })
            }
        case actions.DELETE_PRODUCT:
            const productsRemaining = state.selectedProducts
                .filter(product => product._id !== action.payload)
                .filter(product => !(product._id.startsWith('customProduct_')))

            const customProductsRemaining = state.selectedProducts
                .filter(product => product._id !== action.payload)
                .filter(product => product._id.startsWith('customProduct_'))
                .map((customProduct, index) => {
                    customProduct = {
                        ...customProduct,
                        _id: 'customProduct_' + (1 + index),
                        key: 'customProduct_' + (1 + index)
                    }
                    return customProduct
                })

            return {
                ...state,
                selectedProducts: productsRemaining.concat(customProductsRemaining)
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
        case actions.SHOW_PRODUCT_MODAL:
            return {
                ...state,
                productModalIsVisible: true
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
        case actions.HIDE_PRODUCT_MODAL:
            return {
                ...state,
                productModalIsVisible: false
            }
        case actions.SET_SELECTION_LIMIT:
            return {
                ...state,
                selectionLimit: action.payload
            }
        case actions.DELETE_ALL_CUSTOM_PRODUCTS:
            return {
                ...state,
                selectedCustomProducts: []
            }
        case actions.DELETE_ALL_PRODUCTS:
            return {
                ...state,
                selectedProducts: []
            }
        case actions.CLEAN_STATE:
            return {
                productModalIsVisible: false,
                selectionLimit: 100000000,
                selectedProducts: []
            }
        case actions.UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS:
            const unifyProductsAndCustomProducts = state.selectedProducts.concat(state.selectedCustomProducts)
            return {
                ...state,
                selectedCustomProducts: [],
                selectedProducts: unifyProductsAndCustomProducts
            }
        default:
            return state;
    }
}

const getNamedStates = () => {
    return {
        productInitialState: initialState,
        productReducer: reducer,
        productActions: actions
    }
}

const productSelectionModalReducer = {
    initialState,
    actions,
    reducer,
    getNamedStates
}

export default productSelectionModalReducer