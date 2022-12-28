import React, { useState, useEffect } from 'react'
import api from '../../services'
import helpers from '../../helpers'
import { Row, Col, Form, Input, Checkbox, Button } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import graphics from '../../components/graphics'
import { errorAlert, successAlert } from '../../components/alerts'

const { Spinner } = graphics
const { formHelpers } = helpers

const DocumentosForm = () => {

    const { id } = useParams()
    const history = useHistory()
    const [documento, setDocumento] = useState({
        nombre: '',
        fiscal: false,
        ticket: false,
        presupuesto: false,
        remito: false,
        letra: '',
        codigoUnico: 0,
        _id: null
    })
    const [loading, setLoading] = useState(true)

    const loadInputsData = (e) => {
        setDocumento({
            ...documento,
            [e.target.name]: e.target.value
        })
    }

    const loadCheckboxsData = (e) => {
        setDocumento({
            ...documento,
            [e.target.id]: e.target.checked
        })
    }

    //eslint-disable-next-line
    useEffect(() => {
        const fetchDocumento = async (id) => {
            const searchedItem = await api.documentos.findById(id)
            setDocumento(searchedItem)
            setLoading(false)
        }
        if (id !== 'nuevo') fetchDocumento(id)
        else setLoading(false)
    }, [loading, id])

    const save = async () => {
        if (id && formHelpers.noEmptyKeys(documento) === true) {
            const response = (id === 'nuevo') ? await api.documentos.save(documento) : await api.documentos.edit(documento)
            if (response.code === 200) {
                successAlert('El registro se guardó correctamente.')
                redirectToDocumentos()
            } else errorAlert('Error al guardar el registro.')
        } else errorAlert('Ocurrió un error, inténtelo de nuevo.')
    }

    const redirectToDocumentos = () => {
        history.push('/documentos')
    }

    const inputsProps = [
        { label: 'Nombre', name: 'nombre', required: true, value: documento.nombre },
        { label: 'Letra', name: 'letra', required: true, value: documento.letra },
        { label: 'Código Único', name: 'codigoUnico', required: true, value: documento.codigoUnico }
    ]

    const checkboxsProps = [
        { label: 'Fiscal', name: 'fiscal', required: true, checked: documento.fiscal },
        { label: 'Ticket', name: 'ticket', required: true, checked: documento.ticket },
        { label: 'Presupuesto', name: 'presupuesto', required: true, checked: documento.presupuesto },
        { label: 'Remito', name: 'remito', required: true, checked: documento.remito }
    ]

    return loading
        ? <Spinner />
        : (
            <Form
                onFinish={() => save()}
                initialValues={documento}
                autoComplete='off'
            >
                <h1>{(id === 'nuevo') ? 'Crear nuevo documento' : 'Editar documento'}</h1>
                <Col justify='center' span={12} offset={6}>
                    {inputsProps.map(input => {
                        return (
                            <Form.Item
                                label={input.label}
                                name={input.name}
                                onChange={e => loadInputsData(e)}
                                rules={[{ required: input.required, message: `¡Ingrese ${input.label.toUpperCase()} del documento!` }]}
                                key={input.name}
                            >
                                <Input name={input.name} value={input.value} />
                            </Form.Item>
                        )
                    })}
                    <Row>
                        {checkboxsProps.map(checkbox => {
                            return (
                                <Form.Item
                                    label={checkbox.label}
                                    name={checkbox.name}
                                    required={checkbox.required}
                                    key={checkbox.name}
                                >
                                    <Checkbox onChange={e => loadCheckboxsData(e)} checked={checkbox.checked} />
                                </Form.Item>
                            )
                        })}
                    </Row>
                </Col>
                <Row justify='center' gutter={24}>
                    <Col>
                        <Button className='btn-primary' htmlType='submit'>
                            Guardar
                        </Button>
                    </Col>
                    <Col>
                        <Button className='btn-secondary' onClick={() => { redirectToDocumentos() }}>
                            Cancelar
                        </Button>
                    </Col>
                </Row>
            </Form >
        )
}

export default DocumentosForm
