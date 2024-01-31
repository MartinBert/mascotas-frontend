// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { DeleteModal, OpenImage } from '../../components/generics'
import GiselaDetailsModal from '../../components/generics/productDetailsModal/GiselaDetailsModal'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Table } from 'antd'

// Custom Context Providers
import actions from '../../actions'
import contexts from '../../contexts'

// Services
import api from '../../services'

// Views
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useAuthContext } = contexts.Auth
const { useDeleteModalContext } = contexts.DeleteModal
const { Details, Edit, Delete } = icons


const Productos = () => {
    const navigate = useNavigate()
    const [, auth_dispatch] = useAuthContext()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(6)
    const [filters, setFilters] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [detailsData, setDetailsData] = useState(null)

    // ------------------ Fetch Logged User ------------------ //
    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId')
            const loggedUser = await api.usuarios.findById(userId)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })
        }
        fetchUser()
    }, [auth_dispatch])

    // ------------------ Fetch Products ------------------ //
    useEffect(() => {
        const fetchProducts = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.productos.findPaginated({ page, limit, filters: stringFilters })
            setProducts(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchProducts()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    // ------------------ Products Deletion ------------------ //
    const productDeletion = (productID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: productID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteProduct = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.productos.deleteById(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteProduct()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Products Edition ------------------ //
    const productEdition = (id) => {
        navigate(`/productos/${id}`)
    }

    // ------------------ Products Details ------------------ //
    const seeDetails = (data) => {
        setDetailsData(data)
        setDetailsVisible(true)
    }


    const columnsForTable = [
        {
            dataIndex: 'product_name',
            open: true,
            render: (_, product) => product.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'product_productCode',
            open: true,
            render: (_, product) => product.codigoProducto,
            title: 'Codigo de producto'
        },
        {
            dataIndex: 'product_barCode',
            open: true,
            render: (_, product) => product.codigoBarras,
            title: 'Codigo de barras'
        },
        {
            dataIndex: 'product_stockQuantity',
            open: true,
            render: (_, product) => product.cantidadStock,
            title: 'Stock'
        },
        {
            dataIndex: 'product_details',
            render: (_, product) => (
                <div
                    onClick={() => seeDetails(product)}
                >
                    <Details
                        title='Ver detalle'
                    />
                </div>
            ),
            open: true,
            title: 'Detalles'
        },
        {
            dataIndex: 'product_image',
            render: (_, product) => (
                <OpenImage
                    alt='Ver imagen'
                    imageUrl={
                        (product.imagenes && product.imagenes.length > 0)
                            ? product.imagenes[product.imagenes.length - 1].url
                            : '/no-image.png'
                    }
                />
            ),
            open: true,
            title: 'Imagen'
        },
        {
            dataIndex: 'product_actions',
            render: (_, product) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => productEdition(product._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => productDeletion(product._id)}
                        span={12}
                    >
                        <Delete />
                    </Col>
                </Row>
            ),
            open: true,
            title: 'Acciones'
        },
    ]
        .filter(item => item.open)

    return (
        <Row
            gutter={[0, 16]}
        >
            <Col
                span={24}
            >
                <Header
                    products={products}
                    setFilters={setFilters}
                    filters={filters}
                    setLoading={setLoading}
                    detailsData={detailsData}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={products}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        defaultPageSize: 7,
                        pageSizeOptions: [7, 14, 28, 56],
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    loading={deleteModal_state.loading}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                />
            </Col>
            {
                !detailsData
                    ? null
                    : (
                        <GiselaDetailsModal
                            detailsVisible={detailsVisible}
                            setDetailsVisible={setDetailsVisible}
                            detailsData={detailsData}
                        />
                    )
            }
            <DeleteModal
                title='Eliminar producto'
            />
        </Row>

    )
}

export default Productos