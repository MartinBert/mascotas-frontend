// React Components and Hooks
import React, { useState, useEffect } from 'react'

// Design Components
import { Row, Col, Input, Select, DatePicker } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Services
import api from '../../../services'

// Imports Destructuring
const { RangePicker } = DatePicker
const { exportSimpleExcel } = helpers.excel
const { addDays } = helpers.dateHelper


const Header = ({ setFilters, setPage, ventas, documentos, documentosNombres, mediosPago, mediosPagoNombres }) => {
    const [fecha, setFecha] = useState(null)
    const [cliente, setCliente] = useState(null)
    const [documentosSeleccionados, setDocumentosSeleccionados] = useState([])
    const [mediosPagoSeleccionados, setMediosPagoSeleccionados] = useState([])
    const [ventasToReport, setVentasToReport] = useState(null)
    useEffect(() => { setVentasToReport(ventas) }, [ventas])

    const fetchVentasByDates = async (value) => {
        if (value === null) setVentasToReport(ventas)
        else {
            const initialDate = (addDays(value[0].$d, 0)).toISOString()
            const finalDate = (addDays(value[1].$d, 1)).toISOString()
            const dateFilters = JSON.stringify({
                fechaEmision: { $gte: initialDate, $lte: finalDate }
            })
            const data = await api.ventas.findByDatesRange(dateFilters)
            const ventas = data.docs
            setVentasToReport(ventas)
        }
    }

    const processLines = (ventasToReport) => {
        const processedLines = []
        ventasToReport.forEach(venta => {
            processedLines.push([
                (venta.usuario) ? venta.usuario.nombre : 'Usuario inexistente',
                venta.fechaEmisionString,
                venta.clienteRazonSocial,
                venta.total,
                venta.documento.nombre,
                venta.mediosPagoNombres,
            ])
        })
        return processedLines
    }

    const exportExcel = () => {
        const nameOfSheet = 'Hoja de ventas'
        const nameOfDocument = 'Lista de ventas'
        const columnHeaders = [
            'Usuario',
            'Fecha',
            'Cliente',
            'Importe',
            'Comprobante',
            'Medio de pago'
        ]
        const lines = processLines(ventasToReport)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const clearInputs = () => {
        setFecha(null)
        setCliente(null)
        setDocumentosSeleccionados([])
        setMediosPagoSeleccionados([])
    }

    const onChangeFecha = (value) => {
        clearInputs()
        setFecha(value)
        setFilters({ fechaEmisionString: value })
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeClientes = (value) => {
        clearInputs()
        setCliente(value)
        setFilters({ clienteRazonSocial: value })
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeDocumentos = (value) => {
        clearInputs()
        setDocumentosSeleccionados(value)
        const documentosForFilters = documentos.map(doc => {
            if (value.includes(doc.nombre)) return doc
            else return null
        }).filter(doc => doc !== null)
        setFilters({ documento: documentosForFilters })
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeMediosPago = (value) => {
        clearInputs()
        setMediosPagoSeleccionados(value)
        const mediosDePagoForFilters = mediosPago.map(mp => {
            if (value.includes(mp.nombre)) return mp._id
            else return null
        }).filter(mp => mp !== null)
        setFilters({ mediosPago: mediosDePagoForFilters })
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    return (
        <Row>
            <Col span={24}>
                <Row align='end'>
                    <Col span={4}>
                        <button
                            className='btn-primary'
                            onClick={() => { exportExcel() }}
                        >
                            Reporte de ventas
                        </button>
                    </Col>
                    <Col span={8}>
                        <RangePicker
                            format='DD-MM-YYYY'
                            onChange={value => fetchVentasByDates(value)}
                        />
                    </Col>
                    <Col span={3}>
                        <Input
                            type='primary'
                            placeholder='Buscar por fecha'
                            onChange={e => onChangeFecha(e.target.value)}
                            value={fecha}
                        />
                    </Col>
                    <Col span={3}>
                        <Input
                            type='primary'
                            placeholder='Buscar por cliente'
                            onChange={e => onChangeClientes(e.target.value)}
                            value={cliente}
                        />
                    </Col>
                    <Col span={3}>
                        <Select
                            style={{ width: '100%' }}
                            mode='multiple'
                            options={documentosNombres}
                            value={documentosSeleccionados}
                            placeholder='Comprobante'
                            onChange={value => onChangeDocumentos(value)}
                        />
                    </Col>
                    <Col span={3}>
                        <Select
                            style={{ width: '100%' }}
                            options={mediosPagoNombres}
                            value={mediosPagoSeleccionados}
                            placeholder='Medio de pago'
                            onChange={value => onChangeMediosPago(value)}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Header
