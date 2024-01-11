// React Components and Hooks
import React, { useEffect } from 'react'
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
import DetailsModal from './DetailsModal'
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { formatFindParams } = actions.paginationParams
const { useDeleteModalContext } = contexts.DeleteModal
const { useEntriesContext } = contexts.Entries
const { Delete, Details, Edit } = icons

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
    const [entries_state, entries_dispatch] = useEntriesContext()

    // ------------------ Fetch Entries ------------------ //
    useEffect(() => {
        const fetchEntries_paginated = async () => {
            const findParams = formatFindParams(entries_state.paginationParams)
            const data = await api.entradas.findPaginated(findParams)
            entries_dispatch({ type: 'SET_ENTRIES_FOR_RENDER', payload: data })
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchEntries_paginated()
    }, [
        deleteModal_state.loading,
        entries_state.paginationParams
    ])

    // ------------------ Entry Deletion ------------------ //
    const entryDeletion = (entry) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: entry._id })
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
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Entry Edition ------------------ //
    const entryEdition = (entry) => {
        navigate(`/entradas/${entry._id}`)
    }

    // --------------------- Actions --------------------- //
    const setLimit = (val) => {
        const paginationParams = {
            ...entries_state.paginationParams,
            limit: parseInt(val)
        }
        entries_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const setPage = (e) => {
        const paginationParams = {
            ...entries_state.paginationParams,
            page: parseInt(e)
        }
        entries_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    // ------------------ Product Details ------------------ //
    const openDetailsModal = (entry) => {
        entries_dispatch({ type: 'SET_DATA_FOR_DETAILS_MODAL', payload: entry.productos })
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
                <div onClick={() => openDetailsModal(entry)}>
                    <Details />
                </div>
            ),
            title: 'Productos que entraron'
        },
        {
            dataIndex: 'entry_date',
            render: (_, entry) => entry.fechaString,
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
                <Row justify='start'>
                    <Col
                        onClick={() => entryEdition(entry)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => entryDeletion(entry)}
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
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Header />
            </Col>
            <Col span={24} >
                <Table
                    width={'100%'}
                    dataSource={entries_state.entriesForRender}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: entries_state.paginationParams.page,
                        limit: entries_state.paginationParams.limit,
                        total: entries_state.entriesTotalQuantity,
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
            <DetailsModal />
            <DeleteModal title='Eliminar entrada' />
        </Row>
    )
}

export default Entradas