// Dependencies
import { jsPDF } from 'jspdf'
import qr from '../../qr'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

// Templates
import creditNote from './creditNote.js'
import debitNote from './debitNote.js'
import remittance from './remittance.js'
import ticket from './ticket.js'
import voucher from './voucher.js'

// Imports Destructuring
const { AfipQR } = qr
const { creditNoteTemplate } = creditNote
const { debitNoteTemplate } = debitNote
const { remittanceTemplate } = remittance
const { ticketTemplate } = ticket
const { voucherTemplate } = voucher


const processCanvas = async (frameToCanvas, htmlObject, docName, size) => {
    const canvasResult = new Promise(resolve => {
        try {
            const doc = new jsPDF('p', 'mm', size)
            frameToCanvas.appendChild(htmlObject)
            html2canvas(htmlObject, { allowTaint: true, useCORS: true, scale: 1 }).then(function (canvas) {
                const img = canvas.toDataURL('image/png')
                doc.addImage(img, 'JPEG', 0, 0)
                doc.save(docName)
                document.getElementById('voucher').innerHTML = ''
                resolve({ isProcesseed: true })
            })
        } catch (err) {
            console.error(err)
            resolve({ isProcesseed: false })
        }
    })
    return await canvasResult
}

const createCreditNotePdf = async (creditData) => {
    const qrToVoucher = new AfipQR(creditData)
    const qrImage = await QRCode.toDataURL(qrToVoucher.url)
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div')
    const docName = creditData.numeroCompletoFactura
    const size = [297, 210] // Expresed in mm
    htmlObject.innerHTML = creditNoteTemplate(creditData, qrImage)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const createDebitNotePdf = async (debitData) => {
    const qrToVoucher = new AfipQR(debitData)
    const qrImage = await QRCode.toDataURL(qrToVoucher.url)
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div')
    const docName = debitData.numeroCompletoFactura
    const size = [297, 210] // Expresed in mm
    htmlObject.innerHTML = debitNoteTemplate(debitData, qrImage)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const createRemittancePdf = async (remittanceData) => {
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div')
    const docName = remittanceData.numeroCompletoFactura
    const size = [297, 210] // Expresed in mm
    htmlObject.innerHTML = remittanceTemplate(remittanceData)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const createVoucherPdf = async (billData) => {
    const qrToVoucher = new AfipQR(billData)
    const qrImage = await QRCode.toDataURL(qrToVoucher.url)
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div')
    const docName = billData.numeroCompletoFactura
    const size = [297, 210] // Expresed in mm
    htmlObject.innerHTML = voucherTemplate(billData, qrImage)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const createTicketPdf = async (ticketData) => {
    const frameToCanvas = document.getElementById('ticket')
    const htmlObject = document.createElement('div')
    const docName = ticketData.numeroCompletoFactura
    const size = [297, 80] // Expresed in mm
    htmlObject.innerHTML = ticketTemplate(ticketData)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const commercialDocumentsPDF = {
    createCreditNotePdf,
    createDebitNotePdf,
    createRemittancePdf,
    createVoucherPdf,
    createTicketPdf
}

export default commercialDocumentsPDF