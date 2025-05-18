// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import graphics from '../../components/graphics'
import messages from '../../components/messages'
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import { Row, Col, Form, Input } from 'antd'

// Services
import api from '../../services'

// Imports Destructuring
const { Error } = messages
const { Spinner } = graphics


const UnidadesMedidaForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [unidadMedida, setUnidadMedida] = useState({
        nombre: '',
        fraccionamiento: 1
    })

    const loadUnidadMedidaData = (e) => {
        setUnidadMedida({
            ...unidadMedida,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (unidadMedida.nombre) return
        if (id === 'nuevo') {
            setLoading(false)
            return
        }

        const fetchUnidadMedida = async () => {
            const searchedItem = await api.measureUnits.findById(id)
            setUnidadMedida({
                _id: searchedItem.data._id,
                nombre: searchedItem.data.nombre,
                fraccionamiento: searchedItem.data.fraccionamiento
            })
            setLoading(false)
        }
        fetchUnidadMedida()
    }, [unidadMedida.nombre, id])

    const save = () => {
        if (!unidadMedida.nombre) {
            setError(true)
            return
        }

        const saveItem = async () => {
            const response = (unidadMedida._id)
                ? await api.measureUnits.edit(unidadMedida)
                : await api.measureUnits.save(unidadMedida)
            if (response.status === 'OK') return success()
            return fail()
        }
        saveItem()
    }

    const redirectToUnidadesMedida = () => {
        navigate('/unidadesmedida')
    }

    const success = () => {
        successAlert('El registro se guardo en la base de datos').then(() => {
            redirectToUnidadesMedida()
        })
    }

    const fail = () => {
        errorAlert('Error al guardar el registro')
    }

    return (
        (loading) ? <Spinner />
            :
            <Form
                name='basic'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete='off'
                style={{ marginTop: '10px' }}
            >
                <Row>
                    <Col span={24}>
                        <h1>{(id === 'nuevo') ? 'Crear nueva unidad de medida' : 'Editar unidad de medida'}</h1>
                    </Col>
                    <Col span={12} >
                        {(error) ? <Error message='Debe completar todos los campos obligatorios *' /> : null}
                        <Form.Item
                            onChange={(e) => { loadUnidadMedidaData(e) }}
                            required={true}
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '15px' }}><p>*Nombre:</p></div>
                                <Input name='nombre' value={unidadMedida.nombre} />
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        {(error) ? <Error message='Debe completar todos los campos obligatorios *' /> : null}
                        <Form.Item
                            onChange={(e) => { loadUnidadMedidaData(e) }}
                            required={true}
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '15px' }}><p>*Fraccionamiento:</p></div>
                                <Input name='fraccionamiento' type='number' value={unidadMedida.fraccionamiento} />
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: 'flex' }}>
                        <button
                            className='btn-primary'
                            onClick={() => save()}
                        >
                            Guardar
                        </button>
                        <button className='btn-secondary' type='button' onClick={() => { redirectToUnidadesMedida() }} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </button>
                    </Col>
                </Row>
            </Form>
    )
}

export default UnidadesMedidaForm
