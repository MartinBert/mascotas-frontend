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


const Rubros = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [rubros, setRubros] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Product Categories ------------------ //
    const fetchRubros = async () => {
        const stringFilters = JSON.stringify(filters)
        const data = await api.types.findPaginated({ page, limit, filters: stringFilters })
        setRubros(data.docs)
        setTotalDocs(data.totalDocs)
        deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
    }

    useEffect(() => {
        fetchRubros()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, filters, limit, page])

    // ------------------ Product Category Deletion ------------------ //
    const productCategoryDeletion = (productCategoryID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: productCategoryID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteProductCategory = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.types.remove(deleteModal_state.entityID)
        if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteProductCategory()
        // eslint-disable-next-line
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Product Category Edition ------------------ //
    const productCategoryEdition = (id) => {
        navigate(`/rubros/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'productCategory_name',
            render: (_, productCategory) => productCategory.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'productCategory_actions',
            render: (_, productCategory) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => productCategoryEdition(productCategory._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => productCategoryDeletion(productCategory._id)}
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
                    filters={filters}
                    setFilters={setFilters}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={rubros}
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
                    title='Eliminar rubro'
                />
            </Col>
        </Row>
    )
}

export default Rubros