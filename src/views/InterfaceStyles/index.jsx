// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'

// Design Components
import { Button, Col, Row, Switch } from 'antd'

// Custom Constexts
import contexts from '../../contexts'

// Services
import api from '../../services'

// Imports Destructuring
const { useInterfaceStylesContext } = contexts.InterfaceStyles


const InterfaceStyles = () => {
    const [interfaceStyles_state, interfaceStyles_dispatch] = useInterfaceStylesContext()

    // ------------------------------------ Inputs color ------------------------------------- //
    const loadStyles = async () => {
        const res = await api.interfaceStyles.findAll()
        if (res.length < 1) interfaceStyles_dispatch({ type: 'LOAD_STYLES', payload: null })
        else interfaceStyles_dispatch({ type: 'LOAD_STYLES', payload: res[0] })
    }

    useEffect(() => {
        loadStyles()
        // eslint-disable-next-line
    }, [])

    // ------------------------------- Button to save styles --------------------------------- //
    const saveStyles = async () => {
        let res
        const findStyles = await api.interfaceStyles.findAll()
        if (findStyles.length < 1) res = await api.interfaceStyles.save(interfaceStyles_state)
        else {
            const newStyles = {
                ...interfaceStyles_state,
                _id: findStyles[0]._id
            }
            res = await api.interfaceStyles.edit(newStyles)
        }
        if (res.code !== 200) errorAlert('No pudieron registrarse los nuevos estilos. Intente de nuevo.')
    }

    const buttonToSaveStyles = (
        <Button
            onClick={saveStyles}
            style={{ width: '100%' }}
            type='primary'
        >
            Guardar
        </Button>
    )

    // ------------------------------------ Inputs color ------------------------------------- //
    const data = [
        {
            actionType: 'SET_DARKNESS_BACKGROUND_PRIMARY_COLOR',
            title: 'Selecciona el color primario para fondo:',
            isDarknessActive: true,
            value: interfaceStyles_state.darknessBackgroundPrimaryColor
        },
        {
            actionType: 'SET_DARKNESS_BACKGROUND_SECONDARY_COLOR',
            title: 'Selecciona el color secundario para fondo:',
            isDarknessActive: true,
            value: interfaceStyles_state.darknessBackgroundSecondaryColor
        },
        {
            actionType: 'SET_DARKNESS_BUTTONS_PRIMARY_COLOR',
            title: 'Selecciona el color primario para botones:',
            isDarknessActive: true,
            value: interfaceStyles_state.darknessButtonsPrimaryColor
        },
        {
            actionType: 'SET_DARKNESS_BUTTONS_SECONDARY_COLOR',
            title: 'Selecciona el color primario para botones:',
            isDarknessActive: true,
            value: interfaceStyles_state.darknessButtonsSecondaryColor
        },
        {
            actionType: 'SET_LIGHT_BACKGROUND_PRIMARY_COLOR',
            title: 'Selecciona el color primario para fondo:',
            isDarknessActive: false,
            value: interfaceStyles_state.lightBackgroundPrimaryColor
        },
        {
            actionType: 'SET_LIGHT_BACKGROUND_SECONDARY_COLOR',
            title: 'Selecciona el color secundario para fondo:',
            isDarknessActive: false,
            value: interfaceStyles_state.lightBackgroundSecondaryColor
        },
        {
            actionType: 'SET_LIGHT_BUTTONS_PRIMARY_COLOR',
            title: 'Selecciona el color primario para botones:',
            isDarknessActive: false,
            value: interfaceStyles_state.lightButtonsPrimaryColor
        },
        {
            actionType: 'SET_LIGHT_BUTTONS_SECONDARY_COLOR',
            title: 'Selecciona el color primario para botones:',
            isDarknessActive: false,
            value: interfaceStyles_state.lightButtonsSecondaryColor
        }
    ]

    const dispatchData = (e, actionType) => {
        interfaceStyles_dispatch({ type: actionType, payload: e.target.value })
    }

    const inputsColor = () => {
        const inputs = []
        for (let index = 0; index < data.length; index++) {
            const dataItem = data[index]
            if (dataItem.isDarknessActive === interfaceStyles_state.isDarknessActive) {
                const input = (
                    <Row gutter={[0, 8]} justify='center'>
                        <Col span={24}>
                            <h1>{dataItem.title}</h1>
                        </Col>
                        <Col span={24}>
                            <input
                                onChange={e => dispatchData(e, dataItem.actionType)}
                                style={{
                                    borderRadius: '5px',
                                    height: '50px',
                                    width: '100%'
                                }}
                                type='color'
                                value={dataItem.value}
                            />
                        </Col>
                    </Row>
                )
                const item = {
                    element: input,
                    order: { lg: index, md: index, sm: index, xl: index, xs: index, xxl: index }
                }
                inputs.push(item)
            }
        }
        return inputs
    }

    // ------------------------------ Switch to darkness mode -------------------------------- //
    const onChangeMode = (e) => {
        interfaceStyles_dispatch({ type: 'SET_DARKNESS_ACTIVE', payload: e })
    }

    const switchToDarknessMode = (
        <div style={{ display: 'flex' }}>
            <Switch
                checked={interfaceStyles_state.isDarknessActive}
                onChange={onChangeMode}
            />
            <h1 style={{ marginLeft: '8px' }}>
                Modo oscuro
            </h1>
        </div>
    )

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 16 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row gutter={[0, 24]}>
            <Col span={24}>
                {switchToDarknessMode}
            </Col>
            <Col span={24}>
                <Row
                    gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                    justify='space-around'
                >
                    {
                        inputsColor().map((item, index) => {
                            return (
                                <Col
                                    key={'products_header_' + index}
                                    lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                                    md={{ order: item.order.md, span: responsiveGrid.span.md }}
                                    sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                                    xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                                    xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                                    xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                                >
                                    {item.element}
                                </Col>
                            )
                        })
                    }
                </Row>
            </Col>
            <Col span={24}>
                {buttonToSaveStyles}
            </Col>
        </Row>
    )
}

export default InterfaceStyles