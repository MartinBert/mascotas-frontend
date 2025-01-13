// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert, warningAlert } from '../../../components/alerts'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Services
import api from '../../../services'

// Imports Destructuring
const { useFiscalNoteModalContext } = contexts.FiscalNoteModal
const { Item } = Form
const { formatBody, findNextVoucherNumber_fiscal, fiscalVouchersCodes, creditCodes, debitCodes } = helpers.afipHelper
const { existsProperty, spanishVoucherDataToSave } = helpers.objHelper
const { roundToMultiple, decimalPercent } = helpers.mathHelper
const { createCreditNotePdf, createDebitNotePdf, validations } = helpers.pdfHelper

const { getAssociatedData } = validations


const existsFiscalNoteParams = (state) => {
    if (
        !state
        || !existsProperty(state.params.fiscalNote, 'codigoUnico')
        || !existsProperty(state.params.referenceVoucher, 'empresaCuit')
        || !existsProperty(state.params.referenceVoucher, 'puntoVentaNumero')
    ) return false
    return true
}

const stateIsLoading = (state) => {
    if (
        state.loadingFiscalNote
        || state.loadingPaymentMethod
        || state.loadingSavingOperation
    ) return true
    return false
}

const validateFiscalNotes = (state) => {
    if (!state.creditNote || !state.debitNote) {
        errorAlert('Ocurrió un error, intente de nuevo.')
        window.location.reload()
    }
    return true
}


