import React, { useEffect } from "react";
import { Row, Col, Select } from "antd";
import {
  ProductSelectionModal,
  GenericAutocomplete,
} from "../../components/generics";
import api from "../../services";

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
    SHOW_DISCOUNT_SURCHARGE_MODAL,
    SET_CLIENT,
    SET_DOCUMENT,
    SET_VOUCHER_NUMBERS,
    SET_PAYMENT_METHODS,
    SET_PAYMENT_PLANS
  } = actions;

  useEffect(
    () => {
      if (!state.documento) return;
      const fetchLastVoucherNumber = async () => {
        const lastVoucherNumber = await api.afip.findLastVoucherNumber(
          state.empresaCuit,
          state.puntoVentaNumero,
          state.documentoCodigo
        );
        if(!lastVoucherNumber) {
          setTimeout(() => {
            return fetchLastVoucherNumber();
          }, 100)
        }
        const nextVoucher = lastVoucherNumber + 1;
        dispatch({ type: SET_VOUCHER_NUMBERS, payload: nextVoucher });
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
          <Col xl={6} lg={8} md={8}>
            <GenericAutocomplete
              label="Cliente"
              modelToFind="cliente"
              keyToCompare="razonSocial"
              controllerToUse="clientes"
              selectedSearch={state.cliente}
              dispatch={dispatch}
              action={SET_CLIENT}
              returnCompleteModel={true}
            />
          </Col>
          <Col xl={6} lg={8} md={8}>
            <GenericAutocomplete
              label="Documento"
              modelToFind="documento"
              keyToCompare="nombre"
              controllerToUse="documentos"
              selectedSearch={state.documento}
              dispatch={dispatch}
              action={SET_DOCUMENT}
              returnCompleteModel={true}
            />
          </Col>
          <Col xl={12} lg={8} md={8}>
            <span style={{ textAlign: "right" }}>
              <h1>Total: {state.total}</h1>
            </span>
          </Col>
          <Col xl={6} lg={8} md={8}>
            <GenericAutocomplete
              label="Medio de pago"
              modelToFind="mediopago"
              keyToCompare="nombre"
              controllerToUse="mediospago"
              selectedSearch={state.mediosPago}
              dispatch={dispatch}
              action={SET_PAYMENT_METHODS}
              multiple={true}
              returnCompleteModel={true}
            />
          </Col>
          <Col xl={6} lg={8} md={8}>
            <Select
              defaultValue={"1"}
            >
              <Option value="1">Seleccione un plan de pago</Option>
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
