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


const Clientes = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [clientes, setClientes] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Clients ------------------ //
    useEffect(() => {
        const fetchClientes = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.clientes.findPaginated({ page, limit, filters: stringFilters })
            setClientes(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchClientes()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // ------------------ Client Deletion ------------------ //
    const clientDeletion = (clientID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: clientID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteClient = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.clientes.deleteCliente(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteClient()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Client Edition ------------------ //
    const clientEdition = (id) => {
        navigate(`/clientes/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'client_fiscalCondition',
            render: (_, data) => data.condicionFiscal.nombre,
            title: 'Cond. Fiscal'
        },
        {
            dataIndex: 'client_businessName',
            render: (_, data) => data.razonSocial,
            title: 'Cliente'
        },
        {
            dataIndex: 'client_cuit',
            render: (_, data) => data.cuit,
            title: 'CUIT / CUIL'
        },
        {
            dataIndex: 'client_email',
            render: (_, data) => data.email,
            title: 'Email'
        },
        {
            dataIndex: 'client_phone',
            render: (_, data) => data.telefono,
            title: 'Teléfono'
        },
        {
            dataIndex: 'client_direction',
            render: (_, data) => data.direccion,
            title: 'Dirección'
        },
        {
            dataIndex: 'client_city',
            render: (_, data) => data.ciudad,
            title: 'Ciudad'
        },
        {
            dataIndex: 'client_province',
            render: (_, data) => data.provincia,
            title: 'Provincia'
        },
        {
            dataIndex: 'client_actions',
            render: (_, client) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => clientEdition(client._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => clientDeletion(client._id)}
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
                    setFilters={setFilters}
                    filters={filters}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={clientes}
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
                    title='Eliminar cliente'
                />
            </Col>
        </Row>
    )
}

export default Clientes