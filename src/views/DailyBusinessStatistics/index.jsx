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
import FixStatisticsModal from './FixStatisticsModal'
import Header from './Header'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { roundTwoDecimals } = helpers.mathHelper
const { Edit } = icons

const profitColorCss = (profit) => {
    if (profit >= 0) return '#15DC24'
    else return '#FF3C3C'
}


const DailyBusinessStatistics = () => {
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()

    useEffect(() => {
        const fetchDailyBusinessStatistics = async () => {
            const findParams = formatFindParams(dailyBusinessStatistics_state.paginationParams)
            const data = await api.dailyBusinessStatistics.findPaginated(findParams)
            dailyBusinessStatistics_dispatch({ type: 'SET_DAILY_STATISTICS_RECORDS', payload: data })
        }
        fetchDailyBusinessStatistics()
    }, [
        dailyBusinessStatistics_state.loading,
        dailyBusinessStatistics_state.loadingUpdatingRecords,
        dailyBusinessStatistics_state.paginationParams
    ])

    const openModal = async (dailyBusinessStatisticsID) => {
        dailyBusinessStatistics_dispatch({ type: 'SHOW_FIX_STATISTICS_MODAL' })
        const response = await api.dailyBusinessStatistics.findById(dailyBusinessStatisticsID)
        if (!response) errorAlert('No se pudo recuperar las estadìsticas diarias de referencia para realizar la corrección. Recargue la página para volver a intentar.')
        const referenceData = {
            concept: response.data.concept,
            dailyProfit: response.data.dailyProfit,
            date: response.data.date,
            dateString: response.data.dateString
        }
        dailyBusinessStatistics_dispatch({ type: 'SET_REFERENCE_STATISTICS', payload: referenceData })
    }

    const setLimit = (val) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.paginationParams,
            limit: parseInt(val)
        }
        dailyBusinessStatistics_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const setPage = (e) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.paginationParams,
            page: parseInt(e)
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
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.dateString.substring(0, 10),
            title: 'Fecha',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyIncome',
            render: (_, dailyBusinessStatistics) => roundTwoDecimals(dailyBusinessStatistics.dailyIncome),
            title: 'Ingreso',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyExpense',
            render: (_, dailyBusinessStatistics) => roundTwoDecimals(dailyBusinessStatistics.dailyExpense),
            title: 'Gasto',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyBalance',
            render: (_, dailyBusinessStatistics) => {
                return (
                    <div style={{ color: profitColorCss(dailyBusinessStatistics.dailyProfit), fontSize: '18px' }}>
                        <b>{roundTwoDecimals(dailyBusinessStatistics.dailyProfit)}</b>
                    </div>
                )
            },
            title: 'Balance',
        },
        {
            dataIndex: 'dailyBusinessStatistics_actions',
            render: (_, dailyBusinessStatistics) => (
                <Row justify='start'>
                    <Col onClick={() => openModal(dailyBusinessStatistics._id)}>
                        <Edit />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        }
    ]

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Header />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={dailyBusinessStatistics_state.dailyStatistics_paginatedList}
                    columns={columnsForTable}
                    pagination={{
                        current: dailyBusinessStatistics_state.paginationParams.page,
                        limit: dailyBusinessStatistics_state.paginationParams.limit,
                        total: dailyBusinessStatistics_state.dailyStatistics_totalRecords,
                        showSizeChanger: true,
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={
                        dailyBusinessStatistics_state.loading
                        || dailyBusinessStatistics_state.loadingUpdatingRecords
                    }
                />
                <FixStatisticsModal />
            </Col>
        </Row>
    )
}

export default DailyBusinessStatistics