import React, { useEffect, useState } from 'react';
import api from '../../services';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Button, AutoComplete } from 'antd';
import graphics from '../../components/graphics';
import ImageUploading from 'react-images-uploading';
import { errorAlert, successAlert } from '../../components/alerts';

const { Spinner } = graphics;

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
    const [brandSearch, setBrandSearch] = useState(null);
    const [headingSearch, setHeadingSearch] = useState(null);
    const [brandOptions, setBrandOptions] = useState(null);
    const [headingOptions, setHeadingOptions] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [images, setImages] = useState([]);
    const maxNumber = 69;

    //eslint-disable-next-line
    useEffect(() => {
        const fetchProductById = async(id) => {
            const data = api.productos.getById(id);
            setProduct(data);
            setLoading(false);
        }
        if(id !== "nuevo"){
            fetchProductById(id)
        }else{
            setLoading(false);
        }
    }, [loading, id])

    useEffect(() => {
        if(brandSearch && brandSearch !== ''){
            const fetchBrands = async() => {
                const response = await api.marcas.getByName(brandSearch);
                const formattedOptions = response.docs.map(el => ({value: el.nombre, key: el._id}));
                setBrandOptions(formattedOptions);
            }
            fetchBrands();
        }

        if(headingSearch && headingSearch !== ''){
            const fetchHeadings = async() => {
                const response = await api.rubros.getByName(headingSearch);
                const formattedOptions = response.docs.map(el => ({value: el.nombre, key: el._id}));
                setHeadingOptions(formattedOptions);
            }
            fetchHeadings();
        }
    }, [brandSearch, headingSearch])

    const handleSearch = (searchType, e) => {
        if(searchType === 'marcas'){
            setBrandSearch(e);
        }else{
            setHeadingSearch(e);
        }
    }

    const handleSelect = (selectedType, e) => {
        if(selectedType === 'marcas'){
            const selected = brandOptions.filter(el => el.value === e)[0];
            setSelectedBrand(selected);
            const setBrandToProduct = async() => {
                const response = await api.marcas.getById(selected.key)
                setProduct({
                    ...product,
                    marca: response
                })
            }
            setBrandToProduct()
        }else{
            const selected = headingOptions.filter(el => el.value === e)[0];
            setSelectedHeading(selected);
            const setHeadingToProduct = async() => {
                const response = await api.rubros.getById(selected.key)
                setProduct({
                    ...product,
                    rubro: response
                })
            }
            setHeadingToProduct()
        }
    }

    const setFormDataToProduct = (e, val) =>{
        console.log(e, val)
        setProduct({
            ...product,
            [e.target.name] : e.target.value
        })
    } 
    
    const saveProduct = () => {
        product.imagenes = images;
        console.log(product);
        
        // const saveProduct = async() => {
        //     const response = await api.productos.save(product);
        //     if(response === 'OK'){
        //         successAlert('El registro fue grabado con exito').then(redirectToProducts());
        //     }else{
        //         errorAlert('Error al guardar el registro');
        //     }
        // }

        // const editProduct = async() => {
        //     const response = await api.productos.edit(id, product);
        //     if(response === 'OK'){
        //         successAlert('El registro fue grabado con exito').then(redirectToProducts());
        //     }else{
        //         errorAlert('Error al guardar el registro');
        //     }
        // }

        // if(id === 'nuevo'){
        //     saveProduct();
        // }else{
        //     editProduct();
        // }
    }

    const redirectToProducts = () => {
        history.push('productos');
    }

    const onUploadImage = (imageList) => {
        setImages(imageList);
    };

    return (
        <Row>
            <Col>
                <h1>{(id === 'nuevo') ? 'Crear nuevo producto' : 'Editar producto'}</h1>
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
                                    <AutoComplete
                                        style={{ width: 200 }}
                                        options={brandOptions}
                                        value={(selectedBrand) ? selectedBrand.value : null}
                                        id="marcas"
                                        onSearch={(e) => {handleSearch('marcas', e)}}
                                        onSelect={(e) => {handleSelect('marcas', e)}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{display: "inline-flex"}}>
                                <Form.Item 
                                        required
                                        style={{marginRight: '10px'}}
                                    >
                                        <AutoComplete
                                            style={{ width: 200 }}
                                            options={headingOptions}
                                            value={(selectedHeading) ? selectedHeading.value : null}
                                            id="rubros"
                                            onSearch={(e) => {handleSearch('rubros', e)}}
                                            onSelect={(e) => {handleSelect('rubros', e)}}
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
                                <a href="" id="imageDownloader" style={{visibility: 'none'}}></a>
                                <ImageUploading
                                    multiple
                                    value={images}
                                    onChange={onUploadImage}
                                    maxNumber={maxNumber}
                                    dataURLKey="data_url"
                                >
                                    {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                    }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper">
                                        <button
                                        style={isDragging ? { color: 'red' } : undefined}
                                        onClick={onImageUpload}
                                        {...dragProps}
                                        >
                                        Click or Drop here
                                        </button>
                                        &nbsp;
                                        <button onClick={onImageRemoveAll}>Remove all images</button>
                                        {imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img src={image['data_url']} alt="Mascota feliz" width="100" />
                                            <div className="image-item__btn-wrapper">
                                            <button onClick={() => onImageUpdate(index)}>Update</button>
                                            <button onClick={() => onImageRemove(index)}>Remove</button>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </ImageUploading>

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

export default ProductosForm;