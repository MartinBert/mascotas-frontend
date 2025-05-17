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
const { useRenderConditionsContext } = contexts.RenderConditions
const { EmitDocument, PrintPdf } = icons
const { creditCodes, debitCodes, invoiceCodes, invoiceAndTicketCodes, ticketCodes } = helpers.afipHelper
const { afipDateToLocalFormat } = helpers.dateHelper
const {
    createBudgetPdf,
    createCreditNotePdf,
    createDebitNotePdf,
    createInvoicePdf,
    createRemittancePdf,
    createTicketPdf,
    validations
} = helpers.pdfHelper
const { getAssociatedData } = validations


const VentasList = () => {
    const [fiscalNoteModal_state, fiscalNoteModal_dispatch] = useFiscalNoteModalContext()
    const [renderConditions_state, renderConditions_dispatch] = useRenderConditionsContext()

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

    // ------------------------------------- Load data --------------------------------------- //
    const loadRenderConditions = async () => {
        const recordsQuantityOfSales = await api.sales.countRecords()
        renderConditions_dispatch({
            type: 'SET_EXISTS_SALES',
            payload: recordsQuantityOfSales < 1 ? false : true
        })
    }

    const fetchDocumentos = async () => {
        const data = await api.documents.findAll()
        const todosLosDocumentos = data.docs.map(doc => { return { value: doc.nombre, label: doc.nombre } })
        setDocumentos(data.docs)
        setDocumentosNombres(todosLosDocumentos)
    }

    const fetchMediosPago = async () => {
        const data = await api.paymentMethods.findAll()
        const todosLosMediosDePago = data.docs.map(mp => { return { value: mp.nombre, label: mp.nombre } })
        setMediosPago(data.docs)
        setMediosPagoNombres(todosLosMediosDePago)
    }

    const fetchVentasList = async () => {
        const stringFilters = JSON.stringify(filters)
        const salesData = await api.sales.findPaginated({ page, limit, filters: stringFilters })
        setVentas(salesData.docs)
        setTotalDocs(salesData.totalDocs)
        setLoading(false)
    }

    useEffect(() => {
        loadRenderConditions()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchVentasList()
        // eslint-disable-next-line
    }, [page, limit, filters, loading, fiscalNoteModal_state.fiscalNoteModalIsVisible])

    useEffect(() => {
        // eslint-disable-next-line
        fetchDocumentos()
    }, [])

    useEffect(() => {
        fetchMediosPago()
        // eslint-disable-next-line
    }, [])

    // -------------------------------------- Actions ---------------------------------------- //
    const openFiscalNoteModal = async (ventaID) => {
        const referenceVoucher = await api.sales.findById(ventaID)
        fiscalNoteModal_dispatch({ type: 'SET_REFERENCE_VOUCHER', payload: referenceVoucher })
        fiscalNoteModal_dispatch({ type: 'SHOW_FISCAL_NOTE_MODAL' })
    }
    
    const printVoucher = async (venta) => {
        if (venta.documento.presupuesto) {
            if (venta.documento.fiscal) {
                venta.cae = venta.cae ?? 'no-data'
                venta.vencimientoCae = afipDateToLocalFormat(venta.vencimientoCae)
            }
            return createBudgetPdf(venta)
        }
        else if (venta.documento.remito) {
            if (venta.documento.fiscal) {
                venta.cae = venta.cae ?? 'no-data'
                venta.vencimientoCae = afipDateToLocalFormat(venta.vencimientoCae)
            }
            return createRemittancePdf(venta)
        }
        else if (
            venta.documento.ticket
            || ticketCodes.includes(venta.documento.codigoUnico)
        ) {
            if (venta.documento.fiscal) {
                venta.cae = venta.cae ?? 'no-data'
                venta.vencimientoCae = afipDateToLocalFormat(venta.vencimientoCae)
            }
            return createTicketPdf(venta)
        }
        else if (creditCodes.includes(venta.documento.codigoUnico)) {
            const associatedData = await getAssociatedData(venta, 'print')
            createCreditNotePdf(venta, associatedData)
        }
        else if (debitCodes.includes(venta.documento.codigoUnico)) {
            const associatedData = await getAssociatedData(venta, 'print')
            createDebitNotePdf(venta, associatedData)
        }
        else if (invoiceCodes.includes(venta.documento.codigoUnico)) {
            if (venta.documento.fiscal) {
                venta.cae = venta.cae ?? 'no-data'
                venta.vencimientoCae = afipDateToLocalFormat(venta.vencimientoCae)
            }
            return createInvoicePdf(venta)
        }
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
                        invoiceAndTicketCodes.includes(venta.documento.codigoUnico)
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
        <>
            {
                !renderConditions_state.existsSales
                    ? <h1>Debes registrar al menos una venta antes de comenzar a utilizar esta función.</h1>
                    : (
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
        </>
    )
}

export default VentasList