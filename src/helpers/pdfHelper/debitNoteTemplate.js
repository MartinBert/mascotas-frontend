// Helpers
import dateHelper from '../dateHelper'
import stringHelper from '../stringHelper'
import validations from './validations'

// Imports Destruvturing
const { localFormat, simpleDateWithHours } = dateHelper
const { completeLengthWithZero } = stringHelper
const { existIva } = validations

const createDebitNoteTemplate = (templateData) => {
    const { currentPage, data, isFrontPage, qrImage, totalPages } = templateData

    return `
        <div style='width: 753px; height: 1082px; display: inline-block; line-height: 1; margin: 20px;'>
            <div style='display: flex; width: 100%; height: 200px; text-align: center; padding: 10px; padding-bot: 8px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 40%;'>
                    <div style='width: 100%; display: flex; justify-content: center;'>
                     ${
                        data.referenceVoucher.empresaLogo
                            ? `<img crossorigin='anonymous' src='${data.referenceVoucher.empresaLogo}' alt='voucher-logo' width='50' height='50'>`
                            : null
                    }
                    </div>
                    <div style='text-align: left;'>
                        <p style='margin: 0px; margin-top: 3px;'><i>Razón social:</i> ${data.referenceVoucher.empresaRazonSocial}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Dirección:</i> ${data.referenceVoucher.empresaDireccion}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Cond. IVA:</i> ${data.referenceVoucher.empresaCondicionIva}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>CUIT:</i> ${data.referenceVoucher.empresaCuit}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Ing. brutos:</i> ${data.referenceVoucher.empresaIngresosBrutos}</p>
                        <p style='margin: 0px; margin-top: 3px;'><i>Inicio act.:</i> ${localFormat(data.referenceVoucher.empresaInicioActividad)}</p>
                    </div>
                </div>
                <div style='width: 20%; text-align: center;'>
                    <div style='background-color: #C2BDBC; margin-left: 10px; margin-right: 10px; border: 1px solid; border-radius: 5px;'>
                        <h1 style='font-size: 52px; font-weight: bold; color: #fff; margin-top: 15px'>${data.fiscalNoteLetter}</h1>
                    </div>
                    <p style='vertical-align: text-top; margin-top: 5px;'>Código ${data.fiscalNoteCode}</p>
                </div>
                <div style='width: 40%; text-align: left; margin-left: 20px'>
                    <p style='font-size: 26px; margin: 0px; margin-top: 3px;'>NOTA DEBITO</p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 20px;'>
                        Pto. vta: ${completeLengthWithZero(data.referenceVoucher.puntoVentaNumero, 4)}
                        Comp. nro: ${completeLengthWithZero(data.referenceVoucher.numeroFactura, 8)}
                    </p>
                    <p style='font-size: 16px; margin: 0px; margin-top: 3px;'>Fecha emisión: ${simpleDateWithHours(data.date)}</p>
                    <br />
                    <p style='margin: 0px; margin-top: 3px;'>Comprobante asociado:</p>
                    <p style='margin: 0px; margin-top: 3px;'>
                        ${data.referenceVoucher.documento.nombre}
                        ${data.referenceVoucher.documentoLetra}
                    </p>
                    <p style='margin: 0px; margin-top: 3px;'>
                        Pto. vta: ${completeLengthWithZero(data.referenceVoucher.puntoVentaNumero, 4)}
                        - Comp. nro: ${completeLengthWithZero(data.referenceVoucher.numeroFactura, 8)}
                    </p>
                    <p style='margin: 0px; margin-top: 3px;'>Fecha emisión: ${simpleDateWithHours(data.referenceVoucher.fechaEmision)}</p>
                    <p style='margin: 0px; margin-top: 5px; text-align: right; width: 100%;'>Página ${currentPage} de ${totalPages}</p>
                </div>
            </div>
            <div style='width: 100%; height: 70px; background-color: #C2BDBC; padding: 10px; margin-top: 10px; border: solid 2px; border-radius: 5px; border-color: #C2BDBC'>
                <div style='width: 100%; display: flex'>
                    <div style='width: 40%;'><i>Razón social:</i> ${data.referenceVoucher.clienteRazonSocial}</div>
                    <div style='width: 25%; text-align: center;'><i>Cuit:</i> ${data.referenceVoucher.clienteIdentificador}</div>
                    <div style='width: 35%; text-align: right;'><i>Cond. IVA:</i> ${data.referenceVoucher.clienteCondicionIva}</div>
                </div>
                <div style='width: 100%; margin-top: 2px;'><i>Dirección:</i> ${data.referenceVoucher.clienteDireccion}</div>
                <div style='width: 100%; margin-top: 2px;'>
                    <i>Cond. débito:</i> ${data.paymentMethodName} - ${data.paymentPlanName}
                </div>
            </div>
            <div style='width: 100%; height: 35px; padding: 10px; display: flex; padding-bottom: 15px; font-style: italic'>
                <div style='width: 85%;'>Concepto</div>
                <div style='width: 15%; text-align: right;'>Débito</div>
            </div>
            <div style='width: 100%; height: 562px; padding: 10px'>
                <div style='width: 100%; display: flex; font-size: 16px;'>
                    <div style='width: 85%;'>${data.concept}</div>
                    <div style='width: 15%; text-align: right;'>${existIva(data) ? data.subAmount : data.amountNet}</div>
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
                                    ${existIva(data) ? `<p>Sub total: $${data.subAmount}</p>` : ''}
                                </div>
                                <div style='width: 20%'>
                                    ${data.iva[1] > 0 ? `<p>Iva 21%: $${data.iva[1]}</p>` : ''}
                                    ${data.iva[0] > 0 ? `<p>Iva 10.5%: $${data.iva[0]}</p>` : ''}
                                    ${data.iva[2] > 0 ? `<p>Iva 27%: $${data.iva[2]}</p>` : ''}
                                </div>
                                <div style='width: 20%'>
                                    ${existIva(data) ? `<p>Total IVA: $${data.ivaTotal}</p>` : ''}
                                </div>
                                <div style='width: 40%; text-align: right;'>
                                    <p><h2>Total: $${data.amountNet}</h2></p>
                                </div>
                            </div>
                            <div style='width: 100%; margin-top: 20px'>
                                <div style='width: 100%; display: flex; justify-content: right;'>
                                    <div style='margin-right: 15px;'>
                                        <p>CAE: ${data.cae}</p>
                                        <p>Vencimiento: ${data.caeExpirationDate}</p>
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