const actions = {
    DESELECT_ALL_EXCEL_OPTIONS: 'DESELECT_ALL_EXCEL_OPTIONS',
    HIDE_PRODUCT_DETAILS_MODAL: 'HIDE_PRODUCT_DETAILS_MODAL',
    SELECT_ALL_EXCEL_OPTIONS: 'SELECT_ALL_EXCEL_OPTIONS',
    SET_PRODUCT_FOR_DETAILS_MODAL: 'SET_PRODUCT_FOR_DETAILS_MODAL',
    SET_EXCEL_OPTIONS: 'SET_EXCEL_OPTIONS'
}

const initialState = {
    activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }],
    allExcelTitles: [
        'Producto',
        'Rubro',
        'Marca',
        'Cód. producto',
        'Cód. barras',
        '% IVA compra',
        'IVA compra ($)',
        'Precio de lista ($)',
        '% IVA venta',
        'IVA venta ($)',
        '% Ganancia',
        'Precio de venta ($)',
        'Ganancia por venta ($)',
        '% Ganancia fraccionada',
        'Precio de venta fraccionada ($)',
        'Ganancia venta fraccionada ($)',
        'Precio de venta por unidad fraccionada ($)',
        'Ganancia venta por unidad fraccionada ($)',
        'Stock',
        'Stock fraccionado',
        'Unidad de medida',
        'Fraccionamiento',
    ],
    productDetailsModalVisibility: false,
    productForDetailsModal: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.DESELECT_ALL_EXCEL_OPTIONS:
            const notAllOptions = state.activeExcelOptions.filter(option => option.value !== 'todas')
            const optionsValues = notAllOptions.map(option => option.value)
            const fixedOptions = optionsValues.includes('producto')
                ? notAllOptions
                : [{ disabled: true, label: 'Producto', value: 'producto' }].concat(notAllOptions)
            return {
                ...state,
                activeExcelOptions: fixedOptions
            }
        case actions.HIDE_PRODUCT_DETAILS_MODAL:
            return {
                ...state,
                productDetailsModalVisibility: false,
                productForDetailsModal: null
            }
        case actions.SELECT_ALL_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: [{ disabled: false, label: 'Todas', value: 'todas' }]
            }
        case actions.SET_PRODUCT_FOR_DETAILS_MODAL:
            return {
                ...state,
                productDetailsModalVisibility: true,
                productForDetailsModal: action.payload
            }
        case actions.SET_EXCEL_OPTIONS:
            return {
                ...state,
                activeExcelOptions: action.payload
            }
        default:
            return state
    }
}

const products = {
    initialState,
    actions,
    reducer,
}

export default products