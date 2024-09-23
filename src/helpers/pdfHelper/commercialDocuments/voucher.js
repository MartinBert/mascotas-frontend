// Helpers
import dateHelper from '../../dateHelper'
import mathHelper from '../../mathHelper'
import stringHelper from '../../stringHelper'
import validations from '../validations'

// Imports Destruvturing
const { localFormat, simpleDateWithHours } = dateHelper
const { roundTwoDecimals } = mathHelper
const { completeLengthWithZero } = stringHelper
const { existIva } = validations

const voucherTemplate = (billData, qrImage) => {
    return `
        <div style='width: 753px; height: 1082px; display: inline-block; line-height: 1; margin: 20px;'>
            <div style='display: flex; width: 100%; height: 180px; text-align: center; padding: 10px; padding-bot: 8px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 40%;'>
                    <div style='width: 100%; display: flex; justify-content: center;'>
                     ${
                        billData?.empresaLogo
                            ?? `<img crossorigin='anonymous' src='${billData.empresaLogo}' alt='voucher-logo' width='50' height='50'>`
                    }
                    </div>
                    <div style='text-align: left;'>
                        <p style='margin: 0px; margin-top: 3px;'><i>Razón social:</i> ${billData.empresaRazonSocial}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Dirección:</i> ${billData.empresaDireccion}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Cond. IVA:</i> ${billData.empresaCondicionIva}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>CUIT:</i> ${billData.empresaCuit}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Ing. brutos:</i> ${billData.empresaIngresosBrutos}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Inicio act.:</i> ${localFormat(billData.empresaInicioActividad)}</p>
                    </div>
                </div>
                <div style='width: 20%; text-align: center;'>
                    <div style='background-color: #C2BDBC; margin-left: 10px; margin-right: 10px; border: 1px solid; border-radius: 5px;'>
                        <h1 style='font-size: 52px; font-weight: bold; color: #fff; margin-top: 15px'>${billData.documentoLetra}</h1>
                    </div>
                    <p style='vertical-align: text-top; margin-top: 5px;'>Código ${billData.documentoCodigo}</p>
                </div>
                <div style='width: 40%; text-align: left; margin-left: 20px'>
                    <p style='font-size: 26px; margin: 0px; margin-top: 3px;'>FACTURA</p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 20px;'>
                        Pto. vta: ${completeLengthWithZero(billData.puntoVentaNumero, 4)}
                        - Comp. nro: ${completeLengthWithZero(billData.numeroFactura, 8)}
                    </p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 3px;'>Fecha emisión: ${simpleDateWithHours(billData.fechaEmision)}</p>
                </div>
            </div>
            <div style='width: 100%; height: 70px; background-color: #C2BDBC; padding: 10px; margin-top: 10px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 100%; display: flex'>
                    <div style='width: 40%;'><i>Razón social:</i> ${billData.clienteRazonSocial}</div>
                    <div style='width: 25%; text-align: center;'><i>Cuit:</i> ${billData.clienteIdentificador}</div>
                    <div style='width: 35%; text-align: right;'><i>Cond. IVA:</i> ${billData.clienteCondicionIva}</div>
                </div>
                <div style='width: 100%; margin-top: 2px;'><i>Dirección:</i> ${billData.clienteDireccion}</div>
                <div style='width: 100%; margin-top: 2px;'>
                    <i>Cond. venta:</i> ${billData.mediosPagoNombres[0]} - ${billData.planesPagoNombres[0]}
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
                    billData.renglones.map(renglon => {
                        return (`
                            <div>
                                <div style='width: 100%; display: flex; font-size: 16px;'>
                                    <div style='width: 12%;'>
                                        ${
                                            renglon.fraccionar
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
            <div style='width: 100%; height: 215px; bottom: 0px; display: inline-block;'>
                <div style='width: 100%; color: #C2BDBC;'>
                    <hr>
                </div>
                <div style='width: 100%; display: flex;'>
                    <div style='width: 20%'>
                        ${existIva(billData) ? `<p>Sub total: $${billData.subTotal}</p>` : ''}
                    </div>
                    <div style='width: 20%'>
                        ${billData.iva21 ? `<p>Iva 21%: $${billData.iva21}</p>` : ''}
                        ${billData.iva10 ? `<p>Iva 10.5%: $${billData.iva10}</p>` : ''}
                        ${billData.iva27 ? `<p>Iva 27%: $${billData.iva27}</p>` : ''}
                    </div>
                    <div style='width: 20%'>
                    ${existIva(billData) ? `<p>Total IVA: $${billData.importeIva}</p>` : ''}
                    </div>
                    <div style='width: 40%; text-align: right;'>
                        <p><h2>Total: $${billData.total}</h2></p>
                    </div>
                </div>
                <div style='width: 100%; margin-top: 20px'>
                    <div style='width: 100%; display: flex; justify-content: right;'>
                        <div style='margin-right: 15px;'>
                            <p>CAE: ${billData.cae}</p>
                            <p>Vencimiento: ${billData.vencimientoCae}</p>
                        </div>
                        <div>
                            <img src='${qrImage}' alt='QR afip' width='120' height='120'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

const voucher = {
    voucherTemplate
}

export default voucher