const actions = {
    DELETE_ALL_PRODUCTS: 'DELETE_ALL_PRODUCTS',
    DELETE_PRODUCTS: 'DELETE_PRODUCTS',
    SET_PRODUCTS: 'SET_PRODUCTS',
    UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS: 'UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS'
}

const initialState = {
    params: {
        productos: []
    }
}

const getCustomProducts = (allProducts) => {
    const customProducts = allProducts.filter(product => product._id.startsWith('customProduct_'))
    return customProducts
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.DELETE_ALL_PRODUCTS:
            return {
                ...state,
                params: { ...state.params, productos: [] }
            }
        case actions.DELETE_PRODUCTS:
            const productsToDeleteIDs = action.payload.map(product => product._id)
            const currentProducts = state.params.productos
                .filter(product => !productsToDeleteIDs.includes(product._id))
                .filter(product => !product._id.startsWith('customProduct_'))
            const currentCustomProducts = state.params.productos
                .filter(product => !productsToDeleteIDs.includes(product._id))
                .filter(product => product._id.startsWith('customProduct_'))
                .map((customProduct, index) => {
                    customProduct = {
                        ...customProduct,
                        _id: 'customProduct_' + (1 + index),
                        codigoBarras: 'customProduct_' + (1 + index),
                        key: 'customProduct_' + (1 + index)
                    }
                    return customProduct
                })
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: currentProducts.concat(currentCustomProducts)
                }
            }
        case actions.SET_PRODUCTS:
            const customProducts = getCustomProducts(state.params.productos)
            const productsToSet = [...action.payload, ...customProducts]
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: productsToSet
                }
            }
        case actions.UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS:
            return {
                ...state,
                params: {
                    ...state.params,
                    productos: state.params.productos.concat(action.payload)
                }
            }
        default:
            return state;
    }
}

const saleProducts = {
    initialState,
    actions,
    reducer
}

export default saleProducts