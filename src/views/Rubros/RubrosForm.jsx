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


const RubrosForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [rubro, setRubro] = useState({
        nombre: '',
    })
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const loadRubroData = (e) => {
        setRubro({
            ...rubro,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (rubro.nombre) return
        if (id === 'nuevo') {
            setLoading(false)
            return
        }

        const fetchRubro = async () => {
            const searchedItem = await api.rubros.findById(id)
            setRubro({
                _id: searchedItem._id,
                nombre: searchedItem.nombre,
            })
            setLoading(false)
        }
        fetchRubro()
    }, [rubro.nombre, id])

    const save = () => {
        if (!rubro.nombre) {
            setError(true)
            return
        }

        const saveItem = async () => {
            const response = rubro._id
                ? await api.rubros.edit(rubro)
                : await api.rubros.save(rubro)
            if (response === 'OK') return success()
            return fail()
        }
        saveItem()
    }

    const redirectToRubros = () => {
        navigate('/rubros')
    }

    const success = () => {
        successAlert('El registro se guardo en la base de datos').then(() => {
            redirectToRubros()
        })
    }

    const fail = () => {
        errorAlert('Error al guardar el registro')
    }

    return (
        <Row>
            {loading ? (
                <Spinner />
            ) : (
                <Col>
                    <h1>{id === 'nuevo' ? 'Crear nuevo rubro' : 'Editar rubro'}</h1>
                    {error ? (
                        <Error message='Debe completar todos los campos obligatorios *' />
                    ) : null}
                    <Form
                        name='basic'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            save()
                        }}
                        autoComplete='off'
                        style={{ marginTop: '10px' }}
                    >
                        <Row>
                            <Col span={24} style={{ marginBottom: '10px' }}>
                                <Input
                                    name='nombre'
                                    placeholder='Nombre'
                                    required={true}
                                    value={rubro.nombre}
                                    className='ml-5'
                                    onChange={(e) => {
                                        loadRubroData(e)
                                    }}
                                />
                            </Col>
                            <Col span={6} style={{ display: 'flex' }}>
                                <button type='submit' className='btn-primary'>
                                    Guardar
                                </button>
                                <button
                                    className='btn-secondary'
                                    onClick={() => {
                                        redirectToRubros()
                                    }}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Cancelar
                                </button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            )}
        </Row>
    )
}

export default RubrosForm
