// React Components and Hooks
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import generics from '../../components/generics'
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
const { useRenderConditionsContext } = contexts.RenderConditions
const { DeleteModal, OpenImage } = generics
const { Details, Edit, Delete } = icons


const Productos = () => {
    const navigate = useNavigate()
    const [, auth_dispatch] = useAuthContext()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [products_state, products_dispatch] = useProductsContext()
    const [renderConditions_state, renderConditions_dispatch] = useRenderConditionsContext()

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
        const findBrands = await api.brands.findAll()
        const findTypes = await api.types.findAll()
        const allBrands = findBrands.data
        const allBrandsNames = allBrands.length < 1
            ? []
            : [{ value: 'Todas las marcas' }].concat(allBrands.map(brand => {
                return { value: brand.nombre }
            }))
        const allTypes = findTypes.data
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

    const loadRenderConditions = async () => {
        const recordsQuantityOfBrands = await api.brands.countRecords()
        const recordsQuantityOfTypes = await api.types.countRecords()
        renderConditions_dispatch({
            type: 'SET_EXISTS_BRANDS',
            payload: recordsQuantityOfBrands.data < 1 ? false : true
        })
        renderConditions_dispatch({
            type: 'SET_EXISTS_TYPES',
            payload: recordsQuantityOfTypes.data < 1 ? false : true
        })
    }

    useEffect(() => {
        loadBrandsAndTypes()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        loadRenderConditions()
        // eslint-disable-next-line
    }, [])

    // ------------------ Fetch Logged User ------------------ //
    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId')
            const loggedUser = await api.users.findById(userId)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser.data })
        }
        fetchUser()
    }, [])

    // ------------------ Fetch Products ------------------ //
    const fetchProducts = async () => {
        if (!products_state.index.paginationParams) return
        const findParamsForRender = formatFindParams(products_state.index.paginationParams)
        const dataForRender = await api.products.findPaginated(findParamsForRender)
        products_dispatch({ type: 'SET_PRODUCTS_TO_RENDER_IN_INDEX', payload: dataForRender.data })
        deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
    }

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, products_state.index.paginationParams])

    // ------------------ Products Deletion ------------------ //
    const productDeletion = (productID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: productID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteProduct = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.products.remove(deleteModal_state.entityID)
        if (response.status !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteProduct()
        // eslint-disable-next-line
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
        <>
            {
                !renderConditions_state.existsBrands
                    || !renderConditions_state.existsTypes
                    ? <h1>Debes registrar al menos una marca y un rubro antes de comenzar a utilizar esta función.</h1>
                    : (
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
        </>
    )
}

export default Productos