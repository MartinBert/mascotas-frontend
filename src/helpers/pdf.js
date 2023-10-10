import { jsPDF } from 'jspdf'
import stringHelper from './stringHelper.js'
import dateHelper from './dateHelper.js'
import mathHelper from './mathHelper.js'
import qr from './qr.js'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

const { completeLengthWithZero } = stringHelper
const { simpleDateWithHours } = dateHelper
const { roundTwoDecimals } = mathHelper
const { AfipQR } = qr

const voucherTemplate = (saleData, qrImage) => {
    return `
    <div style='width: 753px; height: 1082px; display: inline-block; line-height: 1; margin: 20px;'>
        <div style='display: flex; width: 100%; height: 180px; text-align: center; padding: 10px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
            <div style='width: 40%;'>
                <div style='width: 100%; display: flex; justify-content: center;'>
                    <img crossorigin='anonymous' src='${saleData.empresaLogo}' alt='voucher-logo' width='50' height='50'>
                </div>
                <div style='text-align: left;'>
                    <p style='margin: 0px; margin-top: 3px;'><i>Razón social:</i> ${saleData.empresaRazonSocial}</p>
                    <p style='margin: 0px; margin-top: 3px;'><i>Dirección:</i> ${saleData.empresaDireccion}</p>
                    <p style='margin: 0px; margin-top: 3px;'><i>Cond. IVA:</i> ${saleData.empresaCondicionIva}</p>
                    <p style='margin: 0px; margin-top: 3px;'><i>CUIT:</i> ${saleData.empresaCuit}</p>
                    <p style='margin: 0px; margin-top: 3px;'><i>Ing. brutos:</i> ${saleData.empresaIngresosBrutos}</p>
                    <p style='margin: 0px; margin-top: 3px;'><i>Inicio act.:</i> ${simpleDateWithHours(saleData.empresaInicioActividad)}</p>
                </div>
            </div>
            <div style='width: 20%; text-align: center;'>
                <div style='background-color: #C2BDBC; margin-left: 10px; margin-right: 10px; border: 1px solid; border-radius: 5px;'>
                    <h1 style='font-size: 52px; font-weight: bold; color: #fff; margin-top: 15px'>${saleData.documentoLetra}</h1>
                </div>
                <p style='vertical-align: text-top; margin-top: 5px;'>Código ${saleData.documentoCodigo}</p>
                ${saleData.documento.fiscal === false ? `<div style='font-size: 16px; bottom: 0;'>NO VÁLIDO COMO FACTURA</div>` : ''}
            </div>
            <div style='width: 40%; text-align: left; margin-left: 20px'>
                <p style='font-size: 26px; margin: 0px; margin-top: 3px;'>${saleData.documento.nombre}</p>
                <p style='font-size: 16px; margin: 0px; margin-top: 20px;'>Pto. vta: ${completeLengthWithZero(saleData.puntoVentaNumero, 4)}
                    Comp. nro: ${completeLengthWithZero(saleData.numeroFactura, 8)}</p>
                <p style='font-size: 16px; margin: 0px; margin-top: 3px;'>Fecha emisión: ${simpleDateWithHours(saleData.fechaEmision)}</p>
            </div>
        </div>
        <div style='width: 100%; height: 70px; background-color: #C2BDBC; padding: 10px; margin-top: 10px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
            <div style='width: 100%; display: flex'>
                <div style='width: 40%;'><i>Razón social:</i> ${saleData.clienteRazonSocial}</div>
                <div style='width: 25%; text-align: center;'><i>Cuit:</i> ${saleData.clienteIdentificador}</div>
                <div style='width: 35%; text-align: right;'><i>Cond. IVA:</i> ${saleData.clienteCondicionIva}</div>
            </div>
            <div style='width: 100%; margin-top: 2px;'><i>Dirección:</i> ${saleData.clienteDireccion}</div>
            <div style='width: 100%; margin-top: 2px;'><i>Cond. venta:</i> ${saleData.condicionVenta}</div>
        </div>
        <div style='width: 100%; height: 35px; padding: 10px; display: flex; padding-bottom: 15px; font-style: italic'>
            <div style='width: 12%;'>Cantidad</div>
            <div style='width: 34%;'>Producto</div>
            <div style='width: 10%;'>P. Unitario</div>
            <div style='width: 10%;'>P. Bruto</div>
            <div style='width: 12%;'>Descuento</div>
            <div style='width: 12%;'>Recargo</div>
            <div style='width: 10%; text-align: right;'>P. Neto</div>
        </div>
        <div style='width: 100%; height: 582px; padding: 10px'>
            ${saleData.renglones.map(renglon => {
                return (
                    `
                        <div>
                            <div style='width: 100%; display: flex; font-size: 16px;'>
                                <div style='width: 12%;'>
                                    ${renglon.fraccionar
                                        ? roundTwoDecimals(renglon.cantidadUnidades / renglon.fraccionamiento)
                                        : roundTwoDecimals(renglon.cantidadUnidades)
                                    }
                                </div>
                                <div style='width: 34%;'>${renglon.nombre}</div>
                                <div style='width: 10%;'>${renglon.precioUnitario}</div>
                                <div style='width: 10%;'>${roundTwoDecimals(renglon.precioBruto)}</div>
                                <div style='width: 12%;'>${roundTwoDecimals(renglon.descuento)}</div>
                                <div style='width: 12%;'>${roundTwoDecimals(renglon.recargo)}</div>
                                <div style='width: 10%; text-align: right;'>${roundTwoDecimals(renglon.precioNeto)}</div>
                            </div>
                            ${ renglon.nota === (null || '')
                                ? ''
                                : (
                                    `<div style='margin-top: 5px; width: 100%; font-size: 14px;'>
                                        <div style='margin-left: 12%; width: 88%;'>
                                            <i>${renglon.nota}</i>
                                        </div>
                                    </div>`
                                )
                            }
                        </div>
                    `
                )
            })
            .join('<br />')}
        </div>
        <div style='width: 100%; height: 215px; bottom: 0px; display: inline-block;'>
            <div style='width: 100%; color: #C2BDBC;'>
                <hr>
            </div>
            <div style='width: 100%; display: flex;'>
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
                    <p><h2>Total: $${saleData.total}</h2></p>
                </div>
            </div>
            <div style='width: 100%; margin-top: 20px'>
                ${saleData.documento.fiscal === true
                    ? (
                        `<div style='width: 100%; display: flex; justify-content: right;'>
                            <div style='margin-right: 15px;'>
                                <p>CAE: ${saleData.cae}</p>
                                <p>Vencimiento: ${saleData.vencimientoCae}</p>
                            </div>
                            <div>
                                <img src='${qrImage}' alt='QR afip' width='120' height='120'>
                            </div>
                        </div>`
                    ) : ''
                }
                ${saleData.documento.nombre === 'REMITO'
                    ? (
                        `<div style='width: 100%; display: flex; justify-content: right;'>
                            <div style='width: 100%; display: inline-block; font-size: 20px; text-align: center;'>
                                <div style='margin-right: 15px; '>............................................................</div>
                                <div style='margin-right: 15px;'>Firma, aclaración y DNI</div>
                            </div>
                        </div>`
                    ) : ''
                }
            </div>
        </div>
    </div>
    `
}

const ticketTemplate = (saleData) => {
    return `
    <div style='width: 283px; height: 1102px; display: inline-block; line-height: 1; margin: 10px; '>
        <div style='width: 100%; height: 210px; border: solid 2px; border-color: #C2BDBC; border-radius: 5px;'>
            <div style='width: 30%; text-align: center; margin: 0 auto; margin-top: 5px;'>
                <div style='background-color: #C2BDBC; border: 1px solid; border-radius: 5px;'>
                    <h1 style='font-size: 32px; font-weight: bold; color: #fff; margin-top: 15px'>${saleData.documentoLetra}</h1>
                </div>
                <p style='vertical-align: text-top; margin-top: 5px;'>Código ${saleData.documentoCodigo}</p>
            </div>
            <div style='width: 100%; margin-top: 15px; padding-left: 10px; text-align: left;'>
                <p style='margin-top: 5px;'><i>Razón social:</i> ${saleData.empresaRazonSocial}</p>
                <p style='margin-top: 3px;'><i>Dirección:</i> ${saleData.empresaDireccion}</p>
                <p style='margin-top: 3px;'><i>Fecha emisión:</i> ${simpleDateWithHours(saleData.fechaEmision)}</p>
                <div style='width: 100%; text-align: center; margin-top: 3px;'>NO VÁLIDO COMO FACTURA</div>
            </div>
        </div>
        <div style='width: 100%; color: #C2BDBC;'>
            <hr>
        </div>
        <div style='width: 100%; height: 39px; display: flex; padding-bottom: 15px;'>
            <div style='width: 15%; text-align: left; padding-left: 5px;'><i>Cant.</i></div>
            <div style='width: 60%; text-align: left;'><i>Producto</i></div>
            <div style='width: 25%; text-align: right; padding-right: 5px;'><i>P. Neto</i></div>
        </div>
        <div style='width: 100%; height: 733px; display: inline-block;'>
            <div>
                ${ saleData.renglones.map(renglon => {
                    return `
                        <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                            <div style='width: 15%;'>${renglon.fraccionar
                                ? roundTwoDecimals(renglon.cantidadUnidades / renglon.fraccionamiento)
                                : roundTwoDecimals(renglon.cantidadUnidades)}
                            </div>
                            <div style='width: 60%;'>${renglon.nombre}</div>
                            <div style='width: 25%; text-align: right; padding-right: 5px;'>${roundTwoDecimals(renglon.precioBruto)}</div>
                        </div>
                        ${ renglon.nota === (null || '')
                                ? ''
                                : (
                                    `<div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                                        <div style='margin-left: 15%; width: 85%;'>
                                            <i>${renglon.nota}</i>
                                        </div>
                                    </div>`
                                )
                            }
                    `
                }).join('<br />')}
            </div>
            <div style='width: 100%; display: inline-block;'>
                <br />
                ${ (saleData.totalRecargo)
                    ? `
                        <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                            <div style='width: 15%;'>1</div>
                            <div style='width: 60%;'>Recargo aplicado</div>
                            <div style='width: 25%; text-align: right; padding-right: 5px;'>${roundTwoDecimals(saleData.totalRecargo)}</div>
                        </div>
                    `
                    : ''
                }
                <br />
                ${ (saleData.totalDescuento)
                    ? `
                        <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                            <div style='width: 15%;'>1</div>
                            <div style='width: 60%;'>Descuento aplicado</div>
                            <div style='width: 25%; text-align: right; padding-right: 5px;'>- ${roundTwoDecimals(saleData.totalDescuento)}</div>
                        </div>
                    `
                    : ''
                }
                <br />
            </div>
        </div>
        <div style='width: 100%; height: 110px; bottom: 0; font-size: 9px;'>
            <div style='width: 100%; color: #C2BDBC;'>
                <hr>
            </div>
            <div style='width: 100%; padding: 10px;'>
                <div style='width: 100%; text-align: right; font-size: 20px;'>
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
    const htmlObject = document.createElement('div')
    const docName = saleData.numeroCompletoFactura
    const size = [297, 80]; //Expresed in mm
    htmlObject.innerHTML = ticketTemplate(saleData)
    const doc = await processCanvas(frameToCanvas, htmlObject, docName, size)
    return { isCreated: doc.isProcesseed }
}

const pdf = {
    createVoucherPdf,
    createTicketPdf
}

export default pdf;