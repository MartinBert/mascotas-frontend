import React, { useEffect, useState, useReducer } from 'react';
import reducers from '../../reducers';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Spin, DatePicker } from 'antd';
import api from '../../services';
import icons from '../../components/icons';
import { errorAlert, successAlert } from '../../components/alerts';
import { ProductSelectionModal } from '../../components/generics';

const { Add, Delete } = icons;
const {reducer, initialState, actions} = reducers.productSelectionModalReducer;
const {DELETE_PRODUCT} = actions;

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
    const [total, setTotal] = useState(0);
    const [state, dispatch] = useReducer(reducer, initialState);
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
                const loggedUser = await api.usuarios.findById(localStorage.getItem('userId'));
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
        const response =  await api.entradas.findById(id);
        setEntrada(response.data);
        setEntradaIsReady(true);
    }
    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Product Selection Modal ------------------------------------------------------/
    useEffect(() => {
        setEntrada({
            ...entrada,
            productos: state.selectedProducts
        })
    },
    //eslint-disable-next-line
    [state.selectedProducts])

    useEffect(() => {
        setTotal(
            entrada.productos.reduce(
                (acc, item) => acc + ((item.cantidadesEntrantes) ? (item.precioUnitario * item.cantidadesEntrantes) : 0), 0
            ))
    }, [entrada.productos])
    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Submit form action -----------------------------------------------------------/
    const handleSubmit = async() => {
        try{
            if(id !== "nuevo"){
                for(let product of entrada.productos){
                    const firstEntradaRequest = await api.entradas.findById(id);
                    const firstEntradaInstance = firstEntradaRequest.data;
                    const originalProductInstance = firstEntradaInstance.productos.find(el => el._id === product._id);
                    if(originalProductInstance && originalProductInstance.cantidadesEntrantes !== product.cantidadesEntrantes){
                        const productToModifyRequest = await api.productos.findById(product._id);
                        const productToModify = productToModifyRequest.data;
                        productToModify.cantidadStock -= originalProductInstance.cantidadesEntrantes;
                        productToModify.cantidadStock += parseFloat(product.cantidadesEntrantes);
                        await api.productos.edit(productToModify);
                    }else{
                        await api.productos.modifyStock({
                            product,
                            isIncrement: true,
                            quantity: product.cantidadesEntrantes
                        })
                    }
                }
                entrada.fecha = new Date();
                entrada.cantidad = entrada.productos.reduce((acc, item) => acc + item.cantidadesEntrantes, 0);
                await api.entradas.edit(entrada)
                .then((response) => {
                    if(response.code === 200){
                        successAlert('El registro se edit?? correctamente');
                        redirectToEntradas();
                    }else{
                        errorAlert('Fallo al editar el registro');
                    }
                })
            }else{
                if(!entrada.descripcion){
                    entrada.descripcion = '-- Sin descripci??n --';
                }
                if(!entrada.fecha){
                    entrada.fecha = new Date()
                };
                entrada.cantidad = entrada.productos.reduce((acc, item) => acc + item.cantidadesEntrantes, 0);
                entrada.costoTotal = total;
                for(const product of entrada.productos){
                    await api.productos.modifyStock({
                        product,
                        isIncrement: true,
                        quantity: product.cantidadesEntrantes
                    })
                }
                await api.entradas.save(entrada)
                .then((response) => {
                    if(response.code === 200){
                        successAlert('El registro se guard?? correctamente');
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
                                    label="Descripci??n"
                                >
                                    <Input 
                                        name="descripcion"
                                        placeholder="Descripci??n"
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
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Fecha"
                                >
                                    <DatePicker 
                                        name="fecha"
                                        locale='es-es'
                                        onChange={(e) => {
                                            setEntrada({
                                                ...entrada,
                                                fecha: new Date(e._d)
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Costo total"
                                >
                                    <Input 
                                        name="costoTotal"
                                        placeholder="Costo total"
                                        value={total}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <div onClick={() => {dispatch({type: 'SHOW_MODAL'})}}>
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
                                                        disabled
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
                                                        disabled
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
                                                        dispatch({type: DELETE_PRODUCT, payload: state.selectedProducts.find(product => product._id === item._id)})
                                                    }
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
                state={state}
                actions={actions}
                dispatch={dispatch}
            />
        </Row>
    )
}

export default EntradasForm;