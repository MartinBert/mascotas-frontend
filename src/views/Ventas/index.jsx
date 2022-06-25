import React, {useEffect, useReducer} from 'react'
import Header from './Header'
import reducers from '../../reducers'
import DiscountSurchargeModal from './DiscountSurchargeModal'
import Lines from './Lines'
import api from '../../services'

const {productInitialState, productReducer, productActions} = reducers.productSelectionModalReducer.getNamedStates();
const {initialState, reducer, actions} = reducers.saleReducer;

const Ventas = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [productState, productDispatch] = useReducer(productReducer, productInitialState);
  const {SET_COMPANY, SET_SALE_POINT, SET_DATES} = actions;

  useEffect(() => {
    if(state.empresa) return;
    const fetchLoggedUserData = async() => {
      const loggedUser = await api.usuarios.getById(localStorage.getItem('userId'));
      dispatch({type: SET_COMPANY, payload: loggedUser.empresa});
      dispatch({type: SET_SALE_POINT, payload: loggedUser.puntoVenta});
    }
    fetchLoggedUserData()
  })

  useEffect(() => {
    if(state.fechaEmision) return;
    dispatch({type: SET_DATES})
  })

  return (
    <>
      <Header
        productState={productState}
        productDispatch={productDispatch}
        productActions={productActions}
        actions={actions}
        dispatch={dispatch}
        state={state}
      />
      <Lines
        productState={productState}
        productDispatch={productDispatch}
        productActions={productActions}
        state={state}
        dispatch={dispatch}
        actions={actions}
      />
      <DiscountSurchargeModal
        state={state}
        dispatch={dispatch}
        actions={actions}
      />
    </>
  )
}

export default Ventas