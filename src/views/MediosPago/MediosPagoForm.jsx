import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Form, Input, Checkbox} from 'antd';
import api from '../../services';
import graphics from '../../components/graphics';
import icons from '../../components/icons';
import helpers from '../../helpers';
import {questionAlert, errorAlert, successAlert} from '../../components/alerts';

const { Spinner } = graphics;
const { Add, Delete } = icons;
const { mathHelper } = helpers;

const MediosPagoForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [mediopago, setMedioPago] = useState({
        nombre: '',
        arqueoCaja: false,
        cierrez: false,
        planes: [],
    })
    const [planLines, setPlanLines] = useState([]);

    //eslint-disable-next-line
    useEffect(() => {
        if(id === 'nuevo'){
            setLoading(false);
        }else{
            if(mediopago.nombre) return;
            const fetchPaymentMethod = async() => {
                const response =  await api.mediospago.findById(id);
                setMedioPago(response.data);
                setPlanLines(response.data.planes);
                setLoading(false);
            }
            fetchPaymentMethod();
        }
    })

    const handleSubmit = () => {
        if(planLines.length === 0 && mediopago.planes.length === 0){
            questionAlert('Si no carga ningún plan el porcentaje de variación del medio de pago será nulo, ¿Desea continuar?')
            .then(result => {
                if(result.isConfirmed){
                    console.log(mediopago);
                }
            })
        }else{
            planLines.forEach(el => {
                if(!el.nombre || !el.cuotas || !el.porcentaje) return errorAlert('Campos incompletos en planes de pago');
            })
            mediopago.planes = planLines;
            if(id === 'nuevo'){
                api.mediospago.save(mediopago)
                .then(response => {
                    if(response.code === 200){
                        success();
                    }else{
                        errorAlert('No se ha podido guardar el registro');
                    }
                })
            }else{
                api.mediospago.edit(mediopago)
                .then(response => {
                    if(response.code === 200){
                        success();
                    }else{
                        errorAlert('No se ha podido guardar el registro');
                    }
                })
            }
        }
    }

    const success = () => {
        successAlert('Se ha guardado el registro')
        .then(() => {
            redirectToMediosPago();
        })
    }

    const redirectToMediosPago = () => {
        history.push('/mediospago');
    }

    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Nueva medio de pago' : 'Editar medio de pago'}</h1>
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
                                    label="Nombre"
                                >
                                    <Input 
                                        name="nombre"
                                        placeholder="Nombre"
                                        value={mediopago.nombre}
                                        onChange={(e) => {
                                            setMedioPago({
                                                ...mediopago,
                                                nombre: e.target.value
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={18} lg={16} md={12} sm={24} xs={24} style={{display: 'flex'}}>
                                <Form.Item 
                                    required
                                    label="Suma en arqueo: "
                                >
                                    <Checkbox 
                                        onChange={(e) => {setMedioPago({
                                            ...mediopago,
                                            arqueoCaja: e.target.checked
                                        })}} 
                                        checked={mediopago.arqueoCaja}
                                    />
                                </Form.Item>
                                <Form.Item 
                                    style={{marginLeft: '15px'}}
                                    required
                                    label="Suma en cierre z: "
                                >
                                    <Checkbox 
                                        onChange={(e) => {setMedioPago({
                                            ...mediopago,
                                            cierrez: e.target.checked
                                        })}} 
                                        checked={mediopago.cierrez}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <div><h3>Agregar planes de pago</h3></div>
                                <div 
                                    onClick={() => {
                                        setPlanLines([
                                            ...planLines,
                                            {
                                                _id: mathHelper.randomFiveDecimals(),
                                                nombre: '',
                                                cuotas: 0,
                                                porcentaje: 0
                                            }
                                        ])
                                    }}
                                >
                                    <Add customStyle={{width: '70px', height: '70px'}}/>
                                </div>
                            </Col>
                            <Col span={24}>
                                {(planLines.length > 0) ?
                                    <Row flex='true' gutter={8}>
                                        <Col><div><h3>Nombre / </h3></div></Col>
                                        <Col><div><h3>Cant. de cuotas / </h3></div></Col>
                                        <Col><div><h3>Porcentaje</h3></div></Col>
                                    </Row>
                                    : null                               
                                }
                                {(planLines.length > 0) ?
                                    planLines.map((item, key) => (
                                        <Row key={key} gutter={8}>
                                            <Col>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input 
                                                        name="nombre"
                                                        value={item.nombre}
                                                        onChange={(e) => {
                                                            setPlanLines(
                                                                planLines.map(el => {
                                                                    if(el._id === item._id){
                                                                        el.nombre = e.target.value
                                                                    }
                                                                    return el;
                                                                })
                                                            )

                                                            console.log(planLines);
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item 
                                                    required
                                                >
                                                    <Input 
                                                        name="cuotas"
                                                        type="number"
                                                        value={item.cuotas}
                                                        onChange={(e) => {
                                                            setPlanLines(
                                                                planLines.map(el => {
                                                                    if(el._id === item._id){
                                                                        el.cuotas = e.target.value
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
                                                        name="porcentaje"
                                                        placeholder="Cant. de cuotas"
                                                        type="number"
                                                        value={item.porcentaje}
                                                        onChange={(e) => {
                                                            setPlanLines(
                                                                planLines.map(el => {
                                                                    if(el._id === item._id){
                                                                        el.porcentaje = e.target.value
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
                                                    setPlanLines(
                                                        planLines.filter(el => el._id !== item._id)
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
                                        onClick={() => {redirectToMediosPago()}}
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

export default MediosPagoForm;