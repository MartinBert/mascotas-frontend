// React Components and Hooks
import React from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import InputHidden from '../../components/generics/InputHidden'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { getYesterdayDate, resetDate, simpleDateWithHours } = helpers.dateHelper
const { fiscalVouchersCodes } = helpers.afipHelper
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
    const query = JSON.stringify({ fechaString: (simpleDateWithHours(date)).substring(0, 10) })
    return query
}

const generateFilters_sales = (date) => {
    const query = JSON.stringify({
        cashRegister: true,
        fechaEmisionString: (simpleDateWithHours(date)).substring(0, 10)
    })
    return query
}


const Header = () => {
    const [
        dailyBusinessStatistics_state,
        dailyBusinessStatistics_dispatch
    ] = useDailyBusinessStatisticsContext()

    // --------------------------------- Update Records --------------------------------- //
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
        const { referenceDate, referenceDate_ms, validated } = await validateProcess()
        if (!validated) return

        // Generation of date array to update records. From 'referenceDate' until yesterday.
        const { dates, dates_ms } = generateDates(referenceDate_ms)

        // Get data to update records.
        const data = await Promise.all(
            dates.map(async date => {
                const dateString = simpleDateWithHours(date)
                const filters_entriesAndOutputs = generateFilters_entriesAndOutputs(date)
                const filters_sales = generateFilters_sales(date)
                const findEntries = await api.entradas.findByDate(filters_entriesAndOutputs)
                const findOutputs = await api.salidas.findByDate(filters_entriesAndOutputs)
                const findSales = await api.ventas.findByDate(filters_sales)
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
                if (record.gananciaNeta) return record.gananciaNeta
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

            const dailyExpense = dailySalesAndDebits_iva + dailyEntries + dailyCredits
            const dailyIncome = dailySalesAndDebits_total + dailyOutputs
            const dailyStatisticsToSave = {
                concept: 'Generado automáticamente',
                dailyExpense,
                dailyIncome,
                dailyProfit: dailyIncome - dailyExpense,
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

    // ---------------------------------- Set filters ----------------------------------- //
    const dispatchParams = ({ filters, pickerValue = null, pickerType = null }) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.paginationParams,
            filters: JSON.stringify(filters)
        }
        dailyBusinessStatistics_dispatch({
            type: 'SET_PAGINATION_PARAMS',
            payload: paginationParams
        })
        if (!pickerValue || !pickerType) return
        dailyBusinessStatistics_dispatch({
            type: 'UPDATE_DATE_PICKERS_VALUES',
            payload: { pickerType, pickerValue }
        })
    }

    // -------- Filter statistics by DAY -------- //
    const setParams_day = (date, dateString) => {
        const dateFilter = !date ? null : { dateString: simpleDateWithHours(date.$d).substring(0, 10) }
        const showNullRecordsFilter = dailyBusinessStatistics_state.showNullRecords
            ? null
            : { profit: { $gte: 0 } }
        const filters = !date
            ? showNullRecordsFilter
            : { ...dateFilter, ...showNullRecordsFilter }
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

    // -------- Filter statistics by DAY RANGE -------- //
    const setParams_dayRange = (date, dateString) => {
        const dateFilter = !date ? null : { date: { $gte: date[0].$d, $lte: date[1].$d } }
        const showNullRecordsFilter = dailyBusinessStatistics_state.showNullRecords
            ? null
            : { profit: { $gte: 0 } }
        const filters = !date
            ? showNullRecordsFilter
            : { ...dateFilter, ...showNullRecordsFilter }
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

    // -------- Filter statistics by MONTH -------- //
    const setParams_month = (date, dateString) => {
        const dateFilter = {
            date: {
                $gte: new Date(date.$d.getFullYear(), date.$d.getMonth(), 1),
                $lte: new Date(date.$d.getFullYear(), date.$d.getMonth() + 1, 0)
            }
        }
        const showNullRecordsFilter = dailyBusinessStatistics_state.showNullRecords
            ? null
            : { profit: { $gte: 0 } }
        const filters = !date
            ? showNullRecordsFilter
            : { ...dateFilter, ...showNullRecordsFilter }
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

    // -------- Filter statistics by MONTH RANGE -------- //
    const setParams_monthRange = (date, dateString) => {
        const dateFilter = {
            date: {
                $gte: new Date(date[0].$d.getFullYear(), date[0].$d.getMonth(), 1),
                $lte: new Date(date[1].$d.getFullYear(), date[1].$d.getMonth() + 1, 0)
            }
        }
        const showNullRecordsFilter = dailyBusinessStatistics_state.showNullRecords
            ? null
            : { profit: { $gte: 0 } }
        const filters = !date
            ? showNullRecordsFilter
            : { ...dateFilter, ...showNullRecordsFilter }
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

    // -------- SHOW or HIDE button for null records -------- //
    const setNullRecordsVisibility = () => {
        if (dailyBusinessStatistics_state.showNullRecords) {
            dailyBusinessStatistics_dispatch({ type: 'SHOW_NULL_RECORDS' })
        } else dailyBusinessStatistics_dispatch({ type: 'HIDE_NULL_RECORDS' })

        const visibilitySelected = !dailyBusinessStatistics_state.showNullRecords
        const dateFilter = dailyBusinessStatistics_state.paginationParams.filters
            ? dailyBusinessStatistics_state.paginationParams.filters.date
            : null
        const showNullRecordsFilter = visibilitySelected
            ? null
            : { profit: { $gte: 0 } }
        const filters = { ...dateFilter, ...showNullRecordsFilter }
        dispatchParams({ filters })
    }

    const nullRecordsVisibilityButton =
        <Button
            className='btn-primary'
            // disabled={dailyBusinessStatistics_state.loading}
            disabled
            onClick={setNullRecordsVisibility}
        >
            Mostrar fechas sin actividad
        </Button>

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
        {
            element: <InputHidden />,
            order: { lg: 9, md: 9, sm: 9, xl: 9, xs: 9, xxl: 9 }
        },
        {
            element: nullRecordsVisibilityButton,
            order: { lg: 10, md: 10, sm: 10, xl: 10, xs: 10, xxl: 10 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 24, vertical: 8 },
        span: { lg: 12, md: 24, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Row gutter={24}>
                    <Col span={12}>
                        <h2>Estadísticas diarias de negocio</h2>
                    </Col>
                    <Col span={12}>
                        <Button
                            className='btn-primary'
                            onClick={activateUpdate}
                        >
                            Actualizar registros
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