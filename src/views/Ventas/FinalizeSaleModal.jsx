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
const { numberOrderDate, resetDate } = helpers.dateHelper
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
            const loggedUser = await api.usuarios.findById(userId)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })
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
        sale_state.generalPercentage = round(sale_state.generalPercentage)
        sale_state.porcentajeDescuentoGlobal = round(sale_state.porcentajeDescuentoGlobal)
        sale_state.porcentajeRecargoGlobal = round(sale_state.porcentajeRecargoGlobal)
        sale_state.renglones = sale_state.renglones.map(line => {
            const fixedLine = {
                ...line,
                cantidadUnidades: round(line.cantidadUnidades),
                cantidadUnidadesFraccionadas: round(line.cantidadUnidadesFraccionadas),
                porcentajeDescuentoRenglon: round(line.porcentajeDescuentoRenglon),
                porcentajeRecargoRenglon: round(line.porcentajeRecargoRenglon)
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
        for (const product of sale_state.productos) {
            const noCustomProduct = sale_state.renglones
                .filter(renglon => !renglon.key.startsWith('customProduct_'))
            const lineOfProduct = noCustomProduct.length === 0
                ? null
                : noCustomProduct.find(renglon => renglon.key === product._id)
            const productToModifyInStock = !lineOfProduct
                ? null
                : {
                    product,
                    [
                        lineOfProduct.fraccionar
                            ? 'fractionedQuantity'
                            : 'quantity'
                    ]: round(
                        lineOfProduct.fraccionar
                            ? lineOfProduct.cantidadUnidadesFraccionadas
                            : lineOfProduct.cantidadUnidades
                    )
                }
            if (productToModifyInStock) {
                const response = await api.productos.modifyStock(productToModifyInStock)
                if (response.code !== 200) errorAlert(`No se pudo modificar el stock del producto "${product.nombre}". Modifíquelo manualmente en la sección "Productos" / "Editar".`)
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

    const saveDailyBusinessStatistic = async () => {
        const filters = JSON.stringify({ dateString: sale_state.fechaEmisionString.substring(0, 10) })
        const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
        const statisticToEdit = findStatisticToEdit.docs[0] || null
        const saleListPricesAndIva = (
            sale_state.productos.reduce((acc, product) => acc + product.precioUnitario, 0)
            + sale_state.renglones
                .filter(line => line._id.startsWith('customProduct_'))
                .reduce((acc, line) => acc + line.importeIva, 0)
        )
        if (statisticToEdit) {
            const editedStatistic = {
                ...statisticToEdit,
                balanceViewIncome: statisticToEdit.balanceViewIncome + sale_state.total,
                balanceViewProfit: statisticToEdit.balanceViewProfit + sale_state.total - sale_state.importeIva,
                salesViewExpense: statisticToEdit.salesViewExpense + saleListPricesAndIva,
                salesViewIncome: statisticToEdit.salesViewIncome + sale_state.total,
                salesViewProfit: statisticToEdit.salesViewProfit + sale_state.total - saleListPricesAndIva,
            }
            await api.dailyBusinessStatistics.edit(editedStatistic)
        } else {
            const newStatistic = {
                balanceViewExpense: 0,
                balanceViewIncome: sale_state.total,
                balanceViewProfit: sale_state.total - sale_state.importeIva,
                concept: 'Generado automáticamente',
                date: new Date(sale_state.fechaEmisionString.substring(0, 10)),
                dateOrder: numberOrderDate(sale_state.fechaEmisionString.substring(0, 10)),
                dateString: sale_state.fechaEmisionString.substring(0, 10),
                salesViewExpense: saleListPricesAndIva,
                salesViewIncome: sale_state.total,
                salesViewProfit: sale_state.total - saleListPricesAndIva
            }
            await api.dailyBusinessStatistics.save(newStatistic)
        }
    }

    const saveSaleData = async () => {
        const fixedLines = sale_state.renglones.map(renglon => {
            const { _id, ...lineData } = renglon
            return lineData
        })
        const fixedProducts = sale_state.productos
            .filter(product => !(product._id.startsWith('customProduct_')))
        const { refs, ...saleData } = sale_state
        const dataToSave = { ...saleData, renglones: fixedLines, productos: fixedProducts }
        const response = await api.ventas.save(dataToSave)
        if (response.code !== 200) errorAlert('Error al guardar la venta en "Lista de ventas". A futuro deberá recuperar el comprobante desde la página de AFIP.')
    }

    const saveStockHistoryOfProducts = async () => {
        const dateString = sale_state.fechaEmisionString.substring(0, 10)
        for (let index = 0; index < sale_state.productos.length; index++) {
            const product = sale_state.productos[index]
            if (!product._id.startsWith('customProduct_')) {
                const [productLine] = sale_state.renglones.filter(line => line.key === product._id)
                const filters = JSON.stringify({ dateString, product })
                const findStockHistory = await api.stockHistory.findAllByFilters(filters)
                const stockHistory = findStockHistory.docs
                let saveResponse
                const data = {
                    date: resetDate(sale_state.fechaEmision),
                    dateString,
                    itIsAManualCorrection: false,
                    product: product._id
                }
                if (stockHistory.length < 1) {
                    data.entries = 0
                    data.outputs = round(productLine.cantidadUnidades)
                    saveResponse = await api.stockHistory.save(data)
                } else {
                    data._id = stockHistory[0]._id
                    data.entries = round(stockHistory[0].entries)
                    data.outputs = round(stockHistory[0].outputs + productLine.cantidadUnidades)
                    saveResponse = await api.stockHistory.edit(data)
                }
                if (saveResponse.code !== 200) errorAlert(`No se pudo generar el historial de stock para el producto "${product.nombre}". Cree el registro manualmente en la sección "Estadísticas de Negocio" / "Historial de Stock" / "Abrir historial" (del producto en cuestión) / "Aplicar corrección".`)
            }
        }
    }

    const save = async () => {
        sale_dispatch({ type: 'LOADING_VIEW' })
        const itsASale = sale_state.documento.cashRegister

        // Save daily business statistic
        if (itsASale) saveDailyBusinessStatistic()

        //Modify stock history of products
        saveStockHistoryOfProducts()

        //Modify stock of products
        const isNotFiscalNote = !fiscalNotesCodes.includes(sale_state.documento.codigoUnico)
        const conditionsToModifyStock = itsASale && isNotFiscalNote
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