// React Components and Hooks
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Context Providers
import contexts from '../../contexts'

// Design Components
import { Button, Col, Form, Input, InputNumber, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { useSalesAreasContext } = contexts.SalesAreas
const { formatValue } = helpers.objHelper


const ZonasDeVentasForm = () => {
    const formRef = useRef(null)
    const navigate = useNavigate()
    const pathname = useLocation().pathname.replace('/zonasdeventas/', '')
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()

    // ---------------- Find Sales Area to Edit ---------------- //
    useEffect(() => {
        const loadSalesAreaDataState = async () => {
            if (pathname === 'nuevo') return
            const response = await api.zonasdeventas.findById(pathname)
            formRef.current.setFieldsValue(response)
            salesAreas_dispatch({ type: 'EDIT_SALES_AREA', payload: response })
        }
        loadSalesAreaDataState()
    }, [pathname])

    const cancel = () => {
        salesAreas_dispatch({ type: 'CLEAN_STATE' })
        navigate('/zonasdeventas')
    }

    const cleanFields = () => {
        salesAreas_dispatch({ type: 'CLEAN_SALES_AREA_STATE' })
    }

    const save = async () => {
        let response
        if (pathname === 'nuevo') response = await api.zonasdeventas.save(salesAreas_state.currentSalesArea)
        else response = await api.zonasdeventas.editByID(salesAreas_state.currentSalesArea)
        if (response.code === 500) return errorAlert('Fallo al guardar el registro')
        successAlert('El registro se guardó correctamente')
        salesAreas_dispatch({ type: 'CLEAN_STATE' })
        navigate('/zonasdeventas')
    }

    const updateValues = (e) => {
        const convertToNumberTargets = ['discountPercentage', 'surchargePercentage']
        const updatedValues = {
            ...salesAreas_state.currentSalesArea,
            [e.target.id]: convertToNumberTargets.includes(e.target.id)
                ? parseFloat(e.target.value)
                : e.target.value
        }
        salesAreas_dispatch({ type: 'EDIT_SALES_AREA', payload: updatedValues })
    }

    const formRenderButtons = [
        {
            element: (
                <Button
                    danger
                    onClick={cancel}
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
                    htmlType='submit'
                    style={{ width: '100%' }}
                    type='primary'
                >
                    Guardar
                </Button>
            )
        }
    ]

    const formRenderInputs = [
        {
            element: <Input id='name' style={{ width: '100%' }} />,
            initialValue: null,
            label: 'Nombre de la zona de venta',
            name: 'name',
            rules: [{
                message: '¡Debes especificar el nombre de la zona de venta!',
                required: true
            }]
        },
        {
            element: <Input id='description' style={{ width: '100%' }} />,
            initialValue: null,
            label: 'Descripción de la zona de venta',
            name: 'description',
            rules: [{
                message: '¡Debes especificar la descripción de la zona de venta!',
                required: false
            }]
        },
        {
            element: <InputNumber id='discountPercentage' style={{ width: '100%' }} />,
            initialValue: 0,
            label: 'Porcentaje de descuento',
            name: 'discountPercentage',
            rules: [{
                message: '¡Debes especificar un porcentaje igual o mayor que cero!',
                min: 0,
                required: true,
                type: 'number'
            }]
        },
        {
            element: <InputNumber id='surchargePercentage' style={{ width: '100%' }} />,
            initialValue: 0,
            label: 'Porcentaje de recargo',
            name: 'surchargePercentage',
            rules: [{
                message: '¡Debes especificar un porcentaje igual o mayor que cero!',
                min: 0,
                required: true,
                type: 'number'
            }]
        },
    ]

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <h1>
                    {
                        pathname === 'nuevo'
                            ? 'Nueva zona de venta'
                            : 'Editar zona de venta'
                    }
                </h1>
            </Col>
            <Col span={24}>
                <Form
                    onChangeCapture={e => updateValues(e)}
                    onFinish={() => save()}
                    onResetCapture={() => cleanFields()}
                    ref={formRef}
                >
                    {
                        formRenderInputs.map((item, index) => {
                            return (
                                <Row key={index}>
                                    <Col span={24}>
                                        <Form.Item
                                            initialValue={item.initialValue}
                                            label={item.label}
                                            name={item.name}
                                            rules={item.rules}
                                        >
                                            {item.element}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    <Row justify='space-around'>
                        {
                            formRenderButtons.map((item, index) => {
                                return (
                                    <Col
                                        key={'salesAreasRenderButtons_' + index}
                                        span={6}
                                    >
                                        <Form.Item>
                                            {item.element}
                                        </Form.Item>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Form>
            </Col>
        </Row>
    )
}

export default ZonasDeVentasForm