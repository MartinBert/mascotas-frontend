// Helpers
import dateHelper from '../dateHelper'
import mathHelper from '../mathHelper'

// Imports destructuring
const { localFormat } = dateHelper
const { isPar } = mathHelper

const pageMargins = 'margin-left: 20px; margin-right: 20px; padding: 10px;'
const overflowEllipsis = 'display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'


const generateBodyWithImages = (renglones) => {
    const bodyWithImages = `
        <div
            style='
                ${pageMargins}
                column-gap: 5px;
                display: grid;
                grid-template-columns:
                auto auto;
                row-gap: 5px;'
        >
            ${
                renglones.map(line => {
                    return (`
                        <div
                            style='
                                border: solid 2px;
                                border-radius: 5px;
                                border-color: #9CE5F7;
                                background-color: #D2F1F8;
                                display: flex;
                                height: 160px;
                                width: 365px;'
                        >
                            <div
                                style='
                                    background-color: #FFFFFF;
                                    border-radius: 5px;
                                    display: flex;
                                    margin: 5px;
                                    justify-content: center;
                                    align-items: center;
                                    width: 120px;'
                            >
                                <img
                                    crossorigin='anonymous'
                                    height='100'
                                    src='${line[0]}'
                                    width='100'
                                >
                            </div>
                            <div
                                style='
                                    margin-left: 10px;
                                    width: 220px;'
                            >
                                <div style='${overflowEllipsis} width: 210px;'><b>${line[1]}</b></div>
                                <div style='${overflowEllipsis} width: 210px;'><h2>$ ${line[6]}</h2></div>
                                <div style='${overflowEllipsis} width: 210px;'>Cód. barras: ${line[5]}</div>
                                <div style='${overflowEllipsis} width: 210px;'>Cód. producto: ${line[4]}</div>
                                <div style='${overflowEllipsis} width: 210px;'>Marca: ${line[3].toUpperCase()}</div>
                                <div style='${overflowEllipsis} width: 210px;'>Rubro: ${line[2].toUpperCase()}</div>
                            </div>
                        </div>
                    `)
                }).join('')
            }
        </div>
    `
    return bodyWithImages
}

const generateBodyWithoutImages = (headers, renglones) => {
    const bodyWithoutImages = `
        <div style='${pageMargins} display: block;'>
            <div style='border-bottom: solid 1px; display: flex; width: 100%;'>
                <div style='${overflowEllipsis} margin-right: 10px; width: 80px;'><i>${headers[0]}</i></div>
                <div style='${overflowEllipsis} margin-right: 10px; width: 60px;'><i>${headers[1]}</i></div>
                <div style='${overflowEllipsis} margin-right: 10px; width: 190px;'><i>${headers[2]}</i></div>
                <div style='${overflowEllipsis} margin-right: 10px; width: 120px;'><i>${headers[3]}</i></div>
                <div style='${overflowEllipsis} margin-right: 10px; width: 120px;'><i>${headers[4]}</i></div>
                <div style='${overflowEllipsis} width: 133px;'><i>${headers[5]}</i></div>
            </div>
            <div style='display: block;'>
                ${renglones.map((line, index) => {
                    return (`
                        <div style='display: flex; width: 100%; ${isPar(index) ? 'background-color: #D2F1F8' : null}'>
                            <div style='${overflowEllipsis} margin-right: 10px; width: 80px;'><i>${line[1]}</i></div>
                            <div style='${overflowEllipsis} margin-right: 10px; width: 60px;'><i>${line[2]}</i></div>
                            <div style='${overflowEllipsis} margin-right: 10px; width: 190px;'><i>${line[0]}</i></div>
                            <div style='${overflowEllipsis} margin-right: 10px; width: 120px;'><i>${line[3]}</i></div>
                            <div style='${overflowEllipsis} margin-right: 10px; width: 120px;'><i>${line[4]}</i></div>
                            <div style='${overflowEllipsis} width: 133px;'><i>${line[5]}</i></div>
                        </div>
                    `)
                }).join('')}
            </div>
        </div>
    `
    return bodyWithoutImages
}

const createProductsCatalogueTemplate = (productsCatalogueData) => {
    const { currentPage, data, isFrontPage, totalPages } = productsCatalogueData
    const { brands, enterprise, headers, renglones, salesArea, types } = data
    const exportWithImages = headers.includes('Ilustración')

    return `
        <div
            style='
                display: block;
                height: 1082px;
                padding-top: 15px;
                width: 793px;'
        >
            ${
                !isFrontPage
                    ? ''
                    : (`
                        <div
                            style='
                                ${pageMargins}
                                display: flex;
                                height: 240px;'
                        >
                            <div
                                style='
                                    border: solid 2px;
                                    border-radius: 5px;
                                    display: block;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    width: 40%;'
                            >
                                <div
                                    style='
                                        margin: 10px;
                                        text-align: center;'
                                >
                                    <img
                                        crossorigin='anonymous'
                                        height='100'
                                        src='${enterprise.logo.url}'
                                        width='100'
                                    >
                                </div>
                                <div style='display: block;'>
                                    <div style=${overflowEllipsis}>${enterprise.direccion}</div>
                                    <div style=${overflowEllipsis}>CUIT: ${enterprise.cuit}</div>
                                    <div style=${overflowEllipsis}>Ing. Brutos: ${enterprise.ingresosBrutos}</div>
                                    <div style=${overflowEllipsis}>Inicio Act.: ${localFormat(enterprise.fechaInicioActividad)}</div>
                                </div>
                            </div>
                            <div
                                style='
                                    display: flex;
                                    flex-direction: column;
                                    margin-left: 30px;
                                    width: 60%;'
                            >
                                <div>
                                    <div style=${overflowEllipsis}><h2>${enterprise.razonSocial}</h2></div>
                                    <div style=${overflowEllipsis}><h3>Teléfono de contacto: ${enterprise.telefono}</h3></div>
                                    <div style=${overflowEllipsis}><h3>Email: ${enterprise.email}</h3></div>
                                </div>
                                <div style='margin-top: 25px;'>
                                    <div style=${overflowEllipsis}><h3 style='margin-bottom: 5px'>Lista de precios:</h3></div>
                                    <div style=${overflowEllipsis}><h1>${salesArea}</h1></div>
                                </div>
                            </div>
                        </div>
                    `)
            }
            <div style='${pageMargins}'>
                <div style='${overflowEllipsis} width: 700px;'><h3><i>Marcas: ${brands.join(', ')}</i></h3></div>
                <div style='${overflowEllipsis} width: 700px;'><h3><i>Rubros: ${types.join(', ')}</i></h3></div>
            </div>
            <div style='height: 642px;'>
                ${
                    exportWithImages
                        ? generateBodyWithImages(renglones)
                        : generateBodyWithoutImages(headers, renglones)
                }
            </div>
        </div>
        <div
            style='
                ${pageMargins}
                text-align: right;'
        >
            Página ${currentPage} de ${totalPages}
        </div>
    `
}


export default createProductsCatalogueTemplate