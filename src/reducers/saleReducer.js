import helpers from '../helpers';

const { decimalPercent, roundTwoDecimals } = helpers.mathHelper;
const { simpleDateWithHours } = helpers.dateHelper;
const { completeLengthWithZero } = helpers.stringHelper;

const initialState = {
  //----------------------------------------------- Generics state of view -----------------------------------------------------------/
  discountSurchargeModalVisible: false,
  discountSurchargeModalOperation: 'discount',
  finalizeSaleModalIsVisible: false,
  loadingView: false,
  loadingDocumentIndex: false,

  //------------------------------------------------- State of sale data -------------------------------------------------------------/
  indice: null,
  usuario: null,
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
  empresaLogo: null,
  puntoVenta: null,
  puntoVentaNumero: null,
  puntoVentaNombre: null,
  numeroFactura: null,
  numeroCompletoFactura: null,
  condicionVenta: 'Contado',
  cliente: null,
  clienteRazonSocial: null,
  clienteDireccion: null,
  clienteIdentificador: null,
  clienteCondicionIva: null,
  clienteDocumentoReceptor: null,
  mediosPago: [],
  mediosPagoNombres: [],
  planesPagoToSelect: [],
  planesPago: [],
  planesPagoNombres: [],
  fechaEmision: null,
  fechaEmisionString: null,
  cae: null,
  vencimientoCae: null,
  porcentajeDescuentoGlobal: 0,
  porcentajeRecargoGlobal: 0,
  totalDescuento: 0,
  totalRecargo: 0,
  totalDescuentoLineas: 0,
  totalRecargoLineas: 0,
  iva21: 0,
  iva10: 0,
  iva27: 0,
  baseImponible21: 0,
  baseImponible10: 0,
  baseImponible27: 0,
  importeIva: 0,
  subTotal: 0,
  total: 0,
  closedSale: false
};

const actions = {
  //---------------------------------------------- Generics actions of view ----------------------------------------------------------/
  SHOW_DISCOUNT_SURCHARGE_MODAL: 'SHOW_DISCOUNT_SURCHARGE_MODAL',
  HIDE_DISCOUNT_SURCHARGE_MODAL: 'HIDE_DISCOUNT_SURCHARGE_MODAL',
  SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION',
  SHOW_FINALIZE_SALE_MODAL: 'SHOW_FINALIZE_SALE_MODAL',
  HIDE_FINALIZE_SALE_MODAL: 'HIDE_FINALIZE_SALE_MODAL',
  CLOSE_FISCAL_OPERATION: 'CLOSE_FISCAL_OPERATION',
  CLOSE_NO_FISCAL_OPERATION: 'CLOSE_NO_FISCAL_OPERATION',
  LOADING_DOCUMENT_INDEX: 'LOADING_DOCUMENT_INDEX',
  LOADING_VIEW: 'LOADING_VIEW',
  RESET_STATE: 'RESET_STATE',

  //------------------------------------------------ Actions of sale data ------------------------------------------------------------/
  SET_INDEX: 'SET_INDEX',
  SET_USER: 'SET_USER',
  SET_GLOBAL_DISCOUNT_PERCENT: 'SET_GLOBAL_DISCOUNT_PERCENT',
  SET_GLOBAL_SURCHARGE_PERCENT: 'SET_GLOBAL_SURCHARGE_PERCENT',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_LINES: 'SET_LINES',
  SET_FRACTIONED: 'SET_FRACTIONED',
  SET_LINE_QUANTITY: 'SET_LINE_QUANTITY',
  SET_LINE_DISCOUNT_PERCENT: 'SET_LINE_DISCOUNT_PERCENT',
  SET_LINE_SURCHARGE_PERCENT: 'SET_LINE_SURCHARGE_PERCENT',
  SET_CLIENT: 'SET_CLIENT',
  SET_DOCUMENT: 'SET_DOCUMENT',
  SET_PAYMENT_METHODS: 'SET_PAYMENT_METHODS',
  SET_PAYMENT_PLANS: 'SET_PAYMENT_PLANS',
  SET_COMPANY: 'SET_COMPANY',
  SET_SALE_POINT: 'SET_SALE_POINT',
  SET_DATES: 'SET_DATES',
  SET_VOUCHER_NUMBERS: 'SET_VOUCHER_NUMBERS',
  SET_TOTAL: 'SET_TOTAL',
};

