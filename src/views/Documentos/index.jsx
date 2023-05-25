// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Table } from 'antd'

// Services
import api from '../../services'

// Views
import Header from './Header'

// Imports Destructuring
const { Edit, Delete } = icons


const Documentos = () => {
    const navigate = useNavigate()
    const [documentos, setDocumentos] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteEntityId, setDeleteEntityId] = useState(null)
    const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null)

    useEffect(() => {
        const fetchDocumentos = async () => {
            const data = await api.documentos.findAll({ page, limit, filters })
            setDocumentos(data.docs)
            setTotalDocs(data.totalDocs)
            setLoading(false)
        }
        fetchDocumentos()
    }, [page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
        if (deleteEntityId === null) return
        const deleteDocument = async () => {
            setLoading(true)
            api.documentos.deleteDocumento(deleteEntityId)
                .then(() => {
                    setDeleteEntityId(null)
                    setLoading(false)
                })
        }
        deleteDocument()
    }, [deleteEntityId])

    const editDocument = (id) => {
        navigate(`/documentos/${id}`)
    }

    const columnsForTable = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Fiscal',
            render: ({ fiscal }) => (
                (fiscal) ? 'Si' : 'No'
            )
        },
        {
            title: 'Ticket',
            render: ({ ticket }) => (
                (ticket) ? 'Si' : 'No'
            )
        },
        {
            title: 'Presupuesto',
            render: ({ presupuesto }) => (
                (presupuesto) ? 'Si' : 'No'
            )
        },
        {
            title: 'Remito',
            render: ({ remito }) => (
                (remito) ? 'Si' : 'No'
            )
        },
        {
            title: 'Letra',
            dataIndex: 'letra',
        },
        {
            title: 'Código único',
            dataIndex: 'codigoUnico',
        },
        {
            title: 'Acciones',
            render: ({ _id }) => (
                <Row>
                    <div onClick={() => { editDocument(_id) }}>
                        <Edit />
                    </div>
                    <div onClick={() => {
                        setDeleteEntityIdConfirmation(_id)
                        setDeleteVisible(true)
                    }}>
                        <Delete />
                    </div>
                </Row>
            )
        }
    ]

    return (
        <Row>
            <Col span={24} style={{ marginBottom: '10px' }}>
                <Header setFilters={setFilters} />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={documentos}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: (e) => { setPage(e) },
                        onShowSizeChange: (e, val) => { setLimit(val) }
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={loading}
                />
                <DeleteModal
                    title='Eliminar documento'
                    deleteVisible={deleteVisible}
                    setLoading={setLoading}
                    setDeleteVisible={setDeleteVisible}
                    setDeleteEntityId={setDeleteEntityId}
                    deleteEntityIdConfirmation={deleteEntityIdConfirmation}
                />
            </Col>
        </Row>
    )
}

export default Documentos