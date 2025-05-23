// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Custom components
import { errorAlert } from '../../components/alerts'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Input, Row, Select } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { formatFindFilters, nullifyFilters } = actions.paginationParams
const { useEntriesContext } = contexts.Entries
const { RangePicker } = DatePicker
const { resetDateTo2359hs, resetDateTo00hs } = helpers.dateHelper
const { generateExcel } = helpers.excel
const { simpleDateWithHours } = helpers.dateHelper
const { existsProperty } = helpers.objHelper
const { regExp } = helpers.stringHelper
const { ifNotNumber, ifNotNumbersOrBar, ifSpecialCharacter } = regExp


const Header = () => {
    const navigate = useNavigate()
    const [entries_state, entries_dispatch] = useEntriesContext()

    // ------------------------------ Button to clean filters -------------------------------- //
    const cleanFilters = () => {
        const filters = nullifyFilters(entries_state.paginationParams.filters)
        const paginationParams = { ...entries_state.paginationParams, filters, page: 1 }
        entries_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const buttonToCleanFilters = (
        <Button
            danger
            onClick={cleanFilters}
            style={{ width: '100%' }}
            type='primary'
        >
            Limpiar filtros
        </Button>
    )

    // ------------------------------ Button to export Excel -------------------------------- //
    const processExcelLines = async (columnHeaders) => {
        let entriesForReport
        if (entries_state.entriesForExcelReport.length > 0) {
            entriesForReport = entries_state.entriesForExcelReport
        } else {
            const findAllFilteredEntries = await api.entries.findAllByFilters(formatFindFilters(entries_state.paginationParams.filters))
            entriesForReport = findAllFilteredEntries.data.docs
        }
        const processedLines = []
        for await (let entrada of entriesForReport) {
            const productosString = entrada.productos.reduce((acc, item) => {
                acc = acc + item.nombre + ' (' + item.cantidadesEntrantes + '), '
                return acc
            }, '')
            const activeOptions = []
            if (columnHeaders.includes('Usuario')) activeOptions.push(entrada.usuario ? entrada.usuario.nombre : '-- Usuario inexistente --')
            if (columnHeaders.includes('Fecha')) activeOptions.push(entrada.fecha ? simpleDateWithHours(entrada.fecha) : '-- Fecha no registrada --')
            if (columnHeaders.includes('Descripción')) activeOptions.push(entrada.descripcion ? entrada.descripcion : '-- Sin descripción --')
            if (columnHeaders.includes('Productos')) activeOptions.push(entrada.productos ? productosString.substring(0, productosString.length - 2) : '-- Sin productos --')
            if (columnHeaders.includes('Costo total')) activeOptions.push(entrada.costoTotal ? entrada.costoTotal : '-- Costo total no calculado --')
            processedLines.push(activeOptions)
        }
        return processedLines
    }

    const exportExcel = async () => {
        const nameOfDocument = 'Lista de entradas'
        const nameOfSheet = 'Hoja de entradas'
        const selectedHeaders = entries_state.activeExcelOptions.map(option => option.label)
        const columnHeaders = selectedHeaders.includes('Todas') ? entries_state.allExcelTitles.filter(option => option !== 'Todas') : selectedHeaders
        const lines = await processExcelLines(columnHeaders)
        const result = await generateExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
        if (!result.isCreated) return errorAlert('No se pudo exportar la lista de entradas. Inténtelo de nuevo.')
        return { isCreated: result.isCreated, docType: 'excel' }
    }

    const buttonToExportExcel = (
        <Button
            className='btn-primary'
            onClick={exportExcel}
        >
            Exportar Excel
        </Button>
    )

    // ----------------------------- Button to redirect to form ------------------------------ //
    const redirectToForm = () => {
        navigate('/entradas/nuevo')
    }

    const buttonOfNewEntry = (
        <Button
            className='btn-primary'
            onClick={redirectToForm}
        >
            Nueva entrada
        </Button>
    )

    // ---------------------------- Range picker to export Excel ----------------------------- //
    const fetchEntradasByDates = async (arrayOfDates, rangeDatesString) => {
        let findEntries
        if (!arrayOfDates) findEntries = { docs: [] }
        else {
            const initialDate = resetDateTo00hs(arrayOfDates[0].$d)
            const finalDate = resetDateTo2359hs(arrayOfDates[1].$d)
            const dateFilters = JSON.stringify({ fecha: { $gte: initialDate, $lte: finalDate } })
            findEntries = await api.entries.findAllByFilters(dateFilters)
        }
        const entriesForExcelReport = findEntries.data.docs
        const rangePickerValueForExcelReport = rangeDatesString
        return entries_dispatch({
            type: 'SET_ENTRIES_FOR_EXCEL_REPORT',
            payload: { entriesForExcelReport, rangePickerValueForExcelReport }
        })
    }

    const rangePickerToExportExcel = (
        <RangePicker
            format='DD-MM-YYYY'
            onChange={fetchEntradasByDates}
            style={{ width: '100%' }}
            value={entries_state.rangePickerValueForExcelReport}
        />
    )

    // --------------------------- Select options to export Excel ---------------------------- //
    const selectOptions = [
        { disabled: false, label: 'Todas', value: 'todas' },
        { disabled: false, label: 'Usuario', value: 'usuario' },
        { disabled: true, label: 'Fecha', value: 'fecha' },
        { disabled: false, label: 'Descripción', value: 'descripcion' },
        { disabled: false, label: 'Productos', value: 'productos' },
        { disabled: false, label: 'Costo total', value: 'costoTotal' },
    ]

    const changeExcelOptions = (e) => {
        let selectedOptions
        if (e.length === 0) selectedOptions = [{ disabled: false, label: 'Todas', value: 'todas' }]
        else {
            selectedOptions = selectOptions.map(option => {
                const eventValues = e.map(eventOption => eventOption.value)
                if (eventValues.includes(option.value)) return option
                else return null
            }).filter(option => option)
        }
        entries_dispatch({ type: 'SET_EXCEL_OPTIONS', payload: selectedOptions })
    }

    const selectExcelOptions = (e) => {
        if (e.value === 'todas') entries_dispatch({ type: 'SELECT_ALL_EXCEL_OPTIONS' })
        else entries_dispatch({ type: 'DESELECT_ALL_EXCEL_OPTIONS' })
    }

    const selectOptionsToExportExcel = (
        <Select
            allowClear
            labelInValue
            mode='multiple'
            onChange={changeExcelOptions}
            onSelect={selectExcelOptions}
            options={selectOptions}
            placeholder='Elige una opción'
            style={{ width: '100%' }}
            value={entries_state.activeExcelOptions}
        />
    )

    // ---------------------------------- Set filters ----------------------------------- //
    const dispatchPaginationParams = (filtersData) => {
        const newFiltersKeys = Object.keys(filtersData)
        const newFiltersValues = Object.values(filtersData)
        const filters = { ...entries_state.paginationParams.filters }
        for (let index = 0; index < newFiltersKeys.length; index++) {
            const key = newFiltersKeys[index]
            filters[key] = newFiltersValues[index]
        }
        const paginationParams = { ...entries_state.paginationParams, filters, page: 1 }
        entries_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    // --------- Filter entries by date ---------- //
    const onChangeDate = (e) => {
        const dateFilter = e.target.value === ''
            ? null
            : e.target.value.replace(ifNotNumbersOrBar, '')
        const filters = { fechaString: dateFilter }
        dispatchPaginationParams(filters)
    }

    const filterByDate = (
        <Input
            type='primary'
            placeholder='Buscar por fecha'
            onChange={onChangeDate}
            value={entries_state.paginationParams.filters.fechaString}
        />
    )

    // ------ Filter entries by description ------ //
    const onChangeDescription = (e) => {
        const descriptionFilter = e.target.value === ''
            ? null
            : e.target.value.replace(ifSpecialCharacter, '')
        const filters = { descripcion: descriptionFilter }
        dispatchPaginationParams(filters)
    }

    const filterByDescription = (
        <Input
            type='primary'
            placeholder='Buscar por descripción'
            onChange={onChangeDescription}
            value={entries_state.paginationParams.filters.descripcion}
        />
    )

    // -------- Filter entries by import --------- //
    const onChangeMaxImport = (e) => {
        const value = e.target.value
        const totalCostFilter = entries_state.paginationParams.filters.costoTotal
        const existPreviousMin = existsProperty(totalCostFilter, '$gte')
        const minImport = existPreviousMin ? { $gte: totalCostFilter.$gte } : null
        const maxImport = value !== '' ? { $lte: value.replace(ifNotNumber, '') } : null
        const filtersData = { costoTotal: (!minImport && !maxImport) ? null : { ...minImport, ...maxImport } }
        dispatchPaginationParams(filtersData)
    }

    const onChangeMinImport = (e) => {
        const value = e.target.value
        const totalCostFilter = entries_state.paginationParams.filters.costoTotal
        const existPreviousMax = existsProperty(totalCostFilter, '$lte')
        const minImport = value !== '' ? { $gte: value.replace(ifNotNumber, '') } : null
        const maxImport = existPreviousMax ? { $lte: totalCostFilter.$lte } : null
        const filtersData = { costoTotal: (!minImport && !maxImport) ? null : { ...minImport, ...maxImport } }
        dispatchPaginationParams(filtersData)
    }

    const filterByImport = (
        <Row gutter={8}>
            <Col span={12}>
                <Input
                    type='primary'
                    placeholder='Importe mínimo'
                    onChange={onChangeMinImport}
                    style={{ width: '100%' }}
                    value={
                        entries_state.paginationParams.filters.costoTotal
                            ? entries_state.paginationParams.filters.costoTotal.$gte
                            : null
                    }
                />
            </Col>
            <Col span={12}>
                <Input
                    type='primary'
                    placeholder='Importe máximo'
                    onChange={onChangeMaxImport}
                    style={{ width: '100%' }}
                    value={
                        entries_state.paginationParams.filters.costoTotal
                            ? entries_state.paginationParams.filters.costoTotal.$lte
                            : null
                    }
                />
            </Col>
        </Row>
    )


    const header = [
        {
            element: buttonOfNewEntry,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: filterByDescription,
            order: { lg: 2, md: 2, sm: 5, xl: 2, xs: 5, xxl: 2 }
        },
        {
            element: buttonToExportExcel,
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: filterByDate,
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 }
        },
        {
            element: rangePickerToExportExcel,
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: filterByImport,
            order: { lg: 6, md: 6, sm: 7, xl: 6, xs: 7, xxl: 6 }
        },
        {
            element: selectOptionsToExportExcel,
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        },
        {
            element: buttonToCleanFilters,
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 24, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
            {
                header.map((item, index) => {
                    return (
                        <Col
                            key={'entries_header_' + index}
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
    )
}

export default Header