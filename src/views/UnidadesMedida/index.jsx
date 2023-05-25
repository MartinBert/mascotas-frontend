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


const UnidadesMedida = () => {
    const navigate = useNavigate()
    const [unidadesMedida, setUnidadesMedida] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteEntityId, setDeleteEntityId] = useState(null)
    const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null)

    useEffect(() => {
        const fetchUnidadesMedida = async () => {
            const data = await api.unidadesmedida.findAll({ page, limit, filters })
            setUnidadesMedida(data.docs)
            setTotalDocs(data.totalDocs)
            setLoading(false)
        }
        fetchUnidadesMedida()
    }, [page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
        if (deleteEntityId === null) return
        const deleteBrand = async () => {
            setLoading(true)
            api.unidadesmedida.deleteUnidadMedida(deleteEntityId)
                .then(() => {
                    setDeleteEntityId(null)
                    setLoading(false)
                })
        }
        deleteBrand()
    }, [deleteEntityId])

    const editBrand = (id) => {
        navigate(`/unidadesmedida/${id}`)
    }

    const columnsForTable = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Fraccionamiento',
            dataIndex: 'fraccionamiento',
        },
        {
            title: 'Acciones',
            render: ({ _id }) => (
                <Row>
                    <div onClick={() => { editBrand(_id) }}>
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
                    dataSource={unidadesMedida}
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
                    title='Eliminar unidad de medida'
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

export default UnidadesMedida