// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Custom Contexts
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


const Documentos = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [documentos, setDocumentos] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Documents ------------------ //
    useEffect(() => {
        const fetchDocumentos = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.documentos.findPaginated({ page, limit, filters: stringFilters })
            setDocumentos(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchDocumentos()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // ------------------ Documents Deletion ------------------ //
    const documentDeletion = (documentID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: documentID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteDocument = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'OK') {
                await api.documentos.deleteDocumento(deleteModal_state.entityID)
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
        deleteDocument()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Documents Edition ------------------ //
    const documentEdition = (id) => {
        navigate(`/documentos/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'document_name',
            render: (_, document) => document.nombre,
            title: 'Nombre',
        },
        {
            dataIndex: 'document_isFiscal',
            render: (_, document) => document.fiscal ? 'Si' : '-',
            title: 'Fiscal',
        },
        {
            dataIndex: 'document_isTicket',
            render: (_, document) => document.ticket ? 'Si' : '-',
            title: 'Ticket',
        },
        {
            dataIndex: 'document_isBudget',
            render: (_, document) => document.presupuesto ? 'Si' : '-',
            title: 'Presupuesto',
        },
        {
            dataIndex: 'document_isRemittance',
            render: (_, document) => document.remito ? 'Si' : '-',
            title: 'Remito',
        },
        {
            dataIndex: 'document_letra',
            render: (_, document) => document.letra,
            title: 'Letra',
        },
        {
            dataIndex: 'document_uniqueCode',
            render: (_, document) => document.codigoUnico,
            title: 'Código único',
        },
        {
            dataIndex: 'document_actions',
            render: (_, document) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => documentEdition(document._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => documentDeletion(document._id)}
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
                    dataSource={documentos}
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
                    title='Eliminar documento'
                />
            </Col>
        </Row>
    )
}

export default Documentos