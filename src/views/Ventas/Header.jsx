// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { ProductSelectionModal, GenericAutocomplete } from '../../components/generics'
import { errorAlert } from '../../components/alerts'

// Design Components
import { DatePicker, Row, Col, Select, Spin } from 'antd'
import dayjs from 'dayjs'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Services
import api from '../../services'

// Helpers
import helpers from '../../helpers'

// Imports Destructurings
const { useSaleContext } = contextProviders.SaleContextProvider
const { useProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider
const { isItLater, localFormat } = helpers.dateHelper
const { Option } = Select


const Header = () => {
    const saleContext = useSaleContext()
    const [sale_state, sale_dispatch] = saleContext
    const productContext = useProductSelectionModalContext()
    const [, product_dispatch] = productContext

    useEffect(() => {
        if (!sale_state.documento) return
        sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
        let attemps = 0
        sale_dispatch({ type: 'SET_TOTAL' })

        const fetchLastFiscalVoucherNumber = async () => {
            const lastVoucherNumber = await api.afip.findLastVoucherNumber(
                sale_state.empresaCuit,
                sale_state.puntoVentaNumero,
                sale_state.documentoCodigo
            )
            if (lastVoucherNumber === undefined && attemps < 10) return setTimeout(() => {
                attemps++
                return fetchLastFiscalVoucherNumber()
            }, 500)
            if (lastVoucherNumber === undefined) return errorAlert('No se pudo recuperar la correlación de AFIP del último comprobante emitido, intente nuevamente más tarde.').then(() => { window.location.reload() })
            const nextVoucher = lastVoucherNumber + 1
            sale_dispatch({ type: 'SET_VOUCHER_NUMBERS', payload: nextVoucher })
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
        }

        const fetchLastNoFiscalVoucherNumber = async () => {
            const lastVoucherNumber = await api.ventas.findLastVoucherNumber(sale_state.documentoCodigo)
            if (lastVoucherNumber === undefined && attemps < 10) return setTimeout(() => {
                attemps++
                return fetchLastNoFiscalVoucherNumber()
            }, 500)
            if (lastVoucherNumber === undefined) return errorAlert('No se pudo recuperar la correlación de comprobantes, intente más tarde.').then(() => { window.location.reload() })
            const nextVoucher = lastVoucherNumber + 1
            sale_dispatch({ type: 'SET_VOUCHER_NUMBERS', payload: nextVoucher })
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
        }

        (sale_state.documentoFiscal) ? fetchLastFiscalVoucherNumber() : fetchLastNoFiscalVoucherNumber()
    },
        //eslint-disable-next-line
        [sale_state.documento]
    )

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

    const cleanFields = () => {
        sale_dispatch({ type: 'SET_CLIENT', payload: null })
        sale_dispatch({ type: 'SET_DATES', payload: new Date() })
        sale_dispatch({ type: 'SET_DOCUMENT', payload: null })
        sale_dispatch({ type: 'SET_PAYMENT_METHODS', payload: null })
        sale_dispatch({ type: 'SET_PAYMENT_PLANS', payload: null })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const cleanGlobalPercentage = () => {
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_PERCENT', payload: 0 })
        sale_dispatch({ type: 'SET_GLOBAL_SURCHARGE_PERCENT', payload: 0 })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const cleanProducts = () => {
        product_dispatch({ type: 'CLEAN_STATE' })
    }

    return (
        <Col span={24}>
            <Row>
                <Col span={24}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Row gutter={8} justify='start'>
                                <Col xl={8} lg={12} md={16} sm={24}>
                                    <button
                                        className='btn-primary'
                                        onClick={() => product_dispatch({ type: 'SHOW_MODAL' })}
                                    >
                                        Productos
                                    </button>
                                </Col>
                                <Col xl={8} lg={12} md={16} sm={24}>
                                    <button
                                        className='btn-primary'
                                        onClick={() => sale_dispatch({ type: 'SHOW_DISCOUNT_SURCHARGE_MODAL' })}
                                    >
                                        Descuento/Recargo
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row gutter={8} justify='end'>
                                <Col xl={8} lg={12} md={16} sm={24}>
                                    <button
                                        className='btn-primary'
                                        onClick={() => cleanFields()}
                                    >
                                        Borrar campos
                                    </button>
                                </Col>
                                <Col xl={8} lg={12} md={16} sm={24}>
                                    <button
                                        className='btn-primary'
                                        onClick={() => cleanProducts()}
                                    >
                                        Borrar productos
                                    </button>
                                </Col>
                                <Col xl={8} lg={12} md={16} sm={24}>
                                    <button
                                        className='btn-primary'
                                        onClick={() => cleanGlobalPercentage()}
                                    >
                                        Borrar % global
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={20}>
                            <Row gutter={8}>
                                <Col xl={6} lg={6} md={12}>
                                    <DatePicker
                                        format={['DD/MM/YYYY']}
                                        onChange={e => changeDate(e)}
                                        style={{ width: '100%' }}
                                        value={dayjs(localFormat(sale_state.fechaEmision), ['DD/MM/YYYY'])}
                                    />
                                </Col>
                                <Col xl={6} lg={6} md={12}>
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
                                </Col>
                                <Col xl={6} lg={6} md={12}>
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
                                </Col>
                                <Col xl={6} lg={6} md={12}>
                                    {
                                        !sale_state.loadingDocumentIndex
                                            ? null
                                            : <span><Spin />Procesando...</span>
                                    }
                                </Col>
                                <Col xl={6} lg={6} md={12}>
                                    <GenericAutocomplete
                                        label='Medio de pago'
                                        modelToFind='mediopago'
                                        keyToCompare='nombre'
                                        controller='mediospago'
                                        selectedSearch={sale_state.mediosPago[0]}
                                        dispatch={sale_dispatch}
                                        action={'SET_PAYMENT_METHODS'}
                                        actionSecondary = {'SET_PAYMENT_PLANS'}
                                        actionTertiary = {'SET_TOTAL'}
                                        payloadSecondary={0}
                                        returnCompleteModel={true}
                                    />
                                </Col>
                                <Col xl={6} lg={6} md={12}>
                                    <Select
                                        onChange={e => {
                                            sale_dispatch({ type: 'SET_PAYMENT_PLANS', payload: [e] })
                                            sale_dispatch({ type: 'SET_TOTAL' })
                                        }}
                                        style={{ width: '100%' }}
                                        value={sale_state.planesPagoNombres[0]}
                                    >
                                        {
                                            !sale_state.planesPagoToSelect
                                                ? null
                                                : sale_state.planesPagoToSelect.map(item => <Option key={item._id} value={JSON.stringify(item)}>{item.nombre}</Option>)
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <ProductSelectionModal />
                </Col>
            </Row>
            <br />
            <Row>
                <Col span={12}>
                    {
                        (sale_state.porcentajeDescuentoGlobal === 0 && sale_state.porcentajeRecargoGlobal === 0)
                            ? null
                            : (
                                <span>
                                    {
                                        sale_state.porcentajeDescuentoGlobal !== 0
                                            ? <h1>Descuento de {sale_state.porcentajeDescuentoGlobal}% aplicado a toda la factura</h1>
                                            : <h1>Recargo de {sale_state.porcentajeRecargoGlobal}% aplicado a toda la factura</h1>
                                    }
                                </span>
                            )
                    }
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <h1>Neto Total: {sale_state.total}</h1>
                </Col>
            </Row>
        </Col>
    )
}

export default Header
