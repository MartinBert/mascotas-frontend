import dateHelper from './dateHelper.js'

const {dateToAfip} = dateHelper

const formatBody = (saleData) => {
    const ivas = []
    if(saleData.iva21 > 0) ivas.push({
        Id: 5, // Id del tipo de IVA (ver tipos disponibles) 
        BaseImp: saleData.baseImponible21, // Base imponible
        Importe: saleData.iva21 // Importe
    })

    if(saleData.iva10 > 0) ivas.push({
        Id: 4, // Id del tipo de IVA (ver tipos disponibles) 
        BaseImp: saleData.baseImponible10, // Base imponible
        Importe: saleData.iva10 // Importe
    })

    if(saleData.iva27 > 0) ivas.push({
        Id: 6, // Id del tipo de IVA (ver tipos disponibles) 
        BaseImp: saleData.baseImponible27, // Base imponible
        Importe: saleData.iva27 // Importe
    })

    const body = {
        CantReg: 1, // Cantidad de comprobantes a registrar
        PtoVta: saleData.puntoVentaNumero, // Punto de venta
        CbteTipo: saleData.documentoCodigo, // Tipo de comprobante (ver tipos disponibles) 
        Concepto: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        DocTipo: saleData.clienteDocumentoReceptor, // Tipo de documento del comprador (ver tipos disponibles)
        DocNro: saleData.clienteIdentificador, // Numero de documento del comprador
        CbteDesde: saleData.numeroFactura, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
        CbteHasta: saleData.numeroFactura, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
        CbteFch: dateToAfip(saleData.fechaEmision), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        ImpTotal: saleData.total, // Importe total del comprobante
        ImpTotConc: 0, // Importe neto no gravado
        ImpNeto: saleData.subTotal, // Importe neto gravado
        ImpOpEx: 0, // Importe exento de IVA
        ImpIVA: saleData.importeIva, //Importe total de IVA
        ImpTrib: 0, //Importe total de tributos
        MonId: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)(PES para pesos argentinos) 
        MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)
        Iva: ivas
    };

    if(saleData.documentoLetra === 'C') delete(body.Iva)

    return body
}

const afipHelper = {
    formatBody
}

export default afipHelper