import afip from './afip'
import auth from './auth'
import benefits from './benefits'
import brands from './marcas'
import business from './empresas'
import clients from './clientes'
import currentAccounts from './cuentascorrientes'
import fiscalConditions from './condicionesfiscales'
import dailyBusinessStatistics from './dailyBusinessStatistics'
import documents from './documentos'
import entries from './entradas'
import fiscalNotes from './fiscalNotes'
import generics from './genericos'
import interfaceStyles from './interfaceStyles'
import measureUnits from './unidadesmedida'
import outputs from './salidas'
import paymentMethods from './mediospago'
import products from './productos'
import salePoints from './puntosventa'
import sales from './ventas'
import salesAreas from './zonasdeventas'
import salesLines from './salesLines'
import seed from './seed'
import stockHistory from './stockHistory'
import tenants from './tenants'
import types from './rubros'
import uploader from './uploader'
import users from './usuarios'


const api = {
    afip,
    auth,
    benefits,
    brands,
    business,
    clients,
    currentAccounts,
    fiscalConditions,
    dailyBusinessStatistics,
    documents,
    entries,
    fiscalNotes,
    generics, // Remove
    interfaceStyles,
    measureUnits,
    outputs,
    paymentMethods,
    products,
    salePoints,
    sales,
    salesAreas,
    salesLines,
    seed,
    stockHistory,
    tenants,
    types,
    uploader,
    users
}

export default api