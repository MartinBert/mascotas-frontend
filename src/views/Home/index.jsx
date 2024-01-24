// React Components and Hooks
import React from 'react'
import { useEffect } from 'react'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { simpleDateWithHours } = helpers.dateHelper
const { decimalPercent, roundTwoDecimals } = helpers.mathHelper


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

    const updateModel = false // 'True' to update defined model
    useEffect(() => {
        const updateProducts = async () => {
            if (!updateModel) return
            const verify = await api.stockHistory.findAll()
            if (verify.length > 0) return

            const findAllEntries = await api.entradas.findAll()
            const findAllOutputs = await api.salidas.findAll()
            const findAllProducts = await api.productos.findAll()
            const allEntries = findAllEntries.docs
            const allOutputs = findAllOutputs.docs
            const allProducts = findAllProducts.docs

            const generateStockHistoryData = allProducts.map(product => {

                const productEntriesData = allEntries.map(entry => {
                    const productsID = entry.productos.map(entryProduct => entryProduct._id)
                    if (productsID.includes(product._id)) {
                        const [currentProduct] = entry.productos.filter(entryProduct => entryProduct._id === product._id)
                        const productEntry = {
                            date: entry.fecha,
                            dateString: entry.fechaString.substring(0, 10),
                            entries: currentProduct.cantidadesEntrantes
                        }
                        return productEntry
                    } else return null
                }).filter(record => record)

                const findEntriesDates = productEntriesData.map(itemData => itemData.dateString)
                const entriesDates = findEntriesDates.filter((item, index) => {
                    return findEntriesDates.indexOf(item) === index
                })

                const reduceEntriesData = entriesDates.map(date => {
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
                    const productsID = output.productos.map(outputProduct => outputProduct._id)
                    if (productsID.includes(product._id)) {
                        const [currentProduct] = output.productos.filter(outputProduct => outputProduct._id === product._id)
                        const productOutput = {
                            date: output.fecha,
                            dateString: output.fechaString.substring(0, 10),
                            outputs: currentProduct.cantidadesSalientes
                        }
                        return productOutput
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

                const stockHistory = {
                    entriesData: reduceEntriesData,
                    outputsData: reduceOutputsData,
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
                    formattedData.outputs = outputsFromDate.length > 0 ? outputsFromDate[0].outputs : 0
                    formattedData.product = productData.product
                    dataForSave.push(formattedData)
                }
            }

            for (let index = 0; index < dataForSave.length; index++) {
                const record = dataForSave[index]
                const response = await api.stockHistory.save(record)
                console.log(response)
            }

            console.log('listo')

        }
        updateProducts()
    }, [updateModel])


    return (
        <h1>Home</h1>
    )
}

export default Home