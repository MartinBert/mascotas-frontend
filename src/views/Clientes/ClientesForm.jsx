import React, { useState, useEffect } from 'react'
import api from '../../services'
import { Row, Col, Form, Input, Button } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import graphics from '../../components/graphics'
import { GenericAutocomplete } from '../../components/generics'
import { errorAlert, successAlert } from '../../components/alerts'
import helpers from '../../helpers'

const { Spinner } = graphics
const { formHelper } = helpers

const ClientesForm = ({userState}) => {

    const { id } = useParams()
    const history = useHistory()
    const [cliente, setCliente] = useState({
        razonSocial: '',
        cuit: '',
        condicionFiscal: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        provincia: '',
        documentoReceptor: 0,
        _id: null
    })
    const [loading, setLoading] = useState(true)

    const loadClienteData = (e) => {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value,
        })
    }

    //eslint-disable-next-line
    useEffect(() => {
        const fetchCliente = async (id) => {
            const searchedItem = await api.clientes.findById(id)
            setCliente(searchedItem)
            setLoading(false)
        }
        if (id !== 'nuevo') fetchCliente(id)
        else setLoading(false)
    }, [loading, id])

    const setFiscalCondition = (condition) => {
        if (condition.nombre === 'Consumidor Final') {
            setCliente({
                ...cliente,
                condicionFiscal: condition,
                documentoReceptor: 86
            })
        } else {
            setCliente({
                ...cliente,
                condicionFiscal: condition,
                documentoReceptor: 80
            })
        }
    }
    
    const redirectToClientes = () => {
        history.push('/clientes')
    }

    const save = async () => {
        if (id && formHelper.noEmptyKeys(cliente) === true) {
            const response = (id === 'nuevo') ? await api.clientes.save(cliente) : await api.clientes.edit(cliente)
            if (response.code === 200) {
                successAlert('El registro se guardó correctamente.')
                redirectToClientes()
            } else errorAlert('Error al guardar el registro.')
        } else errorAlert('Ocurrió un error, inténtelo de nuevo.')
    }

    const formProps = [
        { label: 'Razón social / Nombre', name: 'razonSocial', required: true, value: cliente.razonSocial },
        { label: 'CUIT / CUIL', name: 'cuit', required: true, value: cliente.cuit },
        { label: 'Teléfono', name: 'telefono', required: true, value: cliente.telefono },
        { label: 'Email', name: 'email', required: true, value: cliente.email },
        { label: 'Dirección', name: 'direccion', required: true, value: cliente.direccion },
        { label: 'Ciudad', name: 'ciudad', required: true, value: cliente.ciudad },
        { label: 'Provincia', name: 'provincia', required: true, value: cliente.provincia }
    ]

    return loading
        ? <Spinner />
        : (
            <Form
                onFinish={() => save()}
                initialValues={cliente}
                autoComplete='off'
            >
                <h1>{id === 'nuevo' ? 'Crear nuevo cliente' : 'Editar cliente'}</h1>
                <Col justify='center' span={12} offset={6}>
                    <Form.Item
                        label='Condición fiscal'
                        name='condicionFiscal'
                        onChange={e => loadClienteData(e)}
                        rules={
                            (cliente.condicionFiscal)
                                ? [{ required: false, message: '' }]
                                : [{ required: true, message: '¡Ingrese CONDICIÓN FISCAL de su cliente!' }]
                        }
                    >
                        <GenericAutocomplete
                            modelToFind='condicionfiscal'
                            keyToCompare='nombre'
                            controller='condicionesfiscales'
                            setResultSearch={setFiscalCondition}
                            selectedSearch={cliente.condicionFiscal}
                            returnCompleteModel={true}
                        />
                    </Form.Item>

                    {formProps.map(formItem => (
                        (formItem.name !== 'cuit')
                        ?
                        <Form.Item
                            label={formItem.label}
                            name={formItem.name}
                            onChange={e => loadClienteData(e)}
                            rules={[{ required: formItem.required, message: `¡Ingrese ${formItem.label.toUpperCase()} de su cliente!` }]}
                            key={formItem.name}
                        >
                            <Input name={formItem.name} value={formItem.value} />
                        </Form.Item>
                        :
                        <Row key={formItem.name}>
                            <Col span={16}>
                                <Form.Item
                                    label={formItem.label}
                                    name={formItem.name}
                                    onChange={e => loadClienteData(e)}
                                    rules={[{ required: formItem.required, message: `¡Ingrese ${formItem.label.toUpperCase()} de su cliente!` }]}
                                >
                                    <Input name={formItem.name} value={formItem.value} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button 
                                    className='btn-primary' 
                                    type='button'
                                    onClick={async(e)=> {
                                        e.preventDefault();
                                        setLoading(true)
                                        if(!cliente.cuit) return errorAlert('Debe ingresar el cuit del cliente.');
                                
                                        const userCuit = userState.user.empresa.cuit;
                                        const taxpayerData = await api.afip.findTaxpayerData(userCuit, cliente.cuit);
                                        
                                        if(!taxpayerData) return errorAlert(`No existen datos en AFIP para el identificador ${cliente.cuit}`)
                                
                                        setCliente({
                                            ...cliente,
                                            razonSocial: taxpayerData.razonSocial,
                                            condicionFiscal: null,
                                            email: (taxpayerData.email) ? taxpayerData.email[0].direccion : '',
                                            telefono: (taxpayerData.telefono) ? taxpayerData.telefono[0].numero : '',
                                            direccion: (taxpayerData.domicilio[0].direccion) ? taxpayerData.domicilio[0].direccion : '',
                                            ciudad: (taxpayerData.domicilio[0].localidad) ? taxpayerData.domicilio[0].localidad : '',
                                            provincia: (taxpayerData.domicilio[0].descripcionProvincia) ? taxpayerData.domicilio[0].descripcionProvincia : '',
                                            documentoReceptor: 80
                                        })
                                    }
                                    }
                                >
                                    Buscar datos
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Col>
                <Row justify='center' gutter={24}>
                    <Col>
                        <Button className='btn-primary' htmlType='submit'>
                            Guardar
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => redirectToClientes()} className='btn-secondary' htmlType='button'>
                            Cancelar
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
}

export default ClientesForm