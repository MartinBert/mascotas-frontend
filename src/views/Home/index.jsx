// React Components and Hooks
import React, { useEffect } from 'react'

// Design Components
import { Button, Col, Input, Row, Table } from 'antd'
import { errorAlert } from '../../components/alerts'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import FirstSteps from './FirstSteps'

// Imports Destructuring
const { useAuthContext } = contexts.Auth
const { useHomeContext } = contexts.Home
const {creditCodes, debitCodes } = helpers.afipHelper
const { localFormat, numberOrderDate } = helpers.dateHelper
const { previousInteger, round } = helpers.mathHelper
const { normalizeString } = helpers.stringHelper


const Home = () => {
    const [auth_state] = useAuthContext()
    const [home_state, home_dispatch] = useHomeContext()

    // -------------------------------------- Actions ---------------------------------------- //
    const verifyDevToolsVisibility = () => {
        const activeBusiness = auth_state.user.empresa ? true : false
        const activeSalePoint = auth_state.user.puntoVenta ? true : false
        const activeDevPassword = home_state.devPassword === process.env.REACT_APP_DEV_PASSWORD
        const devToolsAreVisible = activeBusiness && activeSalePoint && activeDevPassword
        const firstStepsAreVisible = !activeBusiness || !activeSalePoint
        home_dispatch({ type: 'SET_VISIBILITY_OF_DEV_TOOLS', payload: devToolsAreVisible })
        home_dispatch({ type: 'SET_VISIBILITY_OF_FIRST_STEPS', payload: firstStepsAreVisible })
    }

    useEffect(() => {
        verifyDevToolsVisibility()
        // eslint-disable-next-line
    }, [auth_state.user.empresa, auth_state.user.puntoVenta, home_state.devPassword])

    // ----------------------------- Button to console entries ------------------------------- //
    const consoleEntries = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findAllEntries = await api.entries.findAll()
        const allEntries = findAllEntries.data
        console.log(allEntries)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleEntries = (
        <Button
            onClick={consoleEntries}
            type='primary'
        >
            Generar
        </Button>
    )

    // -------------------- Button to console daily business statistics ---------------------- //
    const consoleDailyBusinessStatistics = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findDailyBusinessStatistics = await api.dailyBusinessStatistics.findAll()
        const statistics = findDailyBusinessStatistics.data
        console.log(statistics)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleDailyBusinessStatistics = (
        <Button
            onClick={consoleDailyBusinessStatistics}
            type='primary'
        >
            Generar
        </Button>
    )

    // ----------------------------- Button to console outputs ------------------------------- //
    const consoleOutputs = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findAllOutputs = await api.outputs.findAll()
        const allOutputs = findAllOutputs.data
        console.log(allOutputs)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleOutputs = (
        <Button
            onClick={consoleOutputs}
            type='primary'
        >
            Generar
        </Button>
    )

    // ----------------------------- Button to console products ------------------------------ //
    const consoleProducts = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findAllProducts = await api.products.findAll()
        const allProducts = findAllProducts.data
        console.log(allProducts)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleProducts = (
        <Button
            onClick={consoleProducts}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------- Button to console products without assigned brand or type --------------- //
    const consoleProductsWithoutAssignedBrandOrType = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findAllProducts = await api.products.findAll()
        const allProducts = findAllProducts.data
        const productsWithoutBrandOrType = allProducts.filter(product =>
            !product.marca || !product.rubro
        )
        console.log(productsWithoutBrandOrType)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleProductsWithoutAssignedBrandOrType = (
        <Button
            onClick={consoleProductsWithoutAssignedBrandOrType}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------------------------ Button to console sales -------------------------------- //
    const consoleSales = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findAllSales = await api.sales.findAll()
        const allSales = findAllSales.data
        console.log(allSales)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleSales = (
        <Button
            onClick={consoleSales}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------------------- Button to console stock histories --------------------------- //
    const consoleStockHistories = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findStockHistory = await api.stockHistory.findAll()
        const stockHistory = findStockHistory.data
        console.log(stockHistory)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleStockHistories = (
        <Button
            onClick={consoleStockHistories}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------- Button to console supported vouchers from AFIP Controller --------------- //
    const consoleSupportedVouchers = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const cuit = '20365455717'
        const res = await api.afip.getDocumentsTypes(cuit)
        console.log(res)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToConsoleSupportedVouchersFromAfipController = (
        <Button
            onClick={consoleSupportedVouchers}
            type='primary'
        >
            Generar
        </Button>
    )

    // -------------------- Button to delete daily business statistics ----------------------- //
    const deleteDailyBusinessStatistics = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const response = await api.dailyBusinessStatistics.deleteAll()
        if (!response || response.code !== 200) {
            home_dispatch({ type: 'SET_LOADING', payload: false })
            return errorAlert('No se pudo eliminar las estadísticas diarias de negocio. Intente de nuevo.')
        }
        console.log('Daily business statistics was deleted.')
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToDeleteDailyBusinessStatistics = (
        <Button
            danger
            onClick={deleteDailyBusinessStatistics}
            type='primary'
        >
            Eliminar
        </Button>
    )

    // -------------------------- Button to delete data from SEED ---------------------------- //
    const deleteSeedData = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const res = await api.seed.deleteData()
        console.log(res)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToDeleteDataFromSeed = (
        <Button
            danger
            onClick={deleteSeedData}
            type='primary'
        >
            Eliminar
        </Button>
    )

    // ------------------------- Button to delete stock histories ---------------------------- //
    const deleteStockHistories = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const findStockHistories = await api.stockHistory.findAll()
        const stockHistories = findStockHistories.data
        for (let index = 0; index < stockHistories.length; index++) {
            const stockHistory = stockHistories[index]
            await api.stockHistory.remove(stockHistory._id)
        }
        console.log('Stock histories was deleted.')
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToDeleteStockHistories = (
        <Button
            danger
            onClick={deleteStockHistories}
            type='primary'
        >
            Eliminar
        </Button>
    )

    // -------------------------- Button to fix data base records ---------------------------- //
    const fixDataBaseRecords = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })

        // const findSales = await api.sales.findAll()
        // const sales = findSales.data
        // const res = await api.sales.edit(updatedSales)
        // if (!res || res.status !== 'OK') errorAlert('No se pudieron reparar los registros. Intente de nuevo.')
        // else console.log('Records fixed.')

        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToFixDataBaseRecords = (
        <Button
            onClick={fixDataBaseRecords}
            type='primary'
        >
            Reparar
        </Button>
    )
    
    // ------------------- Button to generate daily business statistics ---------------------- //
    const oldestActivityErrorMessage = (activity) => {
        const fixedActivity = activity.substring(0, activity.length - 1)
        const message = `
            No se pudo recuperar la fecha de la primera ${fixedActivity} para elaborar los registros.
            Recargue la página para volver a intentar.
        `
        return message
    }

    const dateLabelsInActivitiesModels = (activity) => {
        let label
        if (activity === 'ventas') label = 'fechaEmision'
        else label = 'fecha'
        return label
    }

    const getOldestActivityDate = async () => {
        const activitiesToCheckOldestDate = ['entries', 'outputs', 'sales']
        const findOldestDatesInMs = []
        for (let index = 0; index < activitiesToCheckOldestDate.length; index++) {
            const activity = activitiesToCheckOldestDate[index];
            const [oldestRecord] = await api[activity].findOldestRecord()
            if (!oldestRecord) return errorAlert(oldestActivityErrorMessage(activity))
            const oldestRecordDate = oldestRecord[dateLabelsInActivitiesModels(activity)]
            const formattedOldestRecordDate = Date.parse(oldestRecordDate)
            findOldestDatesInMs.push(formattedOldestRecordDate)
        }
        const oldestDatesInMs = findOldestDatesInMs.filter(dateInMs => !isNaN(dateInMs))
        const orderedOldestDatesInMs = oldestDatesInMs.sort((date1, date2) => date1 - date2)
        const oldestDateInMs = orderedOldestDatesInMs[0] - (orderedOldestDatesInMs[0] % 86400000) + 10800000
        const data = {
            date: new Date(oldestDateInMs),
            dateInMs: oldestDateInMs,
            stringDate: localFormat(new Date(oldestDateInMs))
        }
        return data
    }

    const generateDatesForCreateRecords = async () => {
        const oldestActivityDateData = await getOldestActivityDate()
        const oldestActivityDateInMs = oldestActivityDateData.dateInMs
        const todayDateInMs = Date.parse(new Date()) - (Date.parse(new Date()) % 86400000) + 10800000
        const loopLimit = previousInteger((todayDateInMs - oldestActivityDateInMs) / 86400000)

        const dates = []
        const datesInMs = []
        const stringDates = []
        for (let index = 0; index <= loopLimit; index++) {
            const currentDayInMs = oldestActivityDateInMs + index * 86400000
            dates.push(new Date(currentDayInMs))
            datesInMs.push(currentDayInMs)
            stringDates.push(localFormat(new Date(currentDayInMs)))
        }
        const data = { dates, datesInMs, stringDates }
        return data
    }

    const generateDailyBusinessStatistics = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const datesData = await generateDatesForCreateRecords()
        const datesForCreateRecords = datesData.dates
        const stringDatesForCreateRecords = datesData.stringDates

        const findEntries = await api.entries.findAll()
        const findOutputs = await api.outputs.findAll()
        const findSales = await api.sales.findAll()
        const entriesRecords = findEntries.data
        const outputsRecords = findOutputs.data
        const salesRecords = findSales.data.filter(record => record.documento.cashRegister)
        const dataForCreateRecords = stringDatesForCreateRecords.map((stringDate, index) => {
            const dataItem = {
                date: datesForCreateRecords[index],
                entries: entriesRecords.filter(record => record.fechaString.substring(0,10) === stringDate),
                outputs: outputsRecords.filter(record => record.fechaString.substring(0,10) === stringDate),
                stringDate,
                sales: salesRecords.filter(record => record.fechaEmisionString.substring(0,10) === stringDate)
            }
            return dataItem
        })

        // Generate records
        const dailyBusinessStatisticsToSave = []
        for (let index = 0; index < dataForCreateRecords.length; index++) {
            const dataItem = dataForCreateRecords[index]

            const creditNotes = dataItem.sales
                .filter(record => creditCodes.includes(record.documentoCodigo))
                .reduce((acc, creditNote) => acc + creditNote.total, 0)
            const cashRegisterVouchersExceptCreditNotes = dataItem.sales
                .filter(record => !creditCodes.includes(record.documentoCodigo))
                .reduce((acc, voucher) => acc + voucher.total, 0)
            const cashRegisterVouchersIVAExceptCreditNotes = dataItem.sales
                .filter(record => !creditCodes.includes(record.documentoCodigo))
                .reduce((acc, voucher) => acc + voucher.importeIva, 0)
            const entries = dataItem.entries.reduce((acc, entry) => acc + entry.costoTotal, 0)
            const outputsIncome = dataItem.outputs.reduce((acc, output) => acc + output.ingreso, 0)
            const outputsNetProfit = dataItem.outputs.reduce((acc, output) => acc + output.gananciaNeta, 0)
            const outputsExpense = outputsIncome - outputsNetProfit
            const salesListPricesData = dataItem.sales
                .filter(record =>
                    !creditCodes.includes(record.documentoCodigo)
                    && !debitCodes.includes(record.documentoCodigo)
                )
                .map(sale => {
                    const data = sale.renglones.map(line => {
                        const data = {
                            productUnitPrice: line.precioListaUnitario,
                            proportion: line.cantidadUnidades
                        }
                        return data
                    })
                    return data
                })
            const salesListPrices = salesListPricesData
                .flat()
                .reduce((acc, item) => acc + item.productUnitPrice * item.proportion, 0)

            const balanceViewExpense = round(creditNotes + cashRegisterVouchersIVAExceptCreditNotes + entries)
            const balanceViewIncome = round(cashRegisterVouchersExceptCreditNotes + outputsIncome)
            const balanceViewProfit = round(balanceViewIncome - balanceViewExpense)
            const salesViewExpense = round(cashRegisterVouchersIVAExceptCreditNotes + creditNotes + outputsExpense + salesListPrices)
            const salesViewIncome = round(cashRegisterVouchersExceptCreditNotes + outputsIncome)
            const salesViewProfit = round(salesViewIncome - salesViewExpense)

            const record = {
                balanceViewExpense,
                balanceViewIncome,
                balanceViewProfit,
                concept: 'Generado automáticamente',
                date: dataItem.date,
                dateOrder: numberOrderDate(dataItem.stringDate),
                dateString: dataItem.stringDate,
                salesViewExpense,
                salesViewIncome,
                salesViewProfit
            }
            dailyBusinessStatisticsToSave.push(record)
        }

        // Save records
        const res = await api.dailyBusinessStatistics.save(dailyBusinessStatisticsToSave)
        if (!res || res.status !== 'OK') {
            home_dispatch({ type: 'SET_LOADING', payload: false })
            return errorAlert('No se pudo generar las estadísticas diarias.')
        }

        console.log('ready')
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToGenerateDailyBusinessStatistics = (
        <Button
            onClick={generateDailyBusinessStatistics}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------------------- Button to generate data from SEED --------------------------- //
    const generateSeedData = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const res = await api.seed.generateData()
        console.log(res)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToGenerateDataFromSeed = (
        <Button
            onClick={generateSeedData}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------------------ Button to generate stock histories --------------------------- //
    const generateStockHistories = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })

        // Data to generate records
        const findAllEntries = await api.entries.findAll()
        const findAllOutputs = await api.outputs.findAll()
        const findAllProducts = await api.products.findAll()
        const findAllSales = await api.sales.findAll()
        const allEntries = findAllEntries.data
        const allOutputs = findAllOutputs.data
        const allProducts = findAllProducts.data
        const allSales = findAllSales.data

        // Generate records
        const generateStockHistoryData = allProducts.map(product => {

            // Entries data
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

            // Outputs data
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

            // Sales data
            const productSalesData = allSales
                .filter(sale => sale.documento.cashRegister)
                .map(sale => {
                    const productsOfSaleIDs = sale.renglones
                        .filter(line => !line.codigoBarras.starsWith('custom'))
                        .map(line => line.productId)
                    if (productsOfSaleIDs.includes(product._id)) {
                        const currentLineOfSale = sale.renglones
                            .find(lineOfSale => lineOfSale.productId === product._id)
                        if (!currentLineOfSale) return null
                        const productOfSale = {
                            date: sale.fechaEmision,
                            dateString: sale.fechaEmisionString.substring(0, 10),
                            sales: currentLineOfSale.cantidadUnidades
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
                    record.outputs = round(saleRecord.sales)
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
                            record.outputs = round(salesOfRecordSales + outputRecord.outputs)
                        } else {
                            record.dateString = outputRecord.dateString
                            record.outputs = round(outputRecord.outputs)
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

        // Save records
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

        console.log('ready')
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToGenerateStockHistories = (
        <Button
            onClick={generateStockHistories}
            type='primary'
        >
            Generar
        </Button>
    )

    // -------------------- Button to get last voucher number from AFIP ---------------------- //
    const getLastVoucherNumber = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const res = await api.afip.findLastVoucherNumber('20365455717', '2', '011')
        console.log(res)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToGetLastVoucherNumberFromAFIP = (
        <Button
            onClick={getLastVoucherNumber}
            type='primary'
        >
            Generar
        </Button>
    )

    // ------------------------------- Button to test service -------------------------------- //
    const testService = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })

        const filters = JSON.stringify({ nombre: 'POLAR SOFT Y CORDERITO T4' })
        const findRecord = await api.products.findAllByFilters(filters)
        const data = findRecord.data.docs
        console.log(data)

        home_dispatch({ type: 'SET_LOADING', payload: true })
    }

    // const testService = async () => {
    //     home_dispatch({ type: 'SET_LOADING', payload: true })
    //     const filters = JSON.stringify({
    //         documentoCodigo: { $in: invoiceAndTicketCodes },
    //         // renglones: { $match: { productId: '67a3dbaebf1fc67a7b5e5620' } }
    //     })
    //     const response = await api.sales.findAllByFilters(filters)
    //     if (response.statusText !== 'OK') {
    //         console.log('Service error')
    //     } else {
    //         const docs = response.data
    //         console.log(docs)
    //     }
    //     home_dispatch({ type: 'SET_LOADING', payload: false })
    // }

    const buttonToTestService = (
        <Button
            onClick={testService}
            type='primary'
        >
            Probar servicio
        </Button>
    )

    // ------------------------------ Input pass to dev tools -------------------------------- //
    const onChangeDevPassword = (e) => {
        home_dispatch({ type: 'SET_DEV_PASSWORD', payload: e.target.value })
    }

    const inputPassToDevTools = (
        <Input.Password
            allowClear
            onChange={onChangeDevPassword}
            placeholder='Dev pass'
        />
    )

    // ----------------------------- Input to filter dev tools ------------------------------- //
    const onChangeDescription = (e) => {
        const description = normalizeString(e.target.value).toLowerCase()
        const filters = { ...home_state.paginationParams.filters, description }
        home_dispatch({ type: 'SET_FILTERS', payload: filters })
    }

    const setDevToolsToRender = () => {
        if (home_state.devPassword !== process.env.REACT_APP_DEV_PASSWORD) return
        const descriptionFilter = home_state.paginationParams.filters.description
        let devTools
        if (!descriptionFilter || descriptionFilter === '') devTools = source
        else {
            devTools = source.filter(devTool => {
                const devToolDescription = normalizeString(devTool.description).toLowerCase()
                if (devToolDescription.includes(descriptionFilter)) return true
                else return false
            })
        }
        devTools = devTools.filter(devTool => devTool.renderable)
        home_dispatch({ type: 'SET_DEV_TOOLS_TO_RENDER', payload: devTools })
    }

    useEffect(() => {
        setDevToolsToRender()
        // eslint-disable-next-line
    }, [home_state.paginationParams.filters, home_state.devPassword])

    const inputToFilterDevTools = (
        <Input
            onChange={onChangeDescription}
            placeholder='Buscar herramienta'
            type='primary'
        />
    )

    // --------------------------------- Table of dev tools ---------------------------------- //
    const setPageAndLimit = (page, limit) => {
        const paginationParams = {
            ...home_state.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        home_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const columns = [
        {
            dataIndex: 'home_description',
            render: (_, source) => source.description,
            title: 'Descripción'
        },
        {
            dataIndex: 'home_primaryAction',
            render: (_, source) => source.primaryAction,
            title: 'Acción primaria'
        },
        {
            dataIndex: 'home_secondaryAction',
            render: (_, source) => source.secondaryAction,
            title: 'Acción secundaria'
        }
    ]

    const source = [
        {
            description: 'Reparar los registros establecidos.',
            key: 'home_buttonToFixDataBaseRecords',
            primaryAction: buttonToFixDataBaseRecords,
            renderable: true,
            secondaryAction: buttonToTestService
        },
        {
            description: 'Muestra en consola los tipos de comprobantes soportados por el controlador de Afip.',
            key: 'home_buttonToConsoleSupportedVouchers',
            primaryAction: buttonToConsoleSupportedVouchersFromAfipController,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola el número del último comprobante fiscal emitido.',
            key: 'home_buttonToGetLastVoucherNumber',
            primaryAction: buttonToGetLastVoucherNumberFromAFIP,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola aquellos productos que no tienen marca o rubro asignado.',
            key: 'home_buttonToConsoleProductsWithoutAssignedBrandOrType',
            primaryAction: buttonToConsoleProductsWithoutAssignedBrandOrType,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todos los productos registrados.',
            key: 'home_buttonToConsoleProducts',
            primaryAction: buttonToConsoleProducts,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Generar o eliminar las estadísticas diarias de negocio.',
            key: 'home_buttonToGenerateDailyBusinessStatistics',
            primaryAction: buttonToGenerateDailyBusinessStatistics,
            renderable: true,
            secondaryAction: buttonToDeleteDailyBusinessStatistics
        },
        {
            description: 'Generar o eliminar Historial de Stock de todos los productos. Útil para corregir datos erróneos de manera limpia.',
            key: 'home_buttonsToGenerateAndDeleteStockHistories',
            primaryAction: buttonToGenerateStockHistories,
            renderable: true,
            secondaryAction: buttonToDeleteStockHistories
        },
        {
            description: 'Genera o elimina datos iniciales para probar el sistema. ¡CUIDADO! Utilizar solo en modo desarrollo.',
            key: 'home_buttonsToGenerateAndDeleteSeedData',
            primaryAction: buttonToGenerateDataFromSeed,
            renderable: auth_state.user.email === process.env.REACT_APP_EMAIL_ADMIN,
            secondaryAction: buttonToDeleteDataFromSeed
        },
        {
            description: 'Muestra en consola todas las entradas de productos hasta la fecha.',
            key: 'home_buttonToConsoleEntries',
            primaryAction: buttonToConsoleEntries,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todas las salidas de productos hasta la fecha.',
            key: 'home_buttonToConsoleOutputs',
            primaryAction: buttonToConsoleOutputs,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todas los comprobantes generados hasta la fecha (facturas, tickets, presupuestos, etc.).',
            key: 'home_buttonToConsoleSales',
            primaryAction: buttonToConsoleSales,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todas las estadísticas diarias de negocio registradas hasta la fecha.',
            key: 'home_buttonToConsoleDailyBusinessStatistics',
            primaryAction: buttonToConsoleDailyBusinessStatistics,
            renderable: true,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola el historial de stock de todos los productos registrados.',
            key: 'home_buttonToConsoleStockHistories',
            primaryAction: buttonToConsoleStockHistories,
            renderable: true,
            secondaryAction: null
        }
    ]


    const tableOfDevTools = (
        <Table
            columns={columns}
            dataSource={home_state.devToolsToRender}
            loading={home_state.loading}
            pagination={{
                defaultCurrent: home_state.paginationParams.page,
                defaultPageSize: home_state.paginationParams.limit,
                limit: home_state.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimit(page, limit),
                pageSizeOptions: [5, 10],
                showSizeChanger: true,
                total: home_state.devToolsToRender.length
            }}
            rowKey='key'
            size='small'
            tableLayout='auto'
            width={'100%'}
        />
    )

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Row align='middle'>
                    <Col
                        span={12}
                        style={{ textAlign: 'left' }}
                    >
                        <h2>¡Bienvenido!</h2>
                    </Col>
                    <Col
                        span={12}
                        style={{ textAlign: 'right' }}
                    >
                        {inputPassToDevTools}
                    </Col>
                </Row>
            </Col>
            {
                !home_state.visibilityOfDevTools
                    ? null
                    : (
                        <Col span={24}>
                            <Row justify='end'>
                                <Col span={12}>
                                    {inputToFilterDevTools}
                                </Col>
                                <Col span={24}>
                                    {tableOfDevTools}
                                </Col>
                            </Row>
                        </Col>
                    )
            }
            {
                !home_state.visibilityOfFirstSteps
                    ? null
                    : (
                        <Col span={24}>
                            <FirstSteps />
                        </Col>
                    )
            }
        </Row>
    )
}

export default Home