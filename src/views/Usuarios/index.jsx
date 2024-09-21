// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import generics from '../../components/generics'
import icons from '../../components/icons'

// Custom Context Providers
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
const { DeleteModal } = generics
const { Edit, Delete } = icons


const Usuarios = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [usuarios, setUsuarios] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Users ------------------ //
    const fetchUsuarios = async () => {
        const stringFilters = JSON.stringify(filters)
        const data = await api.usuarios.findPaginated({ page, limit, filters: stringFilters })
        setUsuarios(data.docs)
        setTotalDocs(data.totalDocs)
        deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
    }

    useEffect(() => {
        fetchUsuarios()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, filters, limit, page])

    // ------------------ User Deletion ------------------ //
    const userDeletion = (userID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: userID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteUser = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.usuarios.deleteUsuario(deleteModal_state.entityID)
        if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteUser()
        // eslint-disable-next-line
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ User Edition ------------------ //
    const userEdition = (id) => {
        navigate(`/usuarios/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'user_name',
            render: (_, user) => user.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'user_email',
            render: (_, user) => user.email,
            title: 'Email',
        },
        {
            dataIndex: 'user_perfil',
            render: (_, user) => user.perfil ? 'Super administrador' : 'Administrador',
            title: 'Perfil',
        },
        {
            dataIndex: 'user_actions',
            render: (_, user) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => userEdition(user._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => userDeletion(user._id)}
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
                    dataSource={usuarios}
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
                <DeleteModal
                    title='Eliminar usuario'
                />
            </Col>
        </Row>
    )
}

export default Usuarios