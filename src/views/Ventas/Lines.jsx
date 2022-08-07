import React, { useEffect } from "react";
import { Table, Input } from "antd";
import icons from "../../components/icons";

const { Delete } = icons;

const Lines = ({
  productState,
  productDispatch,
  productActions,
  state,
  dispatch,
  actions,
}) => {
  const { DELETE_PRODUCT } = productActions;
  const {
    SET_LINES,
    SET_LINE_DISCOUNT_PERCENT,
    SET_LINE_SURCHARGE_PERCENT,
    SET_LINE_QUANTITY,
    SET_PRODUCTS,
    SET_TOTAL,
    SET_IVAS
  } = actions;

  const columnsForTable = [
    {
      title: "Nombre",
      dataIndex: "productoNombre",
    },
    {
      title: "Cant. unidades",
      render: (product) => (
        <Input
          color="primary"
          type="number"
          placeholder="Cantidad"
          value={product.cantidadUnidades}
          onChange={(e) => {
            dispatch({
              type: SET_LINE_QUANTITY,
              payload: {
                _id: product._id,
                cantidadUnidades:
                  e.target.value.length > 0 ? parseFloat(e.target.value) : 0,
              },
            });
            dispatch({ type: SET_TOTAL });
            if(state.documentoLetra) dispatch({ type: SET_IVAS, payload: state.documentoLetra})
          }}
        />
      ),
    },
    {
      title: "P. U.",
      dataIndex: "productoPrecioUnitario",
    },
    {
      title: "Porc. descuento",
      render: (product) => (
        <Input
          color="primary"
          type="number"
          placeholder="Porc. descuento"
          value={product.porcentajeDescuentoRenglon}
          disabled={product.porcentajeRecargoRenglon > 0}
          onChange={(e) => {
            dispatch({
              type: SET_LINE_DISCOUNT_PERCENT,
              payload: {
                _id: product._id,
                porcentajeDescuentoRenglon:
                  e.target.value.length > 0 ? parseFloat(e.target.value) : 0,
              },
            });
            dispatch({ type: SET_TOTAL });
            if(state.documentoLetra) dispatch({ type: SET_IVAS, payload: state.documentoLetra})
          }}
        />
      ),
    },
    {
      title: "Porc. recargo",
      render: (product) => (
        <Input
          color="primary"
          type="number"
          placeholder="Porc. recargo"
          value={product.porcentajeRecargoRenglon}
          disabled={product.porcentajeDescuentoRenglon > 0}
          onChange={(e) => {
            dispatch({
              type: SET_LINE_SURCHARGE_PERCENT,
              payload: {
                _id: product._id,
                porcentajeRecargoRenglon:
                  e.target.value.length > 0 ? parseFloat(e.target.value) : 0,
              },
            });
            dispatch({ type: SET_TOTAL });
            if(state.documentoLetra) dispatch({ type: SET_IVAS, payload: state.documentoLetra})
          }}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "totalRenglon",
    },
    {
      title: "Eliminar",
      render: (product) => (
        <div
          onClick={() => {
            productDispatch({ type: DELETE_PRODUCT, payload: product });
          }}
        >
          <Delete />
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch({ type: SET_LINES, payload: productState.selectedProducts });
    dispatch({ type: SET_PRODUCTS, payload: productState.selectedProducts });
    dispatch({ type: SET_TOTAL });
    if(state.documentoLetra) dispatch({ type: SET_IVAS, payload: state.documentoLetra})
  }, [
    productState.selectedProducts,
    dispatch,
    SET_LINES,
    SET_PRODUCTS,
    SET_TOTAL,
    SET_IVAS,
    state.documentoLetra
  ]);

  return (
    <Table
      style={{ marginTop: "20px" }}
      width={"100%"}
      dataSource={state.renglones}
      columns={columnsForTable}
      pagination={false}
      rowKey="_id"
      tableLayout="auto"
      size="small"
    />
  );
};

export default Lines;
