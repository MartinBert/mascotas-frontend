// React Components and Hooks
import React, { useState, useEffect } from 'react'
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
const { useDeleteModalContext } = contexts.DeleteModal
const { DeleteModal } = generics
const { Edit, Delete } = icons


const UnidadesMedida = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [unidadesMedida, setUnidadesMedida] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Units of Measure ------------------ //
    const fetchUnidadesMedida = async () => {
        const stringFilters = JSON.stringify(filters)
        const data = await api.unidadesmedida.findPaginated({ page, limit, filters: stringFilters })
        setUnidadesMedida(data.docs)
        setTotalDocs(data.totalDocs)
        deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
    }

    useEffect(() => {
        fetchUnidadesMedida()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, filters, limit, page])

    // ------------------ Unit of Measure Deletion ------------------ //
    const unitOfMeasureDeletion = (unitOfMeasureID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: unitOfMeasureID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteUnitOfMeasure = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.unidadesmedida.deleteUnidadMedida(deleteModal_state.entityID)
        if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteUnitOfMeasure()
        // eslint-disable-next-line
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Unit of Measure Edition ------------------ //
    const unitOfMeasureEdition = (id) => {
        navigate(`/unidadesmedida/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'unitOfMeasure_name',
            render: (_, unitOfMeasure) => unitOfMeasure.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'unitOfMeasure_fractionament',
            render: (_, unitOfMeasure) => unitOfMeasure.fraccionamiento,
            title: 'Fraccionamiento'
        },
        {
            dataIndex: 'unitOfMeasure_actions',
            render: (_, unitOfMeasure) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => unitOfMeasureEdition(unitOfMeasure._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => unitOfMeasureDeletion(unitOfMeasure._id)}
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
                    dataSource={unidadesMedida}
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
                    title='Eliminar unidad de medida'
                />
            </Col>
        </Row>
    )
}

export default UnidadesMedida