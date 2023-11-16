// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Table } from 'antd'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Services
import api from '../../services'

// Views
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { Edit, Delete } = icons


const CondicionesFiscales = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [condicionesFiscales, setCondicionesFiscales] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // --------------- Fetch Fiscal Condition --------------- //
    useEffect(() => {
        const fetchCondicionesFiscales = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.condicionesfiscales.findPaginated({ page, limit, filters: stringFilters })
            setCondicionesFiscales(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchCondicionesFiscales()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // --------------- Fiscal Condition Deletion --------------- //
    const fiscalConditionDeletion = (fiscalConditionID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: fiscalConditionID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteFiscalCondition = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.condicionesfiscales.deleteCondicionFiscal(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteFiscalCondition()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // --------------- Fiscal Condition Edition --------------- //
    const fiscalConditionEdition = (id) => {
        navigate(`/condicionesfiscales/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'fiscalCondition_nombre',
            render: (_, fiscalCondition) => fiscalCondition.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'fiscalCondition_addIVA',
            render: (_, fiscalCondition) => fiscalCondition.adicionaIva ? 'Si' : '-',
            title: 'Adiciona IVA',
        },
        {
            dataIndex: 'fiscalCondition_actions',
            render: (_, fiscalCondition) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => fiscalConditionEdition(fiscalCondition._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => fiscalConditionDeletion(fiscalCondition._id)}
                        span={12}
                    >
                        <Delete />
                    </Col>
                </Row>
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
                    dataSource={condicionesFiscales}
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
                    title='Eliminar condición fiscal'
                />
            </Col>
        </Row>
    )
}

export default CondicionesFiscales