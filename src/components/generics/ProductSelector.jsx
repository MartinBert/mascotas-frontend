import React from 'react'
import api from '../../services'
import contexts from '../../contexts'
import helpers from '../../helpers'
import { Select } from 'antd'

const { useGenericComponentsContext } = contexts.GenericComponents
const { existsProperty } = helpers.objHelper
const { nonCaseSensitive, normalizeString } = helpers.stringHelper


const ProductSelector = (props) => {
    const {
        genericComponents_actions,
        genericComponents_dispatch,
        genericComponents_params,
        genericComponents_state
    } = useGenericComponentsContext()
    const {
        currentSelectedProducts,
        dispatch,
        actionToDispatchProduct,
        searchParam
    } = props

    const getFindParams = (e) => {
        let query = {}
        switch (searchParam) {
            case genericComponents_params.productSelector.searchParams.barCode:
                query.normalizedBarcode = normalizeString(e)
                break
            case genericComponents_params.productSelector.searchParams.name:
                query.normalizedName = normalizeString(e)
                break
            case genericComponents_params.productSelector.searchParams.productCode:
                query.normalizedProductCode = normalizeString(e)
                break
            default:
                break
        }
        const idsOfCurrentSelectedProducts = currentSelectedProducts.map(productOrId => {
            let id = ''
            if (typeof productOrId === 'string') id = productOrId
            else if (typeof productOrId === 'object' && existsProperty(productOrId, 'id')) id = productOrId.id
            else id = productOrId._id
            return id
        })
        query._id = { $nin: idsOfCurrentSelectedProducts }
        const findParams = { filters: JSON.stringify(query), limit: 8, page: 1 }
        return findParams
    }

    const getPlaceholder = () => {
        let placeholder = ''
        switch (searchParam) {
            case genericComponents_params.productSelector.searchParams.barCode:
                placeholder = 'Código de barras'
                break
            case genericComponents_params.productSelector.searchParams.name:
                placeholder = 'Nombre del producto'
                break
            case genericComponents_params.productSelector.searchParams.productCode:
                placeholder = 'Código de producto'
                break
            default:
                placeholder = '<...error placeholder>'
        }
        return placeholder
    }

    const onSearch = async (e) => {
        const params = getFindParams(e)
        const findProducts = await api.products.findPaginated(params)
        const products = findProducts.docs
        let options
        switch (searchParam) {
            case genericComponents_params.productSelector.searchParams.barCode:
                options = products.map(product => {
                    const option = {
                        label: `${product.nombre} (cód. barras: ${product.codigoBarras})`,
                        value: product._id
                    }
                    return option
                })
                break
            case genericComponents_params.productSelector.searchParams.name:
                options = products.map(product => {
                    const option = {
                        label: `${product.nombre}`,
                        value: product._id
                    }
                    return option
                })
                break
            case genericComponents_params.productSelector.searchParams.productCode:
                options = products.map(product => {
                    const option = {
                        label: `${product.nombre} (cód. prod: ${product.codigoProducto})`,
                        value: product._id
                    }
                    return option
                })
                break
            default:
                options = []
        }
        genericComponents_dispatch({
            type: genericComponents_actions.PRODUCT_SELECTOR_SET_OPTIONS,
            payload: options
        })
    }

    const onSelect = async (e) => {
        const findProduct = await api.products.findById(e)
        const product = findProduct.data
        dispatch({ type: actionToDispatchProduct, payload: product })
        genericComponents_dispatch({
            type: genericComponents_actions.PRODUCT_SELECTOR_SET_OPTIONS,
            payload: []
        })
    }

    
    const selectToAddProductByName = (
        <Select
            allowClear
            filterOption={nonCaseSensitive}
            onSearch={onSearch}
            onSelect={onSelect}
            options={genericComponents_state.productSelector.options}
            placeholder={getPlaceholder()}
            showSearch
            style={{ width: '100%' }}
            value={null}
        />
    )

    return selectToAddProductByName
}

export default ProductSelector