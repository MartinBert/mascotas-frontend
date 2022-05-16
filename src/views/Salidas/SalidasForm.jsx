import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Spin } from 'antd';
import api from '../../services';
import icons from '../../components/icons';
import helpers from '../../helpers';
import { errorAlert, successAlert } from '../../components/alerts';
import { ProductSelectionModal } from '../../components/generics';

const { Add, Delete } = icons;
const {dateHelper, mathHelper} = helpers;

const SalidasForm = () => {

    //------------------------------------------------------ State declarations ------------------------------------------------------/
    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [salida, setSalida] = useState({
        descripcion: '',
        fecha: new Date(),
        cantidad: 0,
        gananciaNeta: 0,
        productos: [],
        usuario: null,
    });
    const [salidaIsReady, setSalidaIsReady] = useState(false);
    const [productSelectionVisible, setProductSelectionVisible] = useState(false);
    const [selectedProductsInModal, setSelectedProductsInModal] = useState([]);
    //------------------------------------------------------------------------------------------------------------------------------/


    //--------------------------------------------------------- First load ---------------------------------------------------------/
    //eslint-disable-next-line
    useEffect(() => {
        if(!loading) return;
        if(id === 'nuevo'){
            setSalidaIsReady(true);
        }else{
            fetchSalida(); 
        }
    })

    useEffect(() => {
        if(!salidaIsReady) return;
        if(!salida.usuario){
            const fetchLoggedUser = async() => {
                const loggedUser = await api.usuarios.getById(localStorage.getItem('userId'));
                setSalida({
                    ...salida,
                    usuario: loggedUser
                })
            }
            fetchLoggedUser();      
        }
        setLoading(false);
    },
    //eslint-disable-next-line
    [salidaIsReady])

    const fetchSalida = async() => {
        const response =  await api.salidas.getById(id);
        setSalida(response.data);
        setSalidaIsReady(true);
    }
    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Product Selection Modal ------------------------------------------------------/
    useEffect(() => {
        if(selectedProductsInModal && selectedProductsInModal.length !== 0){
            selectedProductsInModal.forEach(item => {
                delete(item.selected);
                if(!salida.productos.find(el => el._id === item._id)){
                    setSalida({
                        ...salida,
                        productos: [
                            ...salida.productos,
                            item
                        ]
                    })
                }
            })
        }
    }, 
    //eslint-disable-next-line
    [selectedProductsInModal])
    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Submit form action -----------------------------------------------------------/
    const handleSubmit = async() => {
        try{
            if(id !== "nuevo"){
                for(let product of salida.productos){
                    const productToModifyRequest = await api.productos.getById(product._id);
                    const productToModify = productToModifyRequest.data;
                    const firstSalidaRequest = await api.salidas.getById(id);
                    const firstSalidaInstance = firstSalidaRequest.data;
                    const originalProductInstance = firstSalidaInstance.productos.find(el => el._id === product._id);
                    if(originalProductInstance && originalProductInstance.cantidadesSalientes !== product.cantidadesSalientes){
                        productToModify.cantidadStock += originalProductInstance.cantidadesSalientes;
                        productToModify.cantidadStock -= parseFloat(product.cantidadesSalientes);
                        await api.productos.edit(productToModify);
                    }else{
                        await api.productos.modifyStock({
                            product,
                            isIncrement: false,
                            quantity: product.cantidadesSalientes
                        })
                    }
                    product.gananciaNetaTotal = mathHelper.roundTwoDecimals(productToModify.gananciaNeta * product.cantidadesSalientes);
                }
                salida.fecha = new Date();
                salida.cantidad = salida.productos.reduce((acc, item) => acc + item.cantidadesSalientes, 0);
                salida.gananciaNeta = salida.productos.reduce((acc, item) => acc + item.gananciaNetaTotal, 0);
                await api.salidas.edit(salida)
                .then((response) => {
                    if(response.code === 200){
                        successAlert('El registro se editó correctamente');
                        redirectToSalidas();
                    }else{
                        errorAlert('Fallo al editar el registro');
                    }
                })
            }else{
                if(!salida.descripcion){
                    salida.descripcion = `Salida del ${dateHelper.simpleDateWithHours(new Date())} hs`;
                }
                salida.fecha = new Date();
                salida.cantidad = salida.productos.reduce((acc, item) => acc + item.cantidadesSalientes, 0);
                for(const product of salida.productos){
                    await api.productos.modifyStock({
                        product,
                        isIncrement: false,
                        quantity: product.cantidadesSalientes
                    })
                }
                await api.salidas.save(salida)
                .then((response) => {
                    if(response.code === 200){
                        successAlert('El registro se guardó correctamente');
                        redirectToSalidas();
                    }else{
                        errorAlert('Fallo al guardar el registro');
                    }
                })
            }
        }catch(err){
            console.error(err);
        }
    }
    const redirectToSalidas = () => {
        history.push('/salidas');
    }
    //------------------------------------------------------------------------------------------------------------------------------/


    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Nueva salida' : 'Editar salida'}</h1>
                {(loading) 
                    ? <Spin/>
                    :
                    <Form 
                        autoComplete="off"
                        onFinish={() => {handleSubmit()}}
                    >
                        <Row gutter={8}>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Descripción"
                                >
                                    <Input 
                                        name="descripcion"
                                        placeholder="Descripción"
                                        value={salida.descripcion}
                                        onChange={(e) => {
                                            setSalida({
                                                ...salida,
                                                descripcion: e.target.value
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <div onClick={() => {setProductSelectionVisible(true)}}>
                                    <Add customStyle={{width: '70px', height: '70px'}}/>
                                </div>
                            </Col>
                            <Col span={24}>
                                {(salida.productos.length > 0) ?
                                    salida.productos.map((item, key) => (
                                        <Row key={key} gutter={8}>
                                            <Col span={8}>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input
                                                        disabled
                                                        name="nombre"
                                                        placeholder="Nombre del producto"
                                                        value={item.nombre}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if(el._id === item._id){
                                                                        el.nombre = e.target.value
                                                                    }
                                                                    return el;
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input
                                                        disabled
                                                        name="barcode"
                                                        placeholder="Codigo de barras de producto"
                                                        value={item.codigoBarras}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if(el._id === item._id){
                                                                        el.codigoBarras = e.target.value
                                                                    }
                                                                    return el;
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input 
                                                        name="quantity"
                                                        placeholder="Cantidad"
                                                        type="number"
                                                        value={item.cantidadesSalientes}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if(el._id === item._id){
                                                                        el.cantidadesSalientes = (!e.target.value) ? 0 : parseFloat(e.target.value);
                                                                    }
                                                                    return el;
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <div onClick={
                                                    () => {
                                                        setSalida({
                                                        ...salida,
                                                        productos: salida.productos.filter(el => el._id !== item._id)
                                                    })}
                                                }>
                                                    <Delete/>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))
                                : null
                            }
                            </Col>
                            <Col span={24} align="start" style={{display: 'flex'}}>
                                <Row>
                                    <Col span={12} style={{display: 'flex'}}>
                                        <button                                         
                                            type="submit"
                                            className="btn-primary"
                                            style={{marginRight: '15px'}}                                 
                                        >
                                            Guardar
                                        </button>
                                        <button 
                                            className="btn-secondary"
                                            onClick={() => {redirectToSalidas()}}
                                        >
                                            Cancelar
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                }
            </Col>
            <ProductSelectionModal
                productSelectionVisible={productSelectionVisible}
                setProductSelectionVisible={setProductSelectionVisible}
                selectionLimit={1}
                setSelectedProductsInModal={setSelectedProductsInModal}
            />
        </Row>
    )
}

export default SalidasForm;