// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import graphics from '../../components/graphics'
import messages from '../../components/messages'
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import { Row, Col, Form, Input, Checkbox } from 'antd'

// Services
import api from '../../services'

// Imports Destructuring
const { Error } = messages
const { Spinner } = graphics


const CondicionesFiscalesForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [condicionFiscal, setCondicionFiscal] = useState({
        nombre: '',
        adicionaIva: true
    })

    const loadCondicionFiscalData = (e) => {
        setCondicionFiscal({
            ...condicionFiscal,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (condicionFiscal.nombre) return
        if (id === 'nuevo') {
            setLoading(false)
            return
        }

        const fetchCondicionFiscal = async () => {
            const searchedItem = await api.condicionesfiscales.findById(id)
            setCondicionFiscal({
                _id: searchedItem._id,
                nombre: searchedItem.nombre,
                adicionaIva: searchedItem.adicionaIva
            })
            setLoading(false)
        }
        fetchCondicionFiscal()
    }, [condicionFiscal.nombre, id])

    const save = () => {
        if (!condicionFiscal.nombre) {
            setError(true)
            return
        }

        const saveItem = async () => {
            const response = (condicionFiscal._id) ? await api.condicionesfiscales.edit(condicionFiscal) : await api.condicionesfiscales.save(condicionFiscal)
            if (response === 'OK') return success()
            return fail()
        }
        saveItem()
    }

    const redirectToCondicionesFiscales = () => {
        navigate('/condicionesfiscales')
    }

    const success = () => {
        successAlert('El registro se guardo en la base de datos').then(() => {
            redirectToCondicionesFiscales()
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
                <Row gutter={8}>
                    <Col span={24}>
                        <h1>{(id === 'nuevo') ? 'Crear nueva condicion fiscal' : 'Editar condicion fiscal'}</h1>
                    </Col>
                    <Col span={12}>
                        {(error) ? <Error message='Debe completar todos los campos obligatorios *' /> : null}
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '15px' }}><p>*Nombre:</p></div>
                            <Input name='nombre' value={condicionFiscal.nombre} style={{ width: '100%' }} onChange={(e) => { loadCondicionFiscalData(e) }} />
                        </div>
                    </Col>
                    <Col span={4} style={{ display: 'flex' }}>
                        <div style={{ marginRight: '15px' }}><p>Adiciona IVA:</p></div>
                        <div>
                            <Checkbox
                                onChange={(e) => {
                                    setCondicionFiscal({
                                        ...condicionFiscal,
                                        adicionaIva: e.target.checked
                                    })
                                }}
                                checked={condicionFiscal.adicionaIva}
                            />
                        </div>
                    </Col>
                    <Col span={6}></Col>
                    <Col span={6} style={{ display: 'flex', marginTop: '15px' }}>
                        <button
                            className='btn-primary'
                            onClick={() => save()}
                        >
                            Guardar
                        </button>
                        <button className='btn-secondary' type='button' onClick={() => { redirectToCondicionesFiscales() }} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </button>
                    </Col>
                </Row>
            </Form>
    )
}

export default CondicionesFiscalesForm
