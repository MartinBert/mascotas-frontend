// Dependencies
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import qr from '../qr'
import QRCode from 'qrcode'

// Helpers
import dateHelper from '../dateHelper'
import mathHelper from '../mathHelper'

// Templates
import createBudgetTemplate from './budgetTemplate'
import createCreditNoteTemplate from './creditNoteTemplate'
import createDebitNoteTemplate from './debitNoteTemplate'
import createInvoiceTemplate from './invoiceTemplate'
import createRemittanceTemplate from './remittanceTemplate'
import createTicketTemplate from './ticketTemplate'
import createProductsCatalogueTemplate from './productsCatalogueTemplate'
import validations from './validations'

// Imports Destructuring
const { localFormat } = dateHelper
const { nextInteger } = mathHelper
const { AfipQR } = qr


const createPdf = async (pdfData) => {
    const {
        createTemplate,
        data,
        divFrame,
        docName,
        numberOfLinesInFrontPage,
        numberOfLinesPerPage,
        qrImage = null,
        sheetSize
    } = pdfData

    let currentPage
    let isFrontPage
    let templateData
    const totalPages = 1 + (nextInteger((data.renglones.length - numberOfLinesInFrontPage) / numberOfLinesPerPage))
    const dataForPdf = []

    // Front page
    currentPage = 1
    isFrontPage = true
    if (!data.renglones) data.renglones = []
    const linesForFrontPage = data.renglones.slice(0, numberOfLinesInFrontPage)
    templateData = { currentPage, data: { ...data, renglones: linesForFrontPage }, isFrontPage, qrImage, totalPages }
    const frontPageContainer = document.createElement('div')
    frontPageContainer.innerHTML = createTemplate(templateData)
    dataForPdf.push(frontPageContainer)

    // Add more pages to pdf
    const linesLength = data.renglones.length
    const isLongerThanOnePage = linesLength > numberOfLinesInFrontPage ? true : false
    if (isLongerThanOnePage) {
        // Lines to add
        const linesToAdd = data.renglones.slice(numberOfLinesInFrontPage, linesLength)
        // Generate data for pages
        for (let index = 0; index < totalPages - 1; index++) {
            const linesForPage = linesToAdd.slice(index * numberOfLinesPerPage, (index + 1) * numberOfLinesPerPage)
            data.renglones = linesForPage
            isFrontPage = false
            currentPage = index + 2
            templateData = { currentPage, data, isFrontPage, qrImage, totalPages }
            const pageContainer = document.createElement('div')
            pageContainer.innerHTML = createTemplate(templateData)
            dataForPdf.push(pageContainer)
        }
    }
    
    // Generate PDF
    const resultsOfLoop = []
    const doc = new jsPDF('p', 'mm', sheetSize) // 'sheetSize expresed in mm
    for (let index = 0; index < dataForPdf.length; index++) {
        try {
            const frame = document.getElementById(divFrame)
            frame.appendChild(dataForPdf[index])
            const canvasOptions = { allowTaint: true, useCORS: true, scale: 1 }
            const canvas = await html2canvas(dataForPdf[index], canvasOptions)
            if (index > 0) doc.addPage('a4', 'p')
            const img = canvas.toDataURL('image/png')
            doc.addImage(img, 'JPEG', 0, 0)
            resultsOfLoop.push(true)
        } catch (error) {
            console.error(error)
            resultsOfLoop.push(false)
        }
    }
    doc.save(docName)
    document.getElementById(divFrame).innerHTML = ''
    const result = resultsOfLoop.includes(false) ? { isProcessed: false } : { isProcessed: true }
    return { isCreated: result.isProcessed }
}

const getQrImage = async (voucherData) => {
    let qrImage
    if (voucherData.isFiscal || voucherData.documento.fiscal) {
        const qrToVoucher = new AfipQR(voucherData)
        qrImage = await QRCode.toDataURL(qrToVoucher.url)
    } else qrImage = null
    return qrImage
}

