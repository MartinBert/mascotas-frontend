import React, { useEffect, useState } from 'react';
import api from '../../services';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Upload } from 'antd';
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
        unidadMedida: null,
        cantidadStock: 0,
        cantidadFraccionadaStock: 1,
        precioUnitario: 0,
        margenGanancia: 0,
        precioVenta: 0,
        gananciaNeta: 0,
        porcentajeIvaCompra: 0,
        porcentajeIvaVenta: 0,
        ivaCompra: 0,
        ivaVenta: 0,
        imagenes: null,
    })
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [selectedMeasure, setSelectedMeasure] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);

    //eslint-disable-next-line
    useEffect(() => {
        const fetchProductById = async(id) => {
            const response = await api.productos.findById(id);
            const product = response.data;

            if(product.marca === null){
                product.marca = {
                    _id : 'no especificado',
                    nombre : 'no especificado'};
            } else {setSelectedBrand({_id: product.marca._id, nombre: product.marca.nombre});}

            if(product.rubro === null){
                product.rubro = {
                    _id : 'no especificado',
                    nombre : 'no especificado'};
            } else {setSelectedHeading({_id: product.rubro._id, nombre: product.rubro.nombre});}

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
        const ivaCompra = roundTwoDecimals(parseFloat(product.precioUnitario) - (parseFloat(product.precioUnitario) / (1 + decimalPercent(product.porcentajeIvaCompra))));
        const ivaVenta = roundTwoDecimals(parseFloat(product.precioUnitario) * decimalPercent(product.porcentajeIvaVenta));
        const gananciaNeta = roundTwoDecimals(parseFloat(product.precioUnitario) * decimalPercent(product.margenGanancia));
        const precioVenta = parseFloat(product.precioUnitario) + ivaVenta + gananciaNeta;
        setProduct({
            ...product,
            ivaCompra,
            ivaVenta,
            gananciaNeta,
            precioVenta
        })
    }, 
    //eslint-disable-next-line
    [product.precioUnitario, product.margenGanancia, product.porcentajeIvaCompra, product.porcentajeIvaVenta])

    const setFormDataToProduct = async(e) =>{
        setProduct({
            ...product,
            [e.target.name] : e.target.value
        })
    }

    const setSelectedBrandToProduct = async(brand) => {
        setSelectedBrand(brand);
        const response = await api.marcas.findById(brand._id);
        setProduct({
            ...product,
            marca: response
        })
    }

    const setSelectedHeadingToProduct = async(heading) => {
        setSelectedHeading(heading);
        const response = await api.rubros.findById(heading._id);
        setProduct({
            ...product,
            rubro: response
        })
    }

    const setSelectedMeasureToProduct = async(measure) => {
        setSelectedMeasure(measure);
        const response = await api.unidadesmedida.findById(measure._id);
        setProduct({
            ...product,
            unidadMedida: response,
            cantidadFraccionadaStock: response.fraccionamiento
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
        onChange: (info) => {
            uploadImageToServer(info.file)
        },
        onRemove: () => {
            removeImage(uploadedImages[0]._id)
        },
        beforeUpload: () => false
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
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="U. Medida"
                                >
                                    <GenericAutocomplete
                                        label="U. Medida"
                                        modelToFind="unidadmedida"
                                        keyToCompare="nombre"
                                        setResultSearch={setSelectedMeasureToProduct}
                                        selectedSearch={selectedMeasure}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                    required
                                    label="Fraccionamiento"
                                >
                                    <Input 
                                        name="cantidadFraccionadaStock"
                                        placeholder="Fraccionamiento"
                                        type="number"
                                        value={(product.unidadMedida) ? product.unidadMedida.fraccionamiento : 1}
                                        disabled={true}
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
                                        label="Porc. Iva Compra"
                                    >
                                        <Input
                                            name="porcentajeIvaCompra"
                                            type="number"
                                            value={product.porcentajeIvaCompra}
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                        required
                                        label="Porc. Iva Venta"
                                    >
                                        <Input
                                            name="porcentajeIvaVenta"
                                            type="number"
                                            value={product.porcentajeIvaVenta}
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                        required
                                        label="Iva Compra"
                                    >
                                        <Input
                                            name="ivaCompra"
                                            type="number"
                                            value={product.ivaCompra}
                                            disabled={true}
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item 
                                        required
                                        label="Iva Venta"
                                    >
                                        <Input
                                            name="ivaVenta"
                                            type="number"
                                            value={product.ivaVenta}
                                            disabled={true}
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
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
            <Col span={24} align="justify">
                <h1>
                    Para realizar ventas AFIP exige que se declare el IVA de la operación, 
                    el porcentaje del mismo puede variar dependiendo del producto, pero generalmente es del 21%.
                    El procedimiento estandar es considerar dicho porcentaje al momento de aplicar un margen de ganancia
                    al producto, puesto que un 21% de la ganancia es absorbida por el IVA de las operaciones cuando el
                    contribuyente realiza el devengamiento fiscal del impuesto.
                </h1><br/>
                <h1>
                    Ejemplo: si se desea obtener un 15% de ganancia sobre una operación, 
                    el porcentaje de recargo total del producto será de 36% (21% de IVA, 15% de ganancia).
                </h1><br/>
                <h1>
                    En el sistema hemos tenido en cuenta esta regulación, por lo que ahora se muestran campos nuevos en el producto para 
                    mayor comodidad del usuario al momento de calcular el iva y la ganancia de sus productos:
                    <ul>
                        <li>
                            Porcentaje de iva compra: corresponde al porcentaje de IVA del costo del producto al momento en el que fue comprado
                            a un proveedor. Es un campo informativo, para control del usuario del sistema.
                        </li>
                        <li>
                            Iva compra: corresponde al importe de IVA que conforma al precio de costo del producto.  
                            Es un campo informativo, para control del usuario del sistema.
                        </li>
                        <li>
                            Porcentaje de iva venta: 
                            Es el porcentaje de IVA que se aplicará al precio del producto en la venta (21% predeterminadamente).
                        </li>
                        <li>
                            Iva venta: Es el importe de IVA del precio del producto que se esté vendiendo.
                        </li>
                    </ul>
                </h1>
                
            </Col>
        </Row>
    )
}

export default ProductosForm;