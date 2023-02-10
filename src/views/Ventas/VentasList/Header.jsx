import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Select, DatePicker } from 'antd'
import helpers from '../../../helpers'
import api from '../../../services'

const { RangePicker } = DatePicker
const { exportSimpleExcel } = helpers.excel
const { addDays } = helpers.dateHelper

const Header = ({ setFilters, setPage, ventas, documentos, documentosNombres }) => {
    const [fecha, setFecha] = useState(null)
    const [cliente, setCliente] = useState(null)
    const [documentosSeleccionados, setDocumentosSeleccionados] = useState([])
    const [ventasToReport, setVentasToReport] = useState(null)
    useEffect(() => { setVentasToReport(ventas) }, [ventas])

    const fetchVentasByDates = async (value) => {
        if (value === null) setVentasToReport(ventas)
        else {
            const initialDate = (addDays(value[0]._d, + 0)).toISOString()
            const finalDate = (addDays(value[1]._d, + 1)).toISOString()
            const response = await api.ventas.findByDates({ initialDate, finalDate })
            setVentasToReport(response)
        }
    }

    const processLines = (ventasToReport) => {
        const processedLines = []
        ventasToReport.forEach(venta => {
            processedLines.push([
                venta.fechaEmisionString,
                (venta.usuario) ? venta.usuario.nombre : 'Usuario inexistente',
                venta.clienteRazonSocial,
                venta.documento.nombre,
                venta.total
            ])
        })
        return processedLines
    }

    const exportExcel = () => {
        const nameOfSheet = 'Hoja de ventas'
        const nameOfDocument = 'Lista de ventas'
        const columnHeaders = [
            'Fecha',
            'Usuario',
            'Cliente',
            'Comprobante',
            'Total de venta',
        ]
        const lines = processLines(ventasToReport)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const clearInputs = () => {
        setFecha(null)
        setCliente(null)
        setDocumentosSeleccionados([])
    }

    const onChangeFecha = (value) => {
        clearInputs()
        setFecha(value)
        setFilters(JSON.stringify({ fechaEmisionString: value }))
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeClientes = (value) => {
        clearInputs()
        setCliente(value)
        setFilters(JSON.stringify({ clienteRazonSocial: value }))
        if (value.length < 1) setFilters(null)
        setPage(1)
    }

    const onChangeDocumentos = (value) => {
        clearInputs()
        setDocumentosSeleccionados(value)
        const documentosForFilters = documentos.map(doc => {
            if (value.includes(doc.nombre)) return doc
            else return null
        })
        setFilters(JSON.stringify({ documento: documentosForFilters }))
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
                    <Col span={4}>
                        <Input
                            type='primary'
                            placeholder='Buscar por fecha'
                            onChange={e => onChangeFecha(e.target.value)}
                            value={fecha}
                        />
                    </Col>
                    <Col span={4}>
                        <Input
                            type='primary'
                            placeholder='Buscar por cliente'
                            onChange={e => onChangeClientes(e.target.value)}
                            value={cliente}
                        />
                    </Col>
                    <Col span={4} align='right'>
                        <Select
                            style={{ width: '100%', textAlign: 'left' }}
                            mode='multiple'
                            options={documentosNombres}
                            value={documentosSeleccionados}
                            placeholder='Buscar por comprobante'
                            onChange={value => onChangeDocumentos(value)}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Header