const createBudgetPdf = async (budgetData) => {
    const qrImage = await getQrImage(budgetData)

    const pdfData = {
        createTemplate: createBudgetTemplate,
        data: budgetData,
        divFrame: 'voucher',
        docName: 'PRESUPUESTO_' + budgetData.numeroCompletoFactura,
        numberOfLinesInFrontPage: 11,
        numberOfLinesPerPage: 15,
        qrImage,
        sheetSize: [297, 210]
    }

    const result = await createPdf(pdfData)
    return result
}

const createCreditNotePdf = async (creditNoteData) => {
    const qrImage = await getQrImage(creditNoteData)

    const pdfData = {
        createTemplate: createCreditNoteTemplate,
        data: creditNoteData,
        divFrame: 'voucher',
        docName: 'NOTA_CREDITO_' + creditNoteData.numeroCompletoFactura,
        numberOfLinesInFrontPage: 11,
        numberOfLinesPerPage: 15,
        qrImage,
        sheetSize: [297, 210]
    }

    const result = await createPdf(pdfData)
    return result
}

const createDebitNotePdf = async (debitNoteData) => {
    const qrImage = await getQrImage(debitNoteData)

    const pdfData = {
        createTemplate: createDebitNoteTemplate,
        data: debitNoteData,
        divFrame: 'voucher',
        docName: 'NOTA_DEBITO_' + debitNoteData.numeroCompletoFactura,
        numberOfLinesInFrontPage: 11,
        numberOfLinesPerPage: 15,
        qrImage,
        sheetSize: [297, 210]
    }

    const result = await createPdf(pdfData)
    return result
}

const createInvoicePdf = async (invoiceData) => {
    const qrImage = await getQrImage(invoiceData)

    const pdfData = {
        createTemplate: createInvoiceTemplate,
        data: invoiceData,
        divFrame: 'voucher',
        docName: 'FACTURA_' + invoiceData.numeroCompletoFactura,
        numberOfLinesInFrontPage: 11,
        numberOfLinesPerPage: 15,
        qrImage,
        sheetSize: [297, 210]
    }

    const result = await createPdf(pdfData)
    return result
}

const createProductsCataloguePdf = async (productsCatalogueData) => {
    const exportWithImages = productsCatalogueData.headers.includes('Ilustración')
    const qrImage = null

    const pdfData = {
        createTemplate: createProductsCatalogueTemplate,
        data: productsCatalogueData,
        divFrame: 'catalogue',
        docName: 'LISTA_PRECIOS_' + localFormat(new Date()),
        numberOfLinesInFrontPage: exportWithImages ? 8 : 31,
        numberOfLinesPerPage: exportWithImages ? 12 : 45,
        qrImage,
        sheetSize: [297, 210]
    }

    const result = await createPdf(pdfData)
    return result
}

const createRemittancePdf = async (remittanceData) => {
    const qrImage = await getQrImage(remittanceData)

    const pdfData = {
        createTemplate: createRemittanceTemplate,
        data: remittanceData,
        divFrame: 'voucher',
        docName: 'REMITO_' + remittanceData.numeroCompletoFactura,
        numberOfLinesInFrontPage: 11,
        numberOfLinesPerPage: 15,
        qrImage,
        sheetSize: [297, 210]
    }

    const result = await createPdf(pdfData)
    return result
}

const createTicketPdf = async (ticketData) => {
    const qrImage = await getQrImage(ticketData)

    const pdfData = {
        createTemplate: createTicketTemplate,
        data: ticketData,
        divFrame: 'ticket',
        docName: 'TICKET_' + ticketData.numeroCompletoFactura,
        numberOfLinesInFrontPage: 11,
        numberOfLinesPerPage: 15,
        qrImage,
        sheetSize: [297, 80]
    }

    const result = await createPdf(pdfData)
    return result
}

const pdfHelper = {
    createBudgetPdf,
    createCreditNotePdf,
    createDebitNotePdf,
    createInvoicePdf,
    createProductsCataloguePdf,
    createRemittancePdf,
    createTicketPdf,
    validations
}

export default pdfHelper