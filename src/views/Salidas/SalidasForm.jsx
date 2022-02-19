import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Button} from 'antd';
import api from '../../services';
import graphics from '../../components/graphics';
import icons from '../../components/icons';
import helpers from '../../helpers';
import { errorAlert, successAlert } from '../../components/alerts';

const { Spinner } = graphics;
const { Add, Delete } = icons;
const { mathHelper } = helpers;

const SalidasForm = () => {
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
    })
    const [productLines, setProductLines] = useState([]);

    //eslint-disable-next-line
    useEffect(() => {
        if(id === 'nuevo'){
            setLoading(false);
        }else{
            const fetchSalida = async() => {
                const response =  await api.salidas.getById(id);
                setSalida(response.data);
                setLoading(false);
            }
            fetchSalida();
        }
    })

    useEffect(() => {
        if(salida.usuario) return;
        const fetchLoggedUser = async() => {
            const response = await api.usuarios.getById(localStorage.getItem('userId'));
            setSalida({
                ...salida,
                usuario: response
            })
        }
        fetchLoggedUser();
    })

    useEffect(() => {
        if(id !== 'nuevo') return;
        if(salida.cantidad !== 0 && salida.gananciaNeta !== 0){
            const saveSalida = async() => {
                const response = await api.salidas.save(salida);
                console.log(response);
                if(response.code === 200){
                    successAlert('Registro guardado con éxito')
                    .then(() => {
                        redirectToSalidas();
                    })
                }
            }
            saveSalida();
        }
    }, 
    //eslint-disable-next-line
    [salida])

    const handleSubmit = () => {
        const fetchProducts = async() => {
            try{

                let productsToSalida = [];
                for(const item of productLines){
                    const response = await api.productos.getByBarcode(item.barcode);
                    let product = response.data;
                    product.cantidadStock -= item.quantity;
                    const productEditionResponse = await api.productos.edit(product);
                    if(productEditionResponse.code === 200){
                        product.cantidadesSalientes = Number(item.quantity);
                        product.gananciaNetaTotal = mathHelper.roundTwoDecimals(product.gananciaNeta * product.cantidadesSalientes);
                        productsToSalida.push(product)
                    }
                }
                const gananciaNeta = productsToSalida.reduce((acc, el) => acc + el.gananciaNetaTotal, 0);
                const cantidad = productsToSalida.reduce((acc, el) => acc + el.cantidadesSalientes, 0);
                setSalida({
                    ...salida,
                    productos: productsToSalida,
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

    const redirectToSalidas = () => {
        history.push('/salidas');
    }

    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Nueva salida' : 'Editar salida'}</h1>
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
                                    required
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
                                <Form.Item>
                                    <Button                                         
                                        htmlType="submit"
                                        className="btn-primary-bg"
                                        style={{marginRight: '15px'}}                                 
                                    >
                                        Guardar
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button 
                                        type="secondary"
                                        onClick={() => {redirectToSalidas()}}
                                    >
                                        Cancelar
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

export default SalidasForm;