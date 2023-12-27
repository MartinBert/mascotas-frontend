// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { fiscalVouchersCodes } = helpers.afipHelper
const { simpleDateWithHours } = helpers.dateHelper

const creditCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.credit)
    .filter(code => code !== null)

const Graphics = () => {
    const [
        dailyBusinessStatistics_state,
        dailyBusinessStatistics_dispatch
    ] = useDailyBusinessStatisticsContext()

    useEffect(() => {
        const findAllStatistics = async () => {
            const findAllStatistics = await api.dailyBusinessStatistics.findAll()
            const allStatistics = findAllStatistics.docs

            for (let index = 0; index < allStatistics.length; index++) {
                const element = allStatistics[index]
                const filters_entriesAndOutputs = JSON.stringify({ fechaString: element.dateString.substring(0, 10) })
                const filters_sales = JSON.stringify({
                    cashRegister: true,
                    fechaEmisionString: element.dateString.substring(0, 10)
                })
                const findEntries = await api.entradas.findByDate(filters_entriesAndOutputs)
                const findOutputs = await api.salidas.findByDate(filters_entriesAndOutputs)
                const findSales = await api.ventas.findByDate(filters_sales)
                const entries = findEntries.docs
                const outputs = findOutputs.docs
                const sales = findSales.docs
                console.log('fecha: ----------------------------------------------' + element.dateString)
                console.log(entries)
                console.log(outputs)
                console.log(sales)
                const dailyEntries = entries.map(entry => {
                    if (!entry) return 0
                    if (entry.documento) return 0
                    if (entry.costoTotal) return entry.costoTotal
                    else return 0
                }).reduce((acc, value) => acc + value, 0)

                const dailyOutputs = outputs.map(output => {
                    if (!output) return 0
                    if (output.documento) return 0
                    if (output.gananciaNeta) return output.gananciaNeta
                    else return 0
                }).reduce((acc, value) => acc + value, 0)

                const dailySalesAndDebits_iva = sales.map(sale => {
                    if (!sale) return 0
                    if (!sale.renglones && !sale.documento) return 0
                    if (!sale.documento.cashRegister) return 0
                    else {
                        const saleIva = !creditCodes.includes(sale.documentoCodigo) ? sale.importeIva : 0
                        return saleIva
                    }
                }).reduce((acc, value) => acc + value, 0)

                const dailySalesAndDebits_total = sales.map(sale => {
                    if (!sale) return 0
                    if (!sale.renglones && !sale.documento) return 0
                    if (!sale.documento.cashRegister) return 0
                    else {
                        const saleTotal = !creditCodes.includes(sale.documentoCodigo) ? sale.total : 0
                        return saleTotal
                    }
                }).reduce((acc, value) => acc + value, 0)

                const dailyCredits = sales.map(sale => {
                    if (!sale) return 0
                    if (!sale.renglones && !sale.documento) return 0
                    if (!sale.documento.cashRegister) return 0
                    else {
                        const creditTotal = creditCodes.includes(sale.documentoCodigo) ? sale.total : 0
                        return creditTotal
                    }
                }).reduce((acc, value) => acc + value, 0)

                const dailyExpense = dailySalesAndDebits_iva + dailyEntries + dailyCredits
                const dailyIncome = dailySalesAndDebits_total + dailyOutputs
                const dailyStatisticsToSave = {
                    _id: element._id,
                    concept: 'Generado automáticamente',
                    dailyExpense,
                    dailyIncome,
                    dailyProfit: dailyIncome - dailyExpense,
                    date: element.date,
                    dateString: element.dateString
                }

                await api.dailyBusinessStatistics.edit(dailyStatisticsToSave)
            }
            console.log('listo')
        }
        findAllStatistics()
    }, [])


    return (
        <Row>
            <Col span={24}>
                <h2>Gráficos próximamente!</h2>
            </Col>
            <Col span={24}>

            </Col>
        </Row>
    )
}

export default Graphics