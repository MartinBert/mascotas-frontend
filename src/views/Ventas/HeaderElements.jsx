// React Components and Hooks
import React from 'react'

// Custom Components
import { GenericAutocomplete } from '../../components/generics'
import { errorAlert } from '../../components/alerts'

// Design Components
import { DatePicker, Select, Spin } from 'antd'
import dayjs from 'dayjs'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Imports Destructurings
const { useCustomProductsContext } = contexts.CustomProducts
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { useSaleContext } = contexts.Sale
const { useSaleProductsContext } = contexts.SaleProducts
const { isItLater, localFormat } = helpers.dateHelper
const { Option } = Select


const BillingClient = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    return (
        <GenericAutocomplete
            label='Cliente'
            modelToFind='cliente'
            keyToCompare='razonSocial'
            controller='clientes'
            selectedSearch={sale_state.cliente}
            dispatch={sale_dispatch}
            action={'SET_CLIENT'}
            returnCompleteModel={true}
        />
    )
}

const BillingDate = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    const changeDate = (e) => {
        if (!e) sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        else {
            if (isItLater(new Date(), e.$d)) {
                errorAlert('No es conveniente facturar con fecha posterior a hoy.')
                sale_dispatch({ type: 'SET_DATES', payload: new Date() })
            }
            else sale_dispatch({ type: 'SET_DATES', payload: e.$d })
        }
    }

    return (
        <DatePicker
            format={['DD/MM/YYYY']}
            onChange={e => changeDate(e)}
            style={{ width: '100%' }}
            value={dayjs(localFormat(sale_state.fechaEmision), ['DD/MM/YYYY'])}
        />
    )
}

const BillingDocument = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    return (
        <GenericAutocomplete
            label='Documento'
            modelToFind='documento'
            keyToCompare='nombre'
            controller='documentos'
            selectedSearch={sale_state.documento}
            dispatch={sale_dispatch}
            action={'SET_DOCUMENT'}
            returnCompleteModel={true}
        />
    )
}

const BillingLoadingDocument = () => {
    const [sale_state] = useSaleContext()

    return (
        !sale_state.loadingDocumentIndex
            ? null
            : <span><Spin />Procesando...</span>
    )
}

const BillingPaymentMethods = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    return (
        <GenericAutocomplete
            label='Medio de pago'
            modelToFind='mediopago'
            keyToCompare='nombre'
            controller='mediospago'
            selectedSearch={sale_state.mediosPago[0]}
            dispatch={sale_dispatch}
            action={'SET_PAYMENT_METHODS'}
            actionSecondary={'SET_PAYMENT_PLANS'}
            actionTertiary={'SET_TOTAL'}
            payloadSecondary={0}
            returnCompleteModel={true}
        />
    )
}

const BillingPaymentPlans = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    const setPaymentPlans = (e) => {
        sale_dispatch({ type: 'SET_PAYMENT_PLANS', payload: [JSON.parse(e)] })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    return (
        <Select
            onChange={e => setPaymentPlans(e)}
            style={{ width: '100%' }}
            placeholder='Plan de pago'
            value={sale_state.planesPagoNombres[0]}
        >
            {
                !sale_state.planesPagoToSelect
                    ? null
                    : sale_state.planesPagoToSelect.map(item => {
                        return (
                            <Option
                                key={item._id}
                                value={JSON.stringify(item)}
                            >
                                {item.nombre}
                            </Option>
                        )
                    })
            }
        </Select>
    )
}

const CleanFieldsButton = () => {
    const [, sale_dispatch] = useSaleContext()

    const cleanFields = () => {
        sale_dispatch({ type: 'SET_CLIENT', payload: null })
        sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        sale_dispatch({ type: 'SET_DOCUMENT', payload: null })
        sale_dispatch({ type: 'SET_PAYMENT_METHODS', payload: null })
        sale_dispatch({ type: 'SET_PAYMENT_PLANS', payload: null })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    return (
        <button
            className='btn-primary'
            onClick={() => cleanFields()}
        >
            Borrar campos
        </button>
    )
}

const CleanGlobalPercentageButton = () => {
    const [, sale_dispatch] = useSaleContext()

    const cleanGlobalPercentage = () => {
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_PERCENT', payload: 0 })
        sale_dispatch({ type: 'SET_GLOBAL_SURCHARGE_PERCENT', payload: 0 })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    return (
        <button
            className='btn-primary'
            onClick={() => cleanGlobalPercentage()}
        >
            Borrar % global
        </button>
    )
}

const CleanProductsButton = () => {
    const [, saleProducts_dispatch] = useSaleProductsContext()

    const cleanProducts = () => {
        saleProducts_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
    }

    return (
        <button
            className='btn-primary'
            onClick={() => cleanProducts()}
        >
            Borrar productos
        </button>
    )
}

const CustomProductListButton = () => {
    const [, customProducts_dispatch] = useCustomProductsContext()

    const openCustomProductList = () => {
        customProducts_dispatch({ type: 'SHOW_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    return (
        <button
            className='btn-primary'
            onClick={() => openCustomProductList()}
        >
            Producto Personalizado
        </button>
    )
}

const GlobalPercentageButton = () => {
    const [, sale_dispatch] = useSaleContext()

    const openGlobalPercentageModal = () => {
        sale_dispatch({ type: 'SHOW_DISCOUNT_SURCHARGE_MODAL' })
    }

    return (
        <button
            className='btn-primary'
            onClick={() => openGlobalPercentageModal()}
        >
            Descuento/Recargo
        </button>
    )
}

const ProductListButton = () => {
    const [, productSelectionModal_dispatch] = useProductSelectionModalContext()

    const openProductList = () => {
        productSelectionModal_dispatch({ type: 'SHOW_PRODUCT_MODAL' })
    }

    return (
        <button
            className='btn-primary'
            onClick={() => openProductList()}
        >
            Productos
        </button>
    )
}

const HeaderElements = {
    BillingClient: <BillingClient />,
    BillingDate: <BillingDate />,
    BillingDocument: <BillingDocument />,
    BillingLoadingDocument: <BillingLoadingDocument />,
    BillingPaymentMethods: <BillingPaymentMethods />,
    BillingPaymentPlans: <BillingPaymentPlans />,
    CleanFieldsButton: <CleanFieldsButton />,
    CleanGlobalPercentageButton: <CleanGlobalPercentageButton />,
    CleanProductsButton: <CleanProductsButton />,
    CustomProductListButton: <CustomProductListButton />,
    GlobalPercentageButton: <GlobalPercentageButton />,
    ProductListButton: <ProductListButton />,
}

export default HeaderElements