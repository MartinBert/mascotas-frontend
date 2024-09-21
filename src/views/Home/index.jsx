// React Components and Hooks
import React, { useEffect } from 'react'

// Design Components
import { Button, Col, Input, Row, Table } from 'antd'

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
const { roundTwoDecimals } = helpers.mathHelper
const { normalizeString } = helpers.stringHelper


const Home = () => {
    const [auth_state] = useAuthContext()
    const [home_state, home_dispatch] = useHomeContext()

    // -------------------------------------- Actions ---------------------------------------- //
    const verifyDevToolsVisibility = () => {
        const activeBusiness = auth_state.user.empresa !== null
        const activeSalePoint = auth_state.user.puntoVenta !== null
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
        const findAllEntries = await api.entradas.findAll()
        const allEntries = findAllEntries.docs
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
        const statistics = findDailyBusinessStatistics.docs
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
        const findAllOutputs = await api.salidas.findAll()
        const allOutputs = findAllOutputs.docs
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
        const findAllProducts = await api.productos.findAll()
        const allProducts = findAllProducts.docs
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
        const findAllProducts = await api.productos.findAll()
        const allProducts = findAllProducts.docs
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
        const findAllSales = await api.ventas.findAll()
        const allSales = findAllSales.docs
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
        const stockHistory = findStockHistory.docs
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

    // -------------------------- Button to delete data from SEED ---------------------------- //
    const deleteSeedData = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const res = await api.seed.deleteData()
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
        const stockHistories = findStockHistories.docs
        for (let index = 0; index < stockHistories.length; index++) {
            const stockHistory = stockHistories[index]
            await api.stockHistory.deleteStockHistory(stockHistory._id)
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

    // --------------------- Button to generate cert and key from AFIP ----------------------- //
    const generateCertAndKey = async () => {
        home_dispatch({ type: 'SET_LOADING', payload: true })
        const res = await api.afip.generateCertAndKey()
        console.log(res)
        home_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const buttonToGenerateCertAndKeyFromAfip = (
        <Button
            onClick={generateCertAndKey}
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

        console.log('ready')

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
        home_dispatch({ type: 'SET_FILTERS', payload: description })
    }

    const setDevToolsToRender = () => {
        const descriptionFilter = home_state.paginationParams.filters
        const devTools = source.filter(devTool => {
            const devToolDescription = normalizeString(devTool.description).toLowerCase()
            if (devToolDescription.includes(descriptionFilter)) return true
            else return false
        })
        home_dispatch({ type: 'SET_DEV_TOOLS_TO_RENDER', payload: devTools })
    }

    useEffect(() => {
        setDevToolsToRender()
        // eslint-disable-next-line
    }, [home_state.paginationParams.filters])

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
            description: 'Muestra en consola los tipos de comprobantes soportados por el controlador de Afip.',
            key: 'home_buttonToConsoleSupportedVouchers',
            primaryAction: buttonToConsoleSupportedVouchersFromAfipController,
            secondaryAction: null
        },
        {
            description: 'Genera un certificado y llave privada para testing desde Afip y los muestra en consola.',
            key: 'home_buttonToGenerateCertAndKeyFromAfip',
            primaryAction: buttonToGenerateCertAndKeyFromAfip,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola el número del último comprobante fiscal emitido.',
            key: 'home_buttonToGetLastVoucherNumber',
            primaryAction: buttonToGetLastVoucherNumberFromAFIP,
            secondaryAction: null
        },
        {
            description: 'Genera o elimina datos iniciales para probar el sistema. ¡CUIDADO! Utilizar solo en modo desarrollo.',
            key: 'home_buttonsToGenerateAndDeleteSeedData',
            primaryAction: buttonToGenerateDataFromSeed,
            secondaryAction: buttonToDeleteDataFromSeed
        },
        {
            description: 'Muestra en consola aquellos productos que no tienen marca o rubro asignado.',
            key: 'home_buttonToConsoleProductsWithoutAssignedBrandOrType',
            primaryAction: buttonToConsoleProductsWithoutAssignedBrandOrType,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todos los productos registrados.',
            key: 'home_buttonToConsoleProducts',
            primaryAction: buttonToConsoleProducts,
            secondaryAction: null
        },
        {
            description: 'Generar o eliminar Historial de Stock de todos los productos. Útil para corregir datos erróneos de manera limpia.',
            key: 'home_buttonsToGenerateAndDeleteStockHistories',
            primaryAction: buttonToGenerateStockHistories,
            secondaryAction: buttonToDeleteStockHistories
        },
        {
            description: 'Muestra en consola todas las entradas de productos hasta la fecha.',
            key: 'home_buttonToConsoleEntries',
            primaryAction: buttonToConsoleEntries,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todas las salidas de productos hasta la fecha.',
            key: 'home_buttonToConsoleOutputs',
            primaryAction: buttonToConsoleOutputs,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todas los comprobantes generados hasta la fecha (facturas, tickets, presupuestos, etc.).',
            key: 'home_buttonToConsoleSales',
            primaryAction: buttonToConsoleSales,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola todas las estadísticas diarias de negocio registradas hasta la fecha.',
            key: 'home_buttonToConsoleDailyBusinessStatistics',
            primaryAction: buttonToConsoleDailyBusinessStatistics,
            secondaryAction: null
        },
        {
            description: 'Muestra en consola el historial de stock de todos los productos registrados.',
            key: 'home_buttonToConsoleStockHistories',
            primaryAction: buttonToConsoleStockHistories,
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
            {buttonToDeleteDataFromSeed}
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