// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import { Button, Col, Modal, Row } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useAuthContext } = contexts.Auth
const { useSaleContext } = contexts.Sale
const { fiscalNotesCodes, formatBody, invoiceCodes, ticketCodes } = helpers.afipHelper
const { localFormat, localFormatToDateObj, numberOrderDate, resetDateTo00hs } = helpers.dateHelper
const { round } = helpers.mathHelper
const {
    createBudgetPdf,
    createInvoicePdf,
    createRemittancePdf,
    createTicketPdf
} = helpers.pdfHelper


const FinalizeSaleModal = () => {
    const [auth_state, auth_dispatch] = useAuthContext()
    const [sale_state, sale_dispatch] = useSaleContext()

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId')
            const loggedUser = await api.users.findById(userId)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser.data })
        }
        fetchUser()
    }, [auth_dispatch])

    // --------------------- Actions --------------------- //
    const activateKeyboard = (e) => {
        if (e.keyCode === 27) {
            e.preventDefault()
            cancelSale()
        } else return
    }

    const redirectFocusIntoModal = (e) => {
        if (e) {
            const buttonToSave = sale_state.refs.buttonToSaveFinalizeSale
            buttonToSave.focus()
        } else return
    }

    const reload = () => { return window.location.reload() }

    // ----------------- Button to cancel ---------------- //
    const cancelSale = () => {
        sale_dispatch({ type: 'HIDE_FINALIZE_SALE_MODAL' })
    }

    const buttonToCancel = (
        <Button
            id='salesFinalizeSaleModal_buttonToCancelFinalizeSale'
            onClick={cancelSale}
            style={{ width: '100%' }}
            className='btn-secondary'
        >
            Cancelar
        </Button>
    )

    // ------------------ Button to save ----------------- //
    const closeFiscalOperation = async () => {
        const bodyToAfip = formatBody(sale_state)
        const responseOfAfip = await api.afip.generateVoucher(auth_state.user.empresa.cuit, bodyToAfip)
        if (!responseOfAfip) {
            return (
                errorAlert('Ocurrió un error al solicitar la creación del comprobante a AFIP. Intente de nuevo.')
                    .then(() => sale_dispatch({ type: 'SET_LOADING_TO_FINALIZE_SALE' }))
            )
        }
        else sale_dispatch({ type: 'CLOSE_FISCAL_OPERATION', payload: responseOfAfip })
    }

    const startCloseSale = async () => {
        sale_state.generalPercentage = round(sale_state.generalPercentage) ?? 0
        sale_state.porcentajeDescuentoGlobal = round(sale_state.porcentajeDescuentoGlobal) ?? 0
        sale_state.porcentajeRecargoGlobal = round(sale_state.porcentajeRecargoGlobal) ?? 0
        sale_state.renglones = sale_state.renglones.map(line => {
            const fixedLine = {
                ...line,
                cantidadUnidades: round(line.cantidadUnidades),
                cantidadUnidadesFraccionadas: round(line.cantidadUnidadesFraccionadas),
                porcentajeDescuentoRenglon: round(line.porcentajeDescuentoRenglon) ?? 0,
                porcentajeRecargoRenglon: round(line.porcentajeRecargoRenglon) ?? 0
            }
            return fixedLine
        })
        sale_dispatch({ type: 'HIDE_FINALIZE_SALE_MODAL' })
        sale_dispatch({ type: 'SET_LOADING_TO_FINALIZE_SALE' })
        sale_state.documentoFiscal
            ? closeFiscalOperation()
            : sale_dispatch({ type: 'CLOSE_NO_FISCAL_OPERATION' })
    }

    const applyStockModification = async () => {
        const productsToApplyModification = sale_state.renglones.filter(line => !line.productId.startsWith('custom'))
        for (const lineOfProduct of productsToApplyModification) {
            const findProductToEdit = await api.products.findById(lineOfProduct.productId)
            const productToEdit = findProductToEdit.data
            const productToModifyInStock = {
                fractionedQuantity: round(lineOfProduct.cantidadUnidadesFraccionadas),
                product: productToEdit
            }
            if (productToModifyInStock) {
                const response = await api.products.modifyStock(productToModifyInStock)
                if (response.code !== 200) errorAlert(`No se pudo modificar el stock del producto "${lineOfProduct.nombre}". Modifíquelo manualmente en la sección "Productos" / "Editar".`)
            }
        }
    }

    const createSaleDocument = async () => {
        let response
        if (sale_state.documento.codigoUnico === '000') { // No fiscal
            if (sale_state.documento.presupuesto) response = await createBudgetPdf(sale_state)
            else if (sale_state.documento.remito) response = await createRemittancePdf(sale_state)
            else if (sale_state.documento.ticket) response = await createTicketPdf(sale_state)
            else response = { isCreated: false }
        } else { // Fiscal
            if (invoiceCodes.includes(sale_state.documento.codigoUnico)) response = await createInvoicePdf(sale_state)
            else if (ticketCodes.includes(sale_state.documento.codigoUnico)) response = await createTicketPdf(sale_state)
            else response = { isCreated: false }
        }
        if (!response.isCreated) return errorAlert('No se pudo generar el comprobante de la operación. Recupérelo desde la página de AFIP.')
    }

    const fillPreviousDates = async () => {
        const currentDate = localFormatToDateObj(sale_state.fechaEmisionString.substring(0, 10))
        const newerRecord = await api.dailyBusinessStatistics.findNewer()
        const newerRecordDate = newerRecord.data?.date ?? currentDate
        const differenceOfDaysBetweenNewerRecordDateAndCurrentDate = round(
            (Date.parse(currentDate) - Date.parse(newerRecordDate)) / 86400000
        )
        let filled = false
        if (differenceOfDaysBetweenNewerRecordDateAndCurrentDate < 2) filled = true
        else {
            const recordsToFill = []
            for (let index = 1; index < differenceOfDaysBetweenNewerRecordDateAndCurrentDate; index++) {
                const recordDate = new Date(Date.parse(newerRecordDate) + index * 86400000)
                const recordToFill = {
                    balanceViewExpense: 0,
                    balanceViewIncome: 0,
                    balanceViewProfit: 0,
                    concept: 'Generado automáticamente',
                    date: recordDate,
                    dateOrder: numberOrderDate(localFormat(recordDate)),
                    dateString: localFormat(recordDate),
                    salesViewExpense: 0,
                    salesViewIncome: 0,
                    salesViewProfit: 0
                }
                recordsToFill.push(recordToFill)
            }
            const response = await api.dailyBusinessStatistics.save(recordsToFill)
            if (!response || response.status !== 'OK') filled = false
            else filled = true
        }
        return filled
    }

    const saveDailyBusinessStatistic = async () => {
        const filters = JSON.stringify({ dateString: sale_state.fechaEmisionString.substring(0, 10) })
        const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
        const statisticToEdit = findStatisticToEdit.data.docs[0] ?? null
        const saleListPricesAndIva = (
            sale_state.renglones.reduce((acc, line) => acc + parseFloat(line.precioListaUnitario) * parseFloat(line.cantidadUnidades), 0)
            + sale_state.renglones
                .filter(line => line._id.startsWith('customProduct_'))
                .reduce((acc, line) => acc + line.importeIva, 0)
        )
        if (statisticToEdit) {
            const filledPreviousDates = await fillPreviousDates()
            if (!filledPreviousDates) errorAlert('No se pudieron generar las estadísticas de negocio anteriores a la fecha. Contacte con su proveedor.')
            const editedStatistic = {
                ...statisticToEdit,
                balanceViewIncome: round(statisticToEdit.balanceViewIncome + sale_state.total),
                balanceViewProfit: round(statisticToEdit.balanceViewProfit + sale_state.total - sale_state.importeIva),
                salesViewExpense: round(statisticToEdit.salesViewExpense + saleListPricesAndIva),
                salesViewIncome: round(statisticToEdit.salesViewIncome + sale_state.total),
                salesViewProfit: round(statisticToEdit.salesViewProfit + sale_state.total - saleListPricesAndIva),
            }
            await api.dailyBusinessStatistics.edit(editedStatistic)
        } else {
            const filledPreviousDates = await fillPreviousDates()
            if (!filledPreviousDates) errorAlert('No se pudieron generar las estadísticas de negocio anteriores a la fecha. Contacte con su proveedor.')
            const newStatistic = {
                balanceViewExpense: 0,
                balanceViewIncome: round(sale_state.total),
                balanceViewProfit: round(sale_state.total - sale_state.importeIva),
                concept: 'Generado automáticamente',
                date: localFormatToDateObj(sale_state.fechaEmisionString.substring(0, 10)),
                dateOrder: numberOrderDate(sale_state.fechaEmisionString.substring(0, 10)),
                dateString: sale_state.fechaEmisionString.substring(0, 10),
                salesViewExpense: round(saleListPricesAndIva),
                salesViewIncome: round(sale_state.total),
                salesViewProfit: round(sale_state.total - saleListPricesAndIva)
            }
            await api.dailyBusinessStatistics.save(newStatistic)
        }
    }

    const saveSaleData = async () => {
        const fixedLines = sale_state.renglones.map(renglon => {
            const { _id, ...lineData } = renglon
            return lineData
        })
        const { refs, productos, ...saleData } = sale_state
        const dataToSave = { ...saleData, renglones: fixedLines }
        const responseOfSaveSale = await api.sales.save(dataToSave)
        if (responseOfSaveSale.status !== 'OK') {
            errorAlert('Error al guardar la venta en "Lista de ventas". A futuro deberá recuperar el comprobante desde la página de AFIP.')
        }
    }

    const saveStockHistoryOfProducts = async () => {
        const dateString = sale_state.fechaEmisionString.substring(0, 10)
        for (let index = 0; index < sale_state.renglones.length; index++) {
            const line = sale_state.renglones[index]
            if (!line.productId.startsWith('customProduct_')) {
                const findProductToSaveStockHistory = await api.products.findById(line.productId)
                const productToSaveStockHistory = findProductToSaveStockHistory.data
                const filters = JSON.stringify({ dateString, product: productToSaveStockHistory })
                const findStockHistory = await api.stockHistory.findAllByFilters(filters)
                const stockHistory = findStockHistory.data.docs
                let response
                const data = {
                    date: resetDateTo00hs(sale_state.fechaEmision),
                    dateString,
                    itIsAManualCorrection: false,
                    product: line.productId
                }
                if (stockHistory.length < 1) {
                    data.entries = 0
                    data.outputs = round(line.cantidadUnidades)
                    response = await api.stockHistory.save(data)
                } else {
                    data._id = stockHistory[0]._id
                    data.entries = round(stockHistory[0].entries)
                    data.outputs = round(stockHistory[0].outputs + line.cantidadUnidades)
                    response = await api.stockHistory.edit(data)
                }
                if (response.status !== 'OK') errorAlert(`No se pudo generar el historial de stock para el producto "${line.nombre}". Cree el registro manualmente en la sección "Estadísticas de Negocio" / "Historial de Stock" / "Abrir historial" (del producto en cuestión) / "Aplicar corrección".`)
            }
        }
    }

    const save = async () => {
        sale_dispatch({ type: 'LOADING_VIEW' })
        const itsASale = sale_state.documento.cashRegister
        const isNotFiscalNote = !fiscalNotesCodes.includes(sale_state.documento.codigoUnico)
        const conditionsToModifyStock = itsASale && isNotFiscalNote

        // Save daily business statistic
        if (itsASale) saveDailyBusinessStatistic()

        //Modify stock history of products
        if (conditionsToModifyStock) saveStockHistoryOfProducts()

        //Modify stock of products
        
        if (conditionsToModifyStock) applyStockModification()

        //Save sale data in sales list
        saveSaleData()

        //Create document
        createSaleDocument()

        sale_dispatch({ type: 'LOADING_VIEW' })
        return successAlert('Comprobante emitido con éxito').then(reload)
    }

    useEffect(() => {
        if (!sale_state.closedSale) return
        save()
        // eslint-disable-next-line
    }, [sale_state.closedSale])

    const buttonToSave = (
        <Button
            id='salesFinalizeSaleModal_buttonToSaveFinalizeSale'
            onClick={startCloseSale}
            onKeyUp={activateKeyboard}
            style={{ width: '100%' }}
            className='btn-primary'
        >
            Aceptar
        </Button>
    )

    // ------------------ Title of modal ----------------- //
    const titleOfModal = <h3><b>¡Atencion!</b>, esta acción finalizará la venta, ¿desea continuar?</h3>


    return (
        <Modal
            afterOpenChange={redirectFocusIntoModal}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            forceRender
            okButtonProps={{ style: { display: 'none' } }}
            open={sale_state.finalizeSaleModalIsVisible}
            width={600}
        >
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    {titleOfModal}
                </Col>
                <Col span={24}>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            {buttonToCancel}
                        </Col>
                        <Col span={12}>
                            {buttonToSave}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}

export default FinalizeSaleModal