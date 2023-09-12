// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { Row, Col } from 'antd'

// Views
import HeaderElements from './HeaderElements'

// Services
import api from '../../services'

// Imports Destructurings
const { useSaleContext } = contexts.Sale


const Header = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

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

    const header = [
        {
            body: HeaderElements.BillingDate,
            name: 'billingDate',
            order_lg: 2,
            order_md: 2,
            order_sm: 4,
            order_xl: 2,
            order_xs: 4,
            order_xxl: 2
        },
        {
            body: HeaderElements.BillingClient,
            name: 'billingClient',
            order_lg: 3,
            order_md: 4,
            order_sm: 5,
            order_xl: 3,
            order_xs: 5,
            order_xxl: 3
        },
        {
            body: HeaderElements.BillingDocument,
            name: 'billingDocument',
            order_lg: 6,
            order_md: 6,
            order_sm: 6,
            order_xl: 6,
            order_xs: 6,
            order_xxl: 6
        },
        {
            body: HeaderElements.BillingLoadingDocument,
            name: 'billingLoadingDocument',
            order_lg: 7,
            order_md: 8,
            order_sm: 7,
            order_xl: 7,
            order_xs: 7,
            order_xxl: 7
        },
        {
            body: HeaderElements.BillingPaymentMethods,
            name: 'billingPaymentMethods',
            order_lg: 10,
            order_md: 10,
            order_sm: 8,
            order_xl: 10,
            order_xs: 8,
            order_xxl: 10
        },
        {
            body: HeaderElements.BillingPaymentPlans,
            name: 'billingPaymentPlans',
            order_lg: 11,
            order_md: 12,
            order_sm: 9,
            order_xl: 11,
            order_xs: 9,
            order_xxl: 11
        },
        {
            body: HeaderElements.CleanFieldsButton,
            name: 'cleanFieldsButton',
            order_lg: 4,
            order_md: 7,
            order_sm: 10,
            order_xl: 4,
            order_xs: 10,
            order_xxl: 4
        },
        {
            body: HeaderElements.CleanGlobalPercentageButton,
            name: 'cleanGlobalPercentageButton',
            order_lg: 12,
            order_md: 11,
            order_sm: 12,
            order_xl: 12,
            order_xs: 12,
            order_xxl: 12
        },
        {
            body: HeaderElements.CleanProductsButton,
            name: 'cleanProductsButton',
            order_lg: 8,
            order_md: 9,
            order_sm: 11,
            order_xl: 8,
            order_xs: 11,
            order_xxl: 8
        },
        {
            body: HeaderElements.CustomProductListButton,
            name: 'customProductListButton',
            order_lg: 5,
            order_md: 3,
            order_sm: 2,
            order_xl: 5,
            order_xs: 2,
            order_xxl: 5
        },
        {
            body: HeaderElements.GlobalPercentageButton,
            name: 'globalPercentageButton',
            order_lg: 9,
            order_md: 5,
            order_sm: 3,
            order_xl: 9,
            order_xs: 3,
            order_xxl: 9
        },
        {
            body: HeaderElements.ProductListButton,
            name: 'productListButton',
            order_lg: 1,
            order_md: 1,
            order_sm: 1,
            order_xl: 1,
            order_xs: 1,
            order_xxl: 1
        },
    ]

    const responsiveGrid = {
        col_span_lg: 6,
        col_span_md: 12,
        col_span_sm: 24,
        col_span_xl: 6,
        col_span_xs: 24,
        col_span_xxl: 6,
        row_gutter_horizontal: 8,
        row_gutter_vertical: 8,
    }

    return (
        <Col span={24}>
            <Row>
                <Col span={24}>
                    <Row
                        gutter={[
                            responsiveGrid.row_gutter_horizontal,
                            responsiveGrid.row_gutter_vertical
                        ]}
                        justify='space-around'
                    >
                        {
                            header.map(item => {
                                return (
                                    <Col
                                        key={item.name}
                                        lg={{
                                            order: item.order_lg,
                                            span: responsiveGrid.col_span_lg
                                        }}
                                        md={{
                                            order: item.order_md,
                                            span: responsiveGrid.col_span_md
                                        }}
                                        sm={{
                                            order: item.order_sm,
                                            span: responsiveGrid.col_span_sm
                                        }}
                                        xl={{
                                            order: item.order_xl,
                                            span: responsiveGrid.col_span_xl
                                        }}
                                        xs={{
                                            order: item.order_xs,
                                            span: responsiveGrid.col_span_xs
                                        }}
                                        xxl={{
                                            order: item.order_xxl,
                                            span: responsiveGrid.col_span_xxl
                                        }}
                                    >
                                        {item.body}
                                    </Col>
                                )
                            })
                        }
                    </Row>
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