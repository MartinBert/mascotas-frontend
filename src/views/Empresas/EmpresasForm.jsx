// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import graphics from '../../components/graphics'
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import dayjs from 'dayjs'
import { Col, DatePicker, Form, Input, Row, Select, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// Services
import api from '../../services'

// Imports Destructuring
const { Spinner } = graphics


const EmpresasForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [uploadedImages, setUploadedImages] = useState([])
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
        puntosVenta: [],
    })
    const [startActivityDateValue, setStartActivityDateValue] = useState('')

    const loadEmpresaData = (e) => {
        setEmpresa({
            ...empresa,
            [e.target.name]: e.target.value,
        })
    }

    const fetchEmpresa = async () => {
        if (id === 'nuevo') {
            setLoading(false)
            return
        }
        const findBusiness = await api.business.findById(id)
        const business = findBusiness.data
        setEmpresa({
            _id: business._id,
            razonSocial: business.razonSocial,
            cuit: business.cuit,
            actividad: business.actividad,
            fechaInicioActividad: business.fechaInicioActividad,
            ingresosBrutos: business.ingresosBrutos,
            direccion: business.direccion,
            telefono: business.telefono,
            email: business.email,
            logo: business.logo,
            condicionFiscal: business.condicionFiscal,
            puntosVenta: business.puntosVenta
        })
        setStartActivityDateValue(dayjs(business.fechaInicioActividad))
        setLoading(false)
    }

    useEffect(() => {
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

    // ------------- Pick start activity date ------------ //
    const [startActivityDateErrorStatus, setStartActivityDateErrorStatus] = useState(false)
    
    const onChangeStartActivityDate = (date, dateString) => {
        // console.log(dateString)
        setEmpresa({ ...empresa, fechaInicioActividad: date })
        setStartActivityDateValue(dayjs(dateString, 'DD-MM-YYYY'))
        setStartActivityDateErrorStatus(false)
    }
    
    const pickerStartActivityDate = (
        <>
            <DatePicker
                format={['DD-MM-YYYY']}
                onChange={onChangeStartActivityDate}
                placeholder='Seleccione fecha inicio act.'
                status={startActivityDateErrorStatus ? 'error' : null}
                style={{ width: '100%' }}
                value={startActivityDateValue}
            />
            <span
                style={{
                    color: 'red',
                    display: startActivityDateErrorStatus ? 'block' : 'none'
                }}
            >
                Debes elegir una fecha.
            </span>
        </>
    )

    // ------------- Select fiscal condition ------------- //
    const [fiscalConditionOptions, setFiscalConditionOptions] = useState([])
    const [fiscalConditionStatus, setFiscalConditionStatus] = useState(false)

    const onSearchFiscalCondition = async (e) => {
        const filters = JSON.stringify({ nombre: e })
        const findDocs = await api.fiscalConditions.findAllByFilters(filters)
        let options = []
        if (findDocs.status === 'OK' && findDocs.data.docs.length > 0) {
            options = findDocs.data.docs.map(doc => {
                const option = { label: doc.nombre, value: doc._id }
                return option
            })
        }
        setFiscalConditionOptions(options)
        setFiscalConditionStatus(false)
    }

    const onClearFiscalCondition = () => {
        setEmpresa({ ...empresa, condicionFiscal: null })
        setFiscalConditionOptions([])
        setFiscalConditionStatus(true)
    }

    const onSelectFiscalCondition = async (e) => {
        const findDoc = await api.fiscalConditions.findById(e)
        let fiscalCondition = null
        if (findDoc.status === 'OK' && findDoc.data) {
            fiscalCondition = findDoc.data
        }
        setEmpresa({ ...empresa, condicionFiscal: fiscalCondition })
        setFiscalConditionOptions([])
        setFiscalConditionStatus(false)
    }

    const selectFiscalCondition = (
        <Select
            allowClear
            filterOption={false}
            onClear={onClearFiscalCondition}
            onSearch={onSearchFiscalCondition}
            onSelect={onSelectFiscalCondition}
            options={fiscalConditionOptions}
            placeholder='Seleccione condición fiscal.'
            showSearch
            status={fiscalConditionStatus}
            style={{ width: '100%' }}
            value={empresa?.condicionFiscal?.nombre ?? null}
        />
    )

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
        setEmpresa({ ...empresa, puntosVenta: [] })
        setSalePointOptions([])
        setSalePointStatus(true)
    }

    const onSelectSalePoint = async (e) => {
        const findDoc = await api.salePoints.findById(e)
        let salePoint = []
        if (findDoc.status === 'OK' && findDoc.data) {
            salePoint = findDoc.data
        }
        setEmpresa({ ...empresa, puntosVenta: [salePoint] })
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
            value={empresa?.puntosVenta[0]?.nombre ?? null}
        />
    )


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
                        disabled
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
                    {pickerStartActivityDate}
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
                    {selectFiscalCondition}
                </Col>
                <Col span={6} style={{ marginBottom: '10px' }}>
                    {selectSalePoint}
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
