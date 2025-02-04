// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Modal, Row, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { useDailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { creditCodes, debitCodes } = helpers.afipHelper
const { round } = helpers.mathHelper


const SalesView = () => {
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()

    // ----------------- Button to close ----------------- //
    const closeModal = () => {
        dailyBusinessStatistics_dispatch({ type: 'HIDE_SALES_VIEW_MODAL' })
    }

    const buttonToClose = (
        <Button
            danger
            onClick={closeModal}
            style={{ width: '100%' }}
            type='primary'
        >
            Cerrar
        </Button>
    )

    // ---------------- Table of sales ----------------- //
    const loadSales = async () => {
        const statisticDate = dailyBusinessStatistics_state.statisticsView.salesView.statisticToViewDetails.dateString

        // Credit notes
        const creditNotesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10), documentoCodigo: creditCodes })
        const findCreditNotes = await api.ventas.findAllByFilters(creditNotesFilters)
        const creditNotes = findCreditNotes.docs
        const creditNotesData = creditNotes.map(creditNote => {
            const dataItem = {
                concept: 'Nota crédito',
                expense: round(creditNote.total),
                productName: '-',
                profit: - round(creditNote.total),
                quantity: 1,
                salePrice: 0
            }
            return dataItem
        })

        // Debit Notes
        const debitNotesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10), documentoCodigo: debitCodes })
        const findDebitNotes = await api.ventas.findAllByFilters(debitNotesFilters)
        const debitNotes = findDebitNotes.docs
        const debitNotesData = debitNotes.map(debitNote => {
            const dataItem = {
                concept: 'Nota débito',
                expense: 0,
                productName: '-',
                profit: round(debitNote.total),
                quantity: 1,
                salePrice: round(debitNote.total)
            }
            return dataItem
        })

        // Outputs
        const outputsFilters = JSON.stringify({ fechaString: statisticDate.substring(0, 10) })
        const findOutputs = await api.salidas.findAllByFilters(outputsFilters)
        const outputs = findOutputs.docs
        const outputsData = outputs.map(output => {
            const data = output.productos.map(product => {
                const profit = parseFloat(product.cantidadesSalientes) * parseFloat(product.precioVenta)
                const dataItem = {
                    concept: 'Salida',
                    expense: 0,
                    productName: product.nombre,
                    profit: round(profit),
                    quantity: round(product.cantidadesSalientes),
                    salePrice: round(profit)
                }
                return dataItem
            })
            return data
        })

        // Sales
        const salesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10) })
        const findSales = await api.ventas.findAllByFilters(salesFilters)
        const sales = findSales.docs
            .filter(sale => sale.documento.cashRegister === true)
            .filter(sale => !creditCodes.includes(sale.documentoCodigo) && !debitCodes.includes(sale.documentoCodigo))
        const salesData = sales.map(sale => {
            const data = sale.renglones.map(line => {
                const productLine = sale.productos.find(product => product.nombre === line.nombre)
                let productListPrice
                if (!productLine) productListPrice = 0
                else {
                    productListPrice = (
                        parseFloat(productLine.precioUnitario)
                        / (line.fraccionar ? parseFloat(line.fraccionamiento) : 1)
                    )
                }
                const dataItem = {
                    concept: 'Venta',
                    expense: round(productListPrice),
                    productName: line.nombre,
                    profit: round(parseFloat(line.precioNeto) - productListPrice) ?? round(line.profit),
                    quantity: !line.fraccionar
                        ? round(line.cantidadUnidades)
                        : `${round(line.cantidadUnidades)} (fracc. ${round(parseFloat(line.cantidadUnidades) / parseFloat(line.fraccionamiento))})`,
                    salePrice: round(line.precioNeto)
                }
                return dataItem
            })
            return data
        })

        const preData = [
            ...creditNotesData.flat(),
            ...debitNotesData.flat(),
            ...outputsData.flat(),
            ...salesData.flat()
        ]
        const data = preData.map((item, i) => { return { ...item, key: 'salesViewItem_' + i } })
        const salesViewData = { sales: data, totalSalesRecords: data.length }
        dailyBusinessStatistics_dispatch({ type: 'SET_SALES_TO_SALES_VIEW', payload: salesViewData })

        const totalSalesViewExpense = round(data.reduce((acc, value) => acc + value.expense, 0))
        const totalSalesViewProfit = round(data.reduce((acc, value) => acc + value.profit, 0))
        const totalSalesViewSalePrices = round(data.reduce((acc, value) => acc + value.salePrice, 0))
        const salesViewTotals = { totalSalesViewExpense, totalSalesViewProfit, totalSalesViewSalePrices }
        dailyBusinessStatistics_dispatch({ type: 'SET_SALES_VIEW_TOTALS', payload: salesViewTotals })
    }

    useEffect(() => {
        loadSales()
        // eslint-disable-next-line
    }, [dailyBusinessStatistics_state.statisticsView.salesView.modalVisibility])

    const setPageAndLimitOfTableOfSales = (page, limit) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        dailyBusinessStatistics_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_SALES_IN_SALES_VIEW',
            payload: paginationParams
        })
    }

    const columnsOfTableOfSales = [
        {
            dataIndex: 'columnsOfIncomesTable_concept',
            render: (_, record) => record.concept,
            title: 'Concepto'
        },
        {
            dataIndex: 'columnsOfIncomesTable_productName',
            render: (_, record) => record.productName,
            title: 'Producto'
        },
        {
            dataIndex: 'columnsOfIncomesTable_productOutputs',
            render: (_, record) => round(record.quantity),
            title: 'Cantidad'
        },
        {
            dataIndex: 'columnsOfIncomesTable_productIncome',
            render: (_, record) => record.productName === '-' ? '-' : round(record.salePrice),
            title: 'Precio Venta'
        },
        {
            dataIndex: 'columnsOfIncomesTable_productExpense',
            render: (_, record) => record.productName === '-' ? '-' : round(record.expense),
            title: 'Precio Lista'
        },
        {
            dataIndex: 'columnsOfIncomesTable_productProfit',
            render: (_, record) => round(record.profit),
            title: 'Ganancia'
        }
    ]

    const tableOfSales = (
        <Table
            columns={columnsOfTableOfSales}
            dataSource={dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.sales}
            loading={dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.loading}
            pagination={{
                defaultCurrent: dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.paginationParams.page,
                defaultPageSize: dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.paginationParams.limit,
                limit: dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimitOfTableOfSales(page, limit),
                pageSize: dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.paginationParams.limit,
                pageSizeOptions: [5, 10],
                showSizeChanger: true,
                total: dailyBusinessStatistics_state.statisticsView.salesView.tableOfSales.totalSalesRecords
            }}
            rowKey='key'
            size='small'
            tableLayout='auto'
            title={() => 'Ventas de la fecha'}
            width={'100%'}
        />
    )

    // ---------------- Titles of totals ----------------- //
    const getSalesProfitColor = () => {
        const parameter = dailyBusinessStatistics_state.statisticsView.salesView.totalProfit
        if (parameter >= 0) return { color: '#15DC24' }
        else return { color: '#FF3C3C' }
    }

    const titlesStyles = {
        textAlign: 'center'
    }

    const titleOfTotalExpenses = <h2 style={titlesStyles}>Total ventas: <b style={{ color: '#15DC24' }}>{round(dailyBusinessStatistics_state.statisticsView.salesView.totalSalePrices)}</b></h2>
    const titleOfTotalIncomes = <h2 style={titlesStyles}>Total precios lista: <b style={{ color: '#FF3C3C' }}>{round(dailyBusinessStatistics_state.statisticsView.salesView.totalExpense)}</b></h2>
    const titleOfBalance = <h2 style={titlesStyles}>Ganancia: <b style={getSalesProfitColor()}>{round(dailyBusinessStatistics_state.statisticsView.salesView.totalProfit)}</b></h2>


    const tablesToRender = [
        {
            element: tableOfSales,
            name: 'detailsOfStockHistoryModal_tableOfSales',
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGridOfTables = {
        gutter: { horizontal: 16, vertical: 8 },
        span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
    }

    const titlesToRender = [
        {
            element: titleOfTotalExpenses,
            name: 'detailsOfStockHistoryModal_titleOfTotalExpenses',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: titleOfTotalIncomes,
            name: 'detailsOfStockHistoryModal_titleOfTotalIncomes',
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        },
        {
            element: titleOfBalance,
            name: 'detailsOfStockHistoryModal_titleOfBalance',
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        }
    ]

    const responsiveGridOfTitles = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 8, md: 8, sm: 24, xl: 8, xs: 24, xxl: 8 }
    }


    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={dailyBusinessStatistics_state.statisticsView.salesView.modalVisibility}
            title={`Detalle de ventas del ${dailyBusinessStatistics_state.statisticsView.salesView.statisticToViewDetails.dateString.substring(0, 10)}`}
            width={1200}
        >
            <Row gutter={[responsiveGridOfTables.gutter.horizontal, responsiveGridOfTables.gutter.vertical]}>
                {
                    tablesToRender.map(item => {
                        return (
                            <Col
                                key={item.name}
                                lg={{ order: item.order.lg, span: responsiveGridOfTables.span.lg }}
                                md={{ order: item.order.md, span: responsiveGridOfTables.span.md }}
                                sm={{ order: item.order.sm, span: responsiveGridOfTables.span.sm }}
                                xl={{ order: item.order.xl, span: responsiveGridOfTables.span.xl }}
                                xs={{ order: item.order.xs, span: responsiveGridOfTables.span.xs }}
                                xxl={{ order: item.order.xxl, span: responsiveGridOfTables.span.xxl }}
                            >
                                {item.element}
                            </Col>
                        )
                    })
                }
            </Row>
            <Row gutter={[responsiveGridOfTitles.gutter.horizontal, responsiveGridOfTitles.gutter.vertical]}>
                {
                    titlesToRender.map(item => {
                        return (
                            <Col
                                key={item.name}
                                lg={{ order: item.order.lg, span: responsiveGridOfTitles.span.lg }}
                                md={{ order: item.order.md, span: responsiveGridOfTitles.span.md }}
                                sm={{ order: item.order.sm, span: responsiveGridOfTitles.span.sm }}
                                xl={{ order: item.order.xl, span: responsiveGridOfTitles.span.xl }}
                                xs={{ order: item.order.xs, span: responsiveGridOfTitles.span.xs }}
                                xxl={{ order: item.order.xxl, span: responsiveGridOfTitles.span.xxl }}
                            >
                                {item.element}
                            </Col>
                        )
                    })
                }
            </Row>
            {buttonToClose}
        </Modal >
    )
}

export default SalesView