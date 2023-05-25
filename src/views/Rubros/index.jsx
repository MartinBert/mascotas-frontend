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


const Rubros = () => {
    const navigate = useNavigate()
    const [rubros, setRubros] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteEntityId, setDeleteEntityId] = useState(null)
    const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null)

    useEffect(() => {
        const fetchRubros = async () => {
            const data = await api.rubros.findAll({ page, limit, filters })
            setRubros(data.docs)
            setTotalDocs(data.totalDocs)
            setLoading(false)
        }
        fetchRubros()
    }, [page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
        if (deleteEntityId === null) return
        const deleteHeading = async () => {
            setLoading(true)
            api.rubros.deleteRubro(deleteEntityId)
                .then(() => {
                    setDeleteEntityId(null)
                    setLoading(false)
                })
        }
        deleteHeading()
    }, [deleteEntityId])

    const editHeading = (id) => {
        navigate(`/rubros/${id}`)
    }

    const columnsForTable = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Acciones',
            render: (heading) => (
                <Row>
                    <div onClick={() => { editHeading(heading._id) }}>
                        <Edit />
                    </div>
                    <div onClick={() => {
                        setDeleteEntityIdConfirmation(heading._id)
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
                    dataSource={rubros}
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
                    title='Eliminar rubro'
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

export default Rubros