import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import reducers from "../../reducers";
import DiscountSurchargeModal from "./DiscountSurchargeModal";
import FinalizeSaleModal from "./FinalizeSaleModal";
import Lines from "./Lines";
import api from "../../services";
import {Row, Col, Spin} from 'antd';

const { productInitialState, productReducer, productActions } = reducers.productSelectionModalReducer.getNamedStates();
const { initialState, reducer, actions } = reducers.saleReducer;

const Ventas = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [productState, productDispatch] = useReducer(
    productReducer,
    productInitialState
  );
  const { SET_COMPANY, SET_SALE_POINT, SET_DATES, SHOW_FINALIZE_SALE_MODAL, SET_INDEX } = actions;

  useEffect(() => {
    const fetchLoggedUserData = async () => {
      const loggedUser = await api.usuarios.findById(
        localStorage.getItem("userId")
      );
      dispatch({ type: SET_COMPANY, payload: loggedUser.empresa });
      dispatch({ type: SET_SALE_POINT, payload: loggedUser.puntoVenta });
    };
    const fetchLastVoucherIndex = async() => {
      const lastIndex = await api.ventas.findLastIndex();
      dispatch({type: SET_INDEX, payload: lastIndex + 1})
    }
    fetchLoggedUserData();
    fetchLastVoucherIndex();
  }, 
  //eslint-disable-next-line
  []);

  useEffect(() => {
    if (state.fechaEmision) return;
    dispatch({ type: SET_DATES });
  }, 
  //eslint-disable-next-line
  []);

  return (
    <>
      {
        (!state.loadingView)
        ?
          <Row>
          <Col span={24}>
            <Header
              productState={productState}
              productDispatch={productDispatch}
              productActions={productActions}
              actions={actions}
              dispatch={dispatch}
              state={state}
            />
          </Col>
          <Col span={24}>
            <Lines
              productState={productState}
              productDispatch={productDispatch}
              productActions={productActions}
              state={state}
              dispatch={dispatch}
              actions={actions}
            />
          </Col>
          <Col span={6} style={{marginTop: "25px"}}>
            <button
                    className="btn-primary"
                    onClick={() => {dispatch({ type: SHOW_FINALIZE_SALE_MODAL }) }}
                >
                    Finalizar venta
            </button>
          </Col>
        </Row>
        : <Spin/>
      }
        <DiscountSurchargeModal
          state={state}
          dispatch={dispatch}
          actions={actions}
        />
        <FinalizeSaleModal
          state={state}
          dispatch={dispatch}
          actions={actions}
        />
        <div id="voucher" style={{width: "793px", height: "1122px", zIndex: -9999, position: "absolute", top: 0, left: 0}}></div>
    </>
  );
};

export default Ventas;
