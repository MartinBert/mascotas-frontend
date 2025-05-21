// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import generics from '../../components/generics'
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
const { DeleteModal, OpenImage } = generics
const { Edit, Delete } = icons


const Empresas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [empresas, setEmpresas] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Business ------------------ //
    const fetchEmpresas = async () => {
        const stringFilters = JSON.stringify(filters)
        const findRecords = await api.business.findPaginated({ page, limit, filters: stringFilters })
        setEmpresas(findRecords.data.docs)
        setTotalDocs(findRecords.data.totalDocs)
        deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
    }

    useEffect(() => {
        fetchEmpresas()
        // eslint-disable-next-line
    }, [ deleteModal_state.loading, filters, limit, page ])

    // ------------------ Business Deletion ------------------ //
    const businessDeletion = (businessID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: businessID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteBusiness = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.business.remove(deleteModal_state.entityID)
        if (response.status !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteBusiness()
        // eslint-disable-next-line
    }, [ deleteModal_state.confirmDeletion, deleteModal_state.entityID ])

    // ------------------ Business Edition ------------------ //
    const businessEdition = (id) => {
        navigate(`/empresas/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'business_businessName',
            render: (_, business) => business.razonSocial,
            title: 'Razón social',
        },
        {
            dataIndex: 'business_cuit',
            render: (_, business) => business.cuit,
            title: 'Cuit',
        },
        {
            dataIndex: 'business_logo',
            render: (_, business) => (
                <OpenImage
                    alt='Logo de empresa'
                    imageUrl={
                        business.logo
                            ? business.logo.url
                            : '/no-image.png'
                    }
                />
            ),
            title: 'Logo',
        },
        {
            dataIndex: 'business_actions',
            render: (_, business) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => businessEdition(business._id)}
                        span={24}
                    >
                        <Edit />
                    </Col>
                </Row>
            ),
            title: 'Acciones',
        }
    ]

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Header
                    filters={filters}
                    setFilters={setFilters}
                />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={empresas}
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
                <DeleteModal title='Eliminar empresa'/>
            </Col>
        </Row>
    )
}

export default Empresas