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
const { fiscalVouchersCodes, formatBody } = helpers.afipHelper
const { resetDate } = helpers.dateHelper
const { roundTwoDecimals } = helpers.mathHelper
const {
    createBudgetPdf,
    createRemittancePdf,
    createVoucherPdf,
    createTicketPdf
} = helpers.pdfHelper.commercialDocumentsPDF

const billCodes = fiscalVouchersCodes.filter(code => typeof code === 'string')
const fiscalNotesCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => [code.credit, code.debit])
    .flat(1)
    .filter(code => code !== null)

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
    const reload = () => { return window.location.reload() }

    // ----------------- Button to cancel ---------------- //
    const cancelSale = () => {
        sale_dispatch({ type: 'HIDE_FINALIZE_SALE_MODAL' })
    }

    const buttonToCancel = (
        <Button
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
                errorAlert('La fecha de facturación debe ser igual o posterior a la del último comprobante emitido.')
                    .then(() => {
                        sale_dispatch({ type: 'SET_DATES', payload: new Date() })
                        sale_dispatch({ type: 'LOADING_VIEW' })
                    })
            )
        }
        else sale_dispatch({ type: 'CLOSE_FISCAL_OPERATION', payload: responseOfAfip })
    }

    const startCloseSale = async () => {
        sale_dispatch({ type: 'HIDE_FINALIZE_SALE_MODAL' })
        sale_dispatch({ type: 'LOADING_VIEW' })
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
                    ]: roundTwoDecimals(lineOfProduct.cantidadUnidades)
                }
            if (productToModifyInStock) {
                const response = await api.productos.modifyStock(productToModifyInStock)
                if (response.code !== 200) errorAlert(`No se pudo modificar el stock del producto "${product.nombre}". Modifíquelo manualmente en la sección "Productos" / "Editar".`)
            }
        }
    }

    const createSaleDocument = async () => {
        let isCreated
        if (sale_state.documento.codigoUnico === '000') { // No fiscal
            if (sale_state.documento.nombre === 'PRESUPUESTO') isCreated = await createBudgetPdf(sale_state)
            else if (sale_state.documento.nombre === 'REMITO') isCreated = await createRemittancePdf(sale_state)
            else if (sale_state.documento.nombre === 'TICKET') isCreated = await createTicketPdf(sale_state)
        } else { // Fiscal
            if (billCodes.includes(sale_state.documento.codigoUnico)) isCreated = await createVoucherPdf(sale_state)
        }
        if (!isCreated) return errorAlert('No se pudo generar el comprobante de la operación. Recupérelo desde la página de AFIP.')
    }

    const saveSaleData = async () => {
        sale_state.renglones = sale_state.renglones.map(renglon => {
            delete renglon._id
            return renglon
        })
        sale_state.productos = sale_state.productos
            .filter(product => !(product._id.startsWith('customProduct_')))
        const response = await api.ventas.save(sale_state)
        if (response.code !== 200) errorAlert('Error al guardar la venta en "Lista de ventas". A futuro deberá recuperar el comprobante desde la página de AFIP.')
    }

    const saveStockHistoryOfProducts = async () => {
        const dateString = sale_state.fechaEmisionString.substring(0, 10)
        for (let index = 0; index < sale_state.productos.length; index++) {
            const product = sale_state.productos[index]
            if (!product._id.startsWith('customProduct_')) {
                const [productLine] = sale_state.renglones.filter(line => line.key === product._id)
                const productOutputs = productLine.fraccionar
                    ? productLine.cantidadUnidades / productLine.fraccionamiento
                    : productLine.cantidadUnidades
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
                    data.outputs = roundTwoDecimals(productOutputs)
                    saveResponse = await api.stockHistory.save(data)
                } else {
                    data._id = stockHistory[0]._id
                    data.entries = roundTwoDecimals(stockHistory[0].entries)
                    data.outputs = roundTwoDecimals(stockHistory[0].outputs + productOutputs)
                    saveResponse = await api.stockHistory.edit(data)
                }
                if (saveResponse.code !== 200) errorAlert(`No se pudo generar el historial de stock para el producto "${product.nombre}". Cree el registro manualmente en la sección "Estadísticas de Negocio" / "Historial de Stock" / "Abrir historial" (del producto en cuestión) / "Aplicar corrección".`)
            }
        }
    }

    const save = async () => {
        //Modify stock history of products
        saveStockHistoryOfProducts()

        //Modify stock of products
        const modifyStock = sale_state.documento.cashRegister && !fiscalNotesCodes.includes(sale_state.documento.codigoUnico)
        if (modifyStock) applyStockModification()

        //Save sale data in sales list
        saveSaleData()

        //Create document
        createSaleDocument()

        return successAlert('Venta realizada con éxito').then(reload)
    }

    useEffect(() => {
        if (!sale_state.closedSale) return
        save()
    }, [sale_state.closedSale])

    const buttonToSave = (
        <Button
            onClick={startCloseSale}
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
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
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