const FiscalNoteModal = () => {
    const [form] = Form.useForm()
    const [fiscalNoteModal_state, fiscalNoteModal_dispatch] = useFiscalNoteModalContext()

    // ---------------------- ACTIONS --------------------------------------------------------------------------- //
    const cancel = () => {
        fiscalNoteModal_dispatch({ type: 'CLEAR_STATE' })
    }

    const clearInputs = () => {
        fiscalNoteModal_dispatch({ type: 'CLEAR_INPUTS' })
    }

    const save = async () => {
        fiscalNoteModal_dispatch({ type: 'SET_LOADING_SAVING_OPERATION', payload: true })

        // Generate and set CAE
        const bodyToAfip = formatBody(fiscalNoteModal_state.afipRequestData)
        const responseOfAfip = await api.afip.generateVoucher(
            fiscalNoteModal_state.params.user.empresa.cuit,
            bodyToAfip
        )
        if (!responseOfAfip) return errorAlert('Ocurrió un error en el procesamiento con AFIP, inténtelo de nuevo.')

        // Save fiscal note
        const fiscalNoteParams = {
            ...spanishVoucherDataToSave(fiscalNoteModal_state.params),
            cae: responseOfAfip.CAE,
            fiscalNoteConcept: fiscalNoteModal_state.params.concept,
            user: fiscalNoteModal_state.params.user._id,
            vencimientoCae: responseOfAfip.CAEFchVto
        }

        const result = await api.ventas.save(fiscalNoteParams)
        if (result.code === 500) warningAlert('Se procesó exitosamente la solicitud con AFIP, pero no se pudo guardar el registro en el sistema. Sin embargo, es posible recuperarlo desde AFIP.')

        // Save daily business statistic
        const filters = JSON.stringify({ dateString: fiscalNoteModal_state.params.dateString.substring(0, 10) })
        const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
        const statisticToEdit = findStatisticToEdit.docs[0] || null
        const addedExpense = fiscalNoteModal_state.creditNote !== null
            ? fiscalNoteModal_state.params.amountNet
            : fiscalNoteModal_state.params.ivaTotal
        const addedIncome = fiscalNoteModal_state.debitNote !== null
            ? fiscalNoteModal_state.params.amountNet - fiscalNoteModal_state.params.ivaTotal
            : 0
        if (statisticToEdit) {
            const editedStatistic = {
                ...statisticToEdit,
                balanceViewExpense: statisticToEdit.balanceViewExpense + addedExpense,
                balanceViewIncome: statisticToEdit.balanceViewIncome + addedIncome,
                balanceViewProfit: statisticToEdit.balanceViewProfit - addedExpense + addedIncome,
                salesViewExpense: statisticToEdit.salesViewExpense + addedExpense,
                salesViewIncome: statisticToEdit.salesViewIncome + addedIncome,
                salesViewProfit: statisticToEdit.salesViewProfit - addedExpense + addedIncome,
            }
            await api.dailyBusinessStatistics.edit(editedStatistic)
        } else {
            const newStatistic = {
                balanceViewExpense: addedExpense,
                balanceViewIncome: addedIncome,
                balanceViewProfit: addedIncome - addedExpense,
                concept: 'Generado automáticamente',
                date: new Date(fiscalNoteModal_state.params.dateString.substring(0, 10)),
                dateString: fiscalNoteModal_state.params.dateString.substring(0, 10),
                salesViewExpense: addedExpense,
                salesViewIncome: addedIncome,
                salesViewProfit: addedIncome - addedExpense,
            }
            await api.dailyBusinessStatistics.save(newStatistic)
        }

        // Create document
        const associatedData = await getAssociatedData(fiscalNoteModal_state.params)

        const fiscalNoteData = {
            ...spanishVoucherDataToSave(fiscalNoteModal_state.params),
            cae: responseOfAfip.CAE,
            caeExpirationDate: responseOfAfip.CAEFchVto,
            fiscalNoteConcept: fiscalNoteModal_state.params.concept
        }

        const fiscalNoteCode = fiscalNoteModal_state.params.fiscalNote.codigoUnico
        if (creditCodes.includes(fiscalNoteCode)) await createCreditNotePdf(fiscalNoteData, associatedData)
        else if (debitCodes.includes(fiscalNoteCode)) await createDebitNotePdf(fiscalNoteData, associatedData)
        else return (
            warningAlert('Se procesó exitosamente la solicitud con AFIP, pero no se pudo generar el comprobante de la operación. Intente generarlo desde el menú del sistema o recuperando el registro desde AFIP.')
                .then(() => fiscalNoteModal_dispatch({ type: 'CLEAR_STATE' }))
        )

        fiscalNoteModal_dispatch({ type: 'CLEAR_STATE' })
        successAlert('Nota fiscal procesada y registrada.')
    }

    // ---------------------- CALCULATE IVA --------------------------------------------------------------------- //
    const calculateIva = async () => {
        if (!fiscalNoteModal_state.params.fiscalNote) return
        fiscalNoteModal_dispatch({ type: 'CALCULATE_IVA' })
    }

    useEffect(() => {
        calculateIva()
        // eslint-disable-next-line
    }, [
        fiscalNoteModal_state.params.amountGross,
        fiscalNoteModal_state.params.amountNet,
        fiscalNoteModal_state.params.fiscalNote,
        fiscalNoteModal_state.params.paymentPlan
    ])

    // ---------------------- GENERATE AFIP REQUEST DATA ---------------------------------------------------------- //
    const generateAfipRequestData = async () => {
        fiscalNoteModal_dispatch({ type: 'GENERATE_AFIP_REQUEST_DATA' })
    }

    useEffect(() => {
        generateAfipRequestData()
        // eslint-disable-next-line
    }, [
        fiscalNoteModal_state.params.amountNet,
        fiscalNoteModal_state.params.fiscalNote,
        fiscalNoteModal_state.params.iva10,
        fiscalNoteModal_state.params.iva21,
        fiscalNoteModal_state.params.iva27,
        fiscalNoteModal_state.params.referenceVoucher,
    ])

    // ---------------------- UPDATE FISCAL NOTE ----------------------------------------------------------------- //
    const findAndSetVoucherNumber = async () => {
        const validation = existsFiscalNoteParams(fiscalNoteModal_state)
        if (!validation) return
        const number = await findNextVoucherNumber_fiscal(
            fiscalNoteModal_state.params.fiscalNote.codigoUnico,
            fiscalNoteModal_state.params.referenceVoucher.empresaCuit,
            fiscalNoteModal_state.params.referenceVoucher.puntoVentaNumero
        )
        fiscalNoteModal_dispatch({ type: 'SET_FISCAL_NOTE_NUMBER', payload: number })
    }

    const updateRenderCondition = () => {
        if (!fiscalNoteModal_state.params.fiscalNote) return
        const selectedFiscalNoteCode = fiscalNoteModal_state.params.fiscalNote.codigoUnico
        let payload
        if (debitCodes.includes(selectedFiscalNoteCode)) payload = true
        else payload = false
        fiscalNoteModal_dispatch({ type: 'SET_RENDER_CONDITION', payload: payload })
    }

    const updateFiscalNote = async () => {
        fiscalNoteModal_dispatch({ type: 'SET_LOADING_FISCAL_NOTE', payload: true })
        findAndSetVoucherNumber()
        updateRenderCondition()
        const params = {
            ...fiscalNoteModal_state.params,
            paymentMethod: null,
            paymentMethodName: null,
            paymentPlan: null,
            paymentPlanName: null
        }
        fiscalNoteModal_dispatch({ type: 'SET_VALUES', payload: params })
        fiscalNoteModal_dispatch({ type: 'SET_LOADING_FISCAL_NOTE', payload: false })
    }

    useEffect(() => {
        updateFiscalNote()
        // eslint-disable-next-line
    }, [fiscalNoteModal_state.params.fiscalNote])

    // ---------------------- UPDATE FORM FIELDS ----------------------------------------------------------------- //
    const updateFormFields = async () => {
        form.setFieldsValue({
            amountGross: fiscalNoteModal_state.params.amountGross,
            amountNet: fiscalNoteModal_state.params.amountNet,
            client: fiscalNoteModal_state.params.referenceVoucher.clienteRazonSocial,
            concept: fiscalNoteModal_state.params.concept,
            date: fiscalNoteModal_state.params.referenceVoucher.fechaEmisionString,
            fiscalNote: fiscalNoteModal_state.params.fiscalNote
                ? fiscalNoteModal_state.params.fiscalNote.nombre
                : null,
            paymentMethods: fiscalNoteModal_state.params.paymentMethodName,
            paymentPlans: fiscalNoteModal_state.params.paymentPlanName,
            total: fiscalNoteModal_state.params.referenceVoucher.total,
        })
    }

    useEffect(() => {
        updateFormFields()
        // eslint-disable-next-line
    }, [
        fiscalNoteModal_state.params.amountGross,
        fiscalNoteModal_state.params.referenceVoucher,
        fiscalNoteModal_state.params.concept,
        fiscalNoteModal_state.params.fiscalNote,
        fiscalNoteModal_state.params.paymentMethodName,
        fiscalNoteModal_state.params.paymentPlanName
    ])

    // ---------------------- UPDATE PARAMS ---------------------------------------------------------------------- //
    const dispatchValues = (target, value) => {
        const params = { ...fiscalNoteModal_state.params }
        for (let index = 0; index < target.length; index++) {
            const newTarget = target[index]
            const newValue = value[index]
            params[newTarget] = newValue
        }
        fiscalNoteModal_dispatch({ type: 'SET_VALUES', payload: params })
    }

    // If CREDIT note, auto fill no-renderable fields with this values
    const setNoRenderableValues = async () => {
        if (!fiscalNoteModal_state.params.fiscalNote) return
        if (debitCodes.includes(fiscalNoteModal_state.params.fiscalNote.codigoUnico)) return
        const amountGross = fiscalNoteModal_state.params.amountNet
        const amountRounded = roundToMultiple(amountGross, 10)
        const filters = JSON.stringify({ $or: [{ nombre: 'Contado' }, { nombre: 'Efectivo' }] })
        const findPaymentMethod = await api.mediospago.findAllByFilters(filters)
        const paymentMethod = findPaymentMethod.docs
        const [paymentPlan] = paymentMethod.map(method => method.planes)
        const propsForCreditNote = {
            amountDifference: amountRounded - amountGross,
            amountGross: amountGross,
            amountRounded: amountRounded,
            paymentMethod: paymentMethod,
            paymentMethodName: paymentMethod.map(method => method.nombre),
            paymentPlan: paymentPlan,
            paymentPlanName: paymentPlan.map(plan => plan.nombre)
        }
        const target = Object.keys(propsForCreditNote)
        const value = Object.values(propsForCreditNote)
        dispatchValues(target, value)
    }

    useEffect(() => {
        setNoRenderableValues()
        // eslint-disable-next-line
    }, [fiscalNoteModal_state.params.fiscalNote])

    const inputAmountGross = (e) => {
        const planFactor = fiscalNoteModal_state.params.paymentPlan
            ? 1 + decimalPercent(fiscalNoteModal_state.params.paymentPlan[0].porcentaje)
            : 1
        const amountGross = e
        const amountNet = e * planFactor
        const amountRounded = roundToMultiple(amountNet, 10)
        const amountDifference = amountRounded - amountNet
        const profit = amountNet
        const target = ['amountDifference', 'amountGross', 'amountNet', 'amountRounded', 'profit']
        const value = [amountDifference, amountGross, amountNet, amountRounded, profit]
        dispatchValues(target, value)
    }

    const inputAmountNet = (e) => {
        const isCredit = creditCodes.includes(fiscalNoteModal_state.params.fiscalNote.codigoUnico)
        const planFactor = fiscalNoteModal_state.params.paymentPlan
            ? 1 + decimalPercent(fiscalNoteModal_state.params.paymentPlan[0].porcentaje)
            : 1
        const amountGross = e / planFactor
        const amountNet = e
        const amountRounded = roundToMultiple(amountNet, 10)
        const amountDifference = amountRounded - amountNet
        const profit = isCredit ? - amountNet : amountNet
        const target = ['amountDifference', 'amountGross', 'amountNet', 'amountRounded', 'profit']
        const value = [amountDifference, amountGross, amountNet, amountRounded, profit]
        dispatchValues(target, value)
    }

    const inputConcept = (e) => {
        const target = [e.target.id]
        const value = [e.target.value]
        dispatchValues(target, value)
    }

    const selectFiscalNote = (e) => {
        validateFiscalNotes(fiscalNoteModal_state)
        const target = ['fiscalNote']
        const value = [fiscalNoteModal_state[e]]
        dispatchValues(target, value)
    }

    const selectPaymentMethod = (e) => {
        const method = fiscalNoteModal_state.allPaymentMethods.filter(method => method.nombre === e)
        const amountGross = 0
        const amountNet = 0
        const paymentPlan = null
        const paymentPlanName = null
        const target = ['amountGross', 'amountNet', 'paymentPlan', 'paymentPlanName', 'paymentMethod', 'paymentMethodName']
        const value = [amountGross, amountNet, paymentPlan, paymentPlanName, method, e]
        dispatchValues(target, value)
    }

    const selectPaymentPlan = (e) => {
        const plan = fiscalNoteModal_state.allPaymentPlans.filter(plan => plan.nombre === e)
        const amountGross = 0
        const amountNet = 0
        const target = ['amountGross', 'amountNet', 'paymentPlan', 'paymentPlanName']
        const value = [amountGross, amountNet, plan, e]
        dispatchValues(target, value)
    }

    // ---------------------- UPDATE PAYMENT METHOD -------------------------------------------------------------- //
    const loadPaymentPlans = async () => {
        const paymentMethodName = fiscalNoteModal_state.params.paymentMethodName
        if (!paymentMethodName) return
        fiscalNoteModal_dispatch({ type: 'SET_LOADING_PAYMENT_METHOD', payload: true })
        const filters = JSON.stringify({ nombre: paymentMethodName })
        const findSelectedPaymentMethod = await api.mediospago.findAllByFilters(filters)
        const [selectedPaymentMethod] = findSelectedPaymentMethod.docs
        const paymentPlans = selectedPaymentMethod.planes
        const paymentPlansNames = paymentPlans.map(plan => plan.nombre)
        fiscalNoteModal_dispatch({ type: 'SET_ALL_PAYMENT_PLANS', payload: { paymentPlans, paymentPlansNames } })
        fiscalNoteModal_dispatch({ type: 'SET_LOADING_PAYMENT_METHOD', payload: false })
    }

    useEffect(() => {
        loadPaymentPlans()
        // eslint-disable-next-line
    }, [fiscalNoteModal_state.params.paymentMethodName])

    // ---------------------- UPDATE REFERENCE VOUCHER ------------------------------------------------------------ //
    const loadFiscalNotesData = async () => {
        const referenceVoucher = fiscalNoteModal_state.params.referenceVoucher
        if (!existsProperty(referenceVoucher, 'documento')) return

        // Load User
        const userId = localStorage.getItem('userId')
        const loggedUser = await api.usuarios.findById(userId)
        fiscalNoteModal_dispatch({ type: 'SET_USER', payload: loggedUser })

        // Load Payment Methods
        const findPaymentMethods = await api.mediospago.findAll()
        const paymentMethods = findPaymentMethods.docs
        const paymentMethodsNames = paymentMethods.map(method => method.nombre)
        fiscalNoteModal_dispatch({ type: 'SET_ALL_PAYMENT_METHODS', payload: { paymentMethods, paymentMethodsNames } })

        // Load Debit and Credit Notes
        const referenceVoucherCode = fiscalNoteModal_state.params.referenceVoucher.documento.codigoUnico
        const associatedFiscalNotesCodes = fiscalVouchersCodes[fiscalVouchersCodes.indexOf(referenceVoucherCode) + 1]
        const creditNote = await api.documentos.findByCode(associatedFiscalNotesCodes.credit)
        const debitNote = await api.documentos.findByCode(associatedFiscalNotesCodes.debit)
        fiscalNoteModal_dispatch({ type: 'SET_CREDIT_NOTE', payload: creditNote })
        fiscalNoteModal_dispatch({ type: 'SET_DEBIT_NOTE', payload: debitNote })
    }

    useEffect(() => {
        loadFiscalNotesData()
        // eslint-disable-next-line
    }, [fiscalNoteModal_state.params.referenceVoucher])

    // ---------------------- RENDER DATA ------------------------------------------------------------------------ //
    const formRender = [
        {
            element: (
                <Row>
                    <Col span={20}>
                        <Item
                            label=''
                            name='fiscalNote'
                            rules={[{
                                message: '¡Debes especificar cuál nota fiscal emitir!',
                                required: true
                            }]}
                        >
                            <Select
                                onChange={e => selectFiscalNote(e)}
                                options={[
                                    { label: 'NOTA CREDITO', value: 'creditNote' },
                                    { label: 'NOTA DEBITO', value: 'debitNote' }
                                ]}
                                placeholder='Selecciona la nota fiscal'
                                value={fiscalNoteModal_state.params.fiscalNote}
                            />
                        </Item>
                    </Col>
                    <Col span={4}>
                        {
                            !fiscalNoteModal_state.loadingFiscalNote
                                ? null
                                : <div style={{ display: 'flex', justifyContent: 'center' }}><Spin /></div>
                        }
                    </Col>
                </Row>
            ),
            label: 'Nota Fiscal',
            name: '',
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 },
            renderable: true,
            rules: []
        },
        {
            element: (
                <Row>
                    <Col span={20}>
                        <Item
                            label=''
                            name='paymentMethods'
                            rules={[{
                                message: '¡Debes especificar el método de pago!',
                                required: true
                            }]}
                        >
                            <Select
                                filterSort={(method_A, method_B) => (method_A.value > method_B.value) ? 1 : -1}
                                onChange={e => selectPaymentMethod(e)}
                                options={
                                    fiscalNoteModal_state.allPaymentMethodsNames.map(methodName => {
                                        return { label: methodName, value: methodName }
                                    })
                                }
                                placeholder='Selecciona el método de pago'
                            />
                        </Item>
                    </Col>
                    <Col span={4}>
                        {
                            !fiscalNoteModal_state.loadingPaymentMethod
                                ? null
                                : <div style={{ display: 'flex', justifyContent: 'center' }}><Spin /></div>
                        }
                    </Col>
                </Row>
            ),
            label: 'Método de Pago',
            name: '',
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 },
            renderable: fiscalNoteModal_state.isRenderable,
            rules: []
        },
        {
            element: (
                <Row gutter={8}>
                    <Col span={20}>
                        <Item
                            label=''
                            name='paymentPlans'
                            rules={[{
                                message: '¡Debes especificar el plan de pago!',
                                required: true
                            }]}
                        >
                            <Select
                                filterSort={(method_A, method_B) => (method_A.value > method_B.value) ? 1 : -1}
                                onChange={e => selectPaymentPlan(e)}
                                options={
                                    fiscalNoteModal_state.allPaymentPlansNames.map(planName => {
                                        return { label: planName, value: planName }
                                    })
                                }
                                placeholder='Selecciona el plan de pago'
                            />
                        </Item>
                    </Col>
                    <Col span={4}>
                        {
                            !fiscalNoteModal_state.params.paymentPlan
                                ? null
                                : `(% ${fiscalNoteModal_state.params.paymentPlan[0].porcentaje})`
                        }
                    </Col>
                </Row>
            ),
            label: 'Plan de Pago',
            name: '',
            order: { lg: 6, md: 6, sm: 7, xl: 6, xs: 7, xxl: 6 },
            renderable: fiscalNoteModal_state.isRenderable,
            rules: []
        },
        {
            element: (
                <Row gutter={8}>
                    {
                        !fiscalNoteModal_state.isRenderable
                            ? null
                            : (
                                <Col span={16}>
                                    <Item
                                        label='Monto Bruto (incluye IVA)'
                                        name='amountGross'
                                        rules={[{
                                            message: '¡El monto especificado debe ser mayor o igual que $0,01!',
                                            min: 0.01,
                                            required: true,
                                            type: 'number'
                                        }]}
                                    >
                                        <InputNumber
                                            id='amountGross'
                                            onChange={e => inputAmountGross(e)}
                                            style={{ width: '100%' }}
                                            value={fiscalNoteModal_state.params.amountGross}
                                        />
                                    </Item>
                                </Col>
                            )
                    }
                    <Col span={8}>
                        <Item
                            label='Neto'
                            name='amountNet'
                            rules={[{
                                message: '¡El monto especificado debe ser mayor o igual que $0,01!',
                                min: 0.01,
                                required: true,
                                type: 'number'
                            }]}
                        >
                            <InputNumber
                                id='amountNet'
                                onChange={e => inputAmountNet(e)}
                                style={{ width: '100%' }}
                                value={fiscalNoteModal_state.params.amountNet}
                            />
                        </Item>
                    </Col>
                </Row>
            ),
            label: '',
            name: '',
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 },
            renderable: true,
            rules: []
        },
        {
            element: <Input disabled />,
            label: 'Cliente',
            name: 'client',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 },
            renderable: true,
            rules: [{
                message: '¡Debes especificar el cliente de referencia!',
                required: true
            }]
        },
        {
            element: (
                <Input
                    id='concept'
                    onChange={e => inputConcept(e)}
                    placeholder='Descripción de la nota fiscal'
                    value={fiscalNoteModal_state.params.concept}
                />
            ),
            label: 'Concepto',
            name: 'concept',
            order: { lg: 2, md: 2, sm: 5, xl: 2, xs: 5, xxl: 2 },
            renderable: true,
            rules: [{
                message: '¡Debes especificar el motivo de emisión de la nota fiscal!',
                required: true
            }]
        },
        {
            element: <Input disabled />,
            label: 'Fecha',
            name: 'date',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 },
            renderable: true,
            rules: [{
                message: '¡Debes especificar la fecha de referencia!',
                required: true
            }]
        },
        {
            element: <InputNumber disabled style={{ width: '100%' }} />,
            label: 'Importe',
            name: 'total',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 },
            renderable: true,
            rules: [{
                message: '¡Debes especificar como referencia un importe mayor o igual que $0,01!',
                min: 0.01,
                required: true,
                type: 'number'
            }]
        }
    ]

    const formRenderButtons = [
        {
            element: (
                <Button
                    danger
                    disabled={fiscalNoteModal_state.loadingSavingOperation}
                    onClick={() => cancel()}
                    style={{ width: '100%' }}
                    type='primary'
                >
                    Cancelar
                </Button>
            )
        },
        {
            element: (
                <Button
                    danger
                    disabled={fiscalNoteModal_state.loadingSavingOperation}
                    htmlType='reset'
                    style={{ width: '100%' }}
                    type='default'
                >
                    Reiniciar
                </Button>
            )
        },
        {
            element: (
                <Button
                    disabled={
                        stateIsLoading(fiscalNoteModal_state)
                            ? true
                            : false
                    }
                    htmlType='submit'
                    style={{ width: '100%' }}
                    type='primary'
                >
                    Emitir
                </Button>
            )
        }
    ]

    const initialValues = {
        client: fiscalNoteModal_state.params.referenceVoucher.clienteRazonSocial,
        date: fiscalNoteModal_state.params.referenceVoucher.fechaEmisionString,
        total: fiscalNoteModal_state.params.referenceVoucher.total,

    }

    const responsiveGrid = { horizontal: 8, lg: 12, md: 12, sm: 24, vertical: 8, xl: 12, xs: 24, xxl: 12 }


    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            forceRender
            okButtonProps={{ style: { display: 'none' } }}
            open={fiscalNoteModal_state.fiscalNoteModalIsVisible}
            width={1200}
        >
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={() => save()}
                onResetCapture={() => clearInputs()}
            >
                <Row gutter={[responsiveGrid.horizontal, responsiveGrid.vertical]}>
                    {
                        formRender.map((item, index) => {
                            return (
                                <Col
                                    key={'fiscalNoteModal_' + index}
                                    lg={{ order: item.order.lg, span: responsiveGrid.lg }}
                                    md={{ order: item.order.md, span: responsiveGrid.md }}
                                    sm={{ order: item.order.sm, span: responsiveGrid.sm }}
                                    xl={{ order: item.order.xl, span: responsiveGrid.xl }}
                                    xs={{ order: item.order.xs, span: responsiveGrid.xs }}
                                    xxl={{ order: item.order.xxl, span: responsiveGrid.xxl }}
                                >
                                    {
                                        !item.renderable
                                            ? null
                                            : (
                                                <Item label={item.label} name={item.name} rules={item.rules}>
                                                    {item.element}
                                                </Item>
                                            )
                                    }
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row justify='space-around'>
                    {
                        formRenderButtons.map((item, index) => {
                            return (
                                <Col key={'fiscalNoteModalButtons_' + index} span={6}>
                                    <Item>
                                        {item.element}
                                    </Item>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Form>
        </Modal >
    )
}

export default FiscalNoteModal