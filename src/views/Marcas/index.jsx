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
const { DeleteModal } = generics
const { Edit, Delete } = icons


const Marcas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [marcas, setMarcas] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    // ------------------ Fetch Brands ------------------ //
    useEffect(() => {
        const fetchMarcas = async () => {
            const stringFilters = JSON.stringify(filters)
            const findRecords = await api.brands.findPaginated({ page, limit, filters: stringFilters })
            setMarcas(findRecords.data.docs)
            setTotalDocs(findRecords.data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchMarcas()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, filters, limit, page])

    // ------------------ Brands Deletion ------------------ //
    const brandDeletion = (brandID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: brandID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteBrand = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.brands.remove(deleteModal_state.entityID)
            if (response.status !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteBrand()
        // eslint-disable-next-line
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Brands Edition ------------------ //
    const brandEdition = (id) => {
        navigate(`/marcas/${id}`)
    }


    const columnsForTable = [
        {
            dataIndex: 'brand_name',
            render: (_, brand) => brand.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'brand_actions',
            render: (_, brand) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => brandEdition(brand._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => brandDeletion(brand._id)}
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
                    dataSource={marcas}
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
                    title='Eliminar marca'
                />
            </Col>
        </Row>
    )
}

export default Marcas