// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Modal, Row, Table } from 'antd'
import icons from '../../components/icons'

// Helpers
import actions from '../../actions'
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useProductsContext } = contexts.Products
const { getLastFortnight, getLastMonth, getLastWeek } = helpers.dateHelper
const { roundTwoDecimals } = helpers.mathHelper
const { Delete, Edit } = icons


const ProductStockHistoryModal = () => {
    const [products_state, products_dispatch] = useProductsContext()

    // --------------- Fetch stock history --------------- //
    const fetchStockHistory = async () => {
        const findStockHistory = formatFindParams(
            products_state.stockHistory.productStockHistoryModal.paginationParams
        )
        const data = await api.stockHistory.findPaginated(findStockHistory)
        products_dispatch({ type: 'SET_STOCK_HISTORY_TO_RENDER', payload: data })
    }

    useEffect(() => {
        fetchStockHistory()
        // eslint-disable-next-line
    }, [
        products_state.stockHistory.fixStockHistoryModal.modalVisibility,
        products_state.stockHistory.productStockHistoryModal.paginationParams
    ])

    // -------------- Button to close modal -------------- //
    const closeModal = () => {
        products_dispatch({ type: 'HIDE_PRODUCT_STOCK_HISTORY_MODAL' })
    }

    const buttonToCloseModal = (
        <Button
            danger
            onClick={closeModal}
            style={{ width: '100%' }}
            type='primary'
        >
            Cerrar
        </Button>
    )

    // --------------- Table of stock flow --------------- //
    const stockHistoryDeletion = async (stockHistory) => {
        const response = await api.stockHistory.deleteStockHistory(stockHistory._id)
        if (response.code !== 200) errorAlert('No se pudo eliminar el registro. Inténtelo de nuevo.')
        else successAlert('Registro eliminado exitosamente.')
        const paginationParams = {
            ...products_state.stockHistory.productStockHistoryModal.paginationParams,
            page: 1
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_IN_PRODUCT_STOCK_HISTORY_MODAL',
            payload: paginationParams
        })
    }

    const stockHistoryEdition = (stockHistory) => {
        products_dispatch({ type: 'SET_STOCK_HISTORY_TO_FIX', payload: stockHistory })
    }

    const setPageAndLimit = (page, limit) => {
        const paginationParams = {
            ...products_state.stockHistory.productStockHistoryModal.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        products_dispatch({
            type: 'SET_PAGINATION_PARAMS_IN_PRODUCT_STOCK_HISTORY_MODAL',
            payload: paginationParams
        })
    }

    const columns = [
        {
            dataIndex: 'stockHistoryModal_date',
            render: (_, stockHistory) => stockHistory.dateString,
            title: 'Fecha'
        },
        {
            dataIndex: 'stockHistoryModal_totalEntries',
            render: (_, stockHistory) => roundTwoDecimals(stockHistory.entries),
            title: 'Cantidad entradas'
        },
        {
            dataIndex: 'stockHistoryModal_totalOutputs',
            render: (_, stockHistory) => roundTwoDecimals(stockHistory.outputs),
            title: 'Cantidad salidas'
        },
        {
            dataIndex: 'stockHistoryModal_actions',
            render: (_, stockHistory) => (
                <Row justify='start'>
                    <Col
                        onClick={() => stockHistoryEdition(stockHistory)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => stockHistoryDeletion(stockHistory)}
                        span={12}
                        style={{ display: stockHistory.itIsAManualCorrection ? 'block' : 'none' }}
                    >
                        <Delete />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        }
    ]

    const tableOfStockFlow = (
        <Table
            columns={columns}
            dataSource={products_state.stockHistory.productStockHistoryModal.recordsForRender}
            loading={products_state.stockHistory.productStockHistoryModal.loading}
            pagination={{
                defaultCurrent: products_state.stockHistory.productStockHistoryModal.paginationParams.page,
                defaultPageSize: products_state.stockHistory.productStockHistoryModal.paginationParams.limit,
                limit: products_state.stockHistory.productStockHistoryModal.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimit(page, limit),
                pageSizeOptions: [5, 10, 15, 20],
                showSizeChanger: true,
                total: products_state.stockHistory.productStockHistoryModal.totalRecords
            }}
            rowKey='_id'
            size='small'
            tableLayout='auto'
            width={'100%'}
        />
    )

    // -------------- Title of product name -------------- //
    const currentProduct = products_state.stockHistory.productStockHistoryModal.product

    const titleOfProductName = currentProduct
        ? <h2>{currentProduct.nombre}</h2>
        : null

    // -------- Titles of last entries and outputs ------- //
    const loadTitlesValues = async () => {
        const lastFortnight = getLastFortnight(new Date()) // [initDate, finalDate]
        const lastMonth = getLastMonth(new Date()) // [initDate, finalDate]
        const lastWeek = getLastWeek(new Date()) // [initDate, finalDate]
        const previousFortnightFilter = JSON.stringify({
            date: { $gte: lastFortnight[0], $lte: lastFortnight[1] },
            product: products_state.stockHistory.productStockHistoryModal.paginationParams.filters.product
        })
        const previousMonthFilter = JSON.stringify({
            date: { $gte: lastMonth[0], $lte: lastMonth[1] },
            product: products_state.stockHistory.productStockHistoryModal.paginationParams.filters.product
        })
        const previousWeekFilter = JSON.stringify({
            date: { $gte: lastWeek[0], $lte: lastWeek[1] },
            product: products_state.stockHistory.productStockHistoryModal.paginationParams.filters.product
        })
        const previousFortnightStockHistories = await api.stockHistory.findAllByFilters(previousFortnightFilter)
        const previousMonthStockHistories = await api.stockHistory.findAllByFilters(previousMonthFilter)
        const previousWeekStockHistories = await api.stockHistory.findAllByFilters(previousWeekFilter)
        const entriesOfPreviousFortnight = previousFortnightStockHistories.docs.reduce((accumulator, currentValue) =>
            accumulator + currentValue.entries, 0
        )
        const entriesOfPreviousMonth = previousMonthStockHistories.docs.reduce((accumulator, currentValue) =>
            accumulator + currentValue.entries, 0
        )
        const entriesOfPreviousWeek = previousWeekStockHistories.docs.reduce((accumulator, currentValue) =>
            accumulator + currentValue.entries, 0
        )
        const outputsOfPreviousFortnight = previousFortnightStockHistories.docs.reduce((accumulator, currentValue) =>
            accumulator + currentValue.outputs, 0
        )
        const outputsOfPreviousMonth = previousMonthStockHistories.docs.reduce((accumulator, currentValue) =>
            accumulator + currentValue.outputs, 0
        )
        const outputsOfPreviousWeek = previousWeekStockHistories.docs.reduce((accumulator, currentValue) =>
            accumulator + currentValue.outputs, 0
        )
        const modalTitlesValues = {
            entriesOfPreviousFortnight,
            entriesOfPreviousMonth,
            entriesOfPreviousWeek,
            outputsOfPreviousFortnight,
            outputsOfPreviousMonth,
            outputsOfPreviousWeek
        }
        products_dispatch({
            type: 'SET_TITLES_VALUES_IN_PRODUCT_STOCK_HISTORY_MODAL',
            payload: modalTitlesValues
        })
    }

    useEffect(() => {
        loadTitlesValues()
        // eslint-disable-next-line
    }, [
        products_state.stockHistory.fixStockHistoryModal.modalVisibility,
        products_state.stockHistory.productStockHistoryModal.paginationParams
    ])


    const titlesOfLastEntriesAndOutputsData = [
        {
            element: <h3>Entradas totales en la última quincena: <b>{roundTwoDecimals(products_state.stockHistory.productStockHistoryModal.flowValues.entriesOfPreviousFortnight)}</b></h3>,
            name: 'titlesOfLastEntriesAndOutputs_entriesOfLastFortnight',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: <h3>Entradas totales en el último mes: <b>{roundTwoDecimals(products_state.stockHistory.productStockHistoryModal.flowValues.entriesOfPreviousMonth)}</b></h3>,
            name: 'titlesOfLastEntriesAndOutputs_entriesOfLastMonth',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: <h3>Entradas totales en la última semana: <b>{roundTwoDecimals(products_state.stockHistory.productStockHistoryModal.flowValues.entriesOfPreviousWeek)}</b></h3>,
            name: 'titlesOfLastEntriesAndOutputs_entriesOfLastWeek',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: <h3>Salidas totales en la última quincena: <b>{roundTwoDecimals(products_state.stockHistory.productStockHistoryModal.flowValues.outputsOfPreviousFortnight)}</b></h3>,
            name: 'titlesOfLastEntriesAndOutputs_outputsOfLastFortnight',
            order: { lg: 4, md: 4, sm: 5, xl: 4, xs: 5, xxl: 4 }
        },
        {
            element: <h3>Salidas totales en el último mes: <b>{roundTwoDecimals(products_state.stockHistory.productStockHistoryModal.flowValues.outputsOfPreviousMonth)}</b></h3>,
            name: 'titlesOfLastEntriesAndOutputs_outputsOfLastMonth',
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        },
        {
            element: <h3>Salidas totales en la última semana: <b>{roundTwoDecimals(products_state.stockHistory.productStockHistoryModal.flowValues.outputsOfPreviousWeek)}</b></h3>,
            name: 'titlesOfLastEntriesAndOutputs_outputsOfLastWeek',
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 }
        }
    ]

    const responsiveGridOfTitles = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    const titlesOfLastEntriesAndOutputs = (
        <Row
            gutter={[
                responsiveGridOfTitles.gutter.horizontal,
                responsiveGridOfTitles.gutter.vertical
            ]}
        >
            {
                titlesOfLastEntriesAndOutputsData.map(title => {
                    return (
                        <Col
                            key={title.name}
                            lg={{ order: title.order.lg, span: responsiveGridOfTitles.span.lg }}
                            md={{ order: title.order.md, span: responsiveGridOfTitles.span.md }}
                            sm={{ order: title.order.sm, span: responsiveGridOfTitles.span.sm }}
                            xl={{ order: title.order.xl, span: responsiveGridOfTitles.span.xl }}
                            xs={{ order: title.order.xs, span: responsiveGridOfTitles.span.xs }}
                            xxl={{ order: title.order.xxl, span: responsiveGridOfTitles.span.xxl }}
                        >
                            {title.element}
                        </Col>
                    )
                })
            }
        </Row>
    )


    const itemsToRender = [
        {
            element: buttonToCloseModal,
            name: 'productStockHistoryModal_buttonToCloseModal',
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: tableOfStockFlow,
            name: 'productStockHistoryModal_tableOfStockFlow',
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: titleOfProductName,
            name: 'productStockHistoryModal_titleOfProductName',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: titlesOfLastEntriesAndOutputs,
            name: 'productStockHistoryModal_titlesOfLastEntriesAndOutputs',
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 0, vertical: 8 },
        span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
    }

    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={products_state.stockHistory.productStockHistoryModal.modalVisibility}
            width={1200}
        >
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

export default ProductStockHistoryModal