// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'
import InputHidden from '../../components/generics/InputHidden'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Checkbox, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { useInterfaceStylesContext } = contexts.InterfaceStyles
const { resetDate, simpleDateWithHours } = helpers.dateHelper
const { RangePicker } = DatePicker


const Header = () => {
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()
    const [interfaceStyles_state, interfaceStyles_dispatch] = useInterfaceStylesContext()

    // --------------------- Actions ------------------------ //
    const dispatchDateParams = ({ dateFilter, pickerValue, pickerType }) => {
        const { date, dateString } = dateFilter
        const filters = { ...dailyBusinessStatistics_state.paginationParams.filters, date, dateString }
        const paginationParams = { ...dailyBusinessStatistics_state.paginationParams, filters, page: 1 }
        dailyBusinessStatistics_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
        dailyBusinessStatistics_dispatch({ type: 'UPDATE_DATE_PICKERS_VALUES', payload: { pickerType, pickerValue } })
    }

    const loadStatisticsViewType = async () => {
        let viewType
        const findStyles = await api.interfaceStyles.findAll()
        if (findStyles.length < 1) viewType = ''
        else viewType = findStyles[0].typeOfDailyStatisticsView
        interfaceStyles_dispatch({ type: 'SET_TYPE_OF_STATISTICS_VIEW', payload: viewType })
    }

    useEffect(() => {
        loadStatisticsViewType()
        // eslint-disable-next-line
    }, [])

    const onChangeBalanceView = (e) => {
        let viewType
        if (e.target.checked) viewType = 'balance'
        else viewType = ''
        interfaceStyles_dispatch({ type: 'SET_TYPE_OF_STATISTICS_VIEW', payload: viewType })
        saveStatisticsViewType(viewType)

    }

    const onChangeSalesView = (e) => {
        let viewType
        if (e.target.checked) viewType = 'sales'
        else viewType = ''
        interfaceStyles_dispatch({ type: 'SET_TYPE_OF_STATISTICS_VIEW', payload: viewType })
        saveStatisticsViewType(viewType)
    }

    const saveStatisticsViewType = async (viewType) => {
        const stylesToSave = { ...interfaceStyles_state, typeOfDailyStatisticsView: viewType }
        const findStyles = await api.interfaceStyles.findAll()
        let res
        if (findStyles.length < 1) res = await api.interfaceStyles.save(stylesToSave)
        else {
            stylesToSave._id = findStyles[0]._id
            res = await api.interfaceStyles.edit(stylesToSave)
        }
        if (res.code !== 200) errorAlert('No pudieron registrarse los nuevos estilos. Intente de nuevo.')
    }

    // -------------- Button to clear filters --------------- //
    const clearFilters = () => {
        dailyBusinessStatistics_dispatch({ type: 'CLEAR_FILTERS' })
    }

    const buttonToClearFilters = (
        <Button
            danger
            onClick={clearFilters}
            style={{ width: '100%' }}
            type='primary'
        >
            Limpiar filtros
        </Button>
    )

    // -------- Button to show or hide null records --------- //
    const buttonToShowOrHideNullRecordsLabel = () => {
        const hideRecordsLabel = 'Ocultar fechas con balance cero'
        const showRecordsLabel = 'Mostrar fechas con balance cero'
        let label = ''
        if (interfaceStyles_state.typeOfStatisticsView === 'balance') {
            label = !!dailyBusinessStatistics_state.paginationParams.filters.balanceViewProfit
                ? showRecordsLabel
                : hideRecordsLabel
        } else {
            label = !!dailyBusinessStatistics_state.paginationParams.filters.salesViewProfit
                ? showRecordsLabel
                : hideRecordsLabel
        }
        return label
    }

    const setNullRecordsVisibility = () => {
        const currentFilters = dailyBusinessStatistics_state.paginationParams.filters
        const filters = {
            ...currentFilters,
            balanceViewProfit: currentFilters.balanceViewProfit ? null : { $ne: 0 },
            salesViewProfit: currentFilters.salesViewProfit ? null : { $ne: 0 }
        }
        const paginationParams = { ...dailyBusinessStatistics_state.paginationParams, filters, page: 1 }
        dailyBusinessStatistics_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const buttonToShowOrHideNullRecords = (
        <Button
            className='btn-primary'
            disabled={dailyBusinessStatistics_state.loading}
            onClick={setNullRecordsVisibility}
        >
            {buttonToShowOrHideNullRecordsLabel()}
        </Button>
    )

    // ----------- DatePicker to filter by day -------------- //
    const setParams_day = (date, dateString) => {
        const dateFilter = {
            date: null,
            dateString: !date ? null : simpleDateWithHours(date.$d).substring(0, 10)
        }
        const pickerValue = dateString
        dispatchDateParams({ dateFilter, pickerValue, pickerType: 'day_datePicker' })
    }

    const datePickerToFilterByDay = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Buscar día
            </Col>
            <Col span={16}>
                <DatePicker
                    disabled={dailyBusinessStatistics_state.loading}
                    format={['DD-MM-YYYY']}
                    onChange={setParams_day}
                    style={{ width: '100%' }}
                    value={dailyBusinessStatistics_state.datePickersValues.day_datePicker}
                />
            </Col>
        </Row>
    )

    // -------- DatePicker to filter by days range ---------- //
    const setParams_dayRange = (date, dateString) => {
        const dateFilter = {
            date: !date ? null : {
                $gte: resetDate(date[0].$d),
                $lte: resetDate(date[1].$d)
            },
            dateString: null
        }
        const pickerValue = dateString
        dispatchDateParams({ dateFilter, pickerValue, pickerType: 'day_rangePicker' })
    }

    const rangePickerToFilterByDays = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Rango de días
            </Col>
            <Col span={16}>
                <RangePicker
                    disabled={dailyBusinessStatistics_state.loading}
                    format={['DD-MM-YYYY']}
                    onChange={setParams_dayRange}
                    style={{ width: '100%' }}
                    value={dailyBusinessStatistics_state.datePickersValues.day_rangePicker}
                />
            </Col>
        </Row>
    )

    // ---------- DatePicker to filter by month ------------- //
    const setParams_month = (date, dateString) => {
        const dateFilter = {
            date: !date ? null : {
                $gte: new Date(date.$d.getFullYear(), date.$d.getMonth(), 1),
                $lte: new Date(date.$d.getFullYear(), date.$d.getMonth() + 1, 0)
            },
            dateString: null
        }
        const pickerValue = dateString
        dispatchDateParams({ dateFilter, pickerValue, pickerType: 'month_datePicker' })
    }

    const datePickerToFilterByMonth = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Buscar mes
            </Col>
            <Col span={16}>
                <DatePicker
                    disabled={dailyBusinessStatistics_state.loading}
                    format={['MM-YYYY']}
                    onChange={setParams_month}
                    picker='month'
                    style={{ width: '100%' }}
                    value={dailyBusinessStatistics_state.datePickersValues.month_datePicker}
                />
            </Col>
        </Row>
    )

    // ------ DatePicker to filter by months range ---------- //
    const setParams_monthRange = (date, dateString) => {
        const dateFilter = {
            date: !date ? null : {
                $gte: new Date(date[0].$d.getFullYear(), date[0].$d.getMonth(), 1),
                $lte: new Date(date[1].$d.getFullYear(), date[1].$d.getMonth() + 1, 0)
            },
            dateString: null
        }
        const pickerValue = dateString
        dispatchDateParams({ dateFilter, pickerValue, pickerType: 'month_rangePicker' })
    }

    const rangePickerToFilterByMonths = (
        <Row align='middle' gutter={8}>
            <Col span={8}>
                Rango de meses
            </Col>
            <Col span={16}>
                <RangePicker
                    disabled={dailyBusinessStatistics_state.loading}
                    format={['MM-YYYY']}
                    onChange={setParams_monthRange}
                    picker='month'
                    style={{ width: '100%' }}
                    value={dailyBusinessStatistics_state.datePickersValues.month_rangePicker}
                />
            </Col>
        </Row>
    )

    // ----------------- Title of actions ------------------- //
    const titleOfActions = <h3>Acciones</h3>

    // ----------------- Title of filters ------------------- //
    const titleOfFilters = <h3>Filtrar registros</h3>


    const itemsToRender = [
        {
            element: buttonToClearFilters,
            order: { lg: 5, md: 5, sm: 10, xl: 5, xs: 10, xxl: 5 }
        },
        {
            element: buttonToShowOrHideNullRecords,
            order: { lg: 3, md: 3, sm: 9, xl: 3, xs: 9, xxl: 3 }
        },
        {
            element: datePickerToFilterByDay,
            order: { lg: 4, md: 4, sm: 3, xl: 4, xs: 3, xxl: 4 }
        },
        {
            element: datePickerToFilterByMonth,
            order: { lg: 8, md: 8, sm: 5, xl: 8, xs: 5, xxl: 8 }
        },
        {
            element: <InputHidden />,
            order: { lg: 7, md: 7, sm: 1, xl: 7, xs: 1, xxl: 7 }
        },
        {
            element: <InputHidden />,
            order: { lg: 9, md: 9, sm: 7, xl: 9, xs: 7, xxl: 9 }
        },
        {
            element: rangePickerToFilterByDays,
            order: { lg: 6, md: 6, sm: 4, xl: 6, xs: 4, xxl: 6 }
        },
        {
            element: rangePickerToFilterByMonths,
            order: { lg: 10, md: 10, sm: 6, xl: 10, xs: 6, xxl: 10 }
        },
        {
            element: titleOfActions,
            order: { lg: 1, md: 1, sm: 8, xl: 1, xs: 8, xxl: 1 }
        },
        {
            element: titleOfFilters,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 16, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    
    return (
        <Row gutter={[0, 8]}>
            <Col span={8}>
                <h2>Estadísticas diarias de negocio</h2>
            </Col>
            <Col span={8}>
                <Checkbox
                    checked={interfaceStyles_state.typeOfStatisticsView === 'balance'}
                    onChange={onChangeBalanceView}
                >
                    Vista balance
                </Checkbox>
            </Col>
            <Col span={8}>
                <Checkbox
                    checked={interfaceStyles_state.typeOfStatisticsView === 'sales'}
                    onChange={onChangeSalesView}
                >
                    Vista ventas
                </Checkbox>
            </Col>
            <Col span={24}>
                <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
                    {
                        itemsToRender.map((item, index) => {
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