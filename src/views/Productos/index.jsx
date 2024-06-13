// React Components and Hooks
import React, { useEffect } from 'react'
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
import ExportProductListModal from './ExportProductListModal'
import Header from './Header'
import PriceModificatorModal from './PriceModificatorModal'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { formatFindParams } = actions.paginationParams
const { useAuthContext } = contexts.Auth
const { useDeleteModalContext } = contexts.DeleteModal
const { useProductsContext } = contexts.Products
const { Details, Edit, Delete } = icons


const Productos = () => {
    const navigate = useNavigate()
    const [, auth_dispatch] = useAuthContext()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [products_state, products_dispatch] = useProductsContext()

    // --------------------- Actions --------------------- //
    const openDetailsModal = (productData) => {
        products_dispatch({ type: 'SET_PRODUCT_FOR_DETAILS_MODAL', payload: productData })
    }

    const setPageAndLimit = (page, limit) => {
        const paginationParams = {
            ...products_state.index.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    // --------------- Fetch Brands and Types ---------------- //
    const loadBrandsAndTypes = async () => {
        const findBrands = await api.marcas.findAll()
        const findTypes = await api.rubros.findAll()
        const allBrands = findBrands.docs
        const allBrandsNames = allBrands.length < 1
            ? []
            : [{ value: 'Todas las marcas' }].concat(allBrands.map(brand => {
                return { value: brand.nombre }
            }))
        const allTypes = findTypes.docs
        const allTypesNames = allTypes.length < 1
            ? []
            : [{ value: 'Todos los rubros' }].concat(allTypes.map(type => {
                return { value: type.nombre }
            }))
        products_dispatch({
            type: 'SET_BRANDS_AND_TYPES',
            payload: { allBrands, allBrandsNames, allTypes, allTypesNames }
        })
    }

    useEffect(() => { loadBrandsAndTypes() }, [])

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
            const findParamsForRender = formatFindParams(products_state.index.paginationParams)
            const dataForRender = await api.productos.findPaginated(findParamsForRender)
            const dataForExport = await api.productos.findAllByFilters(findParamsForRender.filters)
            products_dispatch({ type: 'SET_PRODUCTS_TO_RENDER_IN_INDEX', payload: dataForRender })
            products_dispatch({ type: 'SET_PRODUCTS_FOR_EXCEL_REPORT', payload: dataForExport.docs })
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchProducts()
    }, [deleteModal_state.loading, products_state.index.paginationParams])

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
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Products Edition ------------------ //
    const productEdition = (id) => {
        navigate(`/productos/${id}`)
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
                <div onClick={() => openDetailsModal(product)}>
                    <Details title='Ver detalle' />
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
                <Row justify='start'>
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
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Header />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={products_state.index.productsToRender}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: products_state.index.paginationParams.page,
                        defaultPageSize: products_state.index.paginationParams.limit,
                        limit: products_state.index.paginationParams.limit,
                        onChange: (page, limit) => setPageAndLimit(page, limit),
                        pageSizeOptions: [7, 14, 28, 56],
                        showSizeChanger: true,
                        total: products_state.index.productsTotalRecords
                    }}
                    loading={deleteModal_state.loading}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                />
            </Col>
            {
                !products_state.detailsModal.product
                    ? null
                    : <GiselaDetailsModal />
            }
            <DeleteModal title='Eliminar producto' />
            <ExportProductListModal />
            <PriceModificatorModal />
        </Row>
    )
}

export default Productos