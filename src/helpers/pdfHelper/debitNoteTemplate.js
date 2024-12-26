// Helpers
import dateHelper from '../dateHelper'
import stringHelper from '../stringHelper'
import validations from './validations'

// Imports Destruvturing
const { localFormat, simpleDateWithHours } = dateHelper
const { completeLengthWithZero } = stringHelper
const { existIva } = validations


const createDebitNoteTemplate = (templateData) => {
    const { associatedData, currentPage, data, isFrontPage, qrImage, totalPages } = templateData
    const debitConcept = data.fiscalNoteConcept ?? 'Débito sobre el comprobante asociado'

    return `
        <div style='width: 753px; height: 1082px; display: inline-block; line-height: 1; margin: 20px;'>
            <div style='display: flex; width: 100%; height: 200px; text-align: center; padding: 10px; padding-bot: 8px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 40%;'>
                    <div style='width: 100%; display: flex; justify-content: center;'>
                     ${
                        data.empresaLogo
                            ? `<img crossorigin='anonymous' src='${data.empresaLogo}' alt='voucher-logo' width='50' height='50'>`
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
                </div>
                <div style='width: 40%; text-align: left; margin-left: 20px'>
                    <p style='font-size: 26px; margin: 0px; margin-top: 3px;'>NOTA DEBITO</p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 20px;'>
                        Pto. vta: ${completeLengthWithZero(data.puntoVentaNumero, 4)}
                        Comp. nro: ${completeLengthWithZero(data.numeroFactura, 8)}
                    </p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 3px;'>Fecha emisión: ${simpleDateWithHours(data.fechaEmision)}</p>
                    <br />
                    <p style='margin: 0px; margin-top: 3px;'>Comprobante asociado:</p>
                    <p style='margin: 0px; margin-top: 3px;'>
                        ${associatedData.voucherName}
                        ${associatedData.voucherLetter}
                    </p>
                    <p style='margin: 0px; margin-top: 3px;'>
                        Pto. vta: ${completeLengthWithZero(data.associatedVouchers[0].PtoVta, 4)}
                        - Comp. nro: ${completeLengthWithZero(data.associatedVouchers[0].Nro, 8)}
                    </p>
                    <p style='margin: 0px; margin-top: 3px;'>Fecha emisión: ${associatedData.voucherDate}</p>
                    <p style='margin: 0px; margin-top: 5px; text-align: right; width: 100%;'>Página ${currentPage} de ${totalPages}</p>
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
                    <i>Cond. débito:</i> ${data.mediosPagoNombres[0]} - ${data.planesPagoNombres[0]}
                </div>
            </div>
            <div style='width: 100%; height: 35px; padding: 10px; display: flex; padding-bottom: 15px; font-style: italic'>
                <div style='width: 85%;'>Concepto</div>
                <div style='width: 15%; text-align: right;'>Débito</div>
            </div>
            <div style='width: 100%; height: 562px; padding: 10px'>
                <div style='width: 100%; display: flex; font-size: 16px;'>
                    <div style='width: 85%;'>${debitConcept}</div>
                    <div style='width: 15%; text-align: right;'>${existIva(data) ? data.subTotal : data.total}</div>
                </div>
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
                                    ${data.iva21 > 0 ? `<p>Iva 21%: $${data.iva21}</p>` : ''}
                                    ${data.iva10 > 0 ? `<p>Iva 10.5%: $${data.iva10}</p>` : ''}
                                    ${data.iva27 > 0 ? `<p>Iva 27%: $${data.iva27}</p>` : ''}
                                </div>
                                <div style='width: 20%'>
                                    ${existIva(data) ? `<p>Total IVA: $${data.importeIva}</p>` : ''}
                                </div>
                                <div style='width: 40%; text-align: right;'>
                                    <p><h2>Total: $${data.total}</h2></p>
                                </div>
                            </div>
                            <div style='width: 100%; margin-top: 20px'>
                                <div style='width: 100%; display: flex; justify-content: right;'>
                                    <div style='margin-right: 15px;'>
                                        <p>CAE: ${data.cae ?? associatedData.voucherCae}</p>
                                        <p>Vencimiento: ${data.caeExpirationDate ?? associatedData.voucherCaeExpiration}</p>
                                    </div>
                                    <div>
                                        <img src='${qrImage}' alt='QR afip' width='120' height='120'>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)
            }
        </div>
    `
}


export default createDebitNoteTemplate