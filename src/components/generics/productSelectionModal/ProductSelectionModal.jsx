import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Input, Button, Table, Checkbox } from 'antd';
import { GenericAutocomplete } from '../';
import api from '../../../services';

const ProductSelectionModal = ({productSelectionVisible, setProductSelectionVisible, selectionLimit, setSelectedProductsInModal}) => {

    //--------------------------- State declarations ---------------------------//
    const [products, setProducts] = useState(null);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([]);

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
                        if(selectionLimit <= 1) {
                            setProducts(
                                products.map(el => {
                                    el.selected = false;
                                    return el;
                                })
                            )
                            setSelectedProducts([])
                        }

                        setProducts(
                            products.map(el => {
                                if(el._id === product._id){
                                    el.selected = e.target.checked;
                                }
                                return el;
                            })
                        )

                        if(e.target.checked === false){
                            if(selectionLimit <= 1) {
                                setSelectedProducts(selectedProducts.filter(el => el._id !== product._id));
                            }else{
                                setSelectedProducts([]);
                            }
                        }else{
                            if(selectionLimit <= 1) {
                                setSelectedProducts([
                                    ...selectedProducts,
                                    product
                                ])
                            }else{
                                setSelectedProducts([product])
                            }
                        }
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
          const data = await api.productos.getAll({page, limit, filters: stringFilters});
          setProducts(data.docs);
          setTotalDocs(data.totalDocs);
          setLoading(false);
        }
        fetchProducts();
    },[page, limit, filters])
    //

    //------------------------- State changes detection -------------------------//
    const cleanFilters = () => {
        setSelectedBrand(null);
        setSelectedHeading(null);
        setFilters(null);
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
    [selectedHeading]);
    //--------------------------------------------------------------------------//

    const handleOk = () => {
        setSelectedProductsInModal(selectedProducts)
        setProductSelectionVisible(false);
    }

    return (
    <Modal 
        title={'Seleccionar producto' + ((selectionLimit > 1) ? 's' : '')}
        visible={productSelectionVisible}
        onCancel={() => {
            setProductSelectionVisible(false);
        }}
        onOk={() => {handleOk()}}
        width={1200}
    >
        <Row>
          <Col span={24} style={{marginBottom: '10px'}}>
          <Row justify="space between" gutter={16}>
                <Col span={6}>
                    <Input 
                        color="primary" 
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder="Buscar por nombre"
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
                        color="primary" 
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder="Buscar por codigo de barras"
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
                        color="primary" 
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder="Buscar por codigo de producto"
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
                        type="danger" 
                        onClick={() => {cleanFilters()}}
                    > 
                        Limpiar filtros
                    </Button>
                </Col>
                <Col span={8}>
                    <GenericAutocomplete
                        label="Filtrar por marcas"
                        modelToFind="marca"
                        keyToCompare="nombre"
                        setResultSearch={setSelectedBrand}
                        selectedSearch={selectedBrand}
                        styles={{backgroundColor: '#fff'}}
                    />
                </Col>
                <Col span={8}>
                    <GenericAutocomplete
                        label="Filtrar por rubros"
                        modelToFind="rubro"
                        keyToCompare="nombre"
                        setResultSearch={setSelectedHeading}
                        selectedSearch={selectedHeading}
                        styles={{backgroundColor: '#fff'}}
                    />
                </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
                width={"100%"}
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
                size="small"
            />
          </Col>
        </Row>
    </Modal>
  )
}

export default ProductSelectionModal;