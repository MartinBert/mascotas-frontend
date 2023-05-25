// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Design Components
import { Row, Col, Input, DatePicker } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { RangePicker } = DatePicker
const { addDays } = helpers.dateHelper
const { exportSimpleExcel } = helpers.excel
const { simpleDateWithHours } = helpers.dateHelper


const Header = ({ setFilters, setPage, salidas_paginadas, salidas_totales }) => {
    const [fecha, setFecha] = useState(null)
    const [descripcion, setDescripcion] = useState(null)
    const [salidasToReport, setSalidasToReport] = useState(null)
    useEffect(() => { setSalidasToReport(salidas_paginadas) }, [salidas_paginadas])

    const fetchSalidasByDates = async (value) => {
        if (value === null) setSalidasToReport(salidas_paginadas)
        else {
            const initialDate = (addDays(value[0]._d, + 0)).toISOString()
            const finalDate = (addDays(value[1]._d, + 1)).toISOString()
            const response = await api.salidas.findByDates({ initialDate, finalDate })
            setSalidasToReport(response)
        }
    }

    const processExcelLines = async (salidasToReport) => {
        const processedLines = []
        for await (let salida of salidasToReport) {
            processedLines.push([
                (salida.usuario) ? salida.usuario.nombre : 'Usuario inexistente',
                salida.descripcion,
                simpleDateWithHours(salida.fecha),
                salida.productos.reduce((acc, item) => {
                    acc = acc + item.nombre + ' (' + item.cantidadesSalientes + '),'
                    return acc
                }, ''),
                salida.gananciaNetaTotal,

            ])
        }
        return processedLines
    }

    const exportExcel = async () => {
        const nameOfSheet = 'Hoja de salidas'
        const nameOfDocument = 'Lista de salidas'
        const columnHeaders = [
            'Usuario',
            'Descripción',
            'Fecha',
            'Productos',
            'Ganancia neta total',
        ]
        const lines = await processExcelLines(salidasToReport)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const clearInputs = () => {
        setFecha(null)
        setDescripcion(null)
    }

    const onChangeFecha = (value) => {
        clearInputs()
        setFecha(value)
        const fechaForFilters = salidas_totales.map(entry => {
            const fechaToCompare = simpleDateWithHours(new Date(entry.fecha))
            if (fechaToCompare.includes(value)) return entry.fecha
            else return null
        })
        setFilters(JSON.stringify({ fecha: fechaForFilters }))
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeDescripcion = (value) => {
        clearInputs()
        setDescripcion(value)
        setFilters(JSON.stringify({ descripcion: value }))
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    return (
        <Row gutter={8}>
            <Col span={4}>
                <Link to='/salidas/nuevo'>
                    <button className='btn-primary'>Nueva salida</button>
                </Link>
            </Col>
            <Col span={4}>
                <button
                    className='btn-primary'
                    onClick={() => exportExcel()}
                >
                    Exportar Excel
                </button>
            </Col>
            <Col span={8}>
                <RangePicker
                    format='DD-MM-YYYY'
                    onChange={value => fetchSalidasByDates(value)}
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