// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'
import icons from '../../components/icons'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Row, Col, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import BalanceView from './BalanceView'
import FixStatisticsModal from './FixStatisticsModal'
import Header from './Header'
import SalesView from './SalesView'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { useInterfaceStylesContext } = contexts.InterfaceStyles
const { useRenderConditionsContext } = contexts.RenderConditions
const { round } = helpers.mathHelper
const { Edit, Details } = icons

const profitColorCss = (profit) => {
    if (profit >= 0) return '#15DC24'
    else return '#FF3C3C'
}


const DailyBusinessStatistics = () => {
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()
    const [interfaceStyles_state] = useInterfaceStylesContext()
    const [renderConditions_state, renderConditions_dispatch] = useRenderConditionsContext()

    // ------------------------------------- Load data --------------------------------------- //
    const loadRenderConditions = async () => {
        const recordsQuantityOfEntries = await api.entradas.countRecords()
        const recordsQuantityOfOutputs = await api.salidas.countRecords()
        const recordsQuantityOfSales = await api.ventas.countRecords()
        renderConditions_dispatch({
            type: 'SET_EXISTS_ENTRIES',
            payload: recordsQuantityOfEntries < 1 ? false : true
        })
        renderConditions_dispatch({
            type: 'SET_EXISTS_OUTPUTS',
            payload: recordsQuantityOfOutputs < 1 ? false : true
        })
        renderConditions_dispatch({
            type: 'SET_EXISTS_SALES',
            payload: recordsQuantityOfSales < 1 ? false : true
        })
    }

    const fetchDailyBusinessStatistics = async () => {
        const currentPaginationParams = dailyBusinessStatistics_state.paginationParams
        const currentFilters = currentPaginationParams.filters
        const typeOfStatisticsView = interfaceStyles_state.typeOfStatisticsView
        if (!['balance', 'sales'].includes(typeOfStatisticsView)) {
            return dailyBusinessStatistics_dispatch({ type: 'SET_LOADING', payload: true })
        } else dailyBusinessStatistics_dispatch({ type: 'SET_LOADING', payload: false })

        let filters
        if (typeOfStatisticsView === 'balance') {
            filters = {
                ...currentFilters,
                balanceViewProfit: !currentFilters.balanceViewProfit ? null : { $ne: 0 },
                salesViewProfit: null
            }
        } else {
            filters = {
                ...currentFilters,
                balanceViewProfit: null,
                salesViewProfit: !currentFilters.salesViewProfit ? null : { $ne: 0 }
            }
        }
        const paginationParams = { ...currentPaginationParams, filters }
        const params = formatFindParams(paginationParams)
        const data = await api.dailyBusinessStatistics.findPaginated(params)
        dailyBusinessStatistics_dispatch({ type: 'SET_DAILY_STATISTICS_RECORDS', payload: data })
    }

    useEffect(() => {
        fetchDailyBusinessStatistics()
        // eslint-disable-next-line
    }, [
        dailyBusinessStatistics_state.loading,
        dailyBusinessStatistics_state.loadingUpdatingRecords,
        dailyBusinessStatistics_state.paginationParams,
        interfaceStyles_state.typeOfStatisticsView
    ])

    useEffect(() => {
        loadRenderConditions()
        // eslint-disable-next-line
    }, [])

    // -------------------------------------- Actions ---------------------------------------- //
    const openDetailsStatisticModal = (dailyBusinessStatistics) => {
        let dispatchType
        if (interfaceStyles_state.typeOfStatisticsView === 'balance') {
            dispatchType = 'SET_STATISTIC_TO_BALANCE_VIEW'
        } else if (interfaceStyles_state.typeOfStatisticsView === 'sales') {
            dispatchType = 'SET_STATISTIC_TO_SALES_VIEW'
        } else {
            console.log(`views/DailyBusinessStatistics/index.jsx -- Incorrectly configuration of 'interfaceStyles_state.typeOfStatisticsView'. This should be 'balance' or 'sales'.`)
            return errorAlert('No se pudo abrir la ventana de detalles. Consulte con su proveedor.')
        }
        dailyBusinessStatistics_dispatch({ type: dispatchType, payload: dailyBusinessStatistics })
    }

    const openFixStatisticModal = async (dailyBusinessStatisticsID) => {
        dailyBusinessStatistics_dispatch({ type: 'SHOW_FIX_STATISTICS_MODAL' })
        const response = await api.dailyBusinessStatistics.findById(dailyBusinessStatisticsID)
        if (!response) errorAlert('No se pudo recuperar las estadìsticas diarias de referencia para realizar la corrección. Recargue la página para volver a intentar.')
        const referenceData = {
            concept: response.data.concept,
            balanceViewProfit: response.data.balanceViewProfit,
            salesViewProfit: response.data.salesViewProfit,
            date: response.data.date,
            dateString: response.data.dateString
        }
        dailyBusinessStatistics_dispatch({ type: 'SET_REFERENCE_STATISTICS', payload: referenceData })
    }

    const setPageAndLimit = async (page, limit) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        dailyBusinessStatistics_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }


    const columnsForTable = [
        {
            dataIndex: 'dailyBusinessStatistics_concept',
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.concept,
            title: 'Concepto',
        },
        {
            dataIndex: 'dailyBusinessStatistics_date',
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.dateString,
            title: 'Fecha',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyIncome',
            render: (_, dailyBusinessStatistics) => round(
                interfaceStyles_state.typeOfStatisticsView === 'balance'
                    ? dailyBusinessStatistics.balanceViewIncome
                    : dailyBusinessStatistics.salesViewIncome
            ),
            title: 'Ingreso',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyExpense',
            render: (_, dailyBusinessStatistics) => round(
                interfaceStyles_state.typeOfStatisticsView === 'balance'
                    ? dailyBusinessStatistics.balanceViewExpense
                    : dailyBusinessStatistics.salesViewExpense
            ),
            title: 'Gasto',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyBalance',
            render: (_, dailyBusinessStatistics) => {
                return (
                    <div style={{
                        color: profitColorCss(
                            interfaceStyles_state.typeOfStatisticsView === 'balance'
                                ? dailyBusinessStatistics.balanceViewProfit
                                : dailyBusinessStatistics.salesViewProfit
                        ), fontSize: '18px'
                    }}>
                        <b>{round(
                            interfaceStyles_state.typeOfStatisticsView === 'balance'
                                ? dailyBusinessStatistics.balanceViewProfit
                                : dailyBusinessStatistics.salesViewProfit
                        )}</b>
                    </div>
                )
            },
            title: 'Balance',
        },
        {
            dataIndex: 'dailyBusinessStatistics_actions',
            render: (_, dailyBusinessStatistics) => (
                <Row justify='start'>
                    <Col
                        onClick={() => openFixStatisticModal(dailyBusinessStatistics._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => openDetailsStatisticModal(dailyBusinessStatistics)}
                        span={12}
                    >
                        <Details />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        }
    ]

    const satatisticsBalanceViewConditions = (
        !!dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails
        && dailyBusinessStatistics_state.statisticsView.balanceView.modalVisibility === true
    )

    const satatisticsSalesViewConditions = (
        !!dailyBusinessStatistics_state.statisticsView.salesView.statisticToViewDetails
        && dailyBusinessStatistics_state.statisticsView.salesView.modalVisibility === true
    )

    return (
        <>
            {
                !renderConditions_state.existsEntries
                    && !renderConditions_state.existsOutputs
                    && !renderConditions_state.existsSales
                    ? <h1>Debes registrar al menos una entrada, salida o venta antes de comenzar a utilizar esta función.</h1>
                    : (
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Header />
                            </Col>
                            <Col span={24}>
                                {
                                    dailyBusinessStatistics_state.loading
                                        ? <div>Elija si desea ver los registros en formato "balance" o "ventas".</div>
                                        : (
                                            <Table
                                                columns={columnsForTable}
                                                dataSource={dailyBusinessStatistics_state.recordsToRender}
                                                loading={
                                                    dailyBusinessStatistics_state.loading
                                                    || dailyBusinessStatistics_state.loadingUpdatingRecords
                                                }
                                                pagination={{
                                                    defaultCurrent: dailyBusinessStatistics_state.paginationParams.page,
                                                    defaultPageSize: dailyBusinessStatistics_state.paginationParams.limit,
                                                    limit: dailyBusinessStatistics_state.paginationParams.limit,
                                                    onChange: (page, limit) => setPageAndLimit(page, limit),
                                                    showSizeChanger: true,
                                                    total: dailyBusinessStatistics_state.totalRecords
                                                }}
                                                rowKey='_id'
                                                size='small'
                                                tableLayout='auto'
                                                width={'100%'}
                                            />
                                        )
                                }
                                {
                                    satatisticsBalanceViewConditions
                                        ? <BalanceView />
                                        : satatisticsSalesViewConditions
                                            ? <SalesView />
                                            : null
                                }
                                <FixStatisticsModal />
                            </Col>
                        </Row>
                    )
            }
        </>
    )
}

export default DailyBusinessStatistics