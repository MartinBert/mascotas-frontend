import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Spin } from 'antd';
import api from '../../services';
import icons from '../../components/icons';
import helpers from '../../helpers';
import { errorAlert, successAlert } from '../../components/alerts';
import { ProductSelectionModal } from '../../components/generics';

const { Add, Delete } = icons;
const {dateHelper} = helpers;

const EntradasForm = () => {

    //------------------------------------------------------ State declarations ------------------------------------------------------/
    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [entrada, setEntrada] = useState({
        descripcion: '',
        fecha: new Date(),
        cantidad: 0,
        gananciaNeta: 0,
        productos: [],
        usuario: null,
    });
    const [entradaIsReady, setEntradaIsReady] = useState(false);
    const [productSelectionVisible, setProductSelectionVisible] = useState(false);
    const [selectedProductsInModal, setSelectedProductsInModal] = useState([]);
    //------------------------------------------------------------------------------------------------------------------------------/


    //--------------------------------------------------------- First load ---------------------------------------------------------/
    //eslint-disable-next-line
    useEffect(() => {
        if(!loading) return;
        if(id === 'nuevo'){
            setEntradaIsReady(true);
        }else{
            fetchEntrada(); 
        }
    })

    useEffect(() => {
        if(!entradaIsReady) return;
        if(!entrada.usuario){
            const fetchLoggedUser = async() => {
                const loggedUser = await api.usuarios.getById(localStorage.getItem('userId'));
                setEntrada({
                    ...entrada,
                    usuario: loggedUser
                })
            }
            fetchLoggedUser();      
        }
        setLoading(false);
    }, 
    //eslint-disable-next-line
    [entradaIsReady])

    const fetchEntrada = async() => {
        console.log('Ejecucion de fetch de entrada')
        const response =  await api.entradas.getById(id);
        setEntrada(response.data);
        setEntradaIsReady(true);
    }
    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Product Selection Modal ------------------------------------------------------/
    useEffect(() => {
        if(selectedProductsInModal && selectedProductsInModal.length !== 0){
            selectedProductsInModal.forEach(item => {
                delete(item.selected);
                if(!entrada.productos.find(el => el._id === item._id)){
                    setEntrada({
                        ...entrada,
                        productos: [
                            ...entrada.productos,
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
                for(let product of entrada.productos){
                    const firstEntradaRequest = await api.entradas.getById(id);
                    const firstEntradaInstance = firstEntradaRequest.data;
                    const originalProductInstance = firstEntradaInstance.productos.find(el => el._id === product._id);
                    if(originalProductInstance && originalProductInstance.cantidadesEntrantes !== product.cantidadesEntrantes){
                        const productToModifyRequest = await api.productos.getById(product._id);
                        const productToModify = productToModifyRequest.data;
                        productToModify.cantidadStock -= originalProductInstance.cantidadesEntrantes;
                        productToModify.cantidadStock += parseFloat(product.cantidadesEntrantes);
                        await api.productos.edit(productToModify);
                    }else{
                        await api.productos.modifyStock({
                            product,
                            action: 'increase',
                            quantity: product.cantidadesEntrantes
                        })
                    }
                }
                entrada.fecha = new Date();
                entrada.cantidad = entrada.productos.reduce((acc, item) => acc + item.cantidadesEntrantes, 0);
                await api.entradas.edit(entrada)
                .then((response) => {
                    if(response.code === 200){
                        successAlert('El registro se editó correctamente');
                        redirectToEntradas();
                    }else{
                        errorAlert('Fallo al editar el registro');
                    }
                })
            }else{
                if(!entrada.descripcion){
                    entrada.descripcion = `Entrada del ${dateHelper.simpleDateWithHours(new Date())} hs`;
                }
                entrada.fecha = new Date();
                entrada.cantidad = entrada.productos.reduce((acc, item) => acc + item.cantidadesEntrantes, 0);
                for(const product of entrada.productos){
                    await api.productos.modifyStock({
                        product,
                        action: 'increase',
                        quantity: product.cantidadesEntrantes
                    })
                }
                await api.entradas.save(entrada)
                .then((response) => {
                    if(response.code === 200){
                        successAlert('El registro se guardó correctamente');
                        redirectToEntradas();
                    }else{
                        errorAlert('Fallo al guardar el registro');
                    }
                })
            }
        }catch(err){
            console.error(err);
        }
    }
    const redirectToEntradas = () => {
        history.push('/entradas');
    }
    //------------------------------------------------------------------------------------------------------------------------------/


    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Nueva entrada' : 'Editar entrada'}</h1>
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
                                        value={entrada.descripcion}
                                        onChange={(e) => {
                                            setEntrada({
                                                ...entrada,
                                                descripcion: e.target.value
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <div 
                                    onClick={() => {setProductSelectionVisible(true)}}
                                >
                                    <Add customStyle={{width: '70px', height: '70px'}}/>
                                </div>
                            </Col>
                            <Col span={24}>
                                {(entrada.productos.length > 0) ?
                                    entrada.productos.map((item, key) => (
                                        <Row key={key} gutter={8}>
                                            <Col span={8}>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input 
                                                        name="nombre"
                                                        placeholder="Nombre del producto"
                                                        value={item.nombre}
                                                        onChange={(e) => {
                                                            setEntrada({
                                                                ...entrada,
                                                                productos: entrada.productos.map(el => {
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
                                                        name="barcode"
                                                        placeholder="Codigo de barras de producto"
                                                        value={item.codigoBarras}
                                                        onChange={(e) => {
                                                            setEntrada({
                                                                ...entrada,
                                                                productos: entrada.productos.map(el => {
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
                                                        value={item.cantidadesEntrantes}
                                                        onChange={(e) => {
                                                            setEntrada({
                                                                ...entrada,
                                                                productos: entrada.productos.map(el => {
                                                                    if(el._id === item._id){
                                                                        console.log(e.target.value)
                                                                        el.cantidadesEntrantes = (!e.target.value) ? 0 : parseFloat(e.target.value);
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
                                                        setEntrada({
                                                        ...entrada,
                                                        productos: entrada.productos.filter(el => el._id !== item._id)
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
                                            onClick={() => {redirectToEntradas()}}
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

export default EntradasForm;