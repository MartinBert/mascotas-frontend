// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Custom Context Providers
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Row, Col, Table } from 'antd'

// Services
import api from '../../services'

// Views
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { useSalesAreasContext } = contexts.SalesAreas
const { Edit, Delete } = icons


const ZonasDeVentas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Users ------------------ //
    useEffect(() => {
        const fetchZonasDeVentas = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.zonasdeventas.findPaginated({ page, limit, filters: stringFilters })
            salesAreas_dispatch({ type: 'SET_PAGINATED_SALES_AREAS', payload: data.docs })
            salesAreas_dispatch({ type: 'TOTAL_QUANTITY_OF_SALES_AREAS', payload: data.totalDocs })
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchZonasDeVentas()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // ------------------ User Deletion ------------------ //
    const salesAreaDeletion = (salesAreaID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: salesAreaID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteSalesArea = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.zonasdeventas.deleteByID(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteSalesArea()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ User Edition ------------------ //
    const salesAreaEdition = (salesAreaID) => {
        navigate(`/zonasdeventas/${salesAreaID}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'salesArea_name',
            render: (_, salesArea) => salesArea.name,
            title: 'Nombre'
        },
        {
            dataIndex: 'salesArea_description',
            render: (_, salesArea) => (
                salesArea.description
                    ? salesArea.description
                    : '-'
            ),
            title: 'Descripción'
        },
        {
            dataIndex: 'salesArea_discountPercentage',
            render: (_, salesArea) => (
                salesArea.discountPercentage > 0
                    ? salesArea.discountPercentage
                    : '-'
            ),
            title: '% descuento',
        },
        {
            dataIndex: 'salesArea_discountDecimal',
            render: (_, salesArea) => (
                salesArea.discountDecimal > 0
                    ? salesArea.discountDecimal
                    : '-'
            ),
            title: 'Dec. descuento',
        },
        {
            dataIndex: 'salesArea_surchargePercentage',
            render: (_, salesArea) => (
                salesArea.surchargePercentage > 0
                    ? salesArea.surchargePercentage
                    : '-'
            ),
            title: '% recargo',
        },
        {
            dataIndex: 'salesArea_surchargeDecimal',
            render: (_, salesArea) => (
                salesArea.surchargeDecimal > 0
                    ? salesArea.surchargeDecimal
                    : '-'
            ),
            title: 'Dec. recargo',
        },
        {
            dataIndex: 'salesArea_actions',
            render: (_, salesArea) => (
                salesArea.name === 'Default'
                    ? null
                    : (
                        <Row
                            justify='start'
                        >
                            <Col
                                onClick={() => salesAreaEdition(salesArea._id)}
                                span={12}
                            >
                                <Edit />
                            </Col>
                            <Col
                                onClick={() => salesAreaDeletion(salesArea._id)}
                                span={12}
                            >
                                <Delete />
                            </Col>
                        </Row>
                    )
            ),
            title: 'Acciones',
        }
    ]

    return (
        <Row
            gutter={[0, 16]}
        >
            <Col
                span={24}
            >
                <Header
                    filters={filters}
                    setFilters={setFilters}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={salesAreas_state.paginatedSalesAreas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: salesAreas_state.totalQuantityOfSalesAreas,
                        showSizeChanger: true,
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    loading={deleteModal_state.loading}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                />
                <DeleteModal
                    title='Eliminar zona de venta'
                />
            </Col>
        </Row>
    )
}

export default ZonasDeVentas