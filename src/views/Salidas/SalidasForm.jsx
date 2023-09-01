// React Components and Hooks
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Custom Components
import { ProductSelectionModal } from '../../components/generics'
import { errorAlert, successAlert } from '../../components/alerts'
import icons from '../../components/icons'

// Design Components
import { Row, Col, Form, Input, Spin, DatePicker } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Services
import api from '../../services'

// Imports Destructuring
const { Add, Delete } = icons
const { useLoggedUserContext } = contextProviders.LoggedUserContextProvider
const { useProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider


const SalidasForm = () => {

    //------------------------------------------------------ State declarations ------------------------------------------------------/
    const navigate = useNavigate()
    const { id } = useParams()
    const loggedUserContext = useLoggedUserContext()
    const [loggedUser_state] = loggedUserContext
    const productSelectionModalContext = useProductSelectionModalContext()
    const [productSelectionModal_state, productSelectionModal_dispatch] = productSelectionModalContext
    const [salidaIsReady, setSalidaIsReady] = useState(false)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [salida, setSalida] = useState({
        descripcion: '',
        fecha: new Date(),
        cantidad: 0,
        gananciaNeta: 0,
        productos: [],
        usuario: null,
    })
    //------------------------------------------------------------------------------------------------------------------------------/


    //--------------------------------------------------------- First load ---------------------------------------------------------/

    useEffect(() => {
        if (!loading) return
        if (id === 'nuevo') {
            setSalidaIsReady(true)
        } else {
            const fetchSalida = async () => {
                const response = await api.salidas.findById(id)
                setSalida(response.data)
                setSalidaIsReady(true)
            }
            fetchSalida()
        }
    }, [loading, id])

    useEffect(() => {
        if (!salidaIsReady) return
        if (!salida.usuario) setSalida({ ...salida, usuario: loggedUser_state.user })
        setLoading(false)
    },
        //eslint-disable-next-line
        [salidaIsReady])

    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Product Selection Modal ------------------------------------------------------/
    useEffect(() => {
        setSalida({
            ...salida,
            productos: productSelectionModal_state.selectedProducts
        })
    },
        //eslint-disable-next-line
        [productSelectionModal_state.selectedProducts])

    useEffect(() => {
        setTotal(
            salida.productos.reduce(
                (acc, item) => acc + ((item.cantidadesSalientes) ? (item.gananciaNeta * item.cantidadesSalientes) : 0), 0
            ))
    }, [salida.productos])
    //------------------------------------------------------------------------------------------------------------------------------/


    //----------------------------------------------- Submit form action -----------------------------------------------------------/
    const handleSubmit = async () => {
        try {
            if (id !== 'nuevo') {
                for (let product of salida.productos) {
                    const firstSalidaRequest = await api.salidas.findById(id)
                    const firstSalidaInstance = firstSalidaRequest.data
                    const originalProductInstance = firstSalidaInstance.productos.find(el => el._id === product._id)
                    if (originalProductInstance && originalProductInstance.cantidadesSalientes !== product.cantidadesSalientes) {
                        const productToModifyRequest = await api.productos.findById(product._id)
                        const productToModify = productToModifyRequest.data
                        productToModify.cantidadStock += originalProductInstance.cantidadesSalientes
                        productToModify.cantidadStock -= parseFloat(product.cantidadesSalientes)
                        await api.productos.edit(productToModify)
                    } else {
                        await api.productos.modifyStock({
                            product,
                            isIncrement: false,
                            quantity: product.cantidadesSalientes
                        })
                    }
                }
                salida.fecha = new Date()
                salida.cantidad = salida.productos.reduce((acc, item) => acc + item.cantidadesSalientes, 0)
                await api.salidas.edit(salida)
                    .then((response) => {
                        if (response.code === 200) {
                            successAlert('El registro se editó correctamente')
                            redirectToSalidas()
                        } else {
                            errorAlert('Fallo al editar el registro')
                        }
                    })
            } else {
                if (!salida.descripcion) {
                    salida.descripcion = '-- Sin descripción --'
                }
                if (!salida.fecha) {
                    salida.fecha = new Date()
                }
                salida.cantidad = salida.productos.reduce((acc, item) => acc + item.cantidadesSalientes, 0)
                salida.gananciaNeta = total
                for (const product of salida.productos) {
                    await api.productos.modifyStock({
                        product,
                        isIncrement: false,
                        quantity: product.cantidadesSalientes
                    })
                }
                await api.salidas.save(salida)
                    .then((response) => {
                        if (response.code === 200) {
                            successAlert('El registro se guardó correctamente')
                            redirectToSalidas()
                        } else {
                            errorAlert('Fallo al guardar el registro')
                        }
                    })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const redirectToSalidas = () => {
        navigate('/salidas')
    }
    //------------------------------------------------------------------------------------------------------------------------------/


    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Nueva salida' : 'Editar salida'}</h1>
                {(loading)
                    ? <Spin />
                    :
                    <Form
                        autoComplete='off'
                    >
                        <Row gutter={8}>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label='Descripción'
                                >
                                    <Input
                                        name='descripcion'
                                        placeholder='Descripción'
                                        value={salida.descripcion}
                                        onChange={(e) => {
                                            setSalida({
                                                ...salida,
                                                descripcion: e.target.value
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label='Fecha'
                                >
                                    <DatePicker
                                        name='fecha'
                                        locale='es-es'
                                        onChange={e => {
                                            setSalida({
                                                ...salida,
                                                fecha: new Date(e.$d)
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label='Ganancia neta total'
                                >
                                    <Input
                                        name='gananciaNetaTotal'
                                        placeholder='Ganancia neta total'
                                        value={total}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <div onClick={() => { productSelectionModal_dispatch({ type: 'SHOW_PRODUCT_MODAL' }) }}>
                                    <Add customStyle={{ width: '70px', height: '70px' }} />
                                </div>
                            </Col>
                            <Col span={24}>
                                {(salida.productos.length > 0) ?
                                    salida.productos.map((item, key) => (
                                        <Row key={key} gutter={8}>
                                            <Col span={6}>
                                                <Form.Item
                                                    required
                                                >
                                                    <Input
                                                        disabled
                                                        name='nombre'
                                                        placeholder='Nombre del producto'
                                                        value={item.nombre}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if (el._id === item._id) {
                                                                        el.nombre = e.target.value
                                                                    }
                                                                    return el
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    required
                                                >
                                                    <Input
                                                        disabled
                                                        name='barcode'
                                                        placeholder='Codigo de barras de producto'
                                                        value={item.codigoBarras}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if (el._id === item._id) {
                                                                        el.codigoBarras = e.target.value
                                                                    }
                                                                    return el
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    required
                                                >
                                                    <Input
                                                        name='quantity'
                                                        placeholder='Cantidad'
                                                        type='number'
                                                        value={item.cantidadesSalientes}
                                                        disabled={(item.cantidadesFraccionadasSalientes) ? true : false}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if (el._id === item._id) {
                                                                        el.cantidadesSalientes = (!e.target.value) ? 0 : parseFloat(e.target.value)
                                                                    }
                                                                    return el
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    required
                                                >
                                                    <Input
                                                        name='fractionedQuantity'
                                                        placeholder='Cantidad fraccionada'
                                                        type='number'
                                                        value={item.cantidadesFraccionadasSalientes}
                                                        disabled={(item.cantidadesSalientes) ? true : false}
                                                        onChange={(e) => {
                                                            setSalida({
                                                                ...salida,
                                                                productos: salida.productos.map(el => {
                                                                    if (el._id === item._id) {
                                                                        el.cantidadesFraccionadasSalientes = (!e.target.value) ? 0 : parseFloat(e.target.value)
                                                                    }
                                                                    return el
                                                                })
                                                            })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <div onClick={
                                                    () => {
                                                        productSelectionModal_dispatch({ type: 'DELETE_PRODUCT', payload: productSelectionModal_state.selectedProducts.find(product => product._id === item._id) })
                                                    }
                                                }>
                                                    <Delete />
                                                </div>
                                            </Col>
                                        </Row>
                                    ))
                                    : null
                                }
                            </Col>
                            <Col span={24} align='start' style={{ display: 'flex' }}>
                                <Row>
                                    <Col span={12} style={{ display: 'flex' }}>
                                        <button
                                            className='btn-primary'
                                            onClick={() => handleSubmit()}
                                            style={{ marginRight: '15px' }}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            className='btn-secondary'
                                            onClick={() => { redirectToSalidas() }}
                                        >
                                            Cancelar
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                }
            </Col>
            <ProductSelectionModal />
        </Row>
    )
}

export default SalidasForm