const calculateLineTotal = (line) => {
  const quantity = (line.fraccionar) ? line.cantidadUnidades / line.productoFraccionamiento : line.cantidadUnidades;
  const totalWithoutModifications = line.productoPrecioUnitario * quantity;
  const totalWithSurcharge = totalWithoutModifications * (1 + decimalPercent(line.porcentajeRecargoRenglon));
  const totalWithDiscount = totalWithoutModifications * (1 - decimalPercent(line.porcentajeDescuentoRenglon));
  const surcharge = totalWithSurcharge - totalWithoutModifications;
  const discount = totalWithoutModifications - totalWithDiscount;
  const total = totalWithoutModifications + surcharge - discount;
  return roundTwoDecimals(total);
};

const basePrice = (line) => {
  const quantity = (line.fraccionar) ? line.cantidadUnidades / line.productoFraccionamiento : line.cantidadUnidades;
  return line.productoPrecioUnitario * quantity;
};

const reducer = (state = initialState, action) => {
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
      if (action.payload === 'discount') {
        state.porcentajeDescuentoGlobal = state.porcentajeRecargoGlobal;
        state.porcentajeRecargoGlobal = 0;
      }
      if (action.payload === 'surcharge') {
        state.porcentajeRecargoGlobal = state.porcentajeDescuentoGlobal;
        state.porcentajeDescuentoGlobal = 0;
      }
      return {
        ...state,
        discountSurchargeModalOperation: action.payload,
      };
    case actions.SHOW_FINALIZE_SALE_MODAL:
      return {
        ...state,
        finalizeSaleModalIsVisible: true
      };
    case actions.HIDE_FINALIZE_SALE_MODAL:
      return {
        ...state,
        finalizeSaleModalIsVisible: false
      };
    case actions.CLOSE_FISCAL_OPERATION:
      return {
        ...state,
        cae: action.payload.CAE,
        vencimientoCae: action.payload.CAEFchVto,
        closedSale: true
      };
    case actions.CLOSE_NO_FISCAL_OPERATION:
      return {
        ...state,
        closedSale: true
      }
    case actions.LOADING_DOCUMENT_INDEX:
      return {
        ...state,
        loadingDocumentIndex: !state.loadingDocumentIndex
      }
    case actions.LOADING_VIEW:
      return {
        ...state,
        loadingView: !state.loadingView
      }

    //--------------------------------------------- Reducers of sale data -------------------------------------------------------/
    case actions.SET_INDEX:
      return {
        ...state,
        indice: action.payload
      }
    case actions.SET_USER:
      return {
        ...state,
        usuario: action.payload
      }
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
          const linePresent = state.renglones.find(renglon => renglon._id === product._id);
          if(linePresent) return linePresent;
          return {
            _id: product._id,
            productoNombre: product.nombre,
            productoCodigoBarras: product.codigoBarras,
            productoPrecioUnitario: product.precioVenta,
            productoPorcentajeIva: (product.porcentajeIvaVenta) ? product.porcentajeIvaVenta : 0,
            productoImporteIva: (product.ivaVenta) ? product.ivaVenta : 0,
            productoFraccionamiento: (product.unidadMedida) ? product.unidadMedida.fraccionamiento : 1,
            fraccionar: false,
            cantidadUnidades: 1,
            porcentajeDescuentoRenglon: 0,
            importeDescuentoRenglon: 0,
            porcentajeRecargoRenglon: 0,
            importeRecargoRenglon: 0,
            totalRenglon: product.precioVenta * 1,
          }
        }),
      };
    case actions.SET_FRACTIONED:
      return {
        ...state,
        renglones: state.renglones.map(item => {
          const checked = action.payload.fraccionar;
          const productUnfractionedPrice = state.productos.find(product => product._id === item._id).precioVenta;
          const productFractionedPrice = state.productos.find(product => product._id === item._id).precioVentaFraccionado;
          if(item._id === action.payload._id){
            item = action.payload;
            if(checked){
              item.cantidadUnidades = item.productoFraccionamiento;
              item.productoPrecioUnitario = productFractionedPrice;
              item.totalRenglon = productFractionedPrice;
            }else{
              item.cantidadUnidades = 1;
              item.productoPrecioUnitario = productUnfractionedPrice;
              item.totalRenglon = productUnfractionedPrice;
            }
          }
          return item
        })
      }
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
        clienteIdentificador: action.payload.cuit,
        clienteCondicionIva: action.payload.condicionFiscal.nombre,
        clienteDocumentoReceptor: action.payload.documentoReceptor
      };
    case actions.SET_DOCUMENT:
      return {
        ...state,
        documento: action.payload,
        documentoLetra: action.payload.letra,
        documentoFiscal: action.payload.fiscal,
        documentoCodigo: action.payload.codigoUnico,
        documentoDocumentoReceptor: action.payload.documentoReceptor
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
        empresaLogo: action.payload.logo.url
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
          '-' +
          completeLengthWithZero(action.payload, 8),
      };
    case actions.SET_PAYMENT_METHODS:
      const paymentMethodNames = [action.payload.data].map(paymentMethod => paymentMethod.nombre);
      const paymentPlansMapping = [action.payload.data].map(paymentMethod => paymentMethod.planes);
      const paymentPlans = []
      paymentPlansMapping.forEach(paymentPlanMapping => {
        paymentPlanMapping.forEach(plan => {
          paymentPlans.push(plan);
        })
      })
      return {
        ...state,
        mediosPago: [action.payload.data],
        mediosPagoNombres: paymentMethodNames,
        planesPagoToSelect: paymentPlans,
      }
    case actions.SET_PAYMENT_PLANS:
      const plans = action.payload.map(item => JSON.parse(item));
      const planNames = plans.map(item => item.nombre);
      return{
        ...state,
        planesPago: plans,
        planesPagoNombres: planNames
      }
    case actions.SET_TOTAL:
      if (state.renglones.length === 0) return state;
      const recargoGlobal = (state.planesPago.length < 1) 
                              ? decimalPercent(state.porcentajeRecargoGlobal) 
                              : (state.planesPago[0].porcentaje <= 0)
                                  ? decimalPercent(state.porcentajeRecargoGlobal)
                                  : decimalPercent(state.porcentajeRecargoGlobal) + decimalPercent(state.planesPago[0].porcentaje);
      const descuentoGlobal = (state.planesPago.length < 1) 
                              ? decimalPercent(state.porcentajeDescuentoGlobal) 
                              : (state.planesPago[0].porcentaje >= 0)
                                  ? decimalPercent(state.porcentajeDescuentoGlobal)
                                  : decimalPercent(state.porcentajeDescuentoGlobal) + decimalPercent((state.planesPago[0].porcentaje * -1));
      const totalLinesSum = state.renglones.reduce((acc, el) => acc + el.totalRenglon, 0);
      const totalRecargo = roundTwoDecimals(totalLinesSum * recargoGlobal);
      const totalDescuento = roundTwoDecimals(totalLinesSum * descuentoGlobal);
      const totalDescuentoLineas = roundTwoDecimals(
        state.renglones.reduce((acc, el) => acc + el.importeDescuentoRenglon, 0)
      );
      const totalRecargoLineas = roundTwoDecimals(
        state.renglones.reduce((acc, el) => acc + el.importeRecargoRenglon, 0)
      );
      const iva21productos = state.renglones.filter(renglon => renglon.productoPorcentajeIva === 21);
      const iva10productos = state.renglones.filter(renglon => renglon.productoPorcentajeIva === 10.5);
      const iva27productos = state.renglones.filter(renglon => renglon.productoPorcentajeIva === 27);
      const iva21Total = roundTwoDecimals(
        iva21productos.reduce(
          (acc, item) => 
            acc 
            + (item.totalRenglon + (item.totalRenglon * recargoGlobal) 
            - (item.totalRenglon * descuentoGlobal))
          , 0
        )
      );
      const iva10Total = roundTwoDecimals(
        iva10productos.reduce(
          (acc, item) => 
            acc 
            + (item.totalRenglon + (item.totalRenglon * recargoGlobal) 
            - (item.totalRenglon * descuentoGlobal))
          , 0
        )
      );
      const iva27Total = roundTwoDecimals(
        iva27productos.reduce(
          (acc, item) => 
            acc 
            + (item.totalRenglon + (item.totalRenglon * recargoGlobal) 
            - (item.totalRenglon * descuentoGlobal))
          , 0
        )
      );
      const baseImponible21 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva21Total / 1.21) : iva21Total);
      const baseImponible10 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva10Total / 1.105) : iva10Total);
      const baseImponible27 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva27Total / 1.27) : iva27Total);
      const iva21 = roundTwoDecimals(iva21Total - baseImponible21);
      const iva10 = roundTwoDecimals(iva10Total - baseImponible10);
      const iva27 = roundTwoDecimals(iva27Total - baseImponible27);
      const importeIva = roundTwoDecimals(iva21 + iva10 + iva27);
      const total = roundTwoDecimals(totalLinesSum + totalRecargo - totalDescuento);
      const subTotal = roundTwoDecimals(total - importeIva);
      
      return {
        ...state,
        totalDescuentoLineas,
        totalRecargoLineas,
        totalDescuento,
        totalRecargo,
        baseImponible21,
        baseImponible10,
        baseImponible27,
        iva21,
        iva10,
        iva27,
        importeIva,
        subTotal,
        total,
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
