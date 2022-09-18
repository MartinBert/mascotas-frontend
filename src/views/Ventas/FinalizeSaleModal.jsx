import React, { useEffect } from "react";
import {Modal, Row, Col} from 'antd';
import helpers from '../../helpers';
import api from '../../services';
import { errorAlert, successAlert } from '../../components/alerts';

const {formatBody} = helpers.afipHelper;
const {createVoucherPdf} = helpers.pdf;

const FinalizeSaleModal = ({ state, dispatch, actions}) => {
  const { HIDE_FINALIZE_SALE_MODAL, FINALIZE_SALE, LOADING_VIEW } = actions;

  const startCloseSale = async() => {
    dispatch({type: HIDE_FINALIZE_SALE_MODAL});
    dispatch({type: LOADING_VIEW})
    const loggedUser = await api.usuarios.findById(localStorage.getItem('userId'));
    const bodyToAfip = formatBody(state);
    const responseOfAfip = await api.afip.generateVoucher(loggedUser.empresa.cuit, bodyToAfip);
    dispatch({type: FINALIZE_SALE, payload: responseOfAfip});
  }

  const applyStockModification = async(state) => {
    const processStock = async() => {
      try{
        for(const product of state.productos){
          const lineOfProduct = state.renglones.find(item => item._id = product._id);
          await api.productos.modifyStock(
            {
              product,
              [(lineOfProduct.fraccionar) ? 'fractionedQuantity' : 'quantity']:  lineOfProduct.cantidadUnidades
            }
          )
        }
        return true;
      }catch(err){
        console.error(err);
        return false;
      }
    }
    return {isModified: await processStock()};
  }

  const saveSale = async() => {
    const sale = state;
    sale.renglones = sale.renglones.map(renglon => {
      delete renglon._id;
      return renglon;
    })
    const result = await api.ventas.save(state);
    if(result.code === 200){
      createVoucherPdf(state);
      successAlert('Venta realizada')
      .then(() => {window.location.reload()})
    }else{
      errorAlert('No se pudo guardar la venta')
    }
  }

  useEffect(() => {
    if(state.cae === null) return;
    applyStockModification(state)
    .then(stock => {
      if(stock.isModified)return saveSale();
      return errorAlert('Error al modificar stock')
    })
    .catch(err => {
      console.error(err);
    })
  }, 
  //eslint-disable-next-line
  [state.cae])

  return (
    <Modal
      title={(<h3>Finalizar venta</h3>)}
      visible={state.finalizeSaleModalIsVisible}
      cancelButtonProps={{ style: { display: "none" } }}
      closable={false}
      footer={[
        <Row gutter={8} align="end" key="1">
            <Col span={6}>
                <button
                    className="btn-secondary"
                    onClick={() => {dispatch({ type: HIDE_FINALIZE_SALE_MODAL})}}
                >
                    Cancelar
                </button>
            </Col>
            <Col span={6}>
                <button
                    className="btn-primary"
                    onClick={() => { startCloseSale() }}
                >
                    Aceptar
                </button>
            </Col>
        </Row>
      ]}
      width={600}
    >
      <Row justify="space between" gutter={16}>
        <Col span={24}>
            <h3><b>¡Atencion!</b>, esta acción finalizará la venta, ¿desea continuar?</h3>
        </Col>
      </Row>
    </Modal>
  );
};

export default FinalizeSaleModal;
