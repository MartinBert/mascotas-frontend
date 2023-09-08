// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { DeleteModal, OpenImage } from '../../components/generics'
import GiselaDetailsModal from '../../components/generics/productDetailsModal/GiselaDetailsModal'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Table } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Services
import api from '../../services'

// Views
import Header from './Header'

// Helpers
import helpers from '../../helpers'

// Imports Destructuring
const { Details, Edit, Delete } = icons
const { useLoggedUserContext } = contextProviders.LoggedUserContextProvider
const { decimalPercent, roundToMultiple, roundTwoDecimals } = helpers.mathHelper


const Productos = () => {
    const navigate = useNavigate()
    const loggedUserContext = useLoggedUserContext()
    const [, loggedUser_dispatch] = loggedUserContext
    const [products, setProducts] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(6)
    const [filters, setFilters] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [detailsData, setDetailsData] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteEntityId, setDeleteEntityId] = useState(null)
    const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId')
            const loggedUser = await api.usuarios.findById(userId)
            loggedUser_dispatch({ type: 'LOAD_USER', payload: loggedUser })
        }
        fetchUser()
    }, [loggedUser_dispatch])

    useEffect(() => {
        const fetchProducts = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.productos.findAll({ page, limit, filters: stringFilters })
            setProducts(data.docs)
            setTotalDocs(data.totalDocs)
            setLoading(false)

            const allProductsSearch = await api.productos.findAll()
            const allProducts = allProductsSearch.docs
            console.log(allProducts)
            for (let index = 0; index < allProducts.length; index++) {
                const element = allProducts[index]

                const margenGanancia = decimalPercent(element.margenGanancia)
                const margenGananciaFraccionado = decimalPercent(element.margenGananciaFraccionado)
                const precioUnitario = parseFloat(element.precioUnitario)
                const porcentajeIvaCompra = decimalPercent(element.porcentajeIvaCompra)
                const porcentajeIvaVenta = decimalPercent(element.porcentajeIvaVenta)

                const gananciaNeta = roundTwoDecimals(precioUnitario * margenGanancia)
                const gananciaNetaFraccionado = roundTwoDecimals(precioUnitario * margenGananciaFraccionado)
                const ivaCompra = roundTwoDecimals(precioUnitario - (precioUnitario / (1 + porcentajeIvaCompra)))
                const ivaVenta = roundTwoDecimals(precioUnitario * porcentajeIvaVenta)
                const precioVentaSinRedondear = roundTwoDecimals(precioUnitario + ivaVenta + gananciaNeta)
                const precioVenta = roundToMultiple(roundTwoDecimals(precioUnitario + ivaVenta + gananciaNeta), 10)
                const diferenciaPrecioVenta = precioVenta - precioVentaSinRedondear
                const precioVentaFraccionadoSinRedondear = roundTwoDecimals(precioUnitario + ivaVenta + gananciaNetaFraccionado)
                const precioVentaFraccionado = roundToMultiple(roundTwoDecimals(precioUnitario + ivaVenta + gananciaNetaFraccionado), 10)
                const diferenciaPrecioVentaFraccionado = precioVentaFraccionado - precioVentaFraccionadoSinRedondear

                    element.gananciaNeta = gananciaNeta + diferenciaPrecioVenta
                    element.gananciaNetaFraccionado = gananciaNetaFraccionado + diferenciaPrecioVentaFraccionado
                    element.ivaCompra = ivaCompra
                    element.ivaVenta = ivaVenta
                    element.precioVenta = precioVenta
                    element.precioVentaFraccionado = precioVentaFraccionado
                    await api.productos.edit(element)
            }
        }
        fetchProducts()
    }, [page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
        if (deleteEntityId === null) return
        const deleteProduct = async () => {
            setLoading(true)
            api.productos.deleteById(deleteEntityId)
                .then(() => {
                    setDeleteEntityId(null)
                    setLoading(false)
                })
        }
        deleteProduct()
    }, [deleteEntityId])

    const seeDetails = (data) => {
        setDetailsData(data)
        setDetailsVisible(true)
    }

    const editProduct = (id) => {
        navigate(`/productos/${id}`)
    }

    const columnsForTable = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            open: true
        },
        {
            title: 'Codigo de producto',
            dataIndex: 'codigoProducto',
            open: true
        },
        {
            title: 'Codigo de barras',
            dataIndex: 'codigoBarras',
            open: true
        },
        {
            title: 'Stock',
            dataIndex: 'cantidadStock',
            open: true
        },
        {
            title: 'Detalles',
            render: (product) => (
                <div onClick={() => seeDetails(product)}>
                    <Details title='Ver detalle' />
                </div>
            ),
            open: true
        },
        {
            title: 'Imagen',
            render: (product) => (
                <OpenImage
                    alt='Ver imagen'
                    imageUrl={
                        (product.imagenes && product.imagenes.length > 0)
                            ? product.imagenes[product.imagenes.length - 1].url
                            : '/no-image.png'
                    }
                />
            ),
            open: true
        },
        {
            title: 'Acciones',
            render: (product) => (
                <Row
                    style={{ display: 'flex', justifyContent: 'start' }}
                >
                    <div
                        onClick={() => editProduct(product._id)}
                        style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
                    >
                        <Edit />
                    </div>
                    <div
                        onClick={() => {
                            setDeleteEntityIdConfirmation(product._id)
                            setDeleteVisible(true)
                        }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Delete />
                    </div>
                </Row>
            ),
            open: true
        },
    ].filter(item => item.open)

    return (
        <>
            <Row>
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <Header
                        setFilters={setFilters}
                        filters={filters}
                        setLoading={setLoading}
                        detailsData={detailsData}
                    />
                </Col>
                <Col span={24}>
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
                            onChange: (e) => { setPage(e) },
                            onShowSizeChange: (e, val) => { setLimit(val) }
                        }}
                        loading={loading}
                        rowKey='_id'
                        tableLayout='auto'
                        size='small'
                    />
                </Col>
                {
                    (detailsData)
                        ? <GiselaDetailsModal
                            detailsVisible={detailsVisible}
                            setDetailsVisible={setDetailsVisible}
                            detailsData={detailsData}
                        />
                        : ''
                }
            </Row>
            <DeleteModal
                title='Eliminar producto'
                deleteVisible={deleteVisible}
                setLoading={setLoading}
                setDeleteVisible={setDeleteVisible}
                setDeleteEntityId={setDeleteEntityId}
                deleteEntityIdConfirmation={deleteEntityIdConfirmation}
            />
        </>
    )
}

export default Productos