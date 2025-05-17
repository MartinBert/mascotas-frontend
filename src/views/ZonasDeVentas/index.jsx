// React Components and Hooks
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import generics from '../../components/generics'
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
const { formatFindParams } = actions.paginationParams
const { useDeleteModalContext } = contexts.DeleteModal
const { useSalesAreasContext } = contexts.SalesAreas
const { DeleteModal } = generics
const { Edit, Delete } = icons


const ZonasDeVentas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()

    // -------------------- Actions -------------------- //
    const setPageAndLimit = (page, limit) => {
        const paginationParams = {
            ...salesAreas_state.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        salesAreas_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    // --------------- Fetch Sales Areas --------------- //
    const fetchZonasDeVentas = async () => {
        const findParams = formatFindParams(salesAreas_state.paginationParams)
        const data = await api.salesAreas.findPaginated(findParams)
        salesAreas_dispatch({ type: 'SET_SALES_AREAS_TO_RENDER', payload: data })
    }

    useEffect(() => {
        fetchZonasDeVentas()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, salesAreas_state.paginationParams])

    // -------------- Sales Area Deletion -------------- //
    const salesAreaDeletion = (salesAreaID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: salesAreaID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteSalesArea = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.salesAreas.remove(deleteModal_state.entityID)
        if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteSalesArea()
        // eslint-disable-next-line
    }, [ deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // --------------- Sales Area Edition -------------- //
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
                        <Row justify='start'>
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
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Header />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={salesAreas_state.paginatedSalesAreas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: salesAreas_state.paginationParams.page,
                        defaultPageSize: salesAreas_state.paginationParams.limit,
                        limit: salesAreas_state.paginationParams.limit,
                        onChange: (page, limit) => setPageAndLimit(page, limit),
                        showSizeChanger: true,
                        total: salesAreas_state.totalQuantityOfSalesAreas
                    }}
                    loading={salesAreas_state.loading}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                />
                <DeleteModal title='Eliminar zona de venta' />
            </Col>
        </Row>
    )
}

export default ZonasDeVentas