// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Row } from 'antd'

// Services
import api from '../../services'

// Imports Destructurings
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { RangePicker } = DatePicker


const Header = () => {
    const [
        dailyBusinessStatistics_state,
        dailyBusinessStatistics_dispatch
    ] = useDailyBusinessStatisticsContext()

    const updateRecords = async () => {
        dailyBusinessStatistics_dispatch({ type: 'SET_LOADING', payload: true })
        // toma todas las entradas, salidas, etc y las agrupa y guarda por día
    }

    const dispatchParams = ({ filters, pickerValue, pickerType }) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.paginationParams,
            filters: JSON.stringify(filters)
        }
        dailyBusinessStatistics_dispatch({
            type: 'SET_PAGINATION_PARAMS',
            payload: paginationParams
        })
        dailyBusinessStatistics_dispatch({
            type: 'UPDATE_DATE_PICKERS_VALUES',
            payload: { pickerType, pickerValue }
        })
    }

    // ---------------------------- Filter statistics by DAY ---------------------------- //
    const setParams_day = (date, dateString) => {
        const filters = !date ? null : { date: date.$d }
        const pickerValue = dateString
        dispatchParams({ filters, pickerValue, pickerType: 'day_datePicker' })
    }

    const dayPicker =
        <DatePicker
            disabled={dailyBusinessStatistics_state.loading}
            format={['DD-MM-YYYY']}
            onChange={setParams_day}
            style={{ width: '100%' }}
            value={dailyBusinessStatistics_state.datePickersValues.day_datePicker}
        />

    // ------------------------- Filter statistics by DAY RANGE ------------------------- //
    const setParams_dayRange = (date, dateString) => {
        const filters = !date ? null : { date: { $gte: date[0].$d, $lte: date[1].$d } }
        const pickerValue = dateString
        dispatchParams({ filters, pickerValue, pickerType: 'day_rangePicker' })
    }

    const dayRange =
        <RangePicker
            disabled={dailyBusinessStatistics_state.loading}
            format={['DD-MM-YYYY']}
            onChange={setParams_dayRange}
            style={{ width: '100%' }}
            value={dailyBusinessStatistics_state.datePickersValues.day_rangePicker}
        />

    // --------------------------- Filter statistics by MONTH --------------------------- //
    const setParams_month = (date, dateString) => {
        const filters = !date
            ? null
            : {
                date: {
                    $gte: new Date(date.$d.getFullYear(), date.$d.getMonth(), 1),
                    $lte: new Date(date.$d.getFullYear(), date.$d.getMonth() + 1, 0)
                }
            }
        const pickerValue = dateString
        dispatchParams({ filters, pickerValue, pickerType: 'month_datePicker' })
    }

    const monthPicker =
        <DatePicker
            disabled={dailyBusinessStatistics_state.loading}
            format={['MM-YYYY']}
            onChange={setParams_month}
            picker='month'
            style={{ width: '100%' }}
            value={dailyBusinessStatistics_state.datePickersValues.month_datePicker}
        />

    // ------------------------ Filter statistics by MONTH RANGE ------------------------ //
    const setParams_monthRange = (date, dateString) => {
        console.log(dateString)
        const filters = !date
            ? null
            : {
                date: {
                    $gte: new Date(date[0].$d.getFullYear(), date[0].$d.getMonth(), 1),
                    $lte: new Date(date[1].$d.getFullYear(), date[1].$d.getMonth() + 1, 0)
                }
            }
        const pickerValue = dateString
        dispatchParams({ filters, pickerValue, pickerType: 'month_rangePicker' })
    }

    const monthRange =
        <RangePicker
            disabled={dailyBusinessStatistics_state.loading}
            format={['MM-YYYY']}
            onChange={setParams_monthRange}
            picker='month'
            style={{ width: '100%' }}
            value={dailyBusinessStatistics_state.datePickersValues.month_rangePicker}
        />


    const header = [
        {
            element: 'Buscar día',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: dayPicker,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        },
        {
            element: 'Rango de días',
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: dayRange,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: 'Buscar mes',
            order: { lg: 5, md: 5, sm: 5, xl: 5, xs: 5, xxl: 5 }
        },
        {
            element: monthPicker,
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 }
        },
        {
            element: 'Rango de meses',
            order: { lg: 7, md: 7, sm: 7, xl: 7, xs: 7, xxl: 7 }
        },
        {
            element: monthRange,
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 }
        },
    ]

    const responsiveGrid = {
        gutter: { horizontal: 24, vertical: 8 },
        span: { lg: 12, md: 24, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Row gutter={24} justify='center'>
                    <Col span={12}>
                        <h2>Estadísticas diarias de negocio</h2>
                    </Col>
                    <Col span={12}>
                        <Button
                            className='btn-primary'
                            onClick={updateRecords}
                        >
                            Actualizar
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
                    {
                        header.map((item, index) => {
                            return (
                                <Col
                                    key={'dalilyBusinessStatistics_header_' + index}
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
        </Row>
    )
}

export default Header