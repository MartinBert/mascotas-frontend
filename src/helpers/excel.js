import ExcelJS from 'exceljs'

// Helpers
import mathHelper from './mathHelper'

// Imports destructuring
const { isPar } = mathHelper

const excelColumnsNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const stylizeSheet = (sheet, headersLength, linesLength, exportWithImages) => {

    // Estilizar columnas
    if (exportWithImages) {
        sheet.properties.defaultRowHeight = 80
        for (let headersIndex = 0; headersIndex < headersLength; headersIndex++) {
            sheet.getColumn(excelColumnsNames[headersIndex]).width = 15
            for (let linesIndex = 0; linesIndex < linesLength + 2; linesIndex++) {
                sheet.getCell(excelColumnsNames[headersIndex] + linesIndex).alignment = {
                    vertical: 'middle'
                }
            }
        }
    }

    // Estilizar encabezados
    for (let index = 0; index < headersLength; index++) {
        sheet.getCell(excelColumnsNames[index] + '1').alignment = {
            horizontal: 'center',
            vertical: 'middle'
        }
        sheet.getCell(excelColumnsNames[index] + '1').border = {
            bottom: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
            top: { style: 'thin', color: { argb: '000000' } }
        }
        sheet.getCell(excelColumnsNames[index] + '1').fill = {
            type: 'pattern',
            pattern: 'darkVertical',
            fgColor: { argb: 'FFFF00' }
        }
        sheet.getCell(excelColumnsNames[index] + '1').font = {
            bold: true,
            family: 4,
            name: 'Arial'
        }
    }

    // Estilizar celdas a partir de la segunda fila
    for (let headersIndex = 0; headersIndex < headersLength; headersIndex++) {
        for (let linesIndex = 2; linesIndex < linesLength + 2; linesIndex++) {
            sheet.getCell(excelColumnsNames[headersIndex] + linesIndex).border = {
                bottom: (linesIndex === linesLength + 1) ? { style: 'thin', color: { argb: '000000' } } : null,
                left: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            }
            sheet.getCell(excelColumnsNames[headersIndex] + linesIndex).fill = {
                bgColor: isPar(linesIndex) ? { argb: 'D2F1F8' } : { argb: 'FFFFFF' },
                fgColor: isPar(linesIndex) ? { argb: 'D2F1F8' } : { argb: 'FFFFFF' },
                pattern: 'solid',
                type: 'pattern'
            }
        }
    }

    return sheet
}

const toDataURL = (url) => {
    const promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.onload = function () {
            var reader = new FileReader()
            reader.readAsDataURL(xhr.response)
            reader.onloadend = function () {
                resolve({ base64Url: reader.result })
            }
        }
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.send()
    })
    return promise
}


const generateExcel = async (columnHeaders, lines, nameSheet, nameDocument) => {
    try {
        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet(nameSheet)

        // Columnas
        const columns = columnHeaders.map(headerTitle => {
            const column = {
                header: headerTitle,
                key: headerTitle.toLowerCase().trim()
            }
            return column
        })
        sheet.columns = columns

        // Datos para exportar
        for (let i = 0; i < lines.length; i++) {
            const data = {}
            const line = lines[i]
            for (let index = 0; index < columns.length; index++) {
                const header = columns[index]
                if (header.key === 'ilustración' && line[index] !== '-') {
                    const result = await toDataURL(line[index])
                    const splitted = line[index].split('.')
                    const extName = splitted[splitted.length - 1]
                    const imageInWorkbook = workbook.addImage({
                        base64: result.base64Url,
                        extension: extName,
                    })
                    sheet.addImage(imageInWorkbook, {
                        tl: { col: index, row: i + 1 },
                        ext: { width: 80, height: 80 },
                    })
                } else data[header.key] = line[index]
            }
            sheet.insertRow(i + 2, data)
        }

        // Estilizar Excel
        const headersLength = columnHeaders.length
        const linesLength = lines.length
        const exportWithImages = columnHeaders.includes('Ilustración')
        stylizeSheet(sheet, headersLength, linesLength, exportWithImages)

        // Generar Excel con imágenes
        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = `${nameDocument}.xlsx`
            anchor.click()
            window.URL.revokeObjectURL(url)
        })
        return { isCreated: true }
    } catch (error) {
        console.log(error)
        return { isCreated: false }
    }
}

const excel = {
    generateExcel
}

export default excel