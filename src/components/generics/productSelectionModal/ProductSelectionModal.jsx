// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Custom Components
import { GenericAutocomplete } from '../'

// Custom Context Providers
import contexts from '../../../contexts'

// Services
import api from '../../../services'

// Design Components
import { Modal, Row, Col, Input, Button, Table, Checkbox } from 'antd'

// Imports Destructurings
const { useEntriesContext } = contexts.Entries
const { useOutputsContext } = contexts.Outputs
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { useSaleProductsContext } = contexts.SaleProducts


const ProductSelectionModal = () => {
    const location = useLocation()
    const [entries_state, entries_dispatch] = useEntriesContext()
    const [outputs_state, outputs_dispatch] = useOutputsContext()
    const [productSelectionModal_state, productSelectionModal_dispatch] = useProductSelectionModalContext()
    const [saleProducts_state, saleProducts_dispatch] = useSaleProductsContext()

    const [productsForTable, setProductsForTable] = useState(null)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(0)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedHeading, setSelectedHeading] = useState(null)
    const [filters, setFilters] = useState(null)
    const [loading, setLoading] = useState(true)

    const product_state = () => {
        if (location.pathname === '/entradas/nuevo') return entries_state
        if (location.pathname === '/salidas/nuevo') return outputs_state
        if (location.pathname === '/venta') return saleProducts_state
    }

    // ------------ Products load ------------ //
    useEffect(() => {
        const fetchProducts = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.productos.findFiltered({ page, limit, filters: stringFilters })
            setProductsForTable(data.docs)
            setTotalDocs(data.totalDocs)
            setLoading(false)
        }
        fetchProducts()
    }, [page, limit, filters])

    // ------------ Set product brand ------------ //
    useEffect(() => {
        if (selectedBrand) {
            setFilters(filters => ({ ...filters, marca: selectedBrand }))
        }
    }, [selectedBrand])

    // ------------ Set product heading ------------ //
    useEffect(() => {
        if (selectedHeading) {
            setFilters(filters => ({ ...filters, rubro: selectedHeading }))
        }
    }, [selectedHeading])

    const product_dispatch = (action) => {
        if (location.pathname === '/entradas/nuevo') entries_dispatch(action)
        if (location.pathname === '/salidas/nuevo') outputs_dispatch(action)
        if (location.pathname === '/venta') saleProducts_dispatch(action)
    }

    const checkProduct = (e, product) => {
        if (productSelectionModal_state.selectionLimit <= 1) product_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
        if (e.target.checked) product_dispatch({ type: 'SET_PRODUCT', payload: product })
        else product_dispatch({ type: 'DELETE_PRODUCT', payload: product._id })
    }

    const cleanFilters = () => {
        setSelectedBrand(null)
        setSelectedHeading(null)
        setFilters(null)
    }

    const closeModal = () => {
        productSelectionModal_dispatch({ type: 'HIDE_PRODUCT_MODAL' })
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Codigo de producto',
            dataIndex: 'codigoProducto',
        },
        {
            title: 'Codigo de barras',
            dataIndex: 'codigoBarras',
        },
        {
            title: 'Marcar',
            render: (product) => (
                <Checkbox
                    checked={product_state().products.includes(product) ? true : false}
                    onChange={e => checkProduct(e, product)}
                />
            )
        }
    ]

    return (
        <Modal
            title={'Seleccionar producto' + ((productSelectionModal_state.selectionLimit > 1) ? 's' : '')}
            open={productSelectionModal_state.productModalIsVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            onOk={() => closeModal()}
            width={1200}
        >
            <Row>
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <Row justify='space between' gutter={16}>
                        <Col span={6}>
                            <Input
                                color='primary'
                                style={{ width: 200, marginBottom: '10px' }}
                                placeholder='Buscar por nombre'
                                onChange={(e) => {
                                    setFilters(
                                        {
                                            ...filters,
                                            nombre: e.target.value
                                        }
                                    )
                                }}
                                value={(filters) ? filters.nombre : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                style={{ width: 200, marginBottom: '10px' }}
                                placeholder='Buscar por codigo de barras'
                                onChange={(e) => {
                                    setFilters(
                                        {
                                            ...filters,
                                            codigoBarras: e.target.value
                                        }
                                    )
                                }}
                                value={(filters) ? filters.codigoBarras : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                style={{ width: 200, marginBottom: '10px' }}
                                placeholder='Buscar por codigo de producto'
                                onChange={(e) => {
                                    setFilters(
                                        {
                                            ...filters,
                                            codigoProducto: e.target.value
                                        }
                                    )
                                }}
                                value={(filters) ? filters.codigoProducto : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Button
                                danger
                                onClick={() => cleanFilters()}
                                type='primary'
                            >
                                Limpiar filtros
                            </Button>
                        </Col>
                        <Col span={8}>
                            <GenericAutocomplete
                                label='Filtrar por marcas'
                                modelToFind='marca'
                                keyToCompare='nombre'
                                controller='marcas'
                                returnCompleteModel={true}
                                setResultSearch={setSelectedBrand}
                                selectedSearch={selectedBrand}
                                styles={{ backgroundColor: '#fff' }}
                            />
                        </Col>
                        <Col span={8}>
                            <GenericAutocomplete
                                label='Filtrar por rubros'
                                modelToFind='rubro'
                                keyToCompare='nombre'
                                controller='rubros'
                                returnCompleteModel={true}
                                setResultSearch={setSelectedHeading}
                                selectedSearch={selectedHeading}
                                styles={{ backgroundColor: '#fff' }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Table
                        width={'100%'}
                        dataSource={productsForTable}
                        columns={columns}
                        pagination={{
                            defaultCurrent: page,
                            limit: limit,
                            total: totalDocs,
                            showSizeChanger: true,
                            onChange: (e) => setPage(e),
                            onShowSizeChange: (e, val) => setLimit(val)
                        }}
                        loading={loading}
                        rowKey='_id'
                        tableLayout='auto'
                        size='small'
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default ProductSelectionModal