import helpers from "../helpers";

const { decimalPercent, roundTwoDecimals } = helpers.mathHelper;
const { simpleDateWithHours } = helpers.dateHelper;
const { completeLengthWithZero } = helpers.stringHelper;

const initialState = {
  //----------------------------------------------- Generics state of view -----------------------------------------------------------/
  discountSurchargeModalVisible: false,
  discountSurchargeModalOperation: "discount",

  //------------------------------------------------- State of sale data -------------------------------------------------------------/
  productos: [],
  renglones: [],
  documento: null,
  documentoLetra: null,
  documentoFiscal: null,
  documentoCodigo: null,
  empresa: null,
  empresaRazonSocial: null,
  empresaDireccion: null,
  empresaCondicionIva: null,
  empresaCuit: null,
  empresaIngresosBrutos: null,
  empresaInicioActividad: null,
  puntoVenta: null,
  puntoVentaNumero: null,
  puntoVentaNombre: null,
  numeroFactura: null,
  numeroCompletoFactura: null,
  cliente: null,
  clienteRazonSocial: null,
  clienteDireccion: null,
  fechaEmision: null,
  fechaEmisionString: null,
  porcentajeDescuentoGlobal: 0,
  porcentajeRecargoGlobal: 0,
  totalDescuento: 0,
  totalRecargo: 0,
  totalDescuentoLineas: 0,
  totalRecargoLineas: 0,
  porcentajeIva: 0,
  importeIva: 0,
  subTotal: 0,
  total: 0,
};

const actions = {
  //---------------------------------------------- Generics actions of view ----------------------------------------------------------/
  SHOW_DISCOUNT_SURCHARGE_MODAL: "SHOW_DISCOUNT_SURCHARGE_MODAL",
  HIDE_DISCOUNT_SURCHARGE_MODAL: "HIDE_DISCOUNT_SURCHARGE_MODAL",
  SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION:
    "SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION",

  //------------------------------------------------ Actions of sale data ------------------------------------------------------------/
  SET_GLOBAL_DISCOUNT_PERCENT: "SET_GLOBAL_DISCOUNT_PERCENT",
  SET_GLOBAL_SURCHARGE_PERCENT: "SET_GLOBAL_SURCHARGE_PERCENT",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_LINES: "SET_LINES",
  SET_LINE_QUANTITY: "SET_LINE_QUANTITY",
  SET_LINE_DISCOUNT_PERCENT: "SET_LINE_DISCOUNT_PERCENT",
  SET_LINE_SURCHARGE_PERCENT: "SET_LINE_SURCHARGE_PERCENT",
  SET_CLIENT: "SET_CLIENT",
  SET_DOCUMENT: "SET_DOCUMENT",
  SET_COMPANY: "SET_COMPANY",
  SET_SALE_POINT: "SET_SALE_POINT",
  SET_DATES: "SET_DATES",
  SET_VOUCHER_NUMBERS: "SET_VOUCHER_NUMBERS",
  SET_TOTAL: "SET_TOTAL",
};

const calculateLineTotal = (line) => {
  const totalWithoutModifications =
    line.productoPrecioUnitario * line.cantidadUnidades;
  const totalWithSurcharge =
    totalWithoutModifications *
    (1 + decimalPercent(line.porcentajeRecargoRenglon));
  const totalWithDiscount =
    totalWithoutModifications *
    (1 - decimalPercent(line.porcentajeDescuentoRenglon));
  const surcharge = totalWithSurcharge - totalWithoutModifications;
  const discount = totalWithoutModifications - totalWithDiscount;
  const total = totalWithoutModifications + surcharge - discount;
  return roundTwoDecimals(total);
};

const basePrice = (line) => {
  return line.productoPrecioUnitario * line.cantidadUnidades;
};

const reducer = (state, action) => {
  switch (action.type) {
    //-------------------------------------------- Generic reducers of view -------------------------------------------------------/
    case actions.SHOW_DISCOUNT_SURCHARGE_MODAL:
      return {
        ...state,
        discountSurchargeModalVisible: true,
      };
    case actions.HIDE_DISCOUNT_SURCHARGE_MODAL:
      return {
        ...state,
        discountSurchargeModalVisible: false,
      };
    case actions.SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION:
      if (action.payload === "discount") {
        state.porcentajeDescuentoGlobal = state.porcentajeRecargoGlobal;
        state.porcentajeRecargoGlobal = 0;
      }
      if (action.payload === "surcharge") {
        state.porcentajeRecargoGlobal = state.porcentajeDescuentoGlobal;
        state.porcentajeDescuentoGlobal = 0;
      }
      return {
        ...state,
        discountSurchargeModalOperation: action.payload,
      };

    //--------------------------------------------- Reducers of sale data -------------------------------------------------------/
    case actions.SET_GLOBAL_DISCOUNT_PERCENT:
      return {
        ...state,
        porcentajeDescuentoGlobal: action.payload,
      };
    case actions.SET_GLOBAL_SURCHARGE_PERCENT:
      return {
        ...state,
        porcentajeRecargoGlobal: action.payload,
      };
    case actions.SET_LINE_QUANTITY:
      return {
        ...state,
        renglones: state.renglones.map((line) => {
          if (line._id === action.payload._id) {
            line.cantidadUnidades = action.payload.cantidadUnidades;
            line.totalRenglon = calculateLineTotal(line);
          }
          return line;
        }),
      };
    case actions.SET_LINE_DISCOUNT_PERCENT:
      return {
        ...state,
        renglones: state.renglones.map((line) => {
          if (line._id === action.payload._id) {
            line.porcentajeDescuentoRenglon =
              action.payload.porcentajeDescuentoRenglon;
            line.totalRenglon = calculateLineTotal(line);
            line.importeDescuentoRenglon = basePrice(line) - line.totalRenglon;
          }
          return line;
        }),
      };
    case actions.SET_LINE_SURCHARGE_PERCENT:
      return {
        ...state,
        renglones: state.renglones.map((line) => {
          if (line._id === action.payload._id) {
            line.porcentajeRecargoRenglon =
              action.payload.porcentajeRecargoRenglon;
            line.totalRenglon = calculateLineTotal(line);
            line.importeRecargoRenglon = line.totalRenglon - basePrice(line);
          }
          return line;
        }),
      };
    case actions.SET_LINES:
      return {
        ...state,
        renglones: action.payload.map((product) => {
          let linePresent = [];
          state.renglones.forEach((line) => {
            if (line._id === product._id) {
              linePresent.push({
                _id: product._id,
                productoNombre: product.nombre,
                productoCodigoBarras: product.codigoBarras,
                productoPrecioUnitario: product.precioUnitario,
                cantidadUnidades: line.cantidadUnidades,
                porcentajeDescuentoRenglon: line.porcentajeDescuentoRenglon,
                importeDescuentoRenglon: line.importeDescuentoRenglon,
                porcentajeRecargoRenglon: line.porcentajeRecargoRenglon,
                importeRecargoRenglon: line.importeRecargoRenglon,
                totalRenglon: line.totalRenglon,
              });
            }
          });

          if (linePresent.length > 0) {
            return linePresent[0];
          } else {
            return {
              _id: product._id,
              productoNombre: product.nombre,
              productoCodigoBarras: product.codigoBarras,
              productoPrecioUnitario: product.precioUnitario,
              cantidadUnidades: 1,
              porcentajeDescuentoRenglon: 0,
              importeDescuentoRenglon: 0,
              porcentajeRecargoRenglon: 0,
              importeRecargoRenglon: 0,
              totalRenglon: product.precioUnitario,
            };
          }
        }),
      };
    case actions.SET_PRODUCTS:
      return {
        ...state,
        productos: action.payload,
      };
    case actions.SET_CLIENT:
      return {
        ...state,
        cliente: action.payload,
        clienteRazonSocial: action.payload.razonSocial,
        clienteDireccion: action.payload.direccion,
      };
    case actions.SET_DOCUMENT:
      return {
        ...state,
        documento: action.payload,
        documentoLetra: action.payload.letra,
        documentoFiscal: action.payload.fiscal,
        documentoCodigo: action.payload.codigoUnico,
      };
    case actions.SET_COMPANY:
      return {
        ...state,
        empresa: action.payload,
        empresaRazonSocial: action.payload.razonSocial,
        empresaDireccion: action.payload.direccion,
        empresaCondicionIva: action.payload.condicionFiscal.nombre,
        empresaCuit: action.payload.cuit,
        empresaIngresosBrutos: action.payload.ingresosBrutos,
        empresaInicioActividad: action.payload.fechaInicioActividad,
      };
    case actions.SET_SALE_POINT:
      return {
        ...state,
        puntoVenta: action.payload,
        puntoVentaNumero: action.payload.numero,
        puntoVentaNombre: action.payload.nombre,
      };
    case actions.SET_DATES:
      return {
        ...state,
        fechaEmision: new Date(),
        fechaEmisionString: simpleDateWithHours(new Date()),
      };
    case actions.SET_VOUCHER_NUMBERS:
      return {
        ...state,
        numeroFactura: action.payload,
        numeroCompletoFactura:
          completeLengthWithZero(state.puntoVentaNumero, 4) +
          "-" +
          completeLengthWithZero(action.payload, 8),
      };
    case actions.SET_TOTAL:
      let total = 0;
      let totalDescuentoLineas = 0;
      let totalRecargoLineas = 0;
      let totalDescuento = 0;
      let totalRecargo = 0;
      if (state.renglones.length > 0) {
        const totalLinesSum = state.renglones.reduce(
          (acc, el) => acc + el.totalRenglon,
          0
        );
        totalRecargo = roundTwoDecimals(
          totalLinesSum * decimalPercent(state.porcentajeRecargoGlobal)
        );
        totalDescuento = roundTwoDecimals(
          totalLinesSum * decimalPercent(state.porcentajeDescuentoGlobal)
        );
        total = roundTwoDecimals(totalLinesSum + totalRecargo - totalDescuento);
        totalDescuentoLineas = roundTwoDecimals(
          state.renglones.reduce(
            (acc, el) => acc + el.importeDescuentoRenglon,
            0
          )
        );
        totalRecargoLineas = roundTwoDecimals(
          state.renglones.reduce((acc, el) => acc + el.importeRecargoRenglon, 0)
        );
      }
      return {
        ...state,
        total,
        totalDescuentoLineas,
        totalRecargoLineas,
        totalDescuento,
        totalRecargo,
      };
    default:
      return state;
  }
};

const saleReducer = {
  initialState,
  reducer,
  actions,
};

export default saleReducer;
