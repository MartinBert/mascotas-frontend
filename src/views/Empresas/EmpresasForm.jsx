// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import generics from '../../components/generics'
import graphics from '../../components/graphics'
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import { Row, Col, Form, Input, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// Services
import api from '../../services'

// Imports Destructuring
const { GenericAutocomplete } = generics
const { Spinner } = graphics


const EmpresasForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [uploadedImages, setUploadedImages] = useState([])
    const [selectedCondition, setSelectedCondition] = useState(null)
    const [selectedSalePoint, setSelectedSalePoint] = useState(null)
    const [loading, setLoading] = useState(true)
    const [empresa, setEmpresa] = useState({
        razonSocial: '',
        cuit: '',
        actividad: '',
        fechaInicioActividad: null,
        ingresosBrutos: '',
        direccion: '',
        telefono: '',
        email: '',
        logo: null,
        condicionFiscal: null,
        puntosVenta: null,
    })

    const loadEmpresaData = (e) => {
        setEmpresa({
            ...empresa,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        const fetchEmpresa = async () => {
            if (id === 'nuevo') {
                setLoading(false)
                return
            }
            const searchedItem = await api.business.findById(id)
            setEmpresa({
                _id: searchedItem.data._id,
                razonSocial: searchedItem.data.razonSocial,
                cuit: searchedItem.data.cuit,
                actividad: searchedItem.data.actividad,
                fechaInicioActividad: searchedItem.data.fechaInicioActividad,
                ingresosBrutos: searchedItem.data.ingresosBrutos,
                direccion: searchedItem.data.direccion,
                telefono: searchedItem.data.telefono,
                email: searchedItem.data.email,
                logo: searchedItem.data.logo,
                condicionFiscal: searchedItem.data.condicionFiscal,
                puntosVenta: searchedItem.data.puntosVenta
            })
            setSelectedCondition(searchedItem.data.condicionFiscal)
            setSelectedSalePoint(searchedItem.data.puntosVenta[0])
            setLoading(false)
        }
        fetchEmpresa()
    }, [empresa.razonSocial, id])

    const save = () => {
        if (!empresa.logo) empresa.logo = uploadedImages[0]

        const saveBusiness = async () => {
            const response = await api.business.save(empresa)
            if (response.status === 'OK') {
                successAlert('El registro fue grabado con exito')
                    .then(redirectToEmpresas())
            } else errorAlert('Error al guardar el registro')
        }

        const editBusiness = async () => {
            const response = await api.business.edit(empresa)
            if (response.status === 'OK') success()
            else fail()
        }

        if (id === 'nuevo') saveBusiness()
        else editBusiness()
    }

    const redirectToEmpresas = () => {
        navigate('/empresas')
    }

    const success = () => {
        successAlert('El registro se guardo en la base de datos').then(() => {
            redirectToEmpresas()
        })
    }

    const fail = () => {
        errorAlert('Error al guardar el registro')
    }

    const setSelectedConditionToBusiness = async (condition) => {
        setSelectedCondition(condition)
        setEmpresa({
            ...empresa,
            condicionFiscal: condition,
        })
    }

    const setSelectedSalePointToBusiness = async (salePoints) => {
        setSelectedSalePoint(salePoints)
        setEmpresa({
            ...empresa,
            puntosVenta: salePoints,
        })
    }

    const uploaderProps = {
        name: 'file',
        accept: '.jpg,.jpeg,.png',
        multiple: false,
        onChange: (info) => uploadImageToServer(info.file),
        onRemove: () => removeImage(uploadedImages[0]._id),
        beforeUpload: () => false
    }

    const uploadImageToServer = async (file) => {
        const response = await api.uploader.uploadImage(file)
        if (response.file) {
            setUploadedImages(response.file)
            return response.code
        }
    }

    const removeImage = async (id) => {
        const response = await api.uploader.deleteImage(id)
        setUploadedImages([])
        return response
    }

    return loading ? (
        <Spinner />
    ) : (
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
                    <h1>{id === 'nuevo' ? 'Crear nueva empresa' : 'Editar empresa'}</h1>
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <Input
                        name='razonSocial'
                        placeholder='Razón social'
                        value={empresa.razonSocial}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <Input
                        name='cuit'
                        placeholder='CUIT'
                        value={empresa.cuit}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <Input
                        name='telefono'
                        placeholder='Teléfono'
                        value={empresa.telefono}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <Input
                        name='email'
                        placeholder='Email'
                        value={empresa.email}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={12} style={{ marginBottom: '10px' }}>
                    <Input
                        name='direccion'
                        placeholder='Dirección'
                        value={empresa.direccion}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={12} style={{ marginBottom: '10px' }}>
                    <Input
                        name='actividad'
                        placeholder='Actividad principal'
                        value={empresa.actividad}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <Input
                        name='fechaInicioActividad'
                        placeholder='Fecha de inicio de actividad'
                        value={empresa.fechaInicioActividad}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <Input
                        name='ingresosBrutos'
                        placeholder='Ingresos brutos'
                        value={empresa.ingresosBrutos}
                        onChange={(e) => {
                            loadEmpresaData(e)
                        }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <GenericAutocomplete
                        label='Condición Fiscal'
                        modelToFind='condicionfiscal'
                        keyToCompare='nombre'
                        controller='condicionesfiscales'
                        returnCompleteModel={true}
                        setResultSearch={setSelectedConditionToBusiness}
                        selectedSearch={selectedCondition}
                        styles={{ backgroundColor: '#fff' }}
                    />
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    <GenericAutocomplete
                        label='Punto de venta'
                        // multiple={true}
                        modelToFind='puntoventa'
                        keyToCompare='nombre'
                        controller='puntosventa'
                        returnCompleteModel={true}
                        setResultSearch={setSelectedSalePointToBusiness}
                        selectedSearch={selectedSalePoint}
                        styles={{ backgroundColor: '#fff' }}
                    />
                </Col>
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <Upload {...uploaderProps}>
                        <button
                            style={{ width: '200px', marginBottom: 0 }}
                            type='button'
                            className='btn-primary'
                            icon={<UploadOutlined />}
                            disabled={uploadedImages.length > 0 ? true : false}
                        >
                            Subir logo
                        </button>
                    </Upload>
                </Col>
                <Col span={6} style={{ display: 'flex' }}>
                    <button
                        className='btn-primary'
                        onClick={() => save()}
                    >
                        Guardar
                    </button>
                    <button
                        className='btn-secondary'
                        type='button'
                        onClick={() => {
                            redirectToEmpresas()
                        }}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancelar
                    </button>
                </Col>
            </Row>
        </Form>
    )
}

export default EmpresasForm
