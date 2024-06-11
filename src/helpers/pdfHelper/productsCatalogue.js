// Dependencies
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Helpers
import dateHelper from '../dateHelper'
import mathHelper from '../mathHelper'
import objHelper from '../objHelper'

// Imports destructuring
const { localFormat } = dateHelper
const { isPar, nextInteger } = mathHelper
const { sortArray } = objHelper

const pageMargins = 'margin-left: 20px; margin-right: 20px; padding: 10px;'
const overflowEllipsis = 'display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'

const generateHeader = (enterprise, salesArea) => {
    const { cuit, direccion, email, fechaInicioActividad, ingresosBrutos, logo, razonSocial, telefono } = enterprise

    return `
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
                        src='${logo.url}'
                        width='100'
                    >
                </div>
                <div style='display: block;'>
                    <div style=${overflowEllipsis}>${direccion}</div>
                    <div style=${overflowEllipsis}>CUIT: ${cuit}</div>
                    <div style=${overflowEllipsis}>Ing. Brutos: ${ingresosBrutos}</div>
                    <div style=${overflowEllipsis}>Inicio Act.: ${localFormat(fechaInicioActividad)}</div>
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
                    <div style=${overflowEllipsis}><h2>${razonSocial}</h2></div>
                    <div style=${overflowEllipsis}><h3>Teléfono de contacto: ${telefono}</h3></div>
                    <div style=${overflowEllipsis}><h3>Email: ${email}</h3></div>
                </div>
                <div style='margin-top: 25px;'>
                    <div style=${overflowEllipsis}><h3 style='margin-bottom: 5px'>Lista de precios:</h3></div>
                    <div style=${overflowEllipsis}><h1>${salesArea}</h1></div>
                </div>
            </div>
        </div>
    `
}

const generateBodyWithImages = (lines) => {
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
                lines.map(line => {
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

const generateBodyWithoutImages = (headers, lines) => {
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
                ${lines.map((line, index) => {
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

const frontPageOfCatalogue = (data) => {
    const { brands, enterprise, headers, lines, salesArea, types } = data
    const exportWithImages = headers.includes('Ilustración')
    const linesForFrontPage = exportWithImages ? lines.slice(0, 8) : lines.slice(0, 31)

    return `
        <div
            style='
                display: block;
                height: 1082px;
                width: 793px;'
        >
            ${generateHeader(enterprise, salesArea)}
            <div style='${pageMargins}'>
                <div style='${overflowEllipsis} width: 700px;'><h3><i>Marcas: ${brands.join(', ')}</i></h3></div>
                <div style='${overflowEllipsis} width: 700px;'><h3><i>Rubros: ${types.join(', ')}</i></h3></div>
            </div>
            <div style='height: 642px;'>
                ${exportWithImages
                    ? generateBodyWithImages(linesForFrontPage)
                    : generateBodyWithoutImages(headers, linesForFrontPage)
                }
            </div>
        </div>
    `
}

const createProductsCataloguePdf = async (data) => {
    data.lines = sortArray(data.lines, [1, 2])
    const dataForPdf = []

    // Front page
    const frontPageContainer = document.createElement('div')
    frontPageContainer.innerHTML = frontPageOfCatalogue(data)
    dataForPdf.push(frontPageContainer)

    // Add more pages to pdf
    const linesLength = data.lines.length
    const exportWithImages = data.headers.includes('Ilustración')
    const isLongerThanOnePage = exportWithImages ? linesLength > 8 : linesLength > 31
    if (isLongerThanOnePage) {
        // Lines to add
        const initialLineIndex = exportWithImages ? 8 : 31
        const linesToAdd = data.lines.slice(initialLineIndex, data.lines.length)
        // Calculate number of pages to generate
        const numberOfLinesPerPage = exportWithImages ? 12 : 45
        const totalLines = linesLength - initialLineIndex
        const numberOfPagesToAdd = nextInteger(totalLines / numberOfLinesPerPage)
        // Generate data for pages
        for (let index = 0; index < numberOfPagesToAdd; index++) {
            const linesForPage = linesToAdd.slice(index * numberOfLinesPerPage, (index + 1) * numberOfLinesPerPage)
            const pageContainer = document.createElement('div')
            pageContainer.innerHTML = exportWithImages
                ? generateBodyWithImages(linesForPage)
                : generateBodyWithoutImages(data.headers, linesForPage)
            dataForPdf.push(pageContainer)
        }
    }

    // Generate PDF
    const resultsOfLoop = []
    const docName = 'catalogo_' + localFormat(new Date())
    const size = [297, 210] // Expresed in mm
    const doc = new jsPDF('p', 'mm', size)
    for (let index = 0; index < dataForPdf.length; index++) {
        try {
            const frame = document.getElementById('catalogue')
            frame.appendChild(dataForPdf[index])
            const canvasOptions = { allowTaint: true, useCORS: true, scale: 1 }
            const canvas = await html2canvas(dataForPdf[index], canvasOptions)
            if (index > 0) doc.addPage('a4', 'p')
            const img = canvas.toDataURL('image/png')
            doc.addImage(img, 'JPEG', 0, 4)
            resultsOfLoop.push(true)
        } catch (error) {
            console.error(error)
            resultsOfLoop.push(false)
        }
    }
    doc.save(docName)
    document.getElementById('catalogue').innerHTML = ''
    const result = resultsOfLoop.includes(false) ? { isProcessed: false } : { isProcessed: true }
    return { isCreated: result.isProcessed }
}

const productsCatalogue = {
    createProductsCataloguePdf
}

export default productsCatalogue