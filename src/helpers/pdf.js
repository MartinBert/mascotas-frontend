import { jsPDF } from 'jspdf';
import stringHelper from './stringHelper.js';
import dateHelper from './dateHelper.js';
import mathHelper from './mathHelper.js';
import qr from './qr.js';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const { completeLengthWithZero } = stringHelper;
const { simpleDateWithHours } = dateHelper;
const { roundTwoDecimals } = mathHelper;
const { AfipQR } = qr;

/*const showSurchargesAndDiscounts = 
    [${
        (saleData.totalDescuento)
        ? `
        <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-top: 15px; font-size: 10px;'>
            <div style='width: 12%;'>-</div>
            <div style='width: 34%;'>DESCUENTO TOTAL APLICADO</div>
            <div style='width: 10%;'>-</div>
            <div style='width: 10%;'>-</div>
            <div style='width: 12%;'>-</div>
            <div style='width: 12%;'>-</div>
            <div style='width: 10%; text-align: right;'>- ${saleData.totalDescuento}</div>
        </div> `
        :''
    }
    ${
        (saleData.totalRecargo) 
        ? `
        <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-top: 15px; font-size: 10px;'>
            <div style='width: 12%;'>-</div>
            <div style='width: 34%;'>RECARGO TOTAL PLICADO</div>
            <div style='width: 10%;'>-</div>
            <div style='width: 10%;'>-</div>
            <div style='width: 12%;'>-</div>
            <div style='width: 12%;'>-</div>
            <div style='width: 10%; text-align: right;'>${saleData.totalRecargo}</div>
        </div> `
        :'' 
        width: 793px; height: 1122px
    }]*/

const voucherTemplate = (saleData, qrImage) => {
    return `
    <div style='width: 793px; height: 1122px; line-height: 1;'>
        <div style='display: flex; width: 100%; text-align: center'>
            <div style='width: 40%; margin-top: 15px; padding-left: 20px;'>
                <div style='width: 100%; display: flex; justify-content: center;'>
                    <img crossorigin='anonymous' src='${saleData.empresaLogo}' alt='voucher-logo' width='50' height='50'>
                </div>
                <p style='margin-top: 5px;'>Razón social: ${saleData.empresaRazonSocial}</p>
                <p>Dirección: ${saleData.empresaDireccion}</p>
                <p>Cond. frente a IVA: ${saleData.empresaCondicionIva}</p>
            </div>
            <div style='width: 20%; text-align: center; margin-top: 15px; padding-left: 15px; padding-right: 15px;'>
                <div style='background-color: #4a4a4a; border: 1px solid'>
                    <h1 style='font-size: 52px; font-weight: bold; color: #fff; margin-top: 15px'>${saleData.documentoLetra}</h1>
                </div>
                <p style='vertical-align: text-top;'>Código ${saleData.documentoCodigo}</p>
            </div>
            <div style='width: 40%; margin-top: 15px; padding-right: 15px;'>
                <p style='margin-right: 15px;'>Pto. vta: ${completeLengthWithZero(saleData.puntoVentaNumero, 4)} Comp. nro: ${completeLengthWithZero(saleData.numeroFactura, 8)}</p>
                <p>Fecha emision: ${simpleDateWithHours(saleData.fechaEmision)}</p>
                <p>Cuit: ${saleData.empresaCuit}</p>
                <p>Ing. brutos: ${saleData.empresaIngresosBrutos}</p>
                <p>Fecha inicio actividad: ${simpleDateWithHours(saleData.empresaInicioActividad)}</p>
            </div>
        </div>
        <div style='width: 100%;'>
            <hr>
        </div>
        <div style='width: 100%; background-color: #949494; padding: 15px'>
            <div style='width: 100%; display: flex'>
                <div style='width: 33.3%;'>
                    Razón social: ${saleData.clienteRazonSocial}
                </div>
                <div style='width: 33.3%; padding-left: 15px; padding-right: 15px'>
                    Cuit: ${saleData.clienteIdentificador}
                </div>
                <div style='width: 33.3%;'>
                    Cond. Iva: ${saleData.clienteCondicionIva}
                </div>
            </div>
            <div style='width: 100%; margin-top: 15px;'>
                Dirección: ${saleData.clienteDireccion}
            </div>
            <div style='width: 100%; margin-top: 15px;'>
                Cond. venta: ${saleData.condicionVenta}
            </div>
        </div>
        <div style='width: 100%;'>
            <hr>
        </div>
        <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; font-weight: bold;'>
            <div style='width: 12%;'>Cantidad</div>
            <div style='width: 34%;'>Producto</div>
            <div style='width: 10%;'>P. Unitario</div>
            <div style='width: 10%;'>P. Bruto</div>
            <div style='width: 12%;'>Descuento</div>
            <div style='width: 12%;'>Recargo</div>
            <div style='width: 10%; text-align: right;'>P. Neto</div>
        </div>
        ${saleData.renglones.map(renglon => {
        return `
            <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; font-size: 10px;'>
                <div style='width: 12%;'>${renglon.fraccionar
                ? roundTwoDecimals(renglon.cantidadUnidades / renglon.fraccionamiento)
                : roundTwoDecimals(renglon.cantidadUnidades)
            }</div>
                <div style='width: 34%;'>${renglon.nombre}</div>
                <div style='width: 10%;'>${renglon.precioUnitario}</div>
                <div style='width: 10%;'>${renglon.precioBruto}</div>
                <div style='width: 12%;'>${renglon.descuento}</div>
                <div style='width: 12%;'>${renglon.recargo}</div>
                <div style='width: 10%; text-align: right;'>${renglon.precioNeto}</div>
            </div>
            `
    })}

        <!-- ------------ OPTIONAL, INSERT const showSurchargesAndDiscounts ------------ -->
        
        <div style='width: 100%; position: absolute; bottom: 0'>
            <div style='width: 100%;'>
                <hr>
            </div>
            <div style='width: 100%; padding: 10px; display: flex'>
                <div style='width: 20%'>
                ${(saleData.iva21) ? `<p>Sub total: $${saleData.subTotal}</p>` : ''}
                </div>
                <div style='width: 20%'>
                    ${(saleData.iva21) ? `<p>Iva 21%: $${saleData.iva21}</p>` : ''}
                    ${(saleData.iva10) ? `<p>Iva 10.5%: $${saleData.iva10}</p>` : ''}
                    ${(saleData.iva27) ? `<p>Iva 27%: $${saleData.iva27}</p>` : ''}
                </div>
                <div style='width: 20%'>
                ${(saleData.iva21) ? `<p>Total IVA: $${saleData.importeIva}</p>` : ''}
                </div>
                <div style='width: 40%; text-align: right;'>
                    <p>Total: $${saleData.total}</p>
                </div>
            </div>
            <div style='width: 100%;'>
                <hr>
            </div>
            <div style='width: 100%; display: flex; justify-content: right; padding-right: 15px;'>
                <div style='margin-right: 15px;'>
                    <p>CAE: ${saleData.cae}</p>
                    <p>Vencimiento: ${saleData.vencimientoCae}</p>
                </div>
                <div>
                    <img src='${qrImage}' alt='QR afip' width='120' height='120'>
                </div>
            </div>
        </div>
    </div>
    `
}

const ticketTemplate = (saleData) => {
    return `
    <div style='width: 303px; height: 1122px; line-height: 1;'>
        <div style='width: 100%; text-align: center; font-size: 9px;'>
            <div style='width: 100%; text-align: center; margin-top: 15px;'>
                <div style='background-color: #4a4a4a; border: 1px solid'>
                    <h1 style='font-size: 32px; font-weight: bold; color: #fff; margin-top: 15px'>${saleData.documentoLetra}</h1>
                </div>
                <p style='vertical-align: text-top;'>Código ${saleData.documentoCodigo}</p>
            </div>
            <div style='width: 100%; margin-top: 15px; padding-left: 20px; text-align: left;'>
                <p style='margin-top: 5px;'>Razón social: ${saleData.empresaRazonSocial}</p>
                <p>Dirección: ${saleData.empresaDireccion}</p>
                <p>Fecha emision: ${simpleDateWithHours(saleData.fechaEmision)}</p>
            </div>
        </div>
        <div style='width: 100%;'>
            <hr>
        </div>
        <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; font-weight: bold; font-size: 9px;'>
            <div style='width: 15%;'>Cant.</div>
            <div style='width: 65%;'>Producto</div>
            <div style='width: 20%; text-align: right;'>P. Bruto</div>
        </div>
        ${saleData.renglones.map(renglon => {
        return `
            <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; font-size: 9px;'>
                <div style='width: 15%;'>${renglon.fraccionar
                ? roundTwoDecimals(renglon.cantidadUnidades / renglon.fraccionamiento)
                : roundTwoDecimals(renglon.cantidadUnidades)
            }</div>
                <div style='width: 65%;'>${renglon.nombre}</div>
                <div style='width: 20%; text-align: right;'>${renglon.precioBruto}</div>
            </div>
            `
    })}
        <div style='width: 100%; text-align: center; padding-top: 15px'>----------------</div>
        ${(saleData.totalDescuento)
            ?
            `
            <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-top: 15px; font-size: 9px;'>
                <div style='width: 15%;'>-</div>
                <div style='width: 65%;'>DESCUENTO APLICADO</div>
                <div style='width: 20%; text-align: right;'>- ${saleData.totalDescuento}</div>
            </div>
            `
            : ''
        }
        ${(saleData.totalRecargo)
            ? `
            <div style='width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-top: 15px; font-size: 9px;'>
                <div style='width: 15%;'>-</div>
                <div style='width: 65%;'>RECARGO APLICADO</div>
                <div style='width: 20%; text-align: right;'>${saleData.totalRecargo}</div>
            </div>
            `
            : ''
        }
        <div style='width: 100%; position: absolute; bottom: 0; font-size: 9px;'>
            <div style='width: 100%;'>
                <hr>
            </div>
            <div style='width: 100%; padding: 10px;'>
                <div style='width: 100%; text-align: right; font-weight: bold; font-size: 12px;'>
                    <p>Total: $${saleData.total}</p>
                </div>
            </div>
        </div>
    </div>
    `
}

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

const createVoucherPdf = async (saleData) => {
    const qrToVoucher = new AfipQR(saleData)
    const qrImage = await QRCode.toDataURL(qrToVoucher.url)
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div')
    const docName = saleData.numeroCompletoFactura
    const size = [297, 210]; //Expresed in mm
    htmlObject.innerHTML = voucherTemplate(saleData, qrImage)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const createTicketPdf = async (saleData) => {
    const frameToCanvas = document.getElementById('ticket')
    const htmlObject = document.createElement('div');
    const docName = saleData.numeroCompletoFactura;
    const size = [297, 80]; //Expresed in mm
    htmlObject.innerHTML = ticketTemplate(saleData)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size);
    return { isCreated: doc.isProcesseed }
}

const pdf = {
    createVoucherPdf,
    createTicketPdf
}

export default pdf;