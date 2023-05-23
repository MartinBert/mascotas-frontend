// React Components and Hooks
import React, { useState, useEffect } from 'react'

// Custom Components
import { GenericAutocomplete } from '../'

// Custom Context Providers
import contextProviders from '../../../contextProviders'

// Services
import api from '../../../services'

// Design Components
import { Modal, Row, Col, Input, Button, Table, Checkbox } from 'antd'

// Imports Destructurings
const { useProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider


const ProductSelectionModal = () => {

    const productSelectionModalContext = useProductSelectionModalContext()
    const [product_state, product_dispatch] = productSelectionModalContext

    //--------------------------- State declarations ---------------------------//
    const [products, setProducts] = useState(null)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(0)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedHeading, setSelectedHeading] = useState(null)
    const [filters, setFilters] = useState(null)
    const [loading, setLoading] = useState(true)

    const columnsForTable = [
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
                    checked={product.selected}
                    onChange={(e) => {
                        if(product_state.selectionLimit <= 1) product_dispatch({type: 'CLEAN_PRODUCT_LIST'})
                        product.selected = e.target.checked
                        product_dispatch({type: (e.target.checked) ? 'SET_PRODUCT' : 'DELETE_PRODUCT', payload: product})
                    }}
                />
            )
        }
    ]

    //--------------------------------------------------------------------------//


    //---------------------------- Products load --------------------------------//
    useEffect(() => {
        const fetchProducts = async() => {
          const stringFilters = JSON.stringify(filters)
          const data = await api.productos.findAll({page, limit, filters: stringFilters})
          data.docs.forEach(product => {
              product_state.selectedProducts.forEach(selectedProduct => {
                if(product._id === selectedProduct._id){
                    product.selected = true
                }
              })
          })
          setProducts(data.docs)
          setTotalDocs(data.totalDocs)
          setLoading(false)
        }
        fetchProducts()
    },[page, limit, filters, product_state.selectedProducts])

    //------------------------- State changes detection -------------------------//
    const cleanFilters = () => {
        setSelectedBrand(null)
        setSelectedHeading(null)
        setFilters(null)
    }

    useEffect(() => {
        if(selectedBrand){
            setFilters({
                ...filters,
                marca: selectedBrand
            })
        }
    }, 
    //eslint-disable-next-line
    [selectedBrand])

    useEffect(() => {
        if(selectedHeading){
            setFilters({
                ...filters,
                rubro: selectedHeading
            })
        }
    }, 
    //eslint-disable-next-line
    [selectedHeading])
    //--------------------------------------------------------------------------//

    return (
    <Modal 
        title={'Seleccionar producto' + ((product_state.selectionLimit > 1) ? 's' : '')}
        open={product_state.open}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        onOk={() => {product_dispatch({type: 'HIDE_MODAL'})}}
        width={1200}
    >
        <Row>
          <Col span={24} style={{marginBottom: '10px'}}>
          <Row justify='space between' gutter={16}>
                <Col span={6}>
                    <Input
                        color='primary' 
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder='Buscar por nombre'
                        onChange={(e) => { setFilters(
                            {
                                ...filters,
                                nombre: e.target.value
                            }
                        )}}
                        value={(filters) ? filters.nombre : null}
                    /> 
                </Col>
                <Col span={6}>
                    <Input
                        color='primary' 
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder='Buscar por codigo de barras'
                        onChange={(e) => { setFilters(
                            {
                                ...filters,
                                codigoBarras: e.target.value
                            }
                        )}}
                        value={(filters) ? filters.codigoBarras : null}
                    />
                </Col>
                <Col span={6}>
                    <Input 
                        color='primary' 
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder='Buscar por codigo de producto'
                        onChange={(e) => { setFilters(
                            {
                                ...filters,
                                codigoProducto: e.target.value
                            }
                        )}}
                        value={(filters) ? filters.codigoProducto : null}
                    />
                </Col>
                <Col span={6}>
                    <Button
                        type='danger' 
                        onClick={() => {cleanFilters()}}
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
                        styles={{backgroundColor: '#fff'}}
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
                        styles={{backgroundColor: '#fff'}}
                    />
                </Col>
            </Row>
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
                    onChange: (e) => { setPage(e) },
                    onShowSizeChange: (e, val) => { setLimit(val) }
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