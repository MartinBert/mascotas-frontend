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

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import DetailsModal from './DetailsModal'
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { Delete, Details, Edit } = icons
const { dateHelper } = helpers

const findEntry = async (entryID) => {
    const findEntry = await api.entradas.findById(entryID)
    return findEntry
}

const fixStock = async (entryToDelete) => {
    for (let productOfEntry of entryToDelete.productos) {
        const findProduct = await api.productos.findById(productOfEntry._id)
        const product = await findProduct.data
        await api.productos.modifyStock({
            product,
            isIncrement: false,
            quantity: productOfEntry.cantidadesEntrantes
        })
    }
}


const Entradas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [entradas_paginadas, setEntradas_paginadas] = useState(null)
    const [entradas_totales, setEntradas_totales] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [detailsData, setDetailsData] = useState(null)

    // ------------------ Fetch Entries ------------------ //
    useEffect(() => {
        const fetchEntries_paginated = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.entradas.findPaginated({ page, limit, filters: stringFilters })
            setEntradas_paginadas(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchEntries_paginated()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    useEffect(() => {
        const fetchEntries_all = async () => {
            const data = await api.entradas.findAll()
            setEntradas_totales(data.docs)
        }
        fetchEntries_all()
    }, [])

    // ------------------ Entry Deletion ------------------ //
    const entryDeletion = (entryID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: entryID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteEntry = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const findEntryToDelete = await findEntry(deleteModal_state.entityID)
            if (findEntryToDelete.message !== 'OK') return errorAlert('Fallo al corregir stock. Intente de nuevo.')
            fixStock(findEntryToDelete.data)
            const response = await api.entradas.deleteById(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteEntry()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Entry Edition ------------------ //
    const entryEdition = (entryID) => {
        navigate(`/entradas/${entryID}`)
    }

    // ------------------ Product Details ------------------ //
    const openProductDetails = (entry) => {
        setDetailsData(entry.productos)
        setDetailsVisible(true)
    }


    const columnsForTable = [
        {
            dataIndex: 'entry_user',
            render: (_, entry) => entry.usuario ? entry.usuario.nombre : 'Usuario inexistente',
            title: 'Usuario'
        },
        {
            dataIndex: 'entry_details',
            render: (_, entry) => (
                <div
                    onClick={() => openProductDetails(entry)}
                >
                    <Details />
                </div>
            ),
            title: 'Productos que entraron'
        },
        {
            dataIndex: 'entry_date',
            render: (_, entry) => dateHelper.simpleDateWithHours(entry.fecha) + ' hs',
            title: 'Fecha'
        },
        {
            dataIndex: 'entry_description',
            render: (_, entry) => entry.descripcion,
            title: 'Descripción'

        },
        {
            dataIndex: 'entry_totalCost',
            render: (_, entry) => entry.costoTotal,
            title: 'Costo'

        },
        {
            dataIndex: 'entry_actions',
            render: (_, entry) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => entryEdition(entry._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => entryDeletion(entry._id)}
                        span={12}
                    >
                        <Delete />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        },
    ]

    return (
        <Row
            gutter={[0, 16]}
        >
            <Col
                span={24}
            >
                <Header
                    entradas_paginadas={entradas_paginadas}
                    entradas_totales={entradas_totales}
                    filters={filters}
                    setFilters={setFilters}
                    setPage={setPage}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={entradas_paginadas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    loading={deleteModal_state.loading}
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
            />
        </Row>
    )
}

export default Entradas