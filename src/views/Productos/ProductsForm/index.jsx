import React, { useEffect, useState } from 'react';
import api from '../../../services';
import { useParams } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Upload, message } from 'antd';
import graphics from '../../../components/graphics';
import { UploadOutlined } from '@ant-design/icons';

const { Spinner } = graphics;

const ProductsForm = () => {
    const { idParams } = useParams();
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

    //eslint-disable-next-line
    useEffect(() => {
        const fetchProductById = async(id) => {
            const data = api.productos.getById(id);
            setProduct(data);
            setLoading(false);
        }
        if(idParams !== "nuevo"){
            fetchProductById(idParams)
        }
    }, [loading, idParams])

    const setFormDataToProduct = (e, val) =>{
        console.log(e, val)
        setProduct({
            ...product,
            [e.target.name] : e.target.value
        })
    } 
    
    const saveProduct = () => {
        console.log(product);
    }

    const props = {
        name: 'file',
        action: 'http://127.0.0.1:8080',
        headers: {
            "Content-Type": "text/html",
            "charset": "utf-8"
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} cargado con éxito.`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} falló.`);
          }
        },
      };

    return (
        <Row>
            <Col>
                {(loading) 
                    ? <Spinner/>
                    :
                    <Form 
                        onFinish={() => { saveProduct() }} 
                        autoComplete="off"
                    >
                        <Row>
                            <Col span={24} style={{display: "inline-flex"}}>
                                <Form.Item 
                                    required
                                    style={{marginRight: '10px'}}
                                >
                                    <Input 
                                        value={ product.nombre }
                                        name="nombre"
                                        placeholder="Nombre"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                    style={{marginRight: '10px'}}
                                    >
                                    <Input 
                                        name="codigoProducto"
                                        placeholder="Código de producto"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                    style={{marginRight: '10px'}}
                                >
                                    <Input 
                                        name="codigoBarras" 
                                        placeholder="Código de barras"
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                >
                                    <Input 
                                        name="marca" 
                                        placeholder="Marca"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{display: "inline-flex"}}>
                                <Form.Item 
                                        required
                                        style={{marginRight: '10px'}}
                                    >
                                        <Input 
                                            name="rubro" 
                                            placeholder="Rubro"
                                            onChange={e => { setFormDataToProduct(e) }} 
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        required
                                        style={{marginRight: '10px'}}
                                    >
                                    <Input 
                                        name="cantidadStock"
                                        placeholder="Cantidad de stock"
                                        type="number"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                    style={{marginRight: '10px'}}
                                >
                                    <Input 
                                        name="precioUnitario"
                                        placeholder="Precio unitario"
                                        type="number"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                >
                                    <Input 
                                        name="margenGanancia"
                                        placeholder="Margen de ganancia"
                                        type="number"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{display: "inline-flex"}}>
                                
                                <Form.Item 
                                    required
                                    style={{marginRight: '10px'}}
                                >
                                    <Input 
                                        name="precioVenta"
                                        placeholder="Precio de venta"
                                        type="number"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                    style={{marginRight: '10px'}}
                                >
                                    <Input 
                                        name="gananciaNeta"
                                        placeholder="Ganancia Neta"
                                        type="number"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                                <Form.Item 
                                    required
                                >
                                    <Input
                                        name="iva"
                                        placeholder="Iva"
                                        type="number"
                                        onChange={e => { setFormDataToProduct(e) }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item>
                                    <Upload {...props}>
                                        <Button icon={<UploadOutlined />}>Click para cargar imágenes</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={24} align="start">
                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit"
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }
            </Col>
        </Row>
    )
}

export default ProductsForm;