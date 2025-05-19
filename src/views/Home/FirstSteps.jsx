// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import generics from '../../components/generics'
import { errorAlert, successAlert } from '../../components/alerts'

// Custom contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Row, Steps } from 'antd'
import dayjs from 'dayjs'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { useAuthContext } = contexts.Auth
const { useBusinessContext } = contexts.Business
const { useHomeContext } = contexts.Home
const { useSalePointContext } = contexts.SalePoint
const { Form, ProgressCircle } = generics
const {
    cuitParser,
    grossIncomeParser,
    phoneParser,
    salePointNumberParser
} = helpers.dataParserHelper
const { normalizeString } = helpers.stringHelper


const FirstSteps = () => {
    const [auth_state, auth_dispatch] = useAuthContext()
    const [business_state, business_dispatch] = useBusinessContext()
    const [home_state, home_dispatch] = useHomeContext()
    const [salePoint_state, salePoint_dispatch] = useSalePointContext()

    // -------------------------------------- Actions ---------------------------------------- //
    const isStep0Complete = async () => {
        const data = [
            { filter: JSON.stringify({ documentoReceptor: 86 }), service: 'clients' },
            { filter: JSON.stringify({ adicionaIva: false }), service: 'fiscalConditions' },
            { filter: JSON.stringify({ codigoUnico: '000' }), service: 'documents' },
            { filter: JSON.stringify({ surchargeDecimal: 0 }), service: 'salesAreas' },
            { filter: JSON.stringify({ fraccionamiento: 1 }), service: 'measureUnits' },
        ]
        const results = []
        for (let index = 0; index < data.length; index++) {
            const dataItem = data[index]
            const findResult = await api[dataItem.service].findAllByFilters(dataItem.filter)
            results.push(findResult.data.totalDocs)
        }
        if (results.includes(0)) return false
        else return true
    }
    
    const isStep1Complete = async () => {
        const findResult = await api.salePoints.findAll()
        if (findResult.data.length === 0) return false
        else return true
    }

    const isStep2Complete = async () => {
        const findResult = await api.business.findAll()
        if (findResult.data.length === 0) return false
        else return true
    }

    const reloadPage = () => {
        window.location.reload()
    }

    const setSelectOptionsForStep2 = async () => {
        if (home_state.firstSteps.activeStep !== 2) return
        const findSalePoints = await api.salePoints.findAll()
        const salePoints = findSalePoints.data.map(salepoint => {
            return { label: salepoint.nombre, value: salepoint._id }
        })
        const findFiscalConditions = await api.fiscalConditions.findAll()
        const fiscalConditions = findFiscalConditions.data.map(fiscalCondition => {
            return { label: fiscalCondition.nombre, value: fiscalCondition._id }
        })
        home_dispatch({ type: 'SET_SELECTS_OPTIONS_FOR_STEP_2_FISCAL_CONDITIONS', payload: fiscalConditions })
        home_dispatch({ type: 'SET_SELECTS_OPTIONS_FOR_STEP_2_SALE_POINTS', payload: salePoints })
    }

    const verifyStepsAreCompleted = async () => {
        let isComplete
        if (home_state.firstSteps.activeStep === 0) isComplete = await isStep0Complete()
        else if (home_state.firstSteps.activeStep === 1) isComplete = await isStep1Complete()
        else if (home_state.firstSteps.activeStep === 2) isComplete = await isStep2Complete()
        else isComplete = false
        home_dispatch({ type: 'SET_IS_ACTIVE_STEP_COMPLETED', payload: isComplete })
    }

    useEffect(() => {
        setSelectOptionsForStep2()
        // eslint-disable-next-line
    }, [home_state.firstSteps.activeStep])
    
    useEffect(() => {
        verifyStepsAreCompleted()
        // eslint-disable-next-line
    }, [home_state.firstSteps.activeStep, home_state.firstSteps.isActiveStepCompleted])

    // ---------------------------------- Button to finish ----------------------------------- //
    const finish = async () => {
        const verifyFinish = await isStep2Complete()
        if (!verifyFinish) return errorAlert('Debes registrar la empresa antes de finalizar.')
        else {
            const findBusiness = await api.business.findAll()
            const findSalePoint = await api.salePoints.findAll()
            const business = findBusiness.data[0]._id
            const salePoint = findSalePoint.data[0]._id
            const updatedUser = { ...auth_state.user, empresa: business, puntoVenta: salePoint }
            const res = await api.users.edit(updatedUser)
            if (res.status !== 'OK') return errorAlert('No se pudo completar el registro. Intente de nuevo.')
            auth_dispatch({ type: 'LOAD_USER', payload: updatedUser })
            const alertRes = await successAlert('¡Registros guardados exitosamente!')
            if (alertRes.isConfirmed) reloadPage()
        }
    }
    
    const buttonToFinish = (
        <Button
            onClick={finish}
            style={{ width: '100%' }}
            type='primary'
        >
            Finalizar
        </Button>
    )

    // ----------------------------------- Button to next ------------------------------------ //
    const setSalePoint = async () => {
        const isCurrentStep1 = home_state.firstSteps.activeStep === 1
        if (!isCurrentStep1) {
            return
        } else {
            const findRecord = await api.salePoints.findAll()
            if (findRecord.data.length === 0) {
                return
            } else {
                const salePoint = findRecord.data[0]
                salePoint_dispatch({ type: 'SET_NAME', payload: { fieldStatus: null, value: salePoint.nombre } })
                salePoint_dispatch({ type: 'SET_NUMBER', payload: { fieldStatus: null, value: salePoint.numero } })
            }
        }
    }

    const setBusiness = async () => {
        const isCurrentStep2 = home_state.firstSteps.activeStep === 2
        if (!isCurrentStep2) {
            return
        } else {
            const findUsers = await api.users.findAll()
            const email = findUsers.data[0].email
            const cuit = localStorage.getItem('tenantId')
            business_dispatch({ type: 'SET_CUIT', payload: { fieldStatus: null, value: cuit } })
            business_dispatch({ type: 'SET_EMAIL', payload: { fieldStatus: null, value: email } })
            const findBusiness = await api.business.findAll()
            if (findBusiness.data.length === 0) {
                return
            } else {
                const business = findBusiness.data[0]
                business_dispatch({ type: 'SET_BUSINESS_NAME', payload: { fieldStatus: null, value: business.razonSocial } })
                business_dispatch({ type: 'SET_ACTIVITY_DESCRIPTION', payload: { fieldStatus: null, value: business.actividad } })
                business_dispatch({ type: 'SET_START_ACTIVITIES_DATE', payload: {
                    fieldStatus: null,
                    datePickerValue: dayjs(business.fechaInicioActividad),
                    value: business.fechaInicioActividad
                }})
                business_dispatch({ type: 'SET_GROSS_INCOME', payload: { fieldStatus: null, value: business.ingresosBrutos } })
                business_dispatch({ type: 'SET_ADDRESS', payload: { fieldStatus: null, value: business.direccion } })
                business_dispatch({ type: 'SET_PHONE', payload: { fieldStatus: null, value: business.telefono } })
                business_dispatch({ type: 'SET_LOGO', payload: { fieldStatus: null, value: business.logo } })
                business_dispatch({ type: 'SET_FISCAL_CONDITION', payload: { fieldStatus: null, value: business.condicionFiscal._id } })
                business_dispatch({ type: 'SET_SALE_POINT', payload: { fieldStatus: null, value: business.puntosVenta[0]._id } })
            }
        }
    }

    useEffect(() => {
        setSalePoint()
        setBusiness()
        // eslint-disable-next-line
    }, [home_state.firstSteps.activeStep])

    const next = () => {
        const currentStep = home_state.firstSteps.activeStep
        home_dispatch({ type: 'SET_ACTIVE_STEP', payload: currentStep + 1 })
    }

    const buttonToNext = (
        <Button
            disabled={!home_state.firstSteps.isActiveStepCompleted}
            onClick={next}
            style={{ width: '100%' }}
            type='primary'
        >
            Siguiente
        </Button>
    )

    // --------------------------------- Button to previous ---------------------------------- //
    const prev = () => {
        const currentStep = home_state.firstSteps.activeStep
        home_dispatch({ type: 'SET_ACTIVE_STEP', payload: currentStep - 1 })
    }

    const buttonToPrevious = (
        <Button
            onClick={prev}
            style={{ width: '100%' }}
            type='default'
        >
            Anterior
        </Button>
    )

    // ---------------------------------------- Data ----------------------------------------- //
    const step0Data = {
        predata: [
            {
                source: [
                    { adicionaIva: false, nombre: 'Consumidor Final' },
                    { adicionaIva: true, nombre: 'Responsable Inscripto' },
                    { adicionaIva: true, nombre: 'Monotributista' },
                    { adicionaIva: false, nombre: 'Excento' }
                ],
                service: 'fiscalConditions',
                title: 'Condiciones fiscales'
            },
            {
                source: [
                    {
                        cashRegister: false,
                        codigoUnico: '000',
                        fiscal: false,
                        letra: 'X',
                        nombre: 'PRESUPUESTO',
                        normalizedName: normalizeString('PRESUPUESTO'),
                        presupuesto: true,
                        remito: false,
                        ticket: false
                    },
                    {
                        cashRegister: false,
                        codigoUnico: '000',
                        fiscal: false,
                        letra: 'X',
                        nombre: 'REMITO',
                        normalizedName: normalizeString('REMITO'),
                        presupuesto: false,
                        remito: true,
                        ticket: false
                    },
                    {
                        cashRegister: true,
                        codigoUnico: '000',
                        fiscal: false,
                        letra: 'X',
                        nombre: 'TICKET',
                        normalizedName: normalizeString('TICKET'),
                        presupuesto: false,
                        remito: false,
                        ticket: true
                    },
                    {
                        cashRegister: true,
                        codigoUnico: '011',
                        fiscal: true,
                        letra: 'C',
                        nombre: 'FACTURA',
                        normalizedName: normalizeString('FACTURA'),
                        presupuesto: false,
                        remito: false,
                        ticket: false
                    },
                    {
                        cashRegister: true,
                        codigoUnico: '012',
                        fiscal: true,
                        letra: 'C',
                        nombre: 'NOTA DEBITO',
                        normalizedName: normalizeString('NOTA DEBITO'),
                        presupuesto: false,
                        remito: false,
                        ticket: false
                    },
                    {
                        cashRegister: true,
                        codigoUnico: '013',
                        fiscal: true,
                        letra: 'C',
                        nombre: 'NOTA CREDITO',
                        normalizedName: normalizeString('NOTA CREDITO'),
                        presupuesto: false,
                        remito: false,
                        ticket: false
                    }
                ],
                service: 'documents',
                title: 'Documentos'
            },
            {
                source: [
                    {
                        arqueoCaja: true,
                        cierrez: true,
                        nombre: 'Contado',
                        normalizedName: normalizeString('Contado'),
                        planes: [{
                            _id: 1,
                            cuotas: 1,
                            nombre: 'Efectivo',
                            normalizedName: normalizeString('Efectivo'),
                            porcentaje: 0
                        }]
                    }
                ],
                service: 'paymentMethods',
                title: 'Medios de pago'
            },
            {
                source: [
                    { nombre: '1 Unid.', fraccionamiento: 1 }
                ],
                service: 'measureUnits',
                title: 'Unidades de medida'
            },
            {
                source: [
                    {
                        description: 'Local, sin variación.',
                        discountDecimal: 0,
                        discountPercentage: 0,
                        name: 'Default',
                        surchargeDecimal: 0,
                        surchargePercentage: 0
                    }
                ],
                service: 'salesAreas',
                title: 'Zonas de venta'
            }
        ],
        data: [
            {
                source: [
                    {
                        params: {
                            ciudad: '-',
                            cuit: '00000000000',
                            direccion: '-',
                            documentoReceptor: 86,
                            email: '-',
                            normalizedBusinessName: normalizeString('Consumidor final'),
                            provincia: '-',
                            razonSocial: 'Consumidor final',
                            receiverIvaCondition: 5,
                            telefono: '-',
                        },
                        predataService: [
                            {
                                prop: 'condicionFiscal',
                                query: { nombre: 'Consumidor Final' },
                                service: 'fiscalConditions'
                            }
                        ]
                    }
                ],
                service: 'clients',
                title: 'Clientes'
            }
        ],
        isCompleted: home_state.firstSteps.isActiveStepCompleted,
        isCompletedDispatch: home_dispatch,
        isCompletedType: 'SET_IS_ACTIVE_STEP_COMPLETED'
    }

    const step1Data = {
        fields: [
            {
                action: 'SET_NAME',
                datePickerValue: null,
                dispatch: salePoint_dispatch,
                key: 'nombre',
                label: 'Nombre',
                parser: null,
                selectOptions: null,
                status: salePoint_state.params.name.fieldStatus,
                type: 'input',
                value: salePoint_state.params.name.value
            },
            {
                action: 'SET_NUMBER',
                datePickerValue: null,
                dispatch: salePoint_dispatch,
                key: 'numero',
                label: 'Número',
                parser: salePointNumberParser,
                selectOptions: null,
                status: salePoint_state.params.number.fieldStatus,
                type: 'input',
                value: salePoint_state.params.number.value
            }
        ],
        isCompleted: home_state.firstSteps.isActiveStepCompleted,
        isCompletedDispatch: home_dispatch,
        isCompletedType: 'SET_IS_ACTIVE_STEP_COMPLETED',
        service: 'salePoints'
    }

    const step2Data = {
        fields: [
            {
                action: 'SET_BUSINESS_NAME',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'razonSocial',
                label: 'Razón social',
                parser: null,
                selectOptions: null,
                status: business_state.params.businessName.fieldStatus,
                type: 'input',
                value: business_state.params.businessName.value
            },
            {
                action: 'SET_CUIT',
                datePickerValue: null,
                disabled: true,
                dispatch: business_dispatch,
                key: 'cuit',
                label: 'Cuit',
                parser: cuitParser,
                selectOptions: null,
                status: business_state.params.cuit.fieldStatus,
                type: 'input',
                value: business_state.params.cuit.value
            },
            {
                action: 'SET_ACTIVITY_DESCRIPTION',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'actividad',
                label: 'Descripción actividad',
                parser: null,
                selectOptions: null,
                status: business_state.params.activityDescription.fieldStatus,
                type: 'input',
                value: business_state.params.activityDescription.value
            },
            {
                action: 'SET_START_ACTIVITIES_DATE',
                datePickerValue: business_state.params.startActivityDate.datePickerValue,
                dispatch: business_dispatch,
                key: 'fechaInicioActividad',
                label: 'Fecha inicio actividad',
                parser: null,
                selectOptions: null,
                status: business_state.params.startActivityDate.fieldStatus,
                type: 'datePicker',
                value: business_state.params.startActivityDate.value
            },
            {
                action: 'SET_GROSS_INCOME',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'ingresosBrutos',
                label: 'Ingresos brutos',
                parser: grossIncomeParser,
                selectOptions: null,
                status: business_state.params.grossIncome.fieldStatus,
                type: 'input',
                value: business_state.params.grossIncome.value
            },
            {
                action: 'SET_ADDRESS',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'direccion',
                label: 'Dirección',
                parser: null,
                selectOptions: null,
                status: business_state.params.address.fieldStatus,
                type: 'input',
                value: business_state.params.address.value
            },
            {
                action: 'SET_EMAIL',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'email',
                label: 'Email',
                parser: null,
                selectOptions: null,
                status: business_state.params.email.fieldStatus,
                type: 'input',
                value: business_state.params.email.value
            },
            {
                action: 'SET_PHONE',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'telefono',
                label: 'Teléfono',
                parser: phoneParser,
                selectOptions: null,
                status: business_state.params.phone.fieldStatus,
                type: 'input',
                value: business_state.params.phone.value
            },
            {
                action: 'SET_LOGO',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'logo',
                label: 'Logo',
                parser: null,
                selectOptions: null,
                status: business_state.params.logo.fieldStatus,
                type: 'uploader',
                value: business_state.params.logo.value
            },
            {
                action: 'SET_FISCAL_CONDITION',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'condicionFiscal',
                label: 'Condición fiscal',
                parser: null,
                selectOptions: home_state.firstSteps.selectsOptionsForStep2.fiscalConditions,
                status: business_state.params.fiscalCondition.fieldStatus,
                type: 'select',
                value: business_state.params.fiscalCondition.value
            },
            {
                action: 'SET_SALE_POINT',
                datePickerValue: null,
                dispatch: business_dispatch,
                key: 'puntosVenta',
                label: 'Punto de venta',
                parser: null,
                selectOptions: home_state.firstSteps.selectsOptionsForStep2.salePoints,
                status: business_state.params.salePoint.fieldStatus,
                type: 'select',
                value: business_state.params.salePoint.value
            }
        ],
        isCompleted: home_state.firstSteps.isActiveStepCompleted,
        isCompletedDispatch: home_dispatch,
        isCompletedType: 'SET_IS_ACTIVE_STEP_COMPLETED',
        service: 'business'
    }

    const steps = [
        {
            title: 'Configuraciones previas',
            content: <ProgressCircle data={step0Data} />
        },
        {
            title: 'Punto de venta',
            content: <Form data={step1Data} />
        },
        {
            title: 'Empresa',
            content: <Form data={step2Data} />
        }
    ]

    const items = steps.map(item => ({
        key: item.title,
        title: item.title,
    }))


    return (
        <>
            <Steps
                current={home_state.firstSteps.activeStep}
                items={items}
            />
            <div style={{ marginTop: 16 }}>{steps[home_state.firstSteps.activeStep].content}</div>
            <Row
                align='middle'
                justify='space-between'
                style={{ marginTop: 32 }}
            >
                {home_state.firstSteps.activeStep > 0 && (
                    <Col span={8}>
                        {buttonToPrevious}
                    </Col>
                )}
                {home_state.firstSteps.activeStep < steps.length - 1 && (
                    <Col span={8}>
                        {buttonToNext}
                    </Col>
                )}
                {home_state.firstSteps.activeStep === steps.length - 1 && (
                    <Col span={8}>
                        {buttonToFinish}
                    </Col>
                )}
            </Row>
        </>
    )
}

export default FirstSteps