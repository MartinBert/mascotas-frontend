import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Select, Spin, Input, Table, Button, Checkbox } from 'antd';
import { errorAlert, successAlert } from '../../components/alerts';
import helper from '../../helpers';
import api from '../../services';
import icons from '../../components/icons';

const { Option } = Select;
const { Delete } = icons;
const { decimalPercent, roundTwoDecimals } = helper.mathHelper;

const PriceModificatorModal = ({priceModalVisible, setPriceModalVisible, setLoading, setReRendering}) => {
    const [brands, setBrands] = useState(null);
    const [headings, setHeadings] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [headingsLoading, setHeadingsLoading] = useState(true);
    const [productNameSearch, setProductNameSearch] = useState('');
    const [products, setProducts] = useState(null);
    const [productsLoading, setProductsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage, setLimitPerPage] = useState(10);
    const [totalDocsInPage, setTotalDocsInPage] = useState(0);
    const [addedProducts, setAddedProducts] = useState([]);
    const [modificationValue, setModificationValue] = useState(0);
    const [selectedModificationType, setSelectedModificationType] = useState(null);
    const modificationTypes = [
        {key: 1, value: 'Porcentual'},
        {key: 2, value: 'Monto fijo'}
    ]

    useEffect(() => {
        if(brands) return;
        const fetchBrands = async() => {
            const response = await api.marcas.getAll({page: 0, limit: 100000, filters: null});
            setBrands(response.docs);
            setBrandsLoading(false);
        }
        fetchBrands();
    })

    useEffect(() => {
        if(headings) return;
        const fetchHeadings = async() => {
            const response = await api.rubros.getAll({page: 0, limit: 100000, filters: null});
            setHeadings(response.docs);
            setHeadingsLoading(false);
        }
        fetchHeadings();
    })

    useEffect(() => {
        setProductsLoading(true);
        const fetchProducts = async() => {
            const filtersToParams = {
                nombre: productNameSearch
            }
            if(selectedHeading){
                filtersToParams.rubro = selectedHeading;
            }
            if(selectedBrand){
                filtersToParams.marca = selectedBrand;
            }
            const params = {
                page: currentPage,
                limit: limitPerPage,
                filters: JSON.stringify(filtersToParams)
            }
            const response = await api.productos.getAll(params);
            setProducts(response.docs);
            setTotalDocsInPage(response.totalDocs);
            setProductsLoading(false);
        }
        fetchProducts()
    },
    //eslint-disable-next-line 
    [selectedBrand, selectedHeading, productNameSearch, currentPage, limitPerPage]);

    const handleOk = () => {
        setLoading(true)
        if(!selectedModificationType) return errorAlert('Debe seleccionar el tipo de modificación a aplicar en el precio de los productos...');
        if(modificationValue === 0) return errorAlert('El valor de la modificación no puede ser 0...');
        if(addedProducts.length < 1) return errorAlert('Debe seleccionar al menos 1 producto para modificar su precio...')
        for(let product of addedProducts){
            product.precioUnitario = (selectedModificationType === '1') 
            ? roundTwoDecimals(Number(product.precioUnitario) * (1 + decimalPercent(modificationValue))) 
            : roundTwoDecimals(Number(product.precioUnitario) + Number(modificationValue));
            const calculeWithoutIva = roundTwoDecimals(Number(product.precioUnitario) * (1 + decimalPercent(product.margenGanancia)));
            const calculeWithIva = roundTwoDecimals((Number(product.precioUnitario) * (1 + decimalPercent(product.margenGanancia))) * (1 + decimalPercent(product.iva)));
            const realProfitWithoutIva = roundTwoDecimals(calculeWithoutIva - Number(product.precioUnitario));
            const realProfitWithIva = roundTwoDecimals((calculeWithIva / (1 + decimalPercent(product.iva))) - Number(product.precioUnitario));
            if(product.iva > 0){
                product.precioVenta = calculeWithoutIva;
                product.gananciaNeta = realProfitWithoutIva;
            }else{
                product.precioVenta = calculeWithIva;
                product.gananciaNeta = realProfitWithIva;
            }
            api.productos.edit(product);
        }
        setPriceModalVisible(false);
        cleanModificator();
        successAlert('Los precios fueron modificados!');
        setLoading(false);
    }

    

    const addProductToModification = (product) => {
        const duplicated = addedProducts.find(item => item._id === product._id);
        if(duplicated){
            const stateWithoutThisElement = addedProducts.filter(item => item._id !== product._id);
            setAddedProducts(stateWithoutThisElement);
        }else{
            setAddedProducts([
                ...addedProducts,
                product
            ])
        }
    }

    const cleanFilters = () => {
        setSelectedBrand(null);
        setSelectedHeading(null);
        setProductNameSearch('');
    }

    const cleanModificator = () => {
        setSelectedBrand(null);
        setSelectedHeading(null);
        setProductNameSearch('');
        setAddedProducts([]);
        setModificationValue(0);
        setSelectedModificationType(null);
    }

    const checkPage = () => {
        setAddedProducts(products);
    } 

    const uncheckPage = () => {
        setAddedProducts([]);
    } 

    const columnsForTable = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
        },
        {
          title: 'Cod prod.',
          dataIndex: 'codigoProducto',
        },
        {
          title: 'Agregar',
          render: (product) => (
            <Row style={{display: 'inline-flex'}}>
              <Checkbox onChange={() => { addProductToModification(product) }} checked={(addedProducts.find(item => item._id === product._id))}/>
            </Row>
          )
        },
    ]

    const columnsInAddedProductsTable = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
        },
        {
          title: 'Cod. barras',
          dataIndex: 'codigoBarras',
        },
        {
          title: 'Quitar producto',
          render: (product) => (
              <div onClick={() => {
                products.forEach(el => {
                    if(el._id === product._id){
                        el.selected = false;
                    }
                })
                const sliceElement = addedProducts.filter(item => item._id !== product._id);
                setAddedProducts(sliceElement);
              }}>
                  <Delete/>
              </div>
          )
        },
    ]

    return (
    <Modal 
        title="Editar precio de productos" 
        visible={priceModalVisible}
        onCancel={() => {
            setPriceModalVisible(false);
        }}
        onOk={() => {handleOk()}}
        width={1200}
    >
     <Row>
        <Col span={24}>
            <h2>Filtrar artículos</h2>
        </Col>
        <Col span={24} style={{marginBottom: '15px'}}>
            <Row gutter={8}>
                <Col>
                {
                    (brandsLoading) ? <Spin/>
                    :
                    <Select 
                        placeholder="Marcas" 
                        onChange={(e) => { 
                            setSelectedBrand(e)    
                        }}
                        value={selectedBrand}
                    >
                        {brands.map(brand => (
                            <Option key={brand._id}>{brand.nombre}</Option>
                        ))}
                    </Select>
                }
                </Col>
                <Col>
                {
                    (headingsLoading) ? <Spin/> 
                    :
                    <Select 
                        placeholder="Rubros" 
                        onChange={(e) => { 
                            setSelectedHeading(e)
                        }}
                        
                        value={selectedHeading}
                    >
                        {headings.map(heading => (
                            <Option key={heading._id}>{heading.nombre}</Option>
                        ))}
                    </Select>
                }
                </Col>
                <Col>
                    <Input 
                        color="primary" 
                        placeholder="Nombre"
                        onChange={(e) => { setProductNameSearch(e.target.value)}}
                        value={productNameSearch}
                    /> 
                </Col>
                <Col>
                    <Button 
                        type="danger" 
                        onClick={() => {cleanFilters()}}
                    > 
                        Limpiar filtros
                    </Button>
                </Col>
            </Row>
            <Row style={{marginTop: '15px'}} align="start">
                <Col style={{marginRight: '15px'}}>
                    <Select 
                        placeholder="Tipo de modificación" 
                        onChange={(e) => { 
                            setSelectedModificationType(e)
                        }}
                        value={selectedModificationType}
                    >
                        {modificationTypes.map(modificationType => (
                            <Option key={modificationType.key}>{modificationType.value}</Option>
                        ))}
                    </Select>
                </Col>
                <Col style={{marginRight: '15px'}}>
                    <Input 
                        color="primary" 
                        htmlType="number"
                        placeholder="Porcentaje o monto fijo de modificación"
                        onChange={(e) => { setModificationValue(e.target.value)}}
                        value={modificationValue}
                    />
                </Col>
                <Col style={{marginRight: '15px'}}>
                    <Button 
                        type="primary" 
                        onClick={() => {checkPage()}}
                    > 
                        Marcar página
                    </Button>
                </Col>
                <Col>
                    <Button 
                        type="secondary" 
                        onClick={() => {uncheckPage()}}
                    > 
                        Desmarcar todo
                    </Button>
                </Col>
            </Row>
        </Col>
     </Row>
     <Row gutter={8}>
        <Col span={12}>
            <div align="center">
                <h2>Tabla de selección de artículos</h2>
            </div>
            <Table 
                width={"100%"}
                dataSource={(products)}
                columns={columnsForTable}
                pagination={{
                    defaultCurrent: currentPage,
                    limit: limitPerPage,
                    total: totalDocsInPage,
                    showSizeChanger: true,
                    onChange: (e) => { setCurrentPage(e) },
                    onShowSizeChange: (e, val) => { setLimitPerPage(val) }
                }}
                loading={productsLoading}
                rowKey='_id'
                tableLayout='fixed'
                size="small"
            />
        </Col>
        <Col span={12}>
            <div align="center">
                <h2>Artículos seleccionados</h2>
            </div>
            <Table 
                width={"100%"}
                dataSource={(addedProducts)}
                columns={columnsInAddedProductsTable}
                pagination={false}
                rowKey='_id'
                tableLayout='fixed'
                size="small"
            />
        </Col>
     </Row>
    </Modal>
  )
}

export default PriceModificatorModal;