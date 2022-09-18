import React, { useEffect } from "react";
import { Row, Col, Select, Spin } from "antd";
import {
  ProductSelectionModal,
  GenericAutocomplete,
} from "../../components/generics";
import api from "../../services";
import {errorAlert} from '../../components/alerts';

const {Option} = Select;

const Header = ({
  productState,
  productDispatch,
  productActions,
  actions,
  dispatch,
  state,
}) => {
  const { SHOW_MODAL } = productActions;
  const {
    LOADING_DOCUMENT_INDEX,
    SHOW_DISCOUNT_SURCHARGE_MODAL,
    SET_CLIENT,
    SET_DOCUMENT,
    SET_VOUCHER_NUMBERS,
    SET_PAYMENT_METHODS,
    SET_PAYMENT_PLANS,
    SET_TOTAL
  } = actions;

  useEffect(
    () => {
      if (!state.documento) return;
      dispatch({type: LOADING_DOCUMENT_INDEX})
      let attemps = 0;
      dispatch({type: SET_TOTAL});
      const fetchLastVoucherNumber = async () => {
        const lastVoucherNumber = await api.afip.findLastVoucherNumber(
          state.empresaCuit,
          state.puntoVentaNumero,
          state.documentoCodigo
        );
        console.log(lastVoucherNumber)
        if(lastVoucherNumber === undefined && attemps < 10) return setTimeout(() => {
          attemps++;
          return fetchLastVoucherNumber()
        }, 500)
        if(lastVoucherNumber === undefined) return errorAlert('No se pudo recuperar la correlación de AFIP del último comprobante emitido, intente nuevamente más tarde.').then(() => {window.location.reload()})
        const nextVoucher = lastVoucherNumber + 1;
        dispatch({ type: SET_VOUCHER_NUMBERS, payload: nextVoucher });
        dispatch({type: LOADING_DOCUMENT_INDEX})
      };
      fetchLastVoucherNumber();
    },
    //eslint-disable-next-line
    [state.documento]
  );

  return (
    <Row>
      <Col span={24}>
        <Row gutter={8}>
          <Col xl={4} lg={6} md={6}>
            <button
              className="btn-primary"
              onClick={() => {
                productDispatch({ type: SHOW_MODAL });
              }}
            >
              Productos
            </button>
          </Col>
          <Col xl={4} lg={6} md={6}>
            <button
              className="btn-primary"
              onClick={() => {
                dispatch({ type: SHOW_DISCOUNT_SURCHARGE_MODAL });
              }}
            >
              Descuento/Recargo
            </button>
          </Col>
          <Col xl={16} lg={12} md={12}>
            {state.porcentajeDescuentoGlobal !== 0 ||
            state.porcentajeRecargoGlobal !== 0 ? (
              <span style={{ textAlign: "right" }}>
                {state.porcentajeDescuentoGlobal !== 0 ? (
                  <h1>
                    Descuento de {state.porcentajeDescuentoGlobal}% aplicado
                  </h1>
                ) : (
                  <h1>Recargo de {state.porcentajeRecargoGlobal}% aplicado</h1>
                )}
              </span>
            ) : null}
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xl={6} lg={6} md={12}>
            <GenericAutocomplete
              label="Cliente"
              modelToFind="cliente"
              keyToCompare="razonSocial"
              controller="clientes"
              selectedSearch={state.cliente}
              dispatch={dispatch}
              action={SET_CLIENT}
              returnCompleteModel={true}
            />
          </Col>
          <Col xl={6} lg={6} md={12}>
            <GenericAutocomplete
              label="Documento"
              modelToFind="documento"
              keyToCompare="nombre"
              controller="documentos"
              selectedSearch={state.documento}
              dispatch={dispatch}
              action={SET_DOCUMENT}
              returnCompleteModel={true}
            />
          </Col>
          <Col xl={6} lg={6} md={12}>
            {(state.loadingDocumentIndex) ? <span><Spin/>Esperando a AFIP...</span> : null}
          </Col>
          <Col xl={6} lg={6} md={12}>
            <span style={{ textAlign: "right" }}>
              <h1>Total: {state.total}</h1>
            </span>
          </Col>
          <Col xl={6} lg={8} md={8}>
            <GenericAutocomplete
              label="Medio de pago"
              modelToFind="mediopago"
              keyToCompare="nombre"
              controller="mediospago"
              selectedSearch={state.mediosPago}
              dispatch={dispatch}
              action={SET_PAYMENT_METHODS}
              multiple={true}
              returnCompleteModel={true}
            />
          </Col>
          <Col xl={6} lg={8} md={8}>
            <Select
              onChange={e => {
                dispatch({type: SET_PAYMENT_PLANS, payload: e})
              }}
              mode="tags"
              style={{width: '100%'}}
            >
              {(state.planesPagoToSelect) 
                ? state.planesPagoToSelect.map(item => <Option key={item._id} value={JSON.stringify(item)}>{item.nombre}</Option>) 
                : null
              }
            </Select>
          </Col>
        </Row>
      </Col>
      <ProductSelectionModal
        state={productState}
        dispatch={productDispatch}
        actions={productActions}
      />
    </Row>
  );
};

export default Header;
