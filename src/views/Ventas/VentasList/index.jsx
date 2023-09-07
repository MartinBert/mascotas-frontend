// React Components and Hooks
import React, { useState, useEffect } from 'react'

// Custom Components
import icons from '../../../components/icons'

// Design Components
import { Row, Col, Table } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Services
import api from '../../../services'

// Views
import Header from './Header'

// Imports Destructuring
const { PrintPdf } = icons
const { createVoucherPdf, createTicketPdf } = helpers.pdf


const VentasList = () => {
    const [ventas, setVentas] = useState(null)
    const [documentos, setDocumentos] = useState(null)
    const [documentosNombres, setDocumentosNombres] = useState(null)
    const [mediosPago, setMediosPago] = useState(null)
    const [mediosPagoNombres, setMediosPagoNombres] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)

    useEffect(() => {
        const fetchVentasList = async () => {
            const data = await api.ventas.findAll({ page, limit, filters })
            setVentas(data.docs)
            setTotalDocs(data.totalDocs)
            setLoading(false)

            const allVentas = await api.ventas.findAll()
            for (let index = 0; index < allVentas.length; index++) {
                const element = allVentas[index]
                element.totalRedondeado = roundTwoDecimals(roundToMultiple(element.total, 10))
                element.totalDiferencia = roundTwoDecimals(element.total - roundToMultiple(element.total, 10))
                await api.ventas.edit(element)
            }
        }
        fetchVentasList()
    }, [page, limit, filters, loading])

    useEffect(() => {
        const fetchDocumentos = async () => {
            const data = await api.documentos.findAll(null)
            const todosLosDocumentos = data.map(doc => { return { value: doc.nombre, label: doc.nombre } })
            setDocumentos(data)
            setDocumentosNombres(todosLosDocumentos)
        }
        fetchDocumentos()
    }, [])

    useEffect(() => {
        const fetchMediosPago = async () => {
            const data = await api.mediospago.findAll(null)
            const todosLosMediosDePago = data.map(mp => { return { value: mp.nombre, label: mp.nombre } })
            setMediosPago(data)
            setMediosPagoNombres(todosLosMediosDePago)
        }
        fetchMediosPago()
    }, [])

    const columnsForTable = [
        {
            title: 'Usuario',
            render: (venta) => (
                <p>{(venta.usuario) ? venta.usuario.nombre : 'Usuario inexistente'}</p>
            ),
        },
        {
            title: 'Fecha',
            render: (venta) => (
                <p>{venta.fechaEmisionString}</p>
            ),
        },
        {
            title: 'Cliente',
            render: (venta) => (
                <p>{venta.clienteRazonSocial}</p>
            ),
        },
        {
            title: 'Importe',
            render: (venta) => (
                <p>{venta.total}</p>
            ),
        },
        {
            title: 'Comprobante',
            render: (venta) => (
                <p>{venta.documento.nombre}</p>
            ),
        },
        {
            title: 'Medio de pago',
            render: (venta) => (
                <div style={{ lineHeight: 0 }}>
                    <p>{venta.mediosPagoNombres}</p>
                    <small>{venta.planesPagoNombres}</small>
                </div>
            ),
        },
        {
            title: 'Acciones',
            render: (venta) => (
                <Row>
                    <div onClick={() => {
                        venta.documentoFiscal
                            ? createVoucherPdf(venta)
                            : createTicketPdf(venta)
                    }}
                    >
                        <PrintPdf />
                    </div>
                </Row>
            )
        }
    ]

    return (
        <Row>
            <div id='voucher' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
            <div id='ticket' style={{ width: '303px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
            <Col span={24} style={{ marginBottom: '10px' }}>
                <Header
                    setFilters={setFilters}
                    setPage={setPage}
                    ventas={ventas}
                    documentos={documentos}
                    documentosNombres={documentosNombres}
                    mediosPago={mediosPago}
                    mediosPagoNombres={mediosPagoNombres}
                />
            </Col>
            <Col span={24}>
                <Table
                    width={'100%'}
                    dataSource={ventas}
                    columns={columnsForTable}
                    pagination={{
                        current: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: (e) => { setPage(e) },
                        onShowSizeChange: (e, val) => { setLimit(val) }
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={loading}
                />
            </Col>
        </Row>
    )
}

export default VentasList