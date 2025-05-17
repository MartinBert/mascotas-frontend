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


const MarcasForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [marca, setMarca] = useState({
        nombre: ''
    })

    const loadMarcaData = (e) => {
        setMarca({
            ...marca,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (marca.nombre) return
        if (id === 'nuevo') {
            setLoading(false)
            return
        }

        const fetchMarca = async () => {
            const searchedItem = await api.brands.findById(id)
            setMarca({
                _id: searchedItem._id,
                nombre: searchedItem.nombre
            })
            setLoading(false)
        }
        fetchMarca()
    }, [marca.nombre, id])

    const save = () => {
        if (!marca.nombre) {
            setError(true)
            return
        }

        const saveItem = async () => {
            const response = (marca._id) ? await api.brands.edit(marca) : await api.brands.save(marca)
            if (response === 'OK') return success()
            return fail()
        }
        saveItem()
    }

    const redirectToMarcas = () => {
        navigate('/marcas')
    }

    const success = () => {
        successAlert('El registro se guardo en la base de datos').then(() => {
            redirectToMarcas()
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
                        <h1>{(id === 'nuevo') ? 'Crear nueva marca' : 'Editar marca'}</h1>
                    </Col>
                    <Col span={12} >
                        {(error) ? <Error message='Debe completar todos los campos obligatorios *' /> : null}
                        <Form.Item
                            onChange={(e) => { loadMarcaData(e) }}
                            required={true}
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '15px' }}><p>*Nombre:</p></div>
                                <Input name='nombre' value={marca.nombre} />
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={12}></Col>
                    <Col span={8} style={{ display: 'flex' }}>
                        <button
                            className='btn-primary'
                            onClick={() => save()}
                        >
                            Guardar
                        </button>
                        <button className='btn-secondary' type='button' onClick={() => { redirectToMarcas() }} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </button>
                    </Col>
                </Row>
            </Form>
    )
}

export default MarcasForm
