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

    const activate = false
    // ACTUALIZAR TAMBIEN DOCUMENTOS DESDE LA INTERFAZ
    
    useEffect(() => {
        const addProp = async () => {
            if (!activate) return
            const findEntries = await api.entradas.findAll()
            const entries = findEntries.docs
            for (let index = 0; index < entries.length; index++) {
                const element = entries[index]
                element.fechaString = simpleDateWithHours(new Date(element.fecha))
                await api.entradas.edit(element)
            }
            console.log('entradas actualizadas!')
        }
        addProp()
    }, [activate])
    
    useEffect(() => {
        const addProp = async () => {
            if (!activate) return
            const findOutputs = await api.salidas.findAll()
            const outputs = findOutputs.docs
            for (let index = 0; index < outputs.length; index++) {
                const element = outputs[index]
                element.fechaString = simpleDateWithHours(new Date(element.fecha))
                await api.salidas.edit(element)
            }
            console.log('salidas actualizadas!')
        }
        addProp()
    }, [activate])

    useEffect(() => {
        const addProp = async () => {
            if (!activate) return
            const findSales = await api.ventas.findAll()
            const sales = findSales.docs
            for (let index = 0; index < sales.length; index++) {
                const element = sales[index]

                const newLines = await Promise.all(
                    element.renglones.map(async (renglon, index) => {
                        let productNetProfit
                        const productID = element.productos[index]
                        const findProduct = await api.productos.findById(productID)
                        const product = findProduct ? findProduct.data : null
                        if (product) {
                            const profitMargin = renglon.fraccionar ? decimalPercent(product.margenGananciaFraccionado) : decimalPercent(product.margenGanancia)
                            const unitPrice = !renglon.fraccionar
                                ? renglon.precioUnitario / (1 + profitMargin + decimalPercent(product.porcentajeIvaVenta))
                                : (renglon.precioUnitario / renglon.fraccionamiento) / (1 + profitMargin + decimalPercent(product.porcentajeIvaVenta))
                            productNetProfit = unitPrice * profitMargin * renglon.cantidadUnidades
                        } else {
                            productNetProfit = renglon.precioNeto - renglon.importeIva
                        }
                        const newLine = {
                            ...renglon,
                            profit: roundTwoDecimals(productNetProfit)
                        }
                        return newLine
                    })
                )

                element.renglones = newLines
                element.profit = newLines.reduce((acc, el) => acc + el.profit, 0)
                await api.ventas.edit(element)
            }
            console.log('ventas actualizadas!')
        }
        addProp()
    }, [activate])

    // useEffect(() => {
    //     const viewProps = async () => {
    //         const res = await api.ventas.findAll()
    //         console.log(res.docs)
    //     }
    //     viewProps()
    // }, [])

    return (
        <h1>Home</h1>
    )
}

export default Home