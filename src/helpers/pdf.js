import {jsPDF} from 'jspdf';
import stringHelper from './stringHelper.js';
import dateHelper from './dateHelper.js';
import qr from './qr.js';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const {completeLengthWithZero} = stringHelper;
const {simpleDateWithHours} = dateHelper;
const {AfipQR} = qr;

const createVoucherPdf = async(saleData) => {
    const qrToVoucher = new AfipQR(saleData);
    const qrImage = await QRCode.toDataURL(qrToVoucher.url);

    //voucher html generation
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div');
    htmlObject.innerHTML = `
    <div id='pdfVoucherContainer' style="width: 793px; height: 1122px; line-height: 1;">
        <div style="display: flex; width: 100%; text-align: center">
            <div style="width: 40%; margin-top: 15px; padding-left: 20px;">
                <div style="width: 100%; display: flex; justify-content: center;">
                    <img crossorigin="anonymous" src="${saleData.empresaLogo}" alt="voucher-logo" width="50" height="50">
                </div>
                <p style="margin-top: 5px;">Razón social: ${saleData.empresaRazonSocial}</p>
                <p>Dirección: ${saleData.empresaDireccion}</p>
                <p>Cond. frente a IVA: ${saleData.empresaCondicionIva}</p>
            </div>
            <div style="width: 20%; text-align: center; margin-top: 15px; padding-left: 15px; padding-right: 15px;">
                <div style="background-color: #4a4a4a; border: 1px solid">
                    <h1 style="font-size: 52px; font-weight: bold; color: #fff; margin-top: 15px">${saleData.documentoLetra}</h1>
                </div>
                <p style="vertical-align: text-top;">Código ${saleData.documentoCodigo}</p>
            </div>
            <div style="width: 40%; margin-top: 15px; padding-right: 15px;">
                <p style="margin-right: 15px;">Pto. vta: ${completeLengthWithZero(saleData.puntoVentaNumero, 4)} Comp. nro: ${completeLengthWithZero(saleData.numeroFactura, 8)}</p>
                <p>Fecha emision: ${simpleDateWithHours(saleData.fechaEmision)}</p>
                <p>Cuit: ${saleData.empresaCuit}</p>
                <p>Ing. brutos: ${saleData.empresaIngresosBrutos}</p>
                <p>Fecha inicio actividad: ${simpleDateWithHours(saleData.empresaInicioActividad)}</p>
            </div>
        </div>
        <div style="width: 100%;">
            <hr>
        </div>
        <div style="width: 100%; background-color: #949494; padding: 15px">
            <div style="width: 100%; display: flex">
                <div style="width: 33.3%;">
                    Razón social: ${saleData.clienteRazonSocial}
                </div>
                <div style="width: 33.3%; padding-left: 15px; padding-right: 15px">
                    Cuit: ${saleData.clienteIdentificador}
                </div>
                <div style="width: 33.3%;">
                    Cond. Iva: ${saleData.clienteCondicionIva}
                </div>
            </div>
            <div style="width: 100%; margin-top: 15px;">
                Dirección: ${saleData.clienteDireccion}
            </div>
            <div style="width: 100%; margin-top: 15px;">
                Cond. venta: ${saleData.condicionVenta}
            </div>
        </div>
        <div style="width: 100%;">
            <hr>
        </div>
        <div style="width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; font-weight: bold;">
            <div style="width: 8%;">Cant.</div>
            <div style="width: 60%;">Producto</div>
            <div style="width: 8%;">P. Unit.</div>
            <div style="width: 8%;">Desc.</div>
            <div style="width: 8%;">Rec.</div>
            <div style="width: 8%; text-align: right;">Total</div>
        </div>
        ${saleData.renglones.map(renglon => {
            return `
            <div style="width: 100%; display: flex; padding-left: 15px; padding-right: 15px; font-size: 10px;">
                <div style="width: 8%;">${renglon.cantidadUnidades}</div>
                <div style="width: 60%;">${renglon.productoNombre}</div>
                <div style="width: 8%;">${renglon.productoPrecioUnitario}</div>
                <div style="width: 8%;">${renglon.importeDescuentoRenglon}</div>
                <div style="width: 8%;">${renglon.importeRecargoRenglon}</div>
                <div style="width: 8%; text-align: right;">${renglon.totalRenglon}</div>
            </div>
            `
        })}
        ${
            (saleData.totalDescuento) 
            ?
            `
            <div style="width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-top: 15px; ont-size: 10px;">
                <div style="width: 8%;">-</div>
                <div style="width: 60%;">DESCUENTO EFECTUADO</div>
                <div style="width: 8%;">${saleData.totalDescuento}</div>
                <div style="width: 8%;">-</div>
                <div style="width: 8%;">-</div>
                <div style="width: 8%; text-align: right;">${saleData.totalDescuento}</div>
            </div>
            `
            :'' 
        }
        ${
            (saleData.totalRecargo) 
            ?`
            <div style="width: 100%; display: flex; padding-left: 15px; padding-right: 15px; padding-top: 15px; font-size: 10px;">
                <div style="width: 8%;">-</div>
                <div style="width: 60%;">RECARGO EFECTUADO</div>
                <div style="width: 8%;">${saleData.totalRecargo}</div>
                <div style="width: 8%;">-</div>
                <div style="width: 8%;">-</div>
                <div style="width: 8%; text-align: right;">${saleData.totalRecargo}</div>
            </div>
            `
            :'' 
        }
        <div style="width: 100%; position: absolute; bottom: 0">
            <div style="width: 100%;">
                <hr>
            </div>
            <div style="width: 100%; padding: 10px; display: flex">
                <div style="width: 20%">
                ${(saleData.iva21) ? `<p>Sub total: $${saleData.subTotal}</p>` : ''}
                </div>
                <div style="width: 20%">
                    ${(saleData.iva21) ? `<p>Iva 21%: $${saleData.iva21}</p>` : ''}
                    ${(saleData.iva10) ? `<p>Iva 10.5%: $${saleData.iva10}</p>` : ''}
                    ${(saleData.iva27) ? `<p>Iva 27%: $${saleData.iva27}</p>` : ''}
                </div>
                <div style="width: 20%">
                ${(saleData.iva21) ? `<p>Total IVA: $${saleData.importeIva}</p>` : ''}
                </div>
                <div style="width: 20%">
                    <p>Descuento: $${saleData.totalDescuento + saleData.totalDescuentoLineas}</p>
                    <p>Recargo: $${saleData.totalRecargo + saleData.totalRecargoLineas}</p>
                </div>
                <div style="width: 20%">
                    <p>Total: $${saleData.total}</p>
                </div>
            </div>
            <div style="width: 100%;">
                <hr>
            </div>
            <div style="width: 100%; display: flex; justify-content: right; padding-right: 15px;">
                <div style="margin-right: 15px;">
                    <p>CAE: ${saleData.cae}</p>
                    <p>Vencimiento: ${saleData.vencimientoCae}</p>
                </div>
                <div>
                    <img src="${qrImage}" alt="QR afip" width="120" height="120">
                </div>
            </div>
        </div>
    </div>
    `
    frameToCanvas.appendChild(htmlObject);

    html2canvas(htmlObject, {allowTaint: true, useCORS: true}).then(function (canvas) {
        const img = canvas.toDataURL("image/png");
        const doc = new jsPDF();
        doc.addImage(img, 'JPEG', 0, 0);
        doc.save(saleData.numeroCompletoFactura);
        document.getElementById('voucher').innerHTML = '';
    });
}

const pdf = {
    createVoucherPdf
}

export default pdf;