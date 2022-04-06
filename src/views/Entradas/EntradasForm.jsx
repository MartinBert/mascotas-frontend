import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input } from 'antd';
import api from '../../services';
import graphics from '../../components/graphics';
import icons from '../../components/icons';
import helpers from '../../helpers';
import { errorAlert, successAlert } from '../../components/alerts';

const { Spinner } = graphics;
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
    })
    const [productLines, setProductLines] = useState([]);

    //eslint-disable-next-line
    useEffect(() => {
        if(id === 'nuevo'){
            setLoading(false);
        }else{
            const fetchEntrada = async() => {
                const response =  await api.entradas.getById(id);
                setEntrada(response.data);
                setLoading(false);
            }
            fetchEntrada();
        }
    })

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
    [entrada])

    const handleSubmit = () => {
        const fetchProducts = async() => {
            try{

                let productsToEntrada = [];
                for(const item of productLines){
                    const response = await api.productos.getByBarcode(item.barcode);
                    let product = response.data;
                    let itemQuantity = parseFloat(item.quantity);
                    product.cantidadStock += itemQuantity;
                    const productEditionResponse = await api.productos.edit(product);
                    if(productEditionResponse.code === 200){
                        product.cantidadesEntrantes = Number(item.quantity);
                        product.gananciaNetaTotal = mathHelper.roundTwoDecimals(product.gananciaNeta * product.cantidadesEntrantes);
                        productsToEntrada.push(product)
                    }
                }
                const gananciaNeta = productsToEntrada.reduce((acc, el) => acc + el.gananciaNetaTotal, 0);
                const cantidad = productsToEntrada.reduce((acc, el) => acc + el.cantidadesEntrantes, 0);
                setEntrada({
                    ...entrada,
                    productos: productsToEntrada,
                    gananciaNeta,
                    cantidad
                })
            }catch(err){
                console.error(err);
                errorAlert('Error al guardar el registro...');
            }
        }
        fetchProducts()
    }

    const redirectToEntradas = () => {
        history.push('/entradas');
    }

    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Nueva entrada' : 'Editar entrada'}</h1>
                {(loading) 
                    ? <Spinner/>
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
                                        setProductLines([
                                            ...productLines,
                                            {
                                                id: mathHelper.randomFiveDecimals(),
                                                barcode: '',
                                                quantity: 0
                                            }
                                        ])
                                    }}
                                >
                                    <Add customStyle={{width: '70px', height: '70px'}}/>
                                </div>
                            </Col>
                            <Col span={12}>
                                {(productLines.length > 0) ?
                                    productLines.map((item, key) => (
                                        <Row key={key} gutter={8}>
                                            <Col>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input 
                                                        name="barcode"
                                                        placeholder="Codigo de barras de producto"
                                                        value={item.barcode}
                                                        onChange={(e) => {
                                                            setProductLines(
                                                                productLines.map(el => {
                                                                    if(el.id === productLines[key].id){
                                                                        el.barcode = e.target.value
                                                                    }
                                                                    return el;
                                                                })
                                                            )
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
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            setProductLines(
                                                                productLines.map(el => {
                                                                    if(el.id === productLines[key].id){
                                                                        el.quantity = e.target.value
                                                                    }
                                                                    return el;
                                                                })
                                                            )
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <div onClick={() => {
                                                    setProductLines(
                                                        productLines.filter(el => el.id !== item.id)
                                                    )
                                                }}>
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