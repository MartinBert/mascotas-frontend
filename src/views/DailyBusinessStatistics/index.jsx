// React Components and Hooks
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Row, Col, Table } from 'antd'

// Services
import api from '../../services'

// Views
import FixStatisticsModal from './FixStatisticsModal'
import Header from './Header'

// Imports Destructuring
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { EmitDocument } = icons


const DailyBusinessStatistics = () => {
    const navigate = useNavigate()
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()

    useEffect(() => {
        const fetchDailyBusinessStatistics = async () => {
            const data = await api.dailyBusinessStatistics.findPaginated(dailyBusinessStatistics_state.paginationParams)
            dailyBusinessStatistics_dispatch({ type: 'SET_DAILY_STATISTICS_RECORDS', payload: data })
        }
        fetchDailyBusinessStatistics()
    }, [dailyBusinessStatistics_state.paginationParams])

    const fixDailyStatistic = (dailyBusinessStatisticsID) => {
        navigate(`/daily_business_statistics/${dailyBusinessStatisticsID}`)
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
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.date,
            title: 'Fecha',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyExpense',
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.dailyExpense,
            title: 'Gasto total',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyIncome',
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.dailyIncome,
            title: 'Ingreso total',
        },
        {
            dataIndex: 'dailyBusinessStatistics_dailyProfit',
            render: (_, dailyBusinessStatistics) => dailyBusinessStatistics.dailyProfit,
            title: 'Ganancia',
        },
        {
            dataIndex: 'dailyBusinessStatistics_actions',
            render: (_, dailyBusinessStatistics) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => fixDailyStatistic(dailyBusinessStatistics._id)}
                        span={24}
                    >
                        <EmitDocument />
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
                        defaultCurrent: dailyBusinessStatistics_state.paginationParams.page,
                        limit: dailyBusinessStatistics_state.paginationParams.limit,
                        total: dailyBusinessStatistics_state.dailyStatistics_totalQuantity,
                        showSizeChanger: true,
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={dailyBusinessStatistics_state.loading}
                />
                <FixStatisticsModal />
            </Col>
        </Row>
    )
}

export default DailyBusinessStatistics