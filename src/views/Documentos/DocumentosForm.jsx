// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import graphics from '../../components/graphics'
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import { Row, Col, Form, Input, Checkbox, Button, Popover } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { Spinner } = graphics
const { noEmptyKeys } = helpers.objHelper
const { normalizeString } = helpers.stringHelper


const DocumentosForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [documento, setDocumento] = useState({
        cashRegister: false,
        codigoUnico: 0,
        fiscal: false,
        letra: '',
        nombre: '',
        presupuesto: false,
        remito: false,
        ticket: false,
        _id: null
    })

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

    useEffect(() => {
        const fetchDocumento = async (id) => {
            const searchedItem = await api.documents.findById(id)
            setDocumento(searchedItem)
            setLoading(false)
        }
        if (id !== 'nuevo') fetchDocumento(id)
        else setLoading(false)
    }, [loading, id])

    const save = async () => {
        if (id && noEmptyKeys(documento) === true) {
            const fixedDocument = { ...documento, normalizedName: normalizeString(documento.nombre) }
            const response = (id === 'nuevo') ? await api.documents.save(fixedDocument) : await api.documents.edit(fixedDocument)
            if (response.code === 200) {
                successAlert('El registro se guardó correctamente.')
                redirectToDocumentos()
            } else errorAlert('Error al guardar el registro.')
        } else errorAlert('Ocurrió un error, inténtelo de nuevo.')
    }

    const redirectToDocumentos = () => {
        navigate('/documentos')
    }

    const inputsProps = [
        {
            label: 'Nombre', name: 'nombre', required: true, value: documento.nombre,
            popover: { id: 'nombre', placement: 'right', title: '', content: 'Por ejemplo, "FACTURA C", "PRESUPUESTO", etc.', trigger: 'click' }
        },
        {
            label: 'Letra', name: 'letra', required: true, value: documento.letra,
            popover: { id: 'letra', placement: 'right', title: '', content: <a href='https://www.afip.gob.ar/facturacion/regimen-general/comprobantes.asp' target='_blank' rel='noreferrer'>¿Qué tipo de documento debo utilizar?</a>, trigger: 'click' }
        },
        {
            label: 'Código Único', name: 'codigoUnico', required: true, value: documento.codigoUnico,
            popover: { id: 'codigoUnico', placement: 'right', title: '', content: <a href='https://www.afip.gob.ar/fe/documentos/TABLACOMPROBANTES.xls' target='_blank' rel='noreferrer'>¿Qué código corresponde al documento que quiero registrar?</a>, trigger: 'click' }
        }
    ]

    const checkboxsProps = [
        { label: 'Fiscal', name: 'fiscal', required: true, checked: documento.fiscal },
        { label: 'Ticket', name: 'ticket', required: true, checked: documento.ticket },
        { label: 'Presupuesto', name: 'presupuesto', required: true, checked: documento.presupuesto },
        { label: 'Remito', name: 'remito', required: true, checked: documento.remito },
        { label: 'Arqueo de caja', name: 'cashRegister', required: true, checked: documento.cashRegister }
    ]

    return loading
        ? <Spinner />
        : (
            <Form
                initialValues={documento}
                autoComplete='off'
            >
                <h1>{(id === 'nuevo') ? 'Crear nuevo documento' : 'Editar documento'}</h1>
                <Col justify='center' span={6} offset={9}>
                    {inputsProps.map(input => {
                        return (
                            <Form.Item
                                label={input.label}
                                name={input.name}
                                onChange={e => loadInputsData(e)}
                                rules={[{ required: input.required, message: `¡Ingrese ${input.label.toUpperCase()} del documento!` }]}
                                key={input.name}
                            >
                                <Row justify='end'>
                                    <Col><Input name={input.name} value={input.value} /></Col>
                                    <Col align='middle'>
                                        <Popover
                                            placement={input.popover.placement}
                                            title={input.popover.title}
                                            content={input.popover.content}
                                            trigger={input.popover.trigger}

                                            key={input.popover.id}
                                        >
                                            <Button shape='circle'>?</Button>
                                        </Popover>
                                    </Col>
                                </Row>
                            </Form.Item>
                        )
                    })}
                    <Row justify='space-between'>
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
                        <Button
                            className='btn-primary'
                            onClick={() => save()}
                        >
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
