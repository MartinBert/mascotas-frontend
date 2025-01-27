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


const BalanceView = () => {
    const [dailyBusinessStatistics_state, dailyBusinessStatistics_dispatch] = useDailyBusinessStatisticsContext()

    // ----------------- Button to close ----------------- //
    const closeModal = () => {
        dailyBusinessStatistics_dispatch({ type: 'HIDE_BALANCE_VIEW_MODAL' })
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

    // ---------------- Table of expenses ---------------- //
    const loadExpenses = async () => {
        const statisticDate = dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.dateString
        const entriesFilters = JSON.stringify({ fechaString: statisticDate.substring(0, 10) })
        // Entries data
        const findEntries = await api.entradas.findAllByFilters(entriesFilters)
        const entries = findEntries.docs
        const entriesData = entries.map(entry => {
            const data = entry.productos.map(product => {
                const dataItem = {
                    concept: 'Entrada',
                    cost: product.cantidadesEntrantes * product.precioUnitario,
                    productName: product.nombre,
                    quantity: product.cantidadesEntrantes
                }
                return dataItem
            })
            return data
        })
        // Credit notes data
        const creditNotesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10), documentoCodigo: creditCodes })
        const findCreditNotes = await api.ventas.findAllByFilters(creditNotesFilters)
        const creditNotes = findCreditNotes.docs
        const creditNotesData = creditNotes.map(creditNote => {
            const dataItem = {
                concept: 'Nota crédito',
                cost: creditNote.total,
                productName: '-',
                quantity: 1
            }
            return dataItem
        })
        // IVA of sales and debit notes
        const salesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10) })
        const findSales = await api.ventas.findAllByFilters(salesFilters)
        const sales = findSales.docs
            .filter(sale => sale.documento.cashRegister === true)
            .filter(sale => !creditCodes.includes(sale.documentoCodigo))
        const ivaOfSalesAndDebitNotesData = sales.map(sale => {
            const isDebitNote = debitCodes.includes(sale.documentoCodigo)
            const data = sale.renglones.map(line => {
                const dataItem = {
                    concept: isDebitNote ? 'Nota débito IVA' : 'Venta IVA',
                    cost: line.importeIva,
                    productName: isDebitNote ? '-' : line.nombre,
                    quantity: isDebitNote ? 1 : line.cantidadUnidades
                }
                return dataItem
            })
            return data
        }).flat().filter(dataItem => dataItem.cost !== 0)
        const preData = [...creditNotesData.flat(), ...entriesData.flat(), ...ivaOfSalesAndDebitNotesData.flat()]
        const data = preData.map((item, i) => { return { ...item, key: 'expenseItem' + i } })
        const expensesData = { expenses: data, totalExpensesRecords: data.length }
        dailyBusinessStatistics_dispatch({ type: 'SET_EXPENSES_TO_BALANCE_VIEW', payload: expensesData })
    }

    useEffect(() => {
        loadExpenses()
        // eslint-disable-next-line
    }, [dailyBusinessStatistics_state.statisticsView.balanceView.modalVisibility])

    const setPageAndLimitOfTableOfExpenses = (page, limit) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        dailyBusinessStatistics_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_EXPENSES_IN_BALANCE_VIEW',
            payload: paginationParams
        })
    }

    const columnsOfExpensesTable = [
        {
            dataIndex: 'columnsOfExpensesTable_concept',
            render: (_, record) => record.concept,
            title: 'Concepto'
        },
        {
            dataIndex: 'columnsOfExpensesTable_productName',
            render: (_, record) => record.productName,
            title: 'Producto'
        },
        {
            dataIndex: 'columnsOfExpensesTable_productEntries',
            render: (_, record) => round(record.quantity),
            title: 'Cantidad'
        },
        {
            dataIndex: 'columnsOfExpensesTable_productExpense',
            render: (_, record) => round(record.cost),
            title: 'Gasto'
        }
    ]

    const tableOfExpenses = (
        <Table
            columns={columnsOfExpensesTable}
            dataSource={dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.expenses}
            loading={dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.loading}
            pagination={{
                defaultCurrent: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.paginationParams.page,
                defaultPageSize: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.paginationParams.limit,
                limit: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimitOfTableOfExpenses(page, limit),
                pageSize: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.paginationParams.limit,
                pageSizeOptions: [5, 10],
                showSizeChanger: true,
                total: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfExpenses.totalExpensesRecords
            }}
            rowKey='key'
            size='small'
            tableLayout='auto'
            title={() => 'Gastos de la fecha'}
            width={'100%'}
        />
    )

    // ---------------- Table of incomes ----------------- //
    const loadIncomes = async () => {
        const statisticDate = dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.dateString
        const debitNotesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10), documentoCodigo: debitCodes })
        const outputsFilters = JSON.stringify({ fechaString: statisticDate.substring(0, 10) })
        const salesFilters = JSON.stringify({ fechaEmisionString: statisticDate.substring(0, 10) })
        // Debit notes
        const findDebitNotes = await api.ventas.findAllByFilters(debitNotesFilters)
        const debitNotes = findDebitNotes.docs
        const debitNotesData = debitNotes.map(debitNote => {
            const dataItem = {
                concept: 'Nota débito',
                productName: '-',
                profit: debitNote.total,
                quantity: 1
            }
            return dataItem
        })
        // Outputs
        const findOutputs = await api.salidas.findAllByFilters(outputsFilters)
        const outputs = findOutputs.docs
        const outputsData = outputs.map(output => {
            const data = output.productos.map(product => {
                const dataItem = {
                    concept: 'Salida',
                    productName: product.nombre,
                    profit: product.cantidadesSalientes * product.precioVenta,
                    quantity: product.cantidadesSalientes
                }
                return dataItem
            })
            return data
        })
        // Sales
        const findSales = await api.ventas.findAllByFilters(salesFilters)
        const sales = findSales.docs
            .filter(sale => sale.documento.cashRegister === true)
            .filter(sale => !creditCodes.includes(sale.documentoCodigo) && !debitCodes.includes(sale.documentoCodigo))
        const salesData = sales.map(sale => {
            const data = sale.renglones.map(line => {
                const dataItem = {
                    concept: 'Venta',
                    productName: line.nombre,
                    profit: line.precioNeto,
                    quantity: line.cantidadUnidades
                }
                return dataItem
            })
            return data
        })
        const preData = [...debitNotesData.flat(), ...outputsData.flat(), ...salesData.flat()]
        const data = preData.map((item, i) => { return { ...item, key: 'incomeItem' + i } })
        const incomesData = { incomes: data, totalIncomesRecords: data.length }
        dailyBusinessStatistics_dispatch({ type: 'SET_INCOMES_TO_BALANCE_VIEW', payload: incomesData })
    }

    useEffect(() => {
        loadIncomes()
        // eslint-disable-next-line
    }, [dailyBusinessStatistics_state.statisticsView.balanceView.modalVisibility])

    const setPageAndLimitOfTableOfIncomes = (page, limit) => {
        const paginationParams = {
            ...dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        dailyBusinessStatistics_dispatch({
            type: 'SET_PAGINATION_PARAMS_OF_TABLE_OF_INCOMES_IN_BALANCE_VIEW',
            payload: paginationParams
        })
    }

    const columnsOfIncomesTable = [
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
            render: (_, record) => round(record.profit),
            title: 'Ingreso'
        }
    ]

    const tableOfIncomes = (
        <Table
            columns={columnsOfIncomesTable}
            dataSource={dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.incomes}
            loading={dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.loading}
            pagination={{
                defaultCurrent: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.paginationParams.page,
                defaultPageSize: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.paginationParams.limit,
                limit: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.paginationParams.limit,
                onChange: (page, limit) => setPageAndLimitOfTableOfIncomes(page, limit),
                pageSize: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.paginationParams.limit,
                pageSizeOptions: [5, 10],
                showSizeChanger: true,
                total: dailyBusinessStatistics_state.statisticsView.balanceView.tableOfIncomes.totalIncomesRecords
            }}
            rowKey='key'
            size='small'
            tableLayout='auto'
            title={() => 'Ingresos de la fecha'}
            width={'100%'}
        />
    )

    // ---------------- Titles of totals ----------------- //
    const getBalanceColor = () => {
        const balanceViewExpense = dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.balanceViewExpense
        const balanceViewIncome = dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.balanceViewIncome
        const parameter = balanceViewIncome - balanceViewExpense
        if (parameter >= 0) return { color: '#15DC24' }
        else return { color: '#FF3C3C' }
    }

    const titleOfTotalExpenses = <h2 style={{ textAlign: 'center' }}>Gasto total: <b style={{ color: '#FF3C3C' }}>{round(dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.balanceViewExpense)}</b></h2>
    const titleOfTotalIncomes = <h2 style={{ textAlign: 'center' }}>Ingreso total: <b style={{ color: '#15DC24' }}>{round(dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.balanceViewIncome)}</b></h2>
    const titleOfBalance = <h2 style={{ textAlign: 'center' }}>Balance: <b style={getBalanceColor()}>{round(dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.balanceViewProfit)}</b></h2>


    const tablesToRender = [
        {
            element: tableOfExpenses,
            name: 'detailsOfStockHistoryModal_tableOfExpenses',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: tableOfIncomes,
            name: 'detailsOfStockHistoryModal_tableOfIncomes',
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGridOfTables = {
        gutter: { horizontal: 16, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
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
            open={dailyBusinessStatistics_state.statisticsView.balanceView.modalVisibility}
            title={`Detalle de movimientos del ${dailyBusinessStatistics_state.statisticsView.balanceView.statisticToViewDetails.dateString.substring(0, 10)}`}
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

export default BalanceView