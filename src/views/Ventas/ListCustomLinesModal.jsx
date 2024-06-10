// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import icons from '../../components/icons'

// Design Components
import { Button, Col, Modal, Row, Table } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Imports Destructurings
const { useSaleContext } = contexts.Sale
const { useSaleCustomProductsContext } = contexts.SaleCustomProducts
const { useSaleProductsContext } = contexts.SaleProducts
const { Delete } = icons


const ListCustomLinesModal = () => {
    const [sale_state] = useSaleContext()
    const [customProducts_state, customProducts_dispatch] = useSaleCustomProductsContext()
    const [, saleProducts_dispatch] = useSaleProductsContext()

    // ---------------------- Actions -------------------- //
    const closeModalWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            customProducts_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
            setFocus(false)
        } else return
    }

    const existsRefs = () => {
        const refs = {
            buttonToAdd: sale_state.saleRefs.ref_buttonToAddCustomProduct,
            buttonToSave: sale_state.saleRefs.ref_buttonToSaveAddedCustomProducts,
            clientField: sale_state.saleRefs.ref_autocompleteClient,
            dateField: sale_state.saleRefs.ref_datePicker,
            documentField: sale_state.saleRefs.ref_autocompleteDocument,
            finalizeButton: sale_state.saleRefs.ref_buttonToFinalizeSale,
            openProductSelectionModalButton: sale_state.saleRefs.ref_buttonToOpenProductSelectionModal,
            paymentMethodField: sale_state.saleRefs.ref_autocompletePaymentMethod,
            paymentPlanField: sale_state.saleRefs.ref_autocompletePaymentPlan
        }
        const exists = !Object.values(refs).includes(null)
        const data = { exists, refs }
        return data
    }

    const setFocus = (e) => { // e: true when modal is open, false when is close
        const { exists, refs } = existsRefs()
        if (!exists) return
        let unfilledField
        if (e) {
            const existingCustomProducts = sale_state.renglones
                .filter(line => line._id.startsWith('customProduct_'))
                .concat(customProducts_state.saleCustomProducts)
                .length
            if (existingCustomProducts === 0) unfilledField = refs.buttonToAdd
            else unfilledField = refs.buttonToSave
        } else {
            if (!sale_state.valueForDatePicker) unfilledField = refs.dateField
            else if (refs.clientField.value === '') unfilledField = refs.clientField
            else if (refs.documentField.value === '') unfilledField = refs.documentField
            else if (refs.paymentMethodField.value === '') unfilledField = refs.paymentMethodField
            else if (refs.paymentPlanField.value === '') unfilledField = refs.paymentPlanField
            else if (sale_state.renglones.length === 0) unfilledField = refs.openProductSelectionModalButton
            else unfilledField = refs.finalizeButton
        }
        unfilledField.focus()
    }

    useEffect(() => { setFocus(true) }, [customProducts_state.saleCustomProducts.length])

    // ----------- Button to add custom product ---------- //
    const openCustomProductModal = () => {
        customProducts_dispatch({ type: 'SHOW_CUSTOM_PRODUCT_MODAL' })
    }

    const buttonToAddCustomProduct = (
        <Button
            id='buttonToAddCustomProduct'
            onClick={openCustomProductModal}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Añadir
        </Button>
    )

    // ----------------- Button to cancel ---------------- //
    const cancelAndCloseModal = () => {
        customProducts_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const buttonToCancel = (
        <Button
            danger
            onClick={cancelAndCloseModal}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // ------- Button to delete all custom product ------- //
    const removeAllCustomProducts = () => {
        customProducts_dispatch({ type: 'DELETE_ALL_CUSTOM_PRODUCTS' })
    }

    const buttonToDeleteAll = (
        <Button
            danger
            onClick={removeAllCustomProducts}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Eliminar todos
        </Button>
    )

    // ---------- Button to save custom products --------- //
    const saveProductsAndCloseModal = () => {
        saleProducts_dispatch({
            type: 'UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS',
            payload: customProducts_state.saleCustomProducts
        })
        customProducts_dispatch({ type: 'DELETE_ALL_CUSTOM_PRODUCTS' })
        customProducts_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const buttonToSaveCustomProducts = (
        <Button
            id='buttonToSaveAddedCustomProducts'
            onClick={saveProductsAndCloseModal}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Aceptar
        </Button>
    )

    // ---------------- Actions to render ---------------- //
    const buttonsToRender = [
        {
            element: buttonToAddCustomProduct,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: buttonToCancel,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: buttonToDeleteAll,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        },
        {
            element: buttonToSaveCustomProducts,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        }
    ]

    const responsiveGridForActionsButtons = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 6, md: 6, sm: 24, xl: 6, xs: 24, xxl: 6 }
    }

    const actionsButtons = (
        <Row
            gutter={[
                responsiveGridForActionsButtons.gutter.horizontal,
                responsiveGridForActionsButtons.gutter.vertical
            ]}
            justify='space-around'
        >
            {
                buttonsToRender.map((item, index) => {
                    return (
                        <Col
                            key={'listOfCustomLinesModal_buttonsToRender_' + index}
                            lg={{ order: item.order.lg, span: responsiveGridForActionsButtons.span.lg }}
                            md={{ order: item.order.md, span: responsiveGridForActionsButtons.span.md }}
                            sm={{ order: item.order.sm, span: responsiveGridForActionsButtons.span.sm }}
                            xl={{ order: item.order.xl, span: responsiveGridForActionsButtons.span.xl }}
                            xs={{ order: item.order.xs, span: responsiveGridForActionsButtons.span.xs }}
                            xxl={{ order: item.order.xxl, span: responsiveGridForActionsButtons.span.xxl }}
                        >
                            {item.element}
                        </Col>
                    )
                })
            }
        </Row>
    )

    // ------------- Table of custom products ------------ //
    const removeCustomProduct = (lineId) => {
        customProducts_dispatch({ type: 'DELETE_CUSTOM_PRODUCT', payload: lineId })
    }

    const columns = [
        {
            align: 'start',
            colSpan: 2,
            dataIndex: 'customLinesModal_concept',
            ellipsis: true,
            key: 'customLinesModal_concept',
            onCell: () => ({ colSpan: 2 }),
            render: (_, product) => product.nombre,
            title: 'Concepto'
        },
        {
            align: 'start',
            dataIndex: 'customLinesModal_unitPrice',
            key: 'customLinesModal_unitPrice',
            render: (_, product) => product.precioVenta,
            title: 'Precio unitario'
        },
        {
            align: 'start',
            dataIndex: 'customLinesModal_percentageIVA',
            key: 'customLinesModal_percentageIVA',
            render: (_, product) => product.porcentajeIvaVenta,
            title: 'Porcentaje IVA'
        },
        {
            align: 'start',
            dataIndex: 'customLinesModal_remove',
            key: 'customLinesModal_remove',
            onCell: () => ({ width: '100%' }),
            render: (_, product) => (
                <Col
                    align='start'
                    key={product._id}
                    onClick={() => removeCustomProduct(product._id)}
                >
                    <Delete />
                </Col>
            ),
            title: 'Quitar'
        }
    ]

    const tableOfCustomProducts = (
        <Table
            columns={columns}
            dataSource={customProducts_state.saleCustomProducts}
        />
    )

    const itemsToRender = [
        {
            element: actionsButtons,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        },
        {
            element: tableOfCustomProducts,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 24 },
        span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
    }


    return (
        <Modal
            afterOpenChange={setFocus}
            open={customProducts_state.listOfCustomProductModalIsVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            forceRender
            okButtonProps={{ style: { display: 'none' } }}
            width={1200}
            zIndex={999}
        >
            <Row
                gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                justify='space-around'
            >
                {
                    itemsToRender.map((item, index) => {
                        return (
                            <Col
                                key={'listOfCustomLinesModal_itemsToRender_' + index}
                                lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                                md={{ order: item.order.md, span: responsiveGrid.span.md }}
                                sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                                xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                                xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                                xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                            >
                                {item.element}
                            </Col>
                        )
                    })
                }
            </Row>
        </Modal>
    )
}

export default ListCustomLinesModal