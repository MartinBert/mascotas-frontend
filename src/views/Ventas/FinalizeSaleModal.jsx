import React, { useEffect } from 'react'
import {Modal, Row, Col} from 'antd'
import helpers from '../../helpers'
import api from '../../services'
import { errorAlert, successAlert } from '../../components/alerts'

const { formatBody } = helpers.afipHelper
const { createVoucherPdf, createTicketPdf } = helpers.pdf

const FinalizeSaleModal = ({state, dispatch, actions, userState}) => {
  const { HIDE_FINALIZE_SALE_MODAL, CLOSE_FISCAL_OPERATION, LOADING_VIEW, CLOSE_NO_FISCAL_OPERATION } = actions

  const reload = () => {
    return window.location.reload()
  }

  const closeFiscalOperation = async() => {
    const bodyToAfip = formatBody(state)
    const responseOfAfip = await api.afip.generateVoucher(userState.user.empresa.cuit, bodyToAfip)
    dispatch({type: CLOSE_FISCAL_OPERATION, payload: responseOfAfip})
  }

  const startCloseSale = async() => {
    dispatch({type: HIDE_FINALIZE_SALE_MODAL})
    dispatch({type: LOADING_VIEW})
    state.documentoFiscal ? closeFiscalOperation() : dispatch({type: CLOSE_NO_FISCAL_OPERATION})
  }

  const applyStockModification = async() => {
    const processStock = async() => {
      try{
        for(const product of state.productos){
          const lineOfProduct = state.renglones.find(item => item._id === product._id)
          await api.productos.modifyStock(
            {
              product,
              [(lineOfProduct.fraccionar) ? 'fractionedQuantity' : 'quantity']:  lineOfProduct.cantidadUnidades
            }
          )
        }
        return true
      }catch(err){
        console.error(err)
        return false
      }
    }
    return {isModified: await processStock()}
  }

  const saveSaleData = async() => {
    try {
      state.renglones = state.renglones.map(renglon => {
        delete renglon._id
        return renglon
      })
      const result = await api.ventas.save(state)
      return {isSaved: (result.code === 200)}
    }catch(err){
      console.error(err)
      return {isSaved: false}
    }
  }

  const save = async() => {
    //Modify stock of products
    const stock = await applyStockModification()
    if(!stock.isModified) return errorAlert('Error al modificar stock.').then(() => reload())

    //Save sale data
    const saleData = await saveSaleData()
    if(!saleData.isSaved) return errorAlert('No se pudo guardar la venta.').then(() => reload())

    //Create document
    if (state.documento.nombre === 'TIQUE') await createTicketPdf(state)
    else if (state.documento.nombre !== 'TIQUE') await createVoucherPdf(state)
    else return errorAlert('No se pudo generar el comprobante de la operación.').then(() => reload())

    return successAlert('Venta realizada').then(() => reload())
  }

  useEffect(() => {
    if(!state.closedSale) return
    save()
  },
  //eslint-disable-next-line
  [state.closedSale])

  return (
    <Modal
      title={(<h3>Finalizar venta</h3>)}
      open={state.finalizeSaleModalIsVisible}
      cancelButtonProps={{ style: { display: 'none' } }}
      closable={false}
      footer={[
        <Row gutter={8} align='end' key='1'>
            <Col span={6}>
                <button
                    className='btn-secondary'
                    onClick={() => {dispatch({ type: HIDE_FINALIZE_SALE_MODAL})}}
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
