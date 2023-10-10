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
const { Edit, Delete } = icons


const PuntosVenta = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [puntosVenta, setPuntosVenta] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Sale Points ------------------ //
    useEffect(() => {
        const fetchPuntosVenta = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.puntosventa.findPaginated({ page, limit, filters: stringFilters })
            setPuntosVenta(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchPuntosVenta()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // ------------------ Sale Point Deletion ------------------ //
    const salePointDeletion = (salePointID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: salePointID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteSalePoint = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'OK') {
                deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
                await api.puntosventa.deleteEmpresa(deleteModal_state.entityID)
                    .then(response => {
                        if (response.code === 200) {
                            successAlert('El registro se eliminó correctamente')
                            deleteModal_dispatch({ type: 'CLEAN_STATE' })
                        } else {
                            errorAlert('Fallo al eliminar el registro')
                        }
                    })
            }
        }
        deleteSalePoint()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Sale Point Edition ------------------ //
    const salePointEdition = (id) => {
        navigate(`/puntosventa/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'salePoint_name',
            render: (_, salePoint) => salePoint.nombre,
            title: 'Nombre'

        },
        {
            dataIndex: 'salePoint_number',
            render: (_, salePoint) => salePoint.numero,
            title: 'Número de punto de venta'

        },
        {
            dataIndex: 'salePoint_actions',
            render: (_, salePoint) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => salePointEdition(salePoint._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => salePointDeletion(salePoint._id)}
                        span={12}
                    >
                        <Delete />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
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
                    dataSource={puntosVenta}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={deleteModal_state.loading}
                />
                <DeleteModal
                    title='Eliminar punto de venta'
                />
            </Col>
        </Row>
    )
}

export default PuntosVenta