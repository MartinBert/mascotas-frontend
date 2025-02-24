// Helpers
import dateHelper from '../dateHelper'
import mathHelper from '../mathHelper'
import stringHelper from '../stringHelper'
import validations from './validations'

// Imports Destructuring
const { localFormat, simpleDateWithHours } = dateHelper
const { round } = mathHelper
const { completeLengthWithZero } = stringHelper
const { existIva } = validations


const createBudgetTemplate = (templateData) => {
    const { currentPage, data, isFrontPage, qrImage, totalPages } = templateData

    return `
        <div style='width: 753px; height: 1082px; display: inline-block; line-height: 1; margin: 20px;'>
            <div style='display: flex; width: 100%; height: 180px; text-align: center; padding: 10px; padding-bot: 8px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 40%;'>
                    <div style='width: 100%; display: flex; justify-content: center;'>
                        ${
                            data.empresaLogo
                                ? `<img crossorigin='anonymous' src='${data.empresaLogo}' alt='budget-logo' width='50' height='50'>`
                                : null
                        }
                    </div>
                    <div style='text-align: left;'>
                        <p style='margin: 0px; margin-top: 3px;'><i>Razón social:</i> ${data.empresaRazonSocial}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Dirección:</i> ${data.empresaDireccion}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Cond. IVA:</i> ${data.empresaCondicionIva}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>CUIT:</i> ${data.empresaCuit}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Ing. brutos:</i> ${data.empresaIngresosBrutos}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Inicio act.:</i> ${localFormat(data.empresaInicioActividad)}</p>
                    </div>
                </div>
                <div style='width: 20%; text-align: center;'>
                    <div style='background-color: #C2BDBC; margin-left: 10px; margin-right: 10px; border: 1px solid; border-radius: 5px;'>
                        <h1 style='font-size: 52px; font-weight: bold; color: #fff; margin-top: 15px'>${data.documentoLetra}</h1>
                    </div>
                    <p style='vertical-align: text-top; margin-top: 5px;'>Código ${data.documentoCodigo}</p>
                    <div style='font-size: 16px; bottom: 0;'>NO VÁLIDO COMO FACTURA</div>
                </div>
                <div style='width: 40%; text-align: left; margin-left: 20px'>
                    <p style='font-size: 26px; margin: 0px; margin-top: 3px;'>PRESUPUESTO</p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 20px;'>
                        Pto. vta: ${completeLengthWithZero(data.puntoVentaNumero, 4)}
                        - Comp. nro: ${completeLengthWithZero(data.numeroFactura, 8)}
                    </p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 3px;'>Fecha emisión: ${simpleDateWithHours(data.fechaEmision)}</p>
                    <p style='margin: 0px; margin-top: 60px; text-align: right; width: 100%;'>Página ${currentPage} de ${totalPages}</p>
                </div>
            </div>
            <div style='width: 100%; height: 70px; background-color: #C2BDBC; padding: 10px; margin-top: 10px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 100%; display: flex'>
                    <div style='width: 40%;'><i>Razón social:</i> ${data.clienteRazonSocial}</div>
                    <div style='width: 25%; text-align: center;'><i>Cuit:</i> ${data.clienteIdentificador}</div>
                    <div style='width: 35%; text-align: right;'><i>Cond. IVA:</i> ${data.clienteCondicionIva}</div>
                </div>
                <div style='width: 100%; margin-top: 2px;'><i>Dirección:</i> ${data.clienteDireccion}</div>
                <div style='width: 100%; margin-top: 2px;'>
                    <i>Cond. venta:</i> ${data.mediosPagoNombres[0]} - ${data.planesPagoNombres[0]}
                </div>
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
                ${
                    data.renglones.map(renglon => {
                        return (`
                            <div>
                                <div style='width: 100%; display: flex; font-size: 16px;'>
                                    <div style='width: 12%;'>${round(renglon.cantidadUnidades)}</div>
                                    <div style='width: 34%;'>${renglon.nombre}</div>
                                    <div style='width: 10%;'>${round(renglon.precioUnitario)}</div>
                                    <div style='width: 10%;'>${round(renglon.precioBruto)}</div>
                                    <div style='width: 12%;'>${round(renglon.descuento)}</div>
                                    <div style='width: 12%;'>${round(renglon.recargo)}</div>
                                    <div style='width: 10%; text-align: right;'>${round(renglon.precioNeto)}</div>
                                </div>
                                ${
                                    renglon.nota === (null || '')
                                        ? ''
                                        : (`
                                            <div style='margin-top: 5px; width: 100%; font-size: 14px;'>
                                                <div style='margin-left: 12%; width: 88%;'>
                                                    <i>${renglon.nota}</i>
                                                </div>
                                            </div>
                                        `)
                                }
                            </div>
                        `)
                }).join('<br />')}
            </div>
            ${
                !isFrontPage
                    ? ''
                    : (`
                        <div style='width: 100%; height: 215px; bottom: 0px; display: inline-block;'>
                            <div style='width: 100%; color: #C2BDBC;'>
                                <hr>
                            </div>
                            <div style='width: 100%; display: flex;'>
                                <div style='width: 20%'>
                                    ${existIva(data) ? `<p>Sub total: $${data.subTotal}</p>` : ''}
                                </div>
                                <div style='width: 20%'>
                                    ${data.iva21 ? `<p>Iva 21%: $${data.iva21}</p>` : ''}
                                    ${data.iva10 ? `<p>Iva 10.5%: $${data.iva10}</p>` : ''}
                                    ${data.iva27 ? `<p>Iva 27%: $${data.iva27}</p>` : ''}
                                </div>
                                <div style='width: 20%'>
                                ${existIva(data) ? `<p>Total IVA: $${data.importeIva}</p>` : ''}
                                </div>
                                <div style='width: 40%; text-align: right;'>
                                    <p><h2>Total: $${data.total}</h2></p>
                                </div>
                            </div>
                            ${
                                !data.documento.fiscal
                                    ? ''
                                    : (`
                                        <div style='width: 100%; margin-top: 20px'>
                                            <div style='width: 100%; display: flex; justify-content: right;'>
                                                <div style='margin-right: 15px;'>
                                                    <p>CAE: ${data.cae}</p>
                                                    <p>Vencimiento: ${data.vencimientoCae}</p>
                                                </div>
                                                <div>
                                                    <img src='${qrImage}' alt='QR afip' width='120' height='120'>
                                                </div>
                                            </div>
                                        </div>
                                    `)
                            }
                        </div>
                    `)
            }
        </div>
    `
}


export default createBudgetTemplate