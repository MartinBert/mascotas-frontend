// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Design Components
import { Modal, Row, Col } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useAuthContext } = contexts.Auth
const { useSaleContext } = contexts.Sale
const { formatBody } = helpers.afipHelper
const { createVoucherPdf, createTicketPdf } = helpers.pdfHelper.commercialDocumentsPDF


const FinalizeSaleModal = () => {
    const [auth_state, auth_dispatch] = useAuthContext()
    const [sale_state, sale_dispatch] = useSaleContext()

    const reload = () => {
        return window.location.reload()
    }

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId')
            const loggedUser = await api.usuarios.findById(userId)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })
        }
        fetchUser()
    }, [auth_dispatch])

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
        sale_state.documentoFiscal ? closeFiscalOperation() : sale_dispatch({ type: 'CLOSE_NO_FISCAL_OPERATION' })
    }

    const applyStockModification = async () => {
        const processStock = async () => {
            try {
                for (const product of sale_state.productos) {
                    const noCustomProduct = sale_state.renglones
                        .filter(renglon => !(renglon._id.startsWith('customProduct_')))

                    const lineOfProduct = (noCustomProduct.length === 0)
                        ? null
                        : noCustomProduct.find(renglon => renglon._id === product._id)

                    const productToModifyInStock = (!lineOfProduct)
                        ? null
                        : {
                            product,
                            [
                                lineOfProduct.fraccionar
                                    ? 'fractionedQuantity'
                                    : 'quantity'
                            ]: lineOfProduct.cantidadUnidades
                        }

                    await api.productos.modifyStock(productToModifyInStock)
                }
                return true
            } catch (err) {
                console.error(err)
                return false
            }
        }
        return { isModified: await processStock() }
    }

    const saveSaleData = async () => {
        try {
            sale_state.renglones = sale_state.renglones.map(renglon => {
                delete renglon._id
                return renglon
            })
            
            sale_state.productos = sale_state.productos
                .filter(product => !(product._id.startsWith('customProduct_')))

            const result = await api.ventas.save(sale_state)
            return { isSaved: (result.code === 200) }
        } catch (err) {
            console.error(err)
            return { isSaved: false }
        }
    }

    const save = async () => {
        //Modify stock of products
        const stock = await applyStockModification()
        if (!stock.isModified) return errorAlert('Error al modificar stock.').then(() => reload())

        //Save sale data
        const saleData = await saveSaleData()
        if (!saleData.isSaved) return errorAlert('No se pudo guardar la venta.').then(() => reload())

        //Create document
        if (sale_state.documento.nombre === 'TIQUE') await createTicketPdf(sale_state)
        else if (sale_state.documento.nombre !== 'TIQUE') await createVoucherPdf(sale_state)
        else return errorAlert('No se pudo generar el comprobante de la operación.').then(() => reload())

        return successAlert('Venta realizada').then(() => reload())
    }

    useEffect(() => {
        if (!sale_state.closedSale) return
        save()
    },
        //eslint-disable-next-line
        [sale_state.closedSale])

    return (
        <Modal
            title={(<h3>Finalizar venta</h3>)}
            open={sale_state.finalizeSaleModalIsVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            footer={[
                <Row gutter={8} align='end' key='1'>
                    <Col span={6}>
                        <button
                            className='btn-secondary'
                            onClick={() => { sale_dispatch({ type: 'HIDE_FINALIZE_SALE_MODAL' }) }}
                        >
                            Cancelar
                        </button>
                    </Col>
                    <Col span={6}>
                        <button
                            className='btn-primary'
                            onClick={() => { startCloseSale() }}
                        >
                            Aceptar
                        </button>
                    </Col>
                </Row>
            ]}
            width={600}
        >
            <Row justify='space between' gutter={16}>
                <Col span={24}>
                    <h3><b>¡Atencion!</b>, esta acción finalizará la venta, ¿desea continuar?</h3>
                </Col>
            </Row>
        </Modal>
    )
}

export default FinalizeSaleModal