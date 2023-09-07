// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import Header from './Header'
import DetailsModal from './DetailsModal'

// Imports Destructuring
const { Details, Edit, Delete } = icons
const { dateHelper } = helpers


const Entradas = () => {
    const navigate = useNavigate()
    const [entradas_paginadas, setEntradas_paginadas] = useState(null)
    const [entradas_totales, setEntradas_totales] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [detailsData, setDetailsData] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteEntityId, setDeleteEntityId] = useState(null)
    const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null)

    useEffect(() => {
        const fetchEntradas_paginadas = async () => {
            const response = await api.entradas.findAll({ page, limit, filters })
            setEntradas_paginadas(response.data.docs)
            setTotalDocs(response.data.totalDocs)
            setLoading(false)
        }
        fetchEntradas_paginadas()
    }, [page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
        const fetchEntradas_totales = async () => {
            const data = await api.entradas.findAll(null)
            setEntradas_totales(data)
        }
        fetchEntradas_totales()
    }, [])

    useEffect(() => {
        if (deleteEntityId === null) return
        const deleteEntrada = async () => {
            setLoading(true)
            api.entradas.deleteById(deleteEntityId)
                .then(() => {
                    setDeleteEntityId(null)
                    setLoading(false)
                })
        }
        deleteEntrada()
    }, [deleteEntityId])

    const editEntrada = (id) => {
        console.log('test')
        navigate(`/entradas/${id}`)
    }

    const columnsForTable = [
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            render: usuario => (usuario) ? usuario.nombre : 'Usuario inexistente'
        },
        {
            title: 'Productos que entraron',
            render: data => (
                <div
                    onClick={() => {
                        setDetailsData(data.productos)
                        setDetailsVisible(true)
                    }}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <Details />
                </div>
            )
        },
        {
            title: 'Fecha',
            render: (data) => (
                <p>{dateHelper.simpleDateWithHours(data.fecha) + ' hs'}</p>
            ),
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
        },
        {
            title: 'Costo',
            dataIndex: 'costoTotal',
        },
        {
            title: 'Acciones',
            render: (entrada) => (
                <Row
                    style={{ display: 'flex', justifyContent: 'start' }}
                >
                    <div
                        onClick={() => editEntrada(entrada._id)}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Edit />
                    </div>
                    <div
                        onClick={() => {
                            setDeleteEntityIdConfirmation(entrada._id)
                            setDeleteVisible(true)
                        }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Delete />
                    </div>
                </Row>
            )
        },
    ]

    return (
        <Row>
            <Col span={24}>
                <Header
                    setFilters={setFilters}
                    setPage={setPage}
                    entradas_paginadas={entradas_paginadas}
                    entradas_totales={entradas_totales}
                />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={entradas_paginadas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: (e) => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    loading={loading}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                />
            </Col>
            <DetailsModal
                detailsVisible={detailsVisible}
                setDetailsVisible={setDetailsVisible}
                detailsData={detailsData}
            />
            <DeleteModal
                title='Eliminar entrada'
                deleteVisible={deleteVisible}
                setLoading={setLoading}
                setDeleteVisible={setDeleteVisible}
                setDeleteEntityId={setDeleteEntityId}
                deleteEntityIdConfirmation={deleteEntityIdConfirmation}
            />
        </Row>
    )
}

export default Entradas