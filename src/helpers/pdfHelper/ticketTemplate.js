// Helpers
import dateHelper from '../dateHelper'
import mathHelper from '../mathHelper'

// Imports Destruvturing
const { simpleDateWithHours } = dateHelper
const { roundTwoDecimals } = mathHelper


const createTicketTemplate = (templateData) => {
    const { data, isFrontPage, pageNumber } = templateData

    return `
        <div style='width: 283px; height: 1102px; display: inline-block; line-height: 1; margin: 10px; '>
            <div style='width: 100%; height: 236px; border: solid 2px; border-color: #C2BDBC; border-radius: 5px;'>
                <div style='width: 30%; text-align: center; margin: 0 auto; margin-top: 5px;'>
                    <div style='background-color: #C2BDBC; border: 1px solid; border-radius: 5px;'>
                        <h1 style='font-size: 32px; font-weight: bold; color: #fff; margin-top: 15px'>${data.documentoLetra}</h1>
                    </div>
                    <p style='vertical-align: text-top; margin-top: 5px;'>Código ${data.documentoCodigo}</p>
                </div>
                <div style='width: 100%; margin-top: 15px; padding-left: 10px; text-align: left;'>
                    <p style='width: 100%; text-align: center; margin-top: 5px;'>NO VÁLIDO COMO FACTURA</p>
                    <p style='margin-top: 3px;'><i>Razón social:</i> ${data.empresaRazonSocial}</p>
                    <p style='margin-top: 3px;'><i>Dirección:</i> ${data.empresaDireccion}</p>
                    <p style='margin-top: 3px;'><i>Fecha emisión:</i> ${simpleDateWithHours(data.fechaEmision)}</p>
                    <p style='padding-right: 5px; margin-top: 3px; text-align: right; width: 100%;'>Página 1 de ${pageNumber}</p>
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
            <div style='width: 100%; height: 707px; display: inline-block;'>
                <div>
                    ${
                        data.renglones.map(renglon => {
                            return `
                                <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                                    <div style='width: 15%;'>
                                        ${
                                            renglon.fraccionar
                                                ? roundTwoDecimals(renglon.cantidadUnidades / renglon.fraccionamiento)
                                                : roundTwoDecimals(renglon.cantidadUnidades)}
                                    </div>
                                    <div style='width: 60%;'>${renglon.nombre}</div>
                                    <div style='width: 25%; text-align: right; padding-right: 5px;'>${roundTwoDecimals(renglon.precioBruto)}</div>
                                </div>
                                ${
                                    renglon.nota === (null || '')
                                        ? ''
                                        : (`
                                            <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                                                <div style='margin-left: 15%; width: 85%;'>
                                                    <i>${renglon.nota}</i>
                                                </div>
                                            </div>
                                        `)
                                }
                            `
                        }).join('<br />')}
                </div>
                <div style='width: 100%; display: inline-block;'>
                    <br />
                    ${
                        !data.totalRecargo
                            ? ''
                            : (`
                                <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                                    <div style='width: 15%;'>1</div>
                                    <div style='width: 60%;'>Recargo aplicado</div>
                                    <div style='width: 25%; text-align: right; padding-right: 5px;'>${roundTwoDecimals(data.totalRecargo)}</div>
                                </div>
                            `)
                    }
                    <br />
                    ${
                        !data.totalDescuento
                            ? ''
                            : (`
                                <div style='width: 100%; display: flex; text-align: left; padding-left: 5px; font-size: 12px;'>
                                    <div style='width: 15%;'>1</div>
                                    <div style='width: 60%;'>Descuento aplicado</div>
                                    <div style='width: 25%; text-align: right; padding-right: 5px;'>- ${roundTwoDecimals(data.totalDescuento)}</div>
                                </div>
                            `)
                    }
                    <br />
                </div>
            </div>
            ${
                !isFrontPage
                    ? ''
                    : (`
                        <div style='width: 100%; height: 110px; bottom: 0; font-size: 9px;'>
                            <div style='width: 100%; color: #C2BDBC;'>
                                <hr>
                            </div>
                            <div style='width: 100%; padding: 10px;'>
                                <div style='width: 100%; text-align: right; font-size: 20px;'>
                                    <p>Total: $${data.total}</p>
                                </div>
                            </div>
                        </div>
                    `)
            }
        </div>
    `
}


export default createTicketTemplate