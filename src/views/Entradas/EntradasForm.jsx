import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Spin } from 'antd';
import api from '../../services';
import icons from '../../components/icons';
import helpers from '../../helpers';
import { errorAlert, successAlert } from '../../components/alerts';

const { Add, Delete } = icons;
const { mathHelper, dateHelper } = helpers;

const EntradasForm = () => {
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

    //eslint-disable-next-line
    useEffect(() => {
        if(!loading) return;
        if(id === 'nuevo'){
            setLoading(false);
        }else{
            fetchEntrada(); 
        }
    })

    useEffect(() => {
        if(!entradaIsReady) return;
        setLoading(false);
    }, [entradaIsReady])

    useEffect(() => {
        if(entrada.usuario) return;
        const fetchLoggedUser = async() => {
            const response = await api.usuarios.getById(localStorage.getItem('userId'));
            setEntrada({
                ...entrada,
                usuario: response
            })
        }
        fetchLoggedUser();
    })

    useEffect(() => {
        if(id !== 'nuevo') return;
        if(entrada.cantidad !== 0 && entrada.gananciaNeta !== 0){
            if(entrada.descripcion === undefined || entrada.descripcion === ''){
                entrada.descripcion = `Entrada del ${dateHelper.simpleDateWithHours(new Date())} hs`;
            }
            const saveEntrada = async() => {
                const response = await api.entradas.save(entrada);
                if(response.code === 200){
                    successAlert('Registro guardado con éxito')
                    .then(() => {
                        redirectToEntradas();
                    })
                }
            }
            saveEntrada();
        }
    }, 
    //eslint-disable-next-line
    [entrada]);

    const fetchEntrada = async() => {
        const response =  await api.entradas.getById(id);
        setEntrada(response.data);
        setEntradaIsReady(true);
    }

    const handleSubmit = () => {
        console.log('submit');
    }

    const redirectToEntradas = () => {
        history.push('/entradas');
    }

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
                                    onClick={() => {
                                        setEntrada({
                                            ...entrada,
                                            productos: [
                                                ...entrada.productos,
                                                {
                                                    _id: null,
                                                    codigoBarras: null,
                                                    cantidad: 0
                                                }
                                            ]
                                        })
                                    }}
                                >
                                    <Add customStyle={{width: '70px', height: '70px'}}/>
                                </div>
                            </Col>
                            <Col span={12}>
                                {(entrada.productos.length > 0) ?
                                    entrada.productos.map((item, key) => (
                                        <Row key={key} gutter={8}>
                                            <Col>
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
                                            <Col>
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
                                                                        el.cantidadesEntrantes = parseFloat(e.target.value)
                                                                    }
                                                                    return el;
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col>
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
        </Row>
    )
}

export default EntradasForm;