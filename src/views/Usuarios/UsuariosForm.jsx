// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import graphics from '../../components/graphics'
import messages from '../../components/messages'
import { errorAlert, questionAlert, successAlert, warningAlert } from '../../components/alerts'

// Design Components
import { Checkbox, Col, Form, Input, Row, Select } from 'antd'

// Services
import api from '../../services'

// Imports Destructuring
const { Spinner } = graphics
const { Error } = messages


const UsuariosForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [usuario, setUsuario] = useState({
        nombre: '',
        email: '',
        password: '',
        perfil: false,
        puntoVenta: null,
        empresa: null
    })

    const loadBusiness = async () => {
        const userId = localStorage.getItem('userId')
        const mainUser = await api.users.findById(userId)
        if (!mainUser.data) {
            errorAlert('Error al cargar el usuario de referencia. Intente de nuevo.')
            navigate('/')
        } else {
            const business = mainUser.data.empresa
            setUsuario({ ...usuario, empresa: business })
        }
    }

    // eslint-disable-next-line
    useEffect(() => { loadBusiness() }, [])

    const loadUsuarioData = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: (e.target.name === 'perfil') ? e.target.checked : e.target.value,
        })
    }

    useEffect(() => {
        if (usuario.nombre) return
        if (id === 'nuevo') {
            setLoading(false)
            return
        }
        const fetchUsuario = async () => {
            const searchedItem = await api.users.findById(id)
            setUsuario(searchedItem.data)
            setLoading(false)
        }
        fetchUsuario()
    }, [usuario.nombre, id])

    const save = async () => {
        if (!usuario.nombre || !usuario.email || !usuario.password || !usuario.puntoVenta) {
            setError(true)
        } else {
            const allUsers = await api.tenants.findAllUsers()
            const emailAlreadyExists = allUsers.data.find(user => user.email === usuario.email)
            if (emailAlreadyExists) {
                errorAlert('El email ya está en uso. Regístrese con otro.')
            } else {
                const questionResult = await questionAlert('Requiere volver a iniciar sesión. ¿Desea continuar?')
                if (questionResult.isConfirmed) {
                    let response
                    if (id === 'nuevo') {
                        response = await api.users.save(usuario)
                    } else {
                        const findUserBeforeModifications = await api.users.findById(usuario._id)
                        const filters = JSON.stringify({ email: findUserBeforeModifications.data.email })
                        const findIfNewUserIsATenant = await api.tenants.findAllByFilters(filters)
                        const newUserIsATenant = findIfNewUserIsATenant.data.docs.find(tenant => tenant.email === findUserBeforeModifications.data.email)
                        if (newUserIsATenant) {
                            const updatedTenant = { ...newUserIsATenant, email: usuario.email, name: usuario.nombre }
                            const editTenant = await api.tenants.edit(updatedTenant)
                            if (editTenant.status !== 'OK') {
                                return errorAlert('No se pudo editar el email coincidente del inquilino. Intente de nuevo.')
                            } else {
                                response = await api.users.edit(usuario)
                            }
                        } else {
                            response = await api.users.edit(usuario)
                        }
                    }
                    if (response.status !== 'OK') {
                        warningAlert('Se modificó el inquilino pero no el usuario. Avise a su proveedor.')
                    } else {
                        successAlert('El registro se guardó con éxito.')
                    }
                    localStorage.clear()
                    navigate('/login')
                } else {
                    return
                }
            }
        }
    }

    const redirectToUsuarios = () => {
        navigate('/usuarios')
    }

    // ---------------- Select sale point ---------------- //
    const [salePointOptions, setSalePointOptions] = useState([])
    const [salePointStatus, setSalePointStatus] = useState(false)

    const onSearchSalePoint = async (e) => {
        const filters = JSON.stringify({ nombre: e })
        const findDocs = await api.salePoints.findAllByFilters(filters)
        let options = []
        if (findDocs.status === 'OK' && findDocs.data.docs.length > 0) {
            options = findDocs.data.docs.map(doc => {
                const option = { label: doc.nombre, value: doc._id }
                return option
            })
        }
        setSalePointOptions(options)
        setSalePointStatus(false)
    }

    const onClearSalePoint = () => {
        setUsuario({ ...usuario, puntoVenta: null })
        setSalePointOptions([])
        setSalePointStatus(true)
    }

    const onSelectSalePoint = async (e) => {
        const findDoc = await api.salePoints.findById(e)
        let salePoint = null
        if (findDoc.status === 'OK' && findDoc.data) {
            salePoint = findDoc.data
        }
        setUsuario({ ...usuario, puntoVenta: salePoint })
        setSalePointOptions([])
        setSalePointStatus(false)
    }

    const selectSalePoint = (
        <Select
            allowClear
            filterOption={false}
            onClear={onClearSalePoint}
            onSearch={onSearchSalePoint}
            onSelect={onSelectSalePoint}
            options={salePointOptions}
            placeholder='Seleccione punto de venta.'
            showSearch
            status={salePointStatus}
            style={{ width: '100%' }}
            value={usuario?.puntoVenta?.nombre ?? null}
        />
    )

    return (
        <Row>
            {loading ? (
                <Spinner />
            ) : (
                <Col span={12}>
                    <h1>{id === 'nuevo' ? 'Crear nuevo usuario' : 'Editar usuario'}</h1>
                    {error ? (
                        <Error message='Debe completar todos los campos obligatorios *' />
                    ) : null}
                    <Form
                        name='basic'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        autoComplete='off'
                        style={{ marginTop: '10px' }}
                    >
                        <Form.Item
                            label='Nombre'
                            onChange={(e) => {
                                loadUsuarioData(e)
                            }}
                            required={true}
                        >
                            <Input name='nombre' value={usuario.nombre} className='ml-5' />
                        </Form.Item>
                        <Form.Item
                            label='Email'
                            onChange={(e) => {
                                loadUsuarioData(e)
                            }}
                            required={true}
                        >
                            <Input name='email' value={usuario.email} className='ml-5' />
                        </Form.Item>
                        <Form.Item
                            label='Password'
                            onChange={(e) => {
                                loadUsuarioData(e)
                            }}
                            required={true}
                        >
                            <Input
                                name='password'
                                value={usuario.password}
                                type='password'
                                className='ml-5'
                            />
                        </Form.Item>
                        <Form.Item
                            label='Perfil administrador'
                            required={true}
                        >
                            <Checkbox
                                name='perfil'
                                checked={usuario.perfil}
                                onChange={(e) => {
                                    loadUsuarioData(e)
                                }}
                            ></Checkbox>
                        </Form.Item>
                        <Form.Item
                            label='Punto de venta'
                            required={true}
                        >
                            {selectSalePoint}
                        </Form.Item>
                        <Row>
                            <Col span={8} style={{ display: 'flex' }}>
                                <button
                                    className='btn-primary'
                                    onClick={() => save()}
                                >
                                    Guardar
                                </button>
                                <button
                                    className='btn-secondary'
                                    onClick={() => {
                                        redirectToUsuarios()
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

export default UsuariosForm