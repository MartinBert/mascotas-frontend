// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Modal, Row } from 'antd'

// Helpers
import actions from '../../actions'
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useProductsContext } = contexts.Products
const { regExp } = helpers.stringHelper
const { ifNotNumber } = regExp

const FixStockHistoryModal = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const loadParams = () => {
        const productOfRecordToFix = products_state.stockHistory.fixStockHistoryModal.product
        const recordToFix = products_state.stockHistory.fixStockHistoryModal.stockHistoryToFix
        if (!productOfRecordToFix || !recordToFix) return
        const params = {
            ...products_state.stockHistory.fixStockHistoryModal.params,
            date: recordToFix.date,
            dateString: recordToFix.dateString,
            product: productOfRecordToFix._id
        }
        products_dispatch({ type: 'SET_PARAMS_IN_FIX_STOCK_HISTORY_MODAL', payload: params })
    }

    useEffect(() => { loadParams() }, [
        products_state.stockHistory.fixStockHistoryModal.product,
        products_state.stockHistory.fixStockHistoryModal.stockHistoryToFix
    ])

    // ----------------- Button to cancel ---------------- //
    const closeModal = () => {
        products_dispatch({ type: 'HIDE_FIX_STOCK_HISTORY_MODAL' })
    }

    const buttonToCloseModal = (
        <Button
            danger
            onClick={closeModal}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // ----------------- Button to save ------------------ //
    const save = async () => {
        const validationParameters = [null, '', '0']
        const recordToSave = products_state.stockHistory.fixStockHistoryModal.params
        if (
            validationParameters.includes(recordToSave.entries)
            && validationParameters.includes(recordToSave.outputs)
        ) return errorAlert('Debe indicar la cantidad de entradas o salidas.')
        if (validationParameters.includes(recordToSave.entries)) recordToSave.entries = 0
        if (validationParameters.includes(recordToSave.outputs)) recordToSave.outputs = 0
        const response = await api.stockHistory.save(recordToSave)
        if (response.code !== 200) return errorAlert('No se pudo guardar el registro. Inténtelo de nuevo.')
        else {
            successAlert('El registro fue guardado con éxito.')
            products_dispatch({ type: 'HIDE_FIX_STOCK_HISTORY_MODAL' })
        }
    }

    const buttonToSave = (
        <Button
            onClick={save}
            style={{ width: '100%' }}
            type='primary'
        >
            Guardar
        </Button>
    )

    // ------------- Input of entries number ------------- //
    const onChangeEntries = (e) => {
        const params = {
            ...products_state.stockHistory.fixStockHistoryModal.params,
            entries: parseFloat(e.target.value.replace(ifNotNumber, ''))
        }
        products_dispatch({ type: 'SET_PARAMS_IN_FIX_STOCK_HISTORY_MODAL', payload: params })
    }

    const inputOfEntriesNumber = (
        <Input
            addonBefore='Cantidad de entradas'
            color='primary'
            onChange={onChangeEntries}
            style={{ width: '100%' }}
            value={products_state.stockHistory.fixStockHistoryModal.params.entries}
        />
    )

    // ------------- Input of outputs number ------------- //
    const onChangeOutputs = (e) => {
        const params = {
            ...products_state.stockHistory.fixStockHistoryModal.params,
            outputs: parseFloat(e.target.value.replace(ifNotNumber, ''))
        }
        products_dispatch({ type: 'SET_PARAMS_IN_FIX_STOCK_HISTORY_MODAL', payload: params })
    }

    const inputOfOutputsNumber = (
        <Input
            addonBefore='Cantidad de salidas'
            color='primary'
            onChange={onChangeOutputs}
            style={{ width: '100%' }}
            value={products_state.stockHistory.fixStockHistoryModal.params.outputs}
        />
    )

    // ----------------- Title of modal ------------------ //
    const titleOfModal = <h3>Añadir corrección al historial de stock</h3>

    // -------------- Title of product name -------------- //
    const titleOfProductName = (
        !products_state.stockHistory.fixStockHistoryModal
            ? null
            : !products_state.stockHistory.fixStockHistoryModal.product
                ? null
                : <h3><b>{products_state.stockHistory.fixStockHistoryModal.product.nombre}</b></h3>
    )

    // ----------- Title of stock history date ----------- //
    const titleOfStockHistoryDate = (
        !products_state.stockHistory.fixStockHistoryModal
            ? null
            : !products_state.stockHistory.fixStockHistoryModal.params
                ? null
                : <h3><b>{products_state.stockHistory.fixStockHistoryModal.params.dateString}</b></h3>
    )


    const itemsToRender = [
        {
            element: buttonToCloseModal,
            name: 'fixStockHistoryModal_buttonToCloseModal',
            order: { lg: 5, md: 5, sm: 5, xl: 5, xs: 5, xxl: 5 }
        },
        {
            element: buttonToSave,
            name: 'fixStockHistoryModal_buttonToSave',
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        },
        {
            element: inputOfEntriesNumber,
            name: 'fixStockHistoryModal_inputOfEntriesNumber',
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: inputOfOutputsNumber,
            name: 'fixStockHistoryModal_inputOfOutputsNumber',
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: titleOfProductName,
            name: 'fixStockHistoryModal_titleOfProductName',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: titleOfStockHistoryDate,
            name: 'fixStockHistoryModal_titleOfStockHistoryDate',
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={products_state.stockHistory.fixStockHistoryModal.visibility}
            width={1200}
        >
            {titleOfModal}
            <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
                {
                    itemsToRender.map(item => {
                        return (
                            <Col
                                key={item.name}
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
        </Modal >
    )
}

export default FixStockHistoryModal