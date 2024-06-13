// React Components and Hooks
import React from 'react'
import { useEffect } from 'react'

// Helpers
import actions from '../../actions'
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { formatFindParams } = actions.paginationParams
const { roundTwoDecimals } = helpers.mathHelper
const { normalizeString } = helpers.stringHelper


const Home = () => {

    const console_documentTypes = false // 'True' to console log all supported voucher types by the afip controller
    useEffect(() => {
        const findDocumentsTypes = async () => {
            if (!console_documentTypes) return
            const cuit = '20374528506'
            const res = await api.afip.getDocumentsTypes(cuit)
            console.log(res)
        }
        findDocumentsTypes()
    }, [console_documentTypes])

    // ------------------- Update model ------------------ //
    const generateStockHistories = async () => {

        // Data para generar los registros
        const findAllEntries = await api.entradas.findAll()
        const findAllOutputs = await api.salidas.findAll()
        const findAllProducts = await api.productos.findAll()
        const findAllSales = await api.ventas.findAll()
        const allEntries = findAllEntries.docs
        const allOutputs = findAllOutputs.docs
        const allProducts = findAllProducts.docs
        const allSales = findAllSales.docs

        // Generación de registros
        const generateStockHistoryData = allProducts.map(product => {

            const productEntriesData = allEntries.map(entry => {
                const productsOfEntryIDs = entry.productos.map(productOfEntry => productOfEntry._id)
                if (productsOfEntryIDs.includes(product._id)) {
                    const [currentProduct] = entry.productos.filter(productOfEntry => productOfEntry._id === product._id)
                    const productOfEntry = {
                        date: entry.fecha,
                        dateString: entry.fechaString.substring(0, 10),
                        entries: currentProduct.cantidadesEntrantes
                    }
                    return productOfEntry
                } else return null
            }).filter(record => record)

            const findEntriesDates = productEntriesData.map(itemData => itemData.dateString)
            const entriesDates = findEntriesDates.filter((item, index) => {
                return findEntriesDates.indexOf(item) === index
            })

            const entriesData = entriesDates.map(date => {
                const entriesOfDate = productEntriesData.map(entry => {
                    if (entry.dateString === date) return entry
                    else return null
                }).filter(record => record)
                const reduceValues = { dateString: date }
                for (let index = 0; index < entriesOfDate.length; index++) {
                    reduceValues.entries =
                        entriesOfDate.reduce((acc, value) => acc + value.entries, 0)
                }
                return reduceValues
            })

            const productOutputsData = allOutputs.map(output => {
                const productsOfOutputIDs = output.productos.map(productOfOutput => productOfOutput._id)
                if (productsOfOutputIDs.includes(product._id)) {
                    const [currentProduct] = output.productos.filter(productOfOutput => productOfOutput._id === product._id)
                    const productOfOutput = {
                        date: output.fecha,
                        dateString: output.fechaString.substring(0, 10),
                        outputs: currentProduct.cantidadesSalientes
                    }
                    return productOfOutput
                } else return null
            }).filter(record => record)

            const findOutputsDates = productOutputsData.map(itemData => itemData.dateString)
            const outputsDates = findOutputsDates.filter((item, index) => {
                return findOutputsDates.indexOf(item) === index
            })

            const reduceOutputsData = outputsDates.map(date => {
                const outputsOfDate = productOutputsData.map(output => {
                    if (output.dateString === date) return output
                    else return null
                }).filter(record => record)
                const reduceValues = { dateString: date }
                for (let index = 0; index < outputsOfDate.length; index++) {
                    reduceValues.outputs =
                        outputsOfDate.reduce((acc, value) => acc + value.outputs, 0)
                }
                return reduceValues
            })

            const productSalesData = allSales.map(sale => {
                const productsOfSaleIDs = sale.productos.map(productOfSale => productOfSale._id)
                if (productsOfSaleIDs.includes(product._id)) {
                    const [currentLineOfSale] = sale.renglones
                        .filter(lineOfSale => lineOfSale.nombre === product.nombre)
                    if (!currentLineOfSale) return null
                    const productOfSale = {
                        date: sale.fechaEmision,
                        dateString: sale.fechaEmisionString.substring(0, 10),
                        sales: currentLineOfSale.fraccionar
                            ? currentLineOfSale.cantidadUnidades / currentLineOfSale.fraccionamiento
                            : currentLineOfSale.cantidadUnidades
                    }
                    return productOfSale
                } else return null
            }).filter(record => record)

            const findSalesDates = productSalesData.map(itemData => itemData.dateString)
            const salesDates = findSalesDates.filter((item, index) => {
                return findSalesDates.indexOf(item) === index
            })

            const reduceSalesData = salesDates.map(date => {
                const salesOfDate = productSalesData.map(sale => {
                    if (sale.dateString === date) return sale
                    else return null
                }).filter(record => record)
                const reduceValues = { dateString: date }
                for (let index = 0; index < salesOfDate.length; index++) {
                    reduceValues.sales =
                        salesOfDate.reduce((acc, value) => acc + value.sales, 0)
                }
                return reduceValues
            })

            const outputsData = reduceSalesData.map(saleRecord => {
                let record = {}
                const outputsDates = reduceOutputsData.map(outputRecord => outputRecord.dateString)
                if (!outputsDates.includes(saleRecord.dateString)) {
                    record.dateString = saleRecord.dateString
                    record.outputs = roundTwoDecimals(saleRecord.sales)
                } else record = null
                return record
            }).filter(record => record)
                .concat(
                    reduceOutputsData.map(outputRecord => {
                        const record = {}
                        const salesDates = reduceSalesData.map(saleRecord => saleRecord.dateString)
                        if (salesDates.includes(outputRecord.dateString)) {
                            const [salesOfRecordSales] = reduceSalesData.map(salesRecord => {
                                if (salesRecord.dateString === outputRecord.dateString) return salesRecord.sales
                                else return null
                            }).filter(record => record)
                            record.dateString = outputRecord.dateString
                            record.outputs = roundTwoDecimals(salesOfRecordSales + outputRecord.outputs)
                        } else {
                            record.dateString = outputRecord.dateString
                            record.outputs = roundTwoDecimals(outputRecord.outputs)
                        }
                        return record
                    })
                )

            const stockHistory = {
                entriesData: entriesData,
                outputsData: outputsData,
                product: product._id
            }
            return stockHistory
        })

        const dataForSave = []
        for (let index = 0; index < generateStockHistoryData.length; index++) {
            const productData = generateStockHistoryData[index]
            const findEntriesDates = productData.entriesData.map(itemData => itemData.dateString)
            const findOutputsDates = productData.outputsData.map(itemData => itemData.dateString)
            const findProductActivityDates = [...findEntriesDates, ...findOutputsDates]
            const productActivityDates = findProductActivityDates.filter((item, index) =>
                findProductActivityDates.indexOf(item) === index
            )
            for (let index = 0; index < productActivityDates.length; index++) {
                const formattedData = {}
                const date = productActivityDates[index]
                const formattedDate = date.substring(3, 5) + '/' + date.substring(0, 2) + '/' + date.substring(6, 10)
                const entriesFromDate = productData.entriesData.filter(entry => entry.dateString === date)
                const outputsFromDate = productData.outputsData.filter(output => output.dateString === date)
                formattedData.date = new Date(formattedDate)
                formattedData.dateString = date
                formattedData.entries = entriesFromDate.length > 0 ? entriesFromDate[0].entries : 0
                formattedData.itIsAManualCorrection = false
                formattedData.outputs = outputsFromDate.length > 0 ? outputsFromDate[0].outputs : 0
                formattedData.product = productData.product
                dataForSave.push(formattedData)
            }
        }

        for (let index = 0; index < dataForSave.length; index++) {
            const record = dataForSave[index]
            await api.stockHistory.save(record)
        }

        console.log('listo')

        // VERIFY IN CONSOLE
        // const quantityOfEntriesToSave = dataForSave.reduce((acc, val) => acc + val.entries, 0)
        // const quantityOfOutputsToSave = dataForSave.reduce((acc, val) => acc + val.outputs, 0)
        // const savedEntries = allEntries.reduce((acc, val) => acc + val.cantidad, 0)
        // const savedOutputs = allOutputs.reduce((acc, val) => acc + val.cantidad, 0)
        // const calcVal = (sale) => {
        //     const prodIDs = sale.productos.map(prod => prod.nombre)
        //     if (prodIDs.length === 0) return null
        //     const valToReturnArray = sale.renglones.map(line => {
        //         if(prodIDs.includes(line.nombre)) {
        //             const quantity = line.fraccionar
        //                 ? line.cantidadUnidades / line.fraccionamiento
        //                 : line.cantidadUnidades
        //             return quantity
        //         }
        //         else return null
        //     }).filter(record => record)
        //     const valToReturn = valToReturnArray.reduce((acc, rec) => acc + rec, 0)
        //     return valToReturn
        // }
        // const savedSales = allSales.reduce((acc, sale) => acc + calcVal(sale), 0 )
        // const fixedSavedOutputs = savedOutputs + savedSales

        // console.log('VALORES A GUARDAR: ', quantityOfEntriesToSave + quantityOfOutputsToSave)
        // console.log('VALORES GUARDADOS: ', savedEntries + fixedSavedOutputs)
    }

    const deleteStockHistories = async () => {
        const findStockHistories = await api.stockHistory.findAll()
        const stockHistories = findStockHistories.docs
        for (let index = 0; index < stockHistories.length; index++) {
            const stockHistory = stockHistories[index]
            await api.stockHistory.deleteStockHistory(stockHistory._id)
        }

        console.log('listo')
    }

    const addNormalizedNames = async () => {
        const findProducts = await api.productos.findAll()
        const products = findProducts.docs
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            const productFixed = {
                ...product,
                normalizedBarcode: normalizeString(product.codigoBarras),
                normalizedBrand: normalizeString(product.marca.nombre),
                normalizedName: normalizeString(product.nombre),
                normalizedProductCode: normalizeString(product.codigoProducto),
                normalizedType: normalizeString(product.rubro.nombre)
            }
            await api.productos.edit(productFixed)
        }
        
        console.log('listo')
    }

    const showData = async () => {
        const findAllEntries = await api.entradas.findAll()
        const findAllOutputs = await api.salidas.findAll()
        const findAllProducts = await api.productos.findAll()
        const findAllSales = await api.ventas.findAll()
        const findDailyBusinessStatistics = await api.dailyBusinessStatistics.findAll()
        const findStockHistory = await api.stockHistory.findAll()

        const allEntries = findAllEntries.docs
        const allOutputs = findAllOutputs.docs
        const allProducts = findAllProducts.docs
        const allSales = findAllSales.docs
        const statistics = findDailyBusinessStatistics.docs
        const stockHistory = findStockHistory.docs

        console.log('ENTRADAS')
        console.log(allEntries)
        console.log('--------------------------------------------------------------')
        console.log('SALIDAS')
        console.log(allOutputs)
        console.log('--------------------------------------------------------------')
        console.log('PRODUCTOS')
        console.log(allProducts)
        console.log('--------------------------------------------------------------')
        console.log('VENTAS')
        console.log(allSales)
        console.log('--------------------------------------------------------------')
        console.log('ESTADISTICAS DIARIAS')
        console.log(statistics)
        console.log('--------------------------------------------------------------')
        console.log('HISTORIAL DE STOCK')
        console.log(stockHistory)
    }


    const testRenderElementDisplay = 'none'

    return (
        <>
            <h1>Home</h1>
            <button
                onClick={generateStockHistories}
                style={{ display: testRenderElementDisplay }}
            >
                Generar historial de stock
            </button>
            <hr style={{ display: testRenderElementDisplay }} />
            <button
                onClick={deleteStockHistories}
                style={{ display: testRenderElementDisplay }}
            >
                Borrar historial de stock
            </button>
            <hr style={{ display: testRenderElementDisplay }} />
            <button
                onClick={addNormalizedNames}
                style={{ display: testRenderElementDisplay }}
            >
                Agregar nombres normalizados a productos
            </button>
            <hr style={{ display: testRenderElementDisplay }} />
            <button
                onClick={showData}
                style={{ display: testRenderElementDisplay }}
            >
                Mostrar datos en consola
            </button>
        </>
    )
}

export default Home