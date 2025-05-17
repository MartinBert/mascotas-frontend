// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
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
import DeleteModal from './DeleteModal'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { Edit, Delete } = icons


const CuentasCorrientes = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [cuentasCorrientes, setCuentasCorrientes] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Current Account ------------------ //
    useEffect(() => {
        const fetchCuentasCorrientes = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.cuentasCorrientes.findPaginated({ page, limit, filters: stringFilters })
            setCuentasCorrientes(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchCuentasCorrientes()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // ------------------ Current Account Deletion ------------------ //
    const currentAccountDeletion = (currentAccountID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: currentAccountID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteCurrentAccount = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.cuentasCorrientes.remove(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteCurrentAccount()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Current Account Edition ------------------ //
    const currentAccountEdition = (id) => {
        navigate(`/cuentasCorrientes/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'currentAccount_razonSocial',
            render: (_, currentAccount) => currentAccount.razonSocial,
            title: 'Razón social',
        },
        {
            dataIndex: 'currentAccount_cuit',
            render: (_, currentAccount) => currentAccount.cuit,
            title: 'CUIT',
        },
        {
            dataIndex: 'currentAccount_condicionFiscal',
            render: (_, currentAccount) => currentAccount.condicionFiscal,
            title: 'Cond. Fiscal',
        },
        {
            dataIndex: 'currentAccount_email',
            render: (_, currentAccount) => currentAccount.email,
            title: 'Email',
        },
        {
            dataIndex: 'currentAccount_telefono',
            render: (_, currentAccount) => currentAccount.telefono,
            title: 'Teléfono',
        },
        {
            dataIndex: 'currentAccount_direccion',
            render: (_, currentAccount) => currentAccount.direccion,
            title: 'Dirección',
        },
        {
            dataIndex: 'currentAccount_ciudad',
            render: (_, currentAccount) => currentAccount.ciudad,
            title: 'Ciudad',
        },
        {
            dataIndex: 'currentAccount_provincia',
            render: (_, currentAccount) => currentAccount.provincia,
            title: 'Provincia',
        },
        {
            dataIndex: 'currentAccount_actions',
            render: (_, currentAccount) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => currentAccountEdition(currentAccount._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => currentAccountDeletion(currentAccount._id)}
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
                    dataSource={cuentasCorrientes}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: e => { setPage(e) },
                        onShowSizeChange: (e, val) => { setLimit(val) }
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={loading}
                />
                <DeleteModal
                    title='Eliminar cuenta corriente'
                />
            </Col>
        </Row>
    )
}

export default CuentasCorrientes