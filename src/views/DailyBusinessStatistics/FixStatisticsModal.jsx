// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd'

// Services
import api from '../../services'

// Imports Destructuring
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { useInterfaceStylesContext } = contexts.InterfaceStyles


const FixStatisticsModal = () => {
    const [form] = Form.useForm()
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()
    const [interfaceStyles_state] = useInterfaceStylesContext()

    // ---------------------- ACTIONS --------------------------------------------------------------------------- //
    const cancel = () => {
        dailyBusinessStatistics_dispatch({ type: 'CLEAR_STATE' })
    }

    const clearInputs = () => {
        dailyBusinessStatistics_dispatch({ type: 'CLEAR_INPUTS' })
    }

    const save = async () => {
        const response = await api.dailyBusinessStatistics.save(dailyBusinessStatistics_state.params)
        dailyBusinessStatistics_dispatch({ type: 'CLEAR_STATE' })
        if (response.status !== 'OK') return errorAlert('No se pudo guardar el registro, intente de nuevo más tarde.')
        else return successAlert('Registro guardado con éxito.')
    }

    // ---------------------- UPDATE FORM FIELDS ----------------------------------------------------------------- //
    const updateFields = () => {
        form.setFieldsValue({
            concept: dailyBusinessStatistics_state.params.concept,
            balanceViewExpense: dailyBusinessStatistics_state.params.balanceViewExpense,
            balanceViewIncome: dailyBusinessStatistics_state.params.balanceViewIncome
        })
    }

    const updateReferenceFields = () => {
        form.setFieldsValue({
            referenceStatistics_concept: dailyBusinessStatistics_state.referenceStatistics.concept,
            referenceStatistics_dateString: dailyBusinessStatistics_state.referenceStatistics.dateString,
            referenceStatistics_dailyProfit: interfaceStyles_state.typeOfStatisticsView === 'balance'
                ? dailyBusinessStatistics_state.referenceStatistics.balanceViewProfit
                : dailyBusinessStatistics_state.referenceStatistics.salesViewProfit
        })
    }

    useEffect(() => {
        updateFields()
        // eslint-disable-next-line
    }, [dailyBusinessStatistics_state.params])

    useEffect(() => {
        updateReferenceFields()
        // eslint-disable-next-line
    }, [dailyBusinessStatistics_state.referenceStatistics])

    // ---------------------- UPDATE PARAMS ---------------------------------------------------------------------- //
    const updateValues = (e, targetID = null) => {
        let target
        let value
        if (targetID) {
            target = targetID
            value = e
        } else {
            target = e.target.id
            value = e.target.value
        }
        const params = {
            ...dailyBusinessStatistics_state.params,
            [target]: value
        }
        dailyBusinessStatistics_dispatch({ type: 'SAVE_DAILY_STATISTICS', payload: params })
    }

    const updateValuesOnBlur = (e, targetID) => {
        if (e.target.value > 0) return
        const params = {
            ...dailyBusinessStatistics_state.params,
            [targetID]: 0
        }
        dailyBusinessStatistics_dispatch({ type: 'SAVE_DAILY_STATISTICS', payload: params })
    }


    const formRender = [
        {
            element: (
                <Input
                    disabled
                    id='referenceStatistics_concept'
                    style={{ color: '#424949' }}
                    value={dailyBusinessStatistics_state.referenceStatistics.concept}
                />
            ),
            label: 'Concepto de referencia',
            name: 'referenceStatistics_concept',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 },
            rules: [{
                message: '¡Debes especificar el concepto de referencia!',
                required: true
            }]
        },
        {
            element: (
                <Input
                    disabled
                    id='referenceStatistics_dailyProfit'
                    style={{ color: '#424949' }}
                    value={
                        interfaceStyles_state.typeOfStatisticsView === 'balance'
                            ? dailyBusinessStatistics_state.referenceStatistics.balanceViewProfit
                            : dailyBusinessStatistics_state.referenceStatistics.salesViewProfit
                    }
                />
            ),
            label: 'Balance de referencia',
            name: 'referenceStatistics_dailyProfit',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 },
            rules: [{
                message: '¡Debes especificar el balance de referencia!',
                required: true
            }]
        },
        {
            element: (
                <Input
                    disabled
                    id='referenceStatistics_dateString'
                    style={{ color: '#424949' }}
                    value={dailyBusinessStatistics_state.referenceStatistics.dateString}
                />
            ),
            label: 'Fecha de referencia',
            name: 'referenceStatistics_dateString',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 },
            rules: [{
                message: '¡Debes especificar la fecha de referencia!',
                required: true
            }]
        },
        {
            element: (
                <Input
                    id='concept'
                    onChange={e => updateValues(e)}
                    placeholder='Descripción'
                    value={dailyBusinessStatistics_state.params.concept}
                />
            ),
            label: 'Concepto',
            name: 'concept',
            order: { lg: 2, md: 2, sm: 4, xl: 2, xs: 4, xxl: 2 },
            rules: [{
                message: '¡Debes especificar una descripción!',
                required: true
            }]
        },
        {
            element: (
                <InputNumber
                    onBlur={e => updateValuesOnBlur(e, 'balanceViewExpense')}
                    id='balanceViewExpense'
                    onChange={e => updateValues(e, 'balanceViewExpense')}
                    value={dailyBusinessStatistics_state.params.balanceViewExpense}
                />
            ),
            label: 'Total gasto diario',
            name: 'balanceViewExpense',
            order: { lg: 4, md: 4, sm: 5, xl: 4, xs: 5, xxl: 4 },
            rules: [{
                message: '¡Si no hubo gasto diario, al menos el ingreso diario debe ser mayor que $0,01!',
                min: dailyBusinessStatistics_state.params.balanceViewIncome > 0 ? 0 : 0.01,
                required: true,
                type: 'number'
            }]
        },
        {
            element: (
                <InputNumber
                    onBlur={e => updateValuesOnBlur(e, 'balanceViewIncome')}
                    id='balanceViewIncome'
                    onChange={e => updateValues(e, 'balanceViewIncome')}
                    value={dailyBusinessStatistics_state.params.balanceViewIncome}
                />
            ),
            label: 'Total ingreso diario',
            name: 'balanceViewIncome',
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 },
            rules: [{
                message: '¡Si no hubo ingreso diario, al menos el gasto diario debe ser mayor que $0,01!',
                min: dailyBusinessStatistics_state.params.balanceViewExpense > 0 ? 0 : 0.01,
                required: true,
                type: 'number'
            }]
        },
    ]

    const initialValues = {
        concept: dailyBusinessStatistics_state.params.concept,
        balanceViewExpense: dailyBusinessStatistics_state.params.balanceViewExpense,
        balanceViewIncome: dailyBusinessStatistics_state.params.balanceViewIncome,
        referenceStatistics_concept: dailyBusinessStatistics_state.referenceStatistics.concept,
        referenceStatistics_dateString: dailyBusinessStatistics_state.referenceStatistics.dateString,
        referenceStatistics_dailyProfit: interfaceStyles_state.typeOfStatisticsView === 'balance'
            ? dailyBusinessStatistics_state.referenceStatistics.balanceViewProfit
            : dailyBusinessStatistics_state.referenceStatistics.salesViewProfit
    }

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            forceRender
            okButtonProps={{ style: { display: 'none' } }}
            open={dailyBusinessStatistics_state.fixStatisticsModalIsVisible}
            width={1200}
        >
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={() => save()}
                onResetCapture={() => clearInputs()}
            >
                <h2>Ingrese la corrección para el registro de referencia</h2>
                <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
                    {
                        formRender.map((item, index) => {
                            return (
                                <Col
                                    key={'dailyBusinessStatistics_form_' + index}
                                    lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                                    md={{ order: item.order.md, span: responsiveGrid.span.md }}
                                    sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                                    xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                                    xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                                    xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                                >
                                    <Form.Item label={item.label} name={item.name} rules={item.rules}>
                                        {item.element}
                                    </Form.Item>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row justify='space-around'>
                    <Col span={6}>
                        <Button
                            danger
                            disabled={dailyBusinessStatistics_state.loading}
                            onClick={() => cancel()}
                            style={{ width: '100%' }}
                            type='primary'
                        >
                            Cancelar
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            danger
                            disabled={dailyBusinessStatistics_state.loading}
                            htmlType='reset'
                            style={{ width: '100%' }}
                            type='default'
                        >
                            Reiniciar
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            disabled={dailyBusinessStatistics_state.loading}
                            htmlType='submit'
                            style={{ width: '100%' }}
                            type='primary'
                        >
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default FixStatisticsModal