import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../services'
import { Row, Col, Table } from 'antd'
import Header from './Header'
import icons from '../../components/icons'
import DetailsModal from './DetailsModal'
import { DeleteModal } from '../../components/generics'
import helpers from '../../helpers'

const { Details, Edit, Delete } = icons
const { dateHelper, mathHelper } = helpers
const { roundTwoDecimals } = mathHelper

const Salidas = () => {
    const history = useHistory()
    const [salidas_paginadas, setSalidas_paginadas] = useState(null)
    const [salidas_totales, setSalidas_totales] = useState(null)
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
        const fetchSalidas_paginadas = async () => {
            const response = await api.salidas.findAll({ page, limit, filters })
            const responseFixed = response.data.docs.map(item => {
                item.gananciaNeta = roundTwoDecimals(item.gananciaNeta)
                return item
            })
            setSalidas_paginadas(responseFixed)
            setTotalDocs(response.data.totalDocs)
            setLoading(false)
        }
        fetchSalidas_paginadas()
    }, [page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
        const fetchSalidas_totales = async () => {
            const data = await api.salidas.findAll(null)
            setSalidas_totales(data)
        }
        fetchSalidas_totales()
    }, [])

    useEffect(() => {
        if (deleteEntityId === null) return
        const deleteSalida = async () => {
            setLoading(true)
            api.salidas.deleteById(deleteEntityId)
                .then(() => {
                    setDeleteEntityId(null)
                    setLoading(false)
                })
        }
        deleteSalida()
    }, [deleteEntityId])

    const editSalida = (id) => {
        history.push(`/salidas/${id}`)
    }

    const columnsForTable = [
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            render: usuario => (usuario) ? usuario.nombre : 'Usuario inexistente'
        },
        {
            title: 'Productos que salieron',
            render: data => (
                <div onClick={() => {
                    setDetailsData(data.productos)
                    setDetailsVisible(true)
                }}>
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
            title: 'Ganancia neta',
            dataIndex: 'gananciaNeta',
        },
        {
            title: 'Acciones',
            render: (salida) => (
                <Row style={{ display: 'inline-flex' }}>
                    <div onClick={() => { editSalida(salida._id) }}>
                        <Edit />
                    </div>
                    <div onClick={() => {
                        setDeleteEntityIdConfirmation(salida._id)
                        setDeleteVisible(true)
                    }}>
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
                    salidas_paginadas={salidas_paginadas}
                    salidas_totales={salidas_totales}
                />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={salidas_paginadas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: (e) => { setPage(e) },
                        onShowSizeChange: (e, val) => { setLimit(val) }
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
                title='Eliminar salida'
                deleteVisible={deleteVisible}
                setLoading={setLoading}
                setDeleteVisible={setDeleteVisible}
                setDeleteEntityId={setDeleteEntityId}
                deleteEntityIdConfirmation={deleteEntityIdConfirmation}
            />
        </Row>
    )
}

export default Salidas