// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { useRenderConditionsContext } = contexts.RenderConditions


const DailyBusinessStatisticsGraphics = () => {
    const [
        dailyBusinessStatistics_state,
        dailyBusinessStatistics_dispatch
    ] = useDailyBusinessStatisticsContext()
    const [renderConditions_state, renderConditions_dispatch] = useRenderConditionsContext()

    // ------------------------------------- Load data --------------------------------------- //
    const loadRenderConditions = async () => {
        const recordsQuantityOfEntries = await api.entradas.countRecords()
        const recordsQuantityOfOutputs = await api.salidas.countRecords()
        const recordsQuantityOfSales = await api.ventas.countRecords()
        renderConditions_dispatch({
            type: 'SET_EXISTS_ENTRIES',
            payload: recordsQuantityOfEntries < 1 ? false : true
        })
        renderConditions_dispatch({
            type: 'SET_EXISTS_OUTPUTS',
            payload: recordsQuantityOfOutputs < 1 ? false : true
        })
        renderConditions_dispatch({
            type: 'SET_EXISTS_SALES',
            payload: recordsQuantityOfSales < 1 ? false : true
        })
    }

    useEffect(() => {
        loadRenderConditions()
        // eslint-disable-next-line
    }, [])


    return (
        <>
            {
                !renderConditions_state.existsEntries
                    && !renderConditions_state.existsOutputs
                    && !renderConditions_state.existsSales
                    ? <h1>Debes registrar al menos una entrada, salida o venta antes de comenzar a utilizar esta función.</h1>
                    : (
                        <Row>
                            <Col span={24}>
                                <h2>Gráficos próximamente!</h2>
                            </Col>
                            <Col span={24}>

                            </Col>
                        </Row>
                    )
            }
        </>
    )
}

export default DailyBusinessStatisticsGraphics