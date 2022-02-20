import React, { useEffect, useState } from 'react';
import api from '../../services';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Checkbox, Upload } from 'antd';
import { GenericAutocomplete } from '../../components/generics';
import { UploadOutlined } from '@ant-design/icons';
import graphics from '../../components/graphics';
import helper from '../../helpers'
import { errorAlert, successAlert } from '../../components/alerts';

const { Spinner } = graphics;
const roundTwoDecimals = helper.mathHelper.roundTwoDecimals;
const decimalPercent = helper.mathHelper.decimalPercent;

const ProductosForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({
        nombre: '',
        codigoProducto: '',
        codigoBarras: '',   
        marca: null,   
        rubro: null,   
        cantidadStock: 0,
        precioUnitario: 0,
        margenGanancia: 0,
        precioVenta: 0,
        gananciaNeta: 0,
        iva: 0,
        imagenes: null,
    })
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [applyIVA, setApplyIVA] = useState(false);

    //eslint-disable-next-line
    useEffect(() => {
        const fetchProductById = async(id) => {
            const response = await api.productos.getById(id);
            const product = response.data;
            setSelectedBrand({_id: product.marca._id, nombre: product.marca.nombre});
            setSelectedHeading({_id: product.rubro._id, nombre: product.rubro.nombre});
            setProduct(product);
            setLoading(false);
        }
        if(id !== "nuevo"){
            fetchProductById(id)
        }else{
            setLoading(false);
        }
    }, [loading, id])

    useEffect(() => {
        const calculeWithoutIva = roundTwoDecimals(product.precioUnitario * (1 + decimalPercent(product.margenGanancia)));
        const calculeWithIva = roundTwoDecimals((product.precioUnitario * (1 + decimalPercent(product.margenGanancia))) * (1 + decimalPercent(product.iva)));
        const realProfitWithoutIva = roundTwoDecimals(calculeWithoutIva - product.precioUnitario);
        const realProfitWithIva = roundTwoDecimals((calculeWithIva / (1 + decimalPercent(product.iva))) - product.precioUnitario);
        setProduct({
            ...product,
            precioVenta:(applyIVA) ? calculeWithIva : calculeWithoutIva,
            gananciaNeta: (applyIVA) ? realProfitWithIva : realProfitWithoutIva
        })
    }, 
    //eslint-disable-next-line
    [product.precioUnitario, product.margenGanancia, product.iva])

    const checkApplyIva = (e) => {
        const checked = e.target.checked;
        if(checked){
            setApplyIVA(true);
        }else{
            setProduct({
                ...product,
                iva: 0
            })
            setApplyIVA(false);
        }
    }

    const setFormDataToProduct = async(e) =>{
        setProduct({
            ...product,
            [e.target.name] : e.target.value
        })
    }

    const setSelectedBrandToProduct = async(brand) => {
        setSelectedBrand(brand);
        const response = await api.marcas.getById(brand._id);
        setProduct({
            ...product,
            marca: response
        })
    }

    const setSelectedHeadingToProduct = async(heading) => {
        setSelectedHeading(heading);
        const response = await api.rubros.getById(heading._id);
        setProduct({
            ...product,
            rubro: response
        })
    }
    
    const saveProduct = () => {
        if(!product.imagenes || product.imagenes.length === 0){
            product.imagenes = uploadedImages;
        }

        const saveProduct = async() => {
            const response = await api.productos.save(product);
            if(response.code === 200){
                successAlert('El registro fue grabado con exito').then(redirectToProducts());
            }else{
                errorAlert('Error al guardar el registro');
            }
        }

        const editProduct = async() => {
            const response = await api.productos.edit(product);
            if(response.code === 200){
                successAlert('El registro fue grabado con exito').then(redirectToProducts());
            }else{
                errorAlert('Error al guardar el registro');
            }
        }

        if(id === 'nuevo'){
            saveProduct();
        }else{
            editProduct();
        }
    }

    const handleCancel = () => {
        if(uploadedImages.length > 0){
            removeImage(uploadedImages[0]._id)
            .then(() => {
                redirectToProducts();
            })
        }
        redirectToProducts();
    }

    const redirectToProducts = () => {
        history.push('/productos');
    }

    const uploaderProps = {
        name: 'file',
        accept: '.jpg,.png',
        multiple: false,
        action: (file) => { uploadImageToServer(file) },
        onChange(info) {
            info.file.status = 'done';
        },
        onRemove() {
            removeImage(uploadedImages[0]._id)
        }
    };

    const uploadImageToServer = async(file) => {
        const response = await api.uploader.uploadImage(file);
        if(response.file){
            setUploadedImages(response.file);
            return response.code;
        }
    }

    const removeImage = async(id) => {
        const response = await api.uploader.deleteImage(id);
        setUploadedImages([]);
        return response;
    }

    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Crear nuevo producto' : 'Editar producto'}</h1>
                {(loading) 
                    ? <Spinner/>
                    :
                    <Form 
                        onFinish={() => { saveProduct() }} 
                        autoComplete="off"
                    >
                        <Row gutter={8}>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Nombre"
                                >
                                    <Input 
                                        name="nombre"
                                        placeholder="Nombre"
                                        value={product.nombre}
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Código prod."
                                >
                                    <Input 
                                        name="codigoProducto"
                                        placeholder="Código de producto"
                                        value={product.codigoProducto}
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Cód. barras"
                                >
                                    <Input 
                                        name="codigoBarras" 
                                        placeholder="Código de barras"
                                        value={product.codigoBarras}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Marca"
                                >
                                    <GenericAutocomplete
                                        label="Marca"
                                        modelToFind="marca"
                                        keyToCompare="nombre"
                                        setResultSearch={setSelectedBrandToProduct}
                                        selectedSearch={selectedBrand}
                                        styles={{backgroundColor: '#fff'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Rubro"
                                >
                                    <GenericAutocomplete
                                        label="Rubro"
                                        modelToFind="rubro"
                                        keyToCompare="nombre"
                                        setResultSearch={setSelectedHeadingToProduct}
                                        selectedSearch={selectedHeading}
                                        styles={{backgroundColor: '#fff'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Prec. unit."
                                >
                                    <Input 
                                        name="precioUnitario"
                                        placeholder="Precio unitario"
                                        type="number"
                                        value={product.precioUnitario}
                                        onChange={e => { 
                                            setFormDataToProduct(e)
                                        }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Cant. stock"
                                >
                                    <Input 
                                        name="cantidadStock"
                                        placeholder="Cantidad de stock"
                                        type="number"
                                        value={product.cantidadStock}
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="% Ganancia"
                                >
                                    <Input 
                                        name="margenGanancia"
                                        placeholder="Margen de ganancia"
                                        type="number"
                                        value={product.margenGanancia}
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                        required
                                        label="IVA"
                                    >
                                        <Input
                                            name="iva"
                                            type="number"
                                            value={product.iva}
                                            disabled={!applyIVA}
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    name="applyIva" 
                                    onChange={e => {
                                        checkApplyIva(e)
                                    }} 
                                >
                                    <Checkbox>Aplica IVA?</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Prec. vta."
                                >
                                    <Input 
                                        name="precioVenta"
                                        placeholder="Precio de venta"
                                        type="number"
                                        value={product.precioVenta}
                                        disabled={true}
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                        required
                                        label="Gan. Neta"
                                    >
                                        <Input 
                                            name="gananciaNeta"
                                            placeholder="Ganancia Neta"
                                            type="number"
                                            value={product.gananciaNeta}
                                            disabled={true}
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
                                </Form.Item>
                            </Col>
                            <Col span={6} style={{marginBottom: '20px'}}>
                            <Upload 
                            {...uploaderProps}
                            >
                                <button type="button" className="btn-primary" icon={<UploadOutlined />} disabled={(uploadedImages.length > 0) ? true : false}>Subir imagen</button>
                            </Upload>
                            </Col>
                            <Col span={24} align="start" style={{display: 'flex'}}>
                                <Form.Item style={{marginRight: '15px'}}>
                                    <button                                         
                                        type="submit"
                                        className="btn-primary"                                     
                                    >
                                        Guardar
                                    </button>
                                </Form.Item>
                                <Form.Item>
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => {handleCancel()}}
                                        type="button"
                                    >
                                        Cancelar
                                    </button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }
            </Col>
        </Row>
    )
}

export default ProductosForm;