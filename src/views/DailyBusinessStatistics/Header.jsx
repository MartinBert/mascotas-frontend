// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
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
const { getYesterdayDate, localFormat, resetDate, simpleDateWithHours } = helpers.dateHelper
const { fiscalVouchersCodes } = helpers.afipHelper
const { roundTwoDecimals } = helpers.mathHelper
const { RangePicker } = DatePicker

const creditCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.credit)
    .filter(code => code !== null)

const errorMessage = (activity) => {
    const fixedActivity = activity.substring(0, activity.length - 1)
    const message = `
        No se pudo recuperar la fecha de la primera ${fixedActivity} para elaborar los registros.
        Recargue la página para volver a intentar.
    `
    return message
}

const generateFilters_entriesAndOutputs = (date) => {
    const query = JSON.stringify({ fechaString: localFormat(date) })
    return query
}

const generateFilters_sales = (date) => {
    const query = JSON.stringify({
        cashRegister: true,
        fechaEmisionString: localFormat(date)
    })
    return query
}


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
        let res
        const findStyles = await api.interfaceStyles.findAll()
        const stylesToSave = { ...interfaceStyles_state, typeOfDailyStatisticsView: viewType }
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
    const setNullRecordsVisibility = () => {
        const currentFilters = dailyBusinessStatistics_state.paginationParams.filters
        const filters = { ...currentFilters, dailyProfit: currentFilters.dailyProfit ? null : { $ne: 0 } }
        const paginationParams = { ...dailyBusinessStatistics_state.paginationParams, filters, page: 1 }
        dailyBusinessStatistics_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const buttonToShowOrHideNullRecords = (
        <Button
            className='btn-primary'
            disabled={dailyBusinessStatistics_state.loading}
            onClick={setNullRecordsVisibility}
        >
            {
                dailyBusinessStatistics_state.paginationParams.filters.dailyProfit
                    ? 'Mostrar fechas con balance cero'
                    : 'Ocultar fechas con balance cero'
            }
        </Button>
    )

    // ------------- Button to update records --------------- //
    const generateDates = (referenceDate_ms) => {
        const dates = []
        const dates_ms = []
        const yesterdayDate = getYesterdayDate()
        const yesterdayDate_ms = Date.parse(yesterdayDate)
        const counterInit = referenceDate_ms / 86400000
        const counterLimit = (yesterdayDate_ms - yesterdayDate_ms % 86400000) / 86400000
        for (let index = counterInit; index < counterLimit; index++) {
            const generatedDate_ms = index * 86400000
            dates.push(new Date(generatedDate_ms))
            dates_ms.push(generatedDate_ms)
        }
        return { dates, dates_ms }
    }

    const getFirstActivityDate = async () => {
        const activities = ['entradas', 'salidas', 'ventas']
        const dateInActivity = activity => activity === 'ventas' ? 'fechaEmision' : 'fecha'

        const firstDates_ms = await Promise.all(
            activities.map(async activity => {
                const [firstRecord] = await api[activity].findOldestRecord()
                if (!firstRecord) return errorAlert(errorMessage(activity))
                const firstDate = firstRecord[dateInActivity(activity)]
                const firstDate_ms = Date.parse(firstDate)
                return firstDate_ms
            })
        )
        const validRecords = firstDates_ms.filter(date => !isNaN(date))
        if (validRecords.length !== activities.length) return
        const orderedDates = firstDates_ms.sort((date_1, date_2) => date_1 - date_2)
        const firstActivityDate_ms = orderedDates[0]
        const firstActivityDate = new Date(firstActivityDate_ms)
        return { firstActivityDate, firstActivityDate_ms }
    }

    const validateProcess = async () => {
        const msCondition = -1000
        let referenceDate
        let referenceDate_ms

        // Buscar último registro de estadísticas diarias
        const newerRecord = await api.dailyBusinessStatistics.findNewerRecord()

        if (!newerRecord) {
            errorAlert('No se pudo recuperar el último registro. Recargue la página para volver a intentar.')
            return { referenceDate: null, referenceDate_ms: null, validated: false }
        }

        // Establecer la fecha de referencia como fecha y en milisegundos. A partir de esta, se crearán los nuevos registros.
        if (newerRecord.length > 0) {
            referenceDate = (new Date(Date.parse(newerRecord[newerRecord.length - 1].date) + 86400000)).toISOString()
            referenceDate_ms = Date.parse(referenceDate) + 86400000
        } else {
            const { firstActivityDate, firstActivityDate_ms } = await getFirstActivityDate()
            referenceDate = firstActivityDate
            referenceDate_ms = firstActivityDate_ms
        }
        if (!referenceDate || !referenceDate_ms) {
            errorAlert('No se pudo recuperar la última fecha de referencia. Recargue la página para volver a intentar.')
            return { referenceDate: null, referenceDate_ms: null, validated: false }
        }

        // Solo se crearán nuevos registros si la fecha de referencia es más antigua que ayer. De lo contrario, el sistema ya está actualizado.
        const yesterdayDate = getYesterdayDate()
        const yesterdayDate_ms = Date.parse(yesterdayDate)
        if (yesterdayDate_ms - referenceDate_ms < msCondition) {
            return { referenceDate: null, referenceDate_ms: null, validated: false }
        } else {
            referenceDate = resetDate(referenceDate)
            referenceDate_ms = Date.parse(referenceDate)
            return { referenceDate, referenceDate_ms, validated: true }
        }
    }

    const updateRecords = async () => {
        // Generation of parameters to check if update is necessary.
        // eslint-disable-next-line
        const { referenceDate, referenceDate_ms, validated } = await validateProcess()
        if (!validated) return

        // Generation of date array to update records. From 'referenceDate' until yesterday.
        // eslint-disable-next-line
        const { dates, dates_ms } = generateDates(referenceDate_ms)

        // Get data to update records.
        const data = await Promise.all(
            dates.map(async date => {
                const dateString = simpleDateWithHours(date)
                const filters_entriesAndOutputs = generateFilters_entriesAndOutputs(date)
                const filters_sales = generateFilters_sales(date)
                const findEntries = await api.entradas.findAllByFilters(filters_entriesAndOutputs)
                const findOutputs = await api.salidas.findAllByFilters(filters_entriesAndOutputs)
                const findSales = await api.ventas.findAllByFilters(filters_sales)
                const records = [...findEntries.docs, ...findOutputs.docs, ...findSales.docs]
                return { date, dateString, records }
            })
        )
        if (!data) {
            errorAlert('No se pudo generar las fechas para la actualización de regitros. Recargue la página para volver a intentar.')
            return 'FAIL'
        }

        // Create new records
        const newRecords = data.map(dailyData => {
            const dailyEntries = dailyData.records.map(record => {
                if (record.documento) return 0
                if (record.costoTotal) return record.costoTotal
                else return 0
            }).reduce((acc, value) => acc + value, 0)

            const dailyOutputs = dailyData.records.map(record => {
                if (record.documento) return 0
                if (record.ganancia) return record.ganancia
                else return 0
            }).reduce((acc, value) => acc + value, 0)

            const dailySalesAndDebits_iva = dailyData.records.map(record => {
                if (!record.renglones && !record.documento) return 0
                if (!record.documento.cashRegister) return 0
                else {
                    const saleIva = !creditCodes.includes(record.documentoCodigo) ? record.importeIva : 0
                    return saleIva
                }
            }).reduce((acc, value) => acc + value, 0)

            const dailySalesAndDebits_total = dailyData.records.map(record => {
                if (!record.renglones && !record.documento) return 0
                if (!record.documento.cashRegister) return 0
                else {
                    const saleTotal = !creditCodes.includes(record.documentoCodigo) ? record.total : 0
                    return saleTotal
                }
            }).reduce((acc, value) => acc + value, 0)

            const dailyCredits = dailyData.records.map(record => {
                if (!record.renglones && !record.documento) return 0
                if (!record.documento.cashRegister) return 0
                else {
                    const creditTotal = creditCodes.includes(record.documentoCodigo) ? record.total : 0
                    return creditTotal
                }
            }).reduce((acc, value) => acc + value, 0)

            const dailyExpense = roundTwoDecimals(dailySalesAndDebits_iva + dailyEntries + dailyCredits)
            const dailyIncome = roundTwoDecimals(dailySalesAndDebits_total + dailyOutputs)
            const dailyStatisticsToSave = {
                concept: 'Generado automáticamente',
                dailyExpense,
                dailyIncome,
                dailyProfit: roundTwoDecimals(dailyIncome - dailyExpense),
                date: dailyData.date,
                dateString: dailyData.dateString
            }
            return dailyStatisticsToSave
        })
        if (!newRecords) {
            errorAlert('No se pudo generar los registros nuevos para la actualización. Recargue la página para volver a intentar.')
            return 'FAIL'
        }

        // Update records
        for (let index = 0; index < newRecords.length; index++) {
            const record = newRecords[index]
            const result = await api.dailyBusinessStatistics.save(record)
            if (result.code === 500) errorAlert('No se pudo guardar el registro de la fecha: ' + record.dateString)
        }

        return 'OK'
    }

    const activateUpdate = async () => {
        dailyBusinessStatistics_dispatch({ type: 'SET_LOADING_UPDATING_RECORDS', payload: true })
        const result = await updateRecords()
        if (result === 'FAIL') return
        else {
            successAlert('Registros actualizados correctamente.')
            dailyBusinessStatistics_dispatch({ type: 'SET_LOADING_UPDATING_RECORDS', payload: false })
        }
    }

    const buttonToUpdateRecords = (
        <Button
            className='btn-primary'
            onClick={activateUpdate}
        >
            Actualizar registros
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
            order: { lg: 7, md: 7, sm: 10, xl: 7, xs: 10, xxl: 7 }
        },
        {
            element: buttonToShowOrHideNullRecords,
            order: { lg: 5, md: 5, sm: 9, xl: 5, xs: 9, xxl: 5 }
        },
        {
            element: buttonToUpdateRecords,
            order: { lg: 3, md: 3, sm: 8, xl: 3, xs: 8, xxl: 3 }
        },
        {
            element: datePickerToFilterByDay,
            order: { lg: 4, md: 4, sm: 2, xl: 4, xs: 2, xxl: 4 }
        },
        {
            element: datePickerToFilterByMonth,
            order: { lg: 8, md: 8, sm: 4, xl: 8, xs: 4, xxl: 8 }
        },
        {
            element: <InputHidden />,
            order: { lg: 9, md: 9, sm: 6, xl: 9, xs: 6, xxl: 9 }
        },
        {
            element: rangePickerToFilterByDays,
            order: { lg: 6, md: 6, sm: 3, xl: 6, xs: 3, xxl: 6 }
        },
        {
            element: rangePickerToFilterByMonths,
            order: { lg: 10, md: 10, sm: 5, xl: 10, xs: 5, xxl: 10 }
        },
        {
            element: titleOfActions,
            order: { lg: 1, md: 1, sm: 7, xl: 1, xs: 7, xxl: 1 }
        },
        {
            element: titleOfFilters,
            order: { lg: 2, md: 2, sm: 1, xl: 2, xs: 1, xxl: 2 }
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