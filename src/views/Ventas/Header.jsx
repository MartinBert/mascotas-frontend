// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { Row, Col } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import HeaderElements from './HeaderElements'

// Imports Destructurings
const { useSaleContext } = contexts.Sale
const { findNextVoucherNumber_fiscal, findNextVoucherNumber_noFiscal } = helpers.afipHelper


const Header = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    useEffect(() => {
        const loadNextVoucherNumber = async () => {
            if (!sale_state.documento) return
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
            sale_dispatch({ type: 'SET_TOTAL' })

            let number
            if (sale_state.documentoFiscal) {
                number = await findNextVoucherNumber_fiscal(
                    sale_state.documentoCodigo,
                    sale_state.empresaCuit,
                    sale_state.puntoVentaNumero
                )
            } else {
                number = await findNextVoucherNumber_noFiscal(
                    sale_state.documentoCodigo
                )
            }
            sale_dispatch({ type: 'SET_VOUCHER_NUMBERS', payload: number })
            sale_dispatch({ type: 'LOADING_DOCUMENT_INDEX' })
        }
        loadNextVoucherNumber()
    }, [sale_state.documento])

    const header = [
        {
            element: HeaderElements.BillingDate,
            name: 'billingDate',
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 }
        },
        {
            element: HeaderElements.BillingClient,
            name: 'billingClient',
            order: { lg: 3, md: 4, sm: 5, xl: 3, xs: 5, xxl: 3 }
        },
        {
            element: HeaderElements.BillingDocument,
            name: 'billingDocument',
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        },
        {
            element: HeaderElements.BillingLoadingDocument,
            name: 'billingLoadingDocument',
            order: { lg: 7, md: 8, sm: 7, xl: 7, xs: 7, xxl: 7 }
        },
        {
            element: HeaderElements.BillingPaymentMethods,
            name: 'billingPaymentMethods',
            order: { lg: 10, md: 10, sm: 8, xl: 10, xs: 8, xxl: 10 }
        },
        {
            element: HeaderElements.BillingPaymentPlans,
            name: 'billingPaymentPlans',
            order: { lg: 11, md: 12, sm: 9, xl: 11, xs: 9, xxl: 11 }
        },
        {
            element: HeaderElements.CleanFieldsButton,
            name: 'cleanFieldsButton',
            order: { lg: 4, md: 7, sm: 10, xl: 4, xs: 10, xxl: 4 }
        },
        {
            element: HeaderElements.CleanGlobalPercentageButton,
            name: 'cleanGlobalPercentageButton',
            order: { lg: 12, md: 11, sm: 12, xl: 12, xs: 12, xxl: 12 }
        },
        {
            element: HeaderElements.CleanProductsButton,
            name: 'cleanProductsButton',
            order: { lg: 8, md: 9, sm: 11, xl: 8, xs: 11, xxl: 8 }
        },
        {
            element: HeaderElements.CustomProductListButton,
            name: 'customProductListButton',
            order: { lg: 5, md: 3, sm: 2, xl: 5, xs: 2, xxl: 5 }
        },
        {
            element: HeaderElements.GlobalPercentageButton,
            name: 'globalPercentageButton',
            order: { lg: 9, md: 5, sm: 3, xl: 9, xs: 3, xxl: 9 }
        },
        {
            element: HeaderElements.ProductListButton,
            name: 'productListButton',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 6, md: 12, sm: 24, xl: 6, xs: 24, xxl: 6 }
    }

    return (
        <Col span={24}>
            <Row>
                <Col span={24}>
                    <Row
                        gutter={[
                            responsiveGrid.gutter.horizontal,
                            responsiveGrid.gutter.vertical
                        ]}
                        justify='space-around'
                    >
                        {
                            header.map(item => {
                                return (
                                    <Col
                                        key={item.name}
                                        lg={{
                                            order: item.order.lg,
                                            span: responsiveGrid.span.lg
                                        }}
                                        md={{
                                            order: item.order.md,
                                            span: responsiveGrid.span.md
                                        }}
                                        sm={{
                                            order: item.order.sm,
                                            span: responsiveGrid.span.sm
                                        }}
                                        xl={{
                                            order: item.order.xl,
                                            span: responsiveGrid.span.xl
                                        }}
                                        xs={{
                                            order: item.order.xs,
                                            span: responsiveGrid.span.xs
                                        }}
                                        xxl={{
                                            order: item.order.xxl,
                                            span: responsiveGrid.span.xxl
                                        }}
                                    >
                                        {item.element}
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