// Helpers
import objHelper from '../objHelper'

// Imports Destructuring
const { existsProperty } = objHelper

const existIva = (data) => {
    const iva10 = existsProperty(data, 'iva10') ? data.iva10 : 0
    const iva21 = existsProperty(data, 'iva21') ? data.iva21 : 0
    const iva27 = existsProperty(data, 'iva27') ? data.iva27 : 0
    const totalIva = iva10 + iva21 + iva27
    if (totalIva === 0) return false
    else return true
}

const validations = {
    existIva
}

export default validations