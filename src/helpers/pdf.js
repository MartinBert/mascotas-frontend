import {jsPDF} from 'jspdf';
import stringHelper from './stringHelper.js';
import dateHelper from './dateHelper.js';
import html2canvas from 'html2canvas';

const {completeLengthWithZero} = stringHelper;
const {simpleDateWithHours} = dateHelper;

const createVoucherPdf = async(saleData) => {

    //voucher html generation
    const frameToCanvas = document.getElementById('voucher')
    const htmlObject = document.createElement('div');
    htmlObject.innerHTML = `
    <div style="width: 790px; line-height: 1;">
        <div style="display: flex; width: 100%; text-align: center">
            <div style="width: 40%; margin-top: 15px; padding-left: 15px;">
                <div style="width: 100%; display: flex; justify-content: center;">
                    <img crossorigin="anonymous" src="${saleData.empresaLogo}" alt="voucher-logo" width="50" height="50">
                </div>
                <p style="margin-top: 5px;">Razón social: ${saleData.empresaRazonSocial}</p>
                <p>Dirección: ${saleData.empresaDireccion}</p>
                <p>Cond. frente a IVA: ${saleData.empresaCondicionIva}</p>
            </div>
            <div style="width: 20%; text-align: center; margin-top: 15px; padding-left: 15px; padding-right: 15px;">
                <div style="background-color: #797979;">
                    <h1 style="font-size: 52px; font-weight: bold; color: #fff">${saleData.documentoLetra}</h1>
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
        <div style="width: 100%; background-color:#797979; color: #fff; padding: 15px">
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
    </div>
    `
    frameToCanvas.appendChild(htmlObject);

    console.log(htmlObject)

    html2canvas(htmlObject, {allowTaint: true, useCORS: true}).then(function (canvas) {
        const img = canvas.toDataURL("image/png");
        const doc = new jsPDF();
        doc.addImage(img, 'JPEG', 0, 0);
        doc.save('test.pdf');
        frameToCanvas.remove();
    });
}

const pdf = {
    createVoucherPdf
}

export default pdf;