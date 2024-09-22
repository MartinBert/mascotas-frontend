// React Components and Hooks
import React, { useState, useEffect } from 'react'

// Custom Components
import icons from '../../../components/icons'
import { errorAlert } from '../../../components/alerts'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Col, Row, Table } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Services
import api from '../../../services'

// Views
import FiscalNoteModal from './FiscalNoteModal'
import Header from './Header'

// Imports Destructuring
const { useFiscalNoteModalContext } = contexts.FiscalNoteModal
const { EmitDocument, PrintPdf } = icons
const { fiscalVouchersCodes } = helpers.afipHelper
const {
    createBudgetPdf,
    createCreditNotePdf,
    createDebitNotePdf,
    createRemittancePdf,
    createVoucherPdf,
    createTicketPdf
} = helpers.pdfHelper.commercialDocumentsPDF


const creditCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.credit)
    .filter(code => code !== null)

const debitCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.debit)
    .filter(code => code !== null)

const voucherCodes = ['001', '016', '011', '051']

const ticketCodes = ['081', '082', '083', '111', '118']


const VentasList = () => {
    const [, fiscalNoteModal_dispatch] = useFiscalNoteModalContext()
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
            const stringFilters = JSON.stringify(filters)
            const salesData = await api.ventas.findPaginated({ page, limit, filters: stringFilters })
            setVentas(salesData.docs)
            setTotalDocs(salesData.totalDocs)
            setLoading(false)
        }
        fetchVentasList()
    }, [page, limit, filters, loading])

    useEffect(() => {
        const fetchDocumentos = async () => {
            const data = await api.documentos.findAll()
            const todosLosDocumentos = data.docs.map(doc => { return { value: doc.nombre, label: doc.nombre } })
            setDocumentos(data.docs)
            setDocumentosNombres(todosLosDocumentos)
        }
        fetchDocumentos()
    }, [])

    useEffect(() => {
        const fetchMediosPago = async () => {
            const data = await api.mediospago.findAll()
            const todosLosMediosDePago = data.docs.map(mp => { return { value: mp.nombre, label: mp.nombre } })
            setMediosPago(data.docs)
            setMediosPagoNombres(todosLosMediosDePago)
        }
        fetchMediosPago()
    }, [])

    const openFiscalNoteModal = async (ventaID) => {
        const referenceVoucher = await api.ventas.findById(ventaID)
        fiscalNoteModal_dispatch({ type: 'SET_REFERENCE_VOUCHER', payload: referenceVoucher })
        fiscalNoteModal_dispatch({ type: 'SHOW_FISCAL_NOTE_MODAL' })
    }

    const printVoucher = (venta) => {
        if (venta.documento.presupuesto) return createBudgetPdf(venta)
        else if (venta.documento.remito) return createRemittancePdf(venta)
        else if (
            venta.documento.ticket
            || ticketCodes.includes(venta.documento.codigoUnico)
        ) return createTicketPdf(venta)
        else if (creditCodes.includes(venta.documento.codigoUnico)) return createCreditNotePdf(venta)
        else if (debitCodes.includes(venta.documento.codigoUnico)) return createDebitNotePdf(venta)
        else if (voucherCodes.includes(venta.documento.codigoUnico)) return createVoucherPdf(venta)
        else return errorAlert('El sistema no identificó el documento de la venta. Inténtelo de nuevo o contacte al proveedor del servicio.')
    }

    const columnsForTable = [
        {
            dataIndex: 'salesList_user',
            render: (_, venta) => venta.usuario.nombre,
            title: 'Usuario'
        },
        {
            dataIndex: 'salesList_date',
            render: (_, venta) => venta.fechaEmisionString,
            title: 'Fecha'
        },
        {
            dataIndex: 'salesList_clientName',
            render: (_, venta) => venta.clienteRazonSocial,
            title: 'Cliente'
        },
        {
            dataIndex: 'salesList_saleTotal',
            render: (_, venta) => venta.total,
            title: 'Importe'
        },
        {
            dataIndex: 'salesList_documentName',
            render: (_, venta) => venta.documento.nombre,
            title: 'Comprobante'
        },
        {
            dataIndex: 'salesList_paymentMethods',
            render: (_, venta) => (
                <div style={{ lineHeight: 0 }}>
                    <p>{venta.mediosPagoNombres[0]}</p>
                    <small>{venta.planesPagoNombres[0]}</small>
                </div>
            ),
            title: 'Medio de pago'
        },
        {
            dataIndex: 'salesList_actions',
            render: (_, venta) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => printVoucher(venta)}
                        span={12}
                    >
                        <PrintPdf />
                    </Col>
                    {
                        fiscalVouchersCodes.includes(venta.documento.codigoUnico)
                            ? (
                                <Col
                                    onClick={() => openFiscalNoteModal(venta._id)}
                                    span={12}
                                >
                                    <EmitDocument />
                                </Col>
                            )
                            : null
                    }
                </Row>
            ),
            title: 'Acciones'
        }
    ]

    return (
        <Row>
            <div id='voucher' style={{ width: '793px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
            <div id='ticket' style={{ width: '303px', height: '1122px', zIndex: -9999, position: 'absolute', top: 0, left: 0 }}></div>
            <Col span={24} style={{ marginBottom: '10px' }}>
                <Header
                    setFilters={setFilters}
                    filters={filters}
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
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={loading}
                />
            </Col>
            <FiscalNoteModal />
        </Row>
    )
}

export default VentasList