import React from "react";
import {Modal, Row, Col} from 'antd';
import helpers from '../../helpers';
import api from '../../services';

const {formatBody} = helpers.afipHelper;
const {createVoucherPdf} = helpers.pdf;

const FinalizeSaleModal = ({ state, dispatch, actions}) => {
  const { HIDE_FINALIZE_SALE_MODAL, FINALIZE_SALE, LOADING_VIEW } = actions;

  const startCloseSale = async() => {
    // dispatch({type: LOADING_VIEW});
    // dispatch({type: HIDE_FINALIZE_SALE_MODAL});
    // const loggedUser = await api.usuarios.findById(localStorage.getItem('userId'));
    // const bodyToAfip = formatBody(state);
    // const responseOfAfip = await api.afip.generateVoucher(loggedUser.empresa.cuit, bodyToAfip);
    // dispatch({type: FINALIZE_SALE, payload: responseOfAfip});
    createVoucherPdf(state)
    // dispatch({type: LOADING_VIEW});
    // window.location.reload();
  }

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
