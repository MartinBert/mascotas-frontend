// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Design Components
import { Button, Col, DatePicker, Input, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { RangePicker } = DatePicker
const { addDays } = helpers.dateHelper
const { exportSimpleExcel } = helpers.excel
const { simpleDateWithHours } = helpers.dateHelper


const Header = ({ filters, setFilters, setPage, entradas_paginadas, entradas_totales }) => {
    const navigate = useNavigate()
    const [fecha, setFecha] = useState(null)
    const [descripcion, setDescripcion] = useState(null)
    const [entradasToReport, setEntradasToReport] = useState(null)
    useEffect(() => { setEntradasToReport(entradas_paginadas) }, [entradas_paginadas])

    const fetchEntradasByDates = async (value) => {
        if (value === null) setEntradasToReport(entradas_paginadas)
        else {
            const initialDate = (addDays(value[0].$d, 0)).toISOString()
            const finalDate = (addDays(value[1].$d, 1)).toISOString()
            const dateFilters = JSON.stringify({
                fecha: { $gte: initialDate, $lte: finalDate }
            })
            const data = await api.entradas.findByDatesRange(dateFilters)
            const entradas = data.docs
            setEntradasToReport(entradas)
        }
    }

    const processExcelLines = async (entradasToReport) => {
        const processedLines = []
        for await (let entrada of entradasToReport) {
            processedLines.push([
                (entrada.usuario) ? entrada.usuario.nombre : 'Usuario inexistente',
                simpleDateWithHours(entrada.fecha),
                entrada.descripcion,
                entrada.productos.reduce((acc, item) => {
                    acc = acc + item.nombre + ' (' + item.cantidadesEntrantes + '),'
                    return acc
                }, ''),
                entrada.costoTotal
            ])
        }
        return processedLines
    }

    const exportExcel = async () => {
        const nameOfSheet = 'Hoja de entradas'
        const nameOfDocument = 'Lista de entradas'
        const columnHeaders = [
            'Usuario',
            'Fecha',
            'Descripción',
            'Productos',
            'Costo total'
        ]
        const lines = await processExcelLines(entradasToReport)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const clearInputs = () => {
        setFecha(null)
        setDescripcion(null)
    }

    const onChangeFecha = (value) => {
        clearInputs()
        setFecha(value)
        const fechaForFilters = entradas_totales.map(entry => {
            const fechaToCompare = simpleDateWithHours(new Date(entry.fecha))
            if (fechaToCompare.includes(value)) return entry.fecha
            else return null
        })
        setFilters({ fecha: fechaForFilters })
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeDescripcion = (value) => {
        clearInputs()
        setDescripcion(value)
        setFilters({ descripcion: value })
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const redirectToForm = () => {
        navigate('/entradas/nuevo')
    }

    return (
        <Row gutter={8}>
            <Col span={4}>
                <Button
                    className='btn-primary'
                    onClick={() => redirectToForm()}
                >
                    Nueva entrada
                </Button>
            </Col>
            <Col span={4}>
                <Button
                    className='btn-primary'
                    onClick={() => exportExcel()}
                >
                    Exportar Excel
                </Button>
            </Col>
            <Col span={8}>
                <RangePicker
                    format='DD-MM-YYYY'
                    onChange={value => fetchEntradasByDates(value)}
                />
            </Col>
            <Col span={4} align='right'>
                <Input
                    type='primary'
                    placeholder='Buscar por fecha'
                    onChange={e => onChangeFecha(e.target.value)}
                    value={fecha}
                />
            </Col>
            <Col span={4} align='right'>
                <Input
                    type='primary'
                    placeholder='Buscar por descripción'
                    onChange={e => onChangeDescripcion(e.target.value)}
                    value={descripcion}
                />
            </Col>
        </Row>
    )
}

export default Header
