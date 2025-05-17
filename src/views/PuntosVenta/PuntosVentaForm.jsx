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


const PuntosVentaForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [puntoVenta, setPuntoVenta] = useState({
        nombre: '',
        numero: 1
    })

    const loadPuntoVentaData = (e) => {
        setPuntoVenta({
            ...puntoVenta,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (puntoVenta.nombre) return
        if (id === 'nuevo') {
            setLoading(false)
            return
        }

        const fetchPuntoVenta = async () => {
            const searchedItem = await api.salePoints.findById(id)
            setPuntoVenta({
                _id: searchedItem._id,
                nombre: searchedItem.nombre,
                numero: searchedItem.numero
            })
            setLoading(false)
        }
        fetchPuntoVenta()
    }, [puntoVenta.nombre, id])

    const save = () => {
        if (!puntoVenta.nombre) {
            setError(true)
            return
        }

        const saveItem = async () => {
            const response = (puntoVenta._id)
                ? await api.salePoints.edit(puntoVenta)
                : await api.salePoints.save(puntoVenta)
            if (response.code === 200) return success()
            return fail()
        }
        saveItem()
    }

    const redirectToPuntosVenta = () => {
        navigate('/puntosventa')
    }

    const success = () => {
        successAlert('El registro se guardo en la base de datos').then(() => {
            redirectToPuntosVenta()
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
                        <h1>{(id === 'nuevo') ? 'Crear nuevo punto de venta' : 'Editar punto de venta'}</h1>
                    </Col>
                    <Col span={12} >
                        {(error) ? <Error message='Debe completar todos los campos obligatorios *' /> : null}
                        <Form.Item
                            onChange={(e) => { loadPuntoVentaData(e) }}
                            required={true}
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '15px' }}><p>*Nombre:</p></div>
                                <Input name='nombre' value={puntoVenta.nombre} />
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            onChange={(e) => { loadPuntoVentaData(e) }}
                            required={true}
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '15px' }}><p>*Número:</p></div>
                                <Input type='number' name='numero' value={puntoVenta.numero} />
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
                        <button className='btn-secondary' type='button' onClick={() => { redirectToPuntosVenta() }} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </button>
                    </Col>
                </Row>
            </Form>
    )
}

export default PuntosVentaForm
