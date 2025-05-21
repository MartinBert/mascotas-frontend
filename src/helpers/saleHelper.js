import mathHelper from './mathHelper'

const { decimalPercent, previousInteger, round, roundToMultiple } = mathHelper


// -------------------- Verification and format of data ------------------ //
const formatPercentages = (line) => {
    let discountPercentage
    if (!line.porcentajeDescuentoRenglon) discountPercentage = null
    else if (
        line.porcentajeDescuentoRenglon.endsWith('.')
        || line.porcentajeDescuentoRenglon.endsWith(',')
    ) discountPercentage = null
    else discountPercentage = decimalPercent(line.porcentajeDescuentoRenglon)
    let surchargePercentage
    if (!line.porcentajeRecargoRenglon) surchargePercentage = null
    else if (
        line.porcentajeRecargoRenglon.endsWith('.')
        || line.porcentajeRecargoRenglon.endsWith(',')
    ) surchargePercentage = null
    else surchargePercentage = decimalPercent(line.porcentajeRecargoRenglon)
    const data = {
        discountPercentage,
        surchargePercentage
    }
    return data
}

const verifyIfExistsGeneralPercentage = (generalDiscount, generalSurcharge) => {
    const notExistsGeneralPercentage = (
        (!generalDiscount || generalDiscount === 0)
        && (!generalSurcharge || generalSurcharge === 0)
    )
    let existsGeneralPercentage = false
    if (notExistsGeneralPercentage) existsGeneralPercentage = false
    else existsGeneralPercentage = true
    return existsGeneralPercentage
}

const verifyUpdateLinesValues = (state) => {
    if (
        !state.porcentajeDescuentoGlobal
        && !state.porcentajeRecargoGlobal
        && state.mediosPago.length === 0
        && state.planesPago.length === 0
        && state.renglones.length === 0
    ) return false
    return true
}

const verifyUpdateTotals = (state) => {
    if (state.renglones.length === 0) return false
    return true
}


// ----------------------------- Calculations ---------------------------- // 
const calculateGrAndKgQuantity = (outdatedLine, updatedDataOfLine) => {
    const line = { ...outdatedLine, ...updatedDataOfLine }
    const unitMeasureInlcudesKilograms = line?.unidadMedida?.nombre?.toLowerCase().includes('kilo') ?? null
    const unitMeasureInlcudesGrams = line?.unidadMedida?.nombre?.toLowerCase().includes(' gramo') ?? null
    const unitMeasureInlcudesGrOrKg = unitMeasureInlcudesKilograms || unitMeasureInlcudesGrams
    const isUnitMeasureGrToGr = (!unitMeasureInlcudesKilograms && unitMeasureInlcudesGrams) ? true : false
    const isUnitMeasureKgToKg = (unitMeasureInlcudesKilograms && !unitMeasureInlcudesGrams) ? true : false
    let updatedGrQuantity = 0
    let updatedKgQuantity = 0
    if (line.fraccionar) {
        if (isUnitMeasureGrToGr) {
            const parameter = round(line.cantidadUnidadesFraccionadas * line.fraccionamiento)
            updatedGrQuantity = parameter >= 1000 ? round(parameter % 1000) : round(parameter)
            updatedKgQuantity = parameter >= 1000 ? round(Math.trunc(parameter / 1000)) : 0
        } else if (isUnitMeasureKgToKg) {
            updatedGrQuantity = round((line.cantidadUnidadesFraccionadas - Math.trunc(line.cantidadUnidadesFraccionadas)) * 1000)
            updatedKgQuantity = round(Math.trunc(line.cantidadUnidadesFraccionadas))
        } else {
            const calculatedGr = round(line.cantidadUnidadesFraccionadas) >= 1000 ? round(line.cantidadUnidadesFraccionadas % 1000) : round(line.cantidadUnidadesFraccionadas)
            const calculatedKg = round(line.cantidadUnidadesFraccionadas) >= 1000 ? round(Math.trunc(line.cantidadUnidadesFraccionadas / 1000)) : 0
            updatedGrQuantity = line.fraccionamiento >= 1000 ? calculatedGr : round(line.cantidadUnidadesFraccionadas)
            updatedKgQuantity = line.fraccionamiento >= 1000 ? calculatedKg : 0
        }
    } else {
        if (unitMeasureInlcudesGrOrKg) {
            let quantityFactor = round(line.cantidadUnidades * line.fraccionamiento)
            let remainder = 0
            if (isUnitMeasureGrToGr) {
                remainder = round(line.cantidadUnidades) % 1000
                updatedGrQuantity = round((remainder * line.fraccionamiento) % 1000)
                updatedKgQuantity = round(previousInteger(quantityFactor / 1000))
            } else if (isUnitMeasureKgToKg) {
                remainder = round(quantityFactor - previousInteger(quantityFactor))
                updatedGrQuantity = round(remainder * 1000)
                updatedKgQuantity = round(previousInteger(quantityFactor))
            } else {
                updatedGrQuantity = round(quantityFactor % 1000)
                updatedKgQuantity = round(previousInteger(quantityFactor / 1000))
            }
        } else {
            updatedGrQuantity = 0
            updatedKgQuantity = 0
        }
    }
    const data = { updatedGrQuantity, updatedKgQuantity }
    return data
}

const getDataFromLine = (line, stateData) => {
    const { discountPercentage, surchargePercentage } = formatPercentages(line)
    const discountDecimalVariation = round(
        discountPercentage
        + stateData.generalDiscount
        + (stateData.paymentPlanVariation > 0 ? 0 : stateData.paymentPlanVariation)
    )
    const surchargeDecimalVariation = round(
        surchargePercentage
        + stateData.generalSurcharge
        + (stateData.paymentPlanVariation > 0 ? stateData.paymentPlanVariation : 0)
    )
    const factorOfDecimalVariation = round(1 - discountDecimalVariation + surchargeDecimalVariation)
    const fractionatedSalePriceOfProductOfLine = round(stateData.productOfLine.precioVentaFraccionado)
    const listUnitPriceOfProductOfLine = round(line.precioListaUnitario)
    const salePriceOfProductOfLine = round(stateData.productOfLine.precioVenta)
    const factorOfFractionatedProductOfLine = fractionatedSalePriceOfProductOfLine / salePriceOfProductOfLine
    const data = {
        discountDecimalVariation,
        factorOfDecimalVariation,
        factorOfFractionatedProductOfLine,
        fractionatedSalePriceOfProductOfLine,
        listUnitPriceOfProductOfLine,
        salePriceOfProductOfLine,
        surchargeDecimalVariation
    }
    return data
}

const updateLinesValues = (state) => {
    const verified = verifyUpdateLinesValues(state)
    if (!verified) return state.renglones
    const generalDiscount = decimalPercent(state.porcentajeDescuentoGlobal)
    const generalSurcharge = decimalPercent(state.porcentajeRecargoGlobal)
    const lastModifiedParameter = state.lastModifiedParameter.parameter
    const idOflineToModify = state.lastModifiedParameter.lineId
    const paymentPlanVariation = (
        state.planesPago.length > 0
            ? decimalPercent(parseFloat(state.planesPago[0].porcentaje))
            : 0
    )
    const stateData = { generalDiscount, generalSurcharge, paymentPlanVariation }

    let basicGrossPrice = 0
    let calculatedQuantity = 0
    let lineQuantityIsNaN = false
    let quantityWithoutVariations = 0
    let updatedDataOfLine = {}
    let updatedLine = {}
    let updatedLines = []
    switch (lastModifiedParameter) {
        case 'generalPercentage':
            if (!state.generalPercentageType) updatedLines = state.renglones
            else {
                updatedLines = state.renglones.map(line => {
                    updatedDataOfLine = {}
                    stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                    const {
                        discountDecimalVariation,
                        factorOfDecimalVariation,
                        fractionatedSalePriceOfProductOfLine,
                        listUnitPriceOfProductOfLine,
                        salePriceOfProductOfLine,
                        surchargeDecimalVariation
                    } = getDataFromLine(line, stateData)
    
                    if (line.fraccionar && line.precioNetoFijo) {
                        quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                        calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                        updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                        updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                        updatedDataOfLine.cantidadUnidades = calculatedQuantity
                        updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                        updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                        updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                        updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
    
                    } else if (line.fraccionar && !line.precioNetoFijo) {
                        calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                        basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                        updatedDataOfLine.precioBruto = basicGrossPrice
                        updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                        updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                        updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
    
                    } else if (!line.fraccionar && line.precioNetoFijo) {
                        quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                        calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                        updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                        updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                        updatedDataOfLine.cantidadUnidades = calculatedQuantity
                        updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                        updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                        updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                        updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                    
                    } else if (!line.fraccionar && !line.precioNetoFijo) {
                        calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                        basicGrossPrice = salePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                        updatedDataOfLine.precioBruto = basicGrossPrice
                        updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                        updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                        updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
    
                    } else updatedDataOfLine = {}
    
                    updatedLine = { ...line, ...updatedDataOfLine }
                    return updatedLine
                })
            }
            break
        case 'generalPercentageType':
            const existsGeneralPercentage = verifyIfExistsGeneralPercentage(generalDiscount, generalSurcharge)
            if (!existsGeneralPercentage) updatedLines = state.renglones
            else {
                updatedLines = state.renglones.map(line => {
                    updatedDataOfLine = {}
                    stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                    const {
                        discountDecimalVariation,
                        factorOfDecimalVariation,
                        fractionatedSalePriceOfProductOfLine,
                        listUnitPriceOfProductOfLine,
                        salePriceOfProductOfLine,
                        surchargeDecimalVariation
                    } = getDataFromLine(line, stateData)
    
                    if (line.fraccionar && line.precioNetoFijo) {
                        quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                        calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                        updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                        updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                        updatedDataOfLine.cantidadUnidades = calculatedQuantity
                        updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                        updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                        updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                        updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
    
                    } else if (line.fraccionar && !line.precioNetoFijo) {
                        calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                        basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                        updatedDataOfLine.precioBruto = basicGrossPrice
                        updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                        updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                        updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
    
                    } else if (!line.fraccionar && line.precioNetoFijo) {
                        quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                        calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                        updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                        updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                        updatedDataOfLine.cantidadUnidades = calculatedQuantity
                        updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                        updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                        updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                        updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                    
                    } else if (!line.fraccionar && !line.precioNetoFijo) {
                        calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                        basicGrossPrice = salePriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                        updatedDataOfLine.precioBruto = basicGrossPrice
                        updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                        updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                        updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                        updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
    
                    } else updatedDataOfLine = {}
    
                    updatedLine = { ...line, ...updatedDataOfLine }
                    return updatedLine
                })
            }
            break
        case 'lineDiscount':
            updatedLines = state.renglones.map(line => {
                if (line._id !== idOflineToModify) return line
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity

                } else if (line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else if (!line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        case 'lineFractionated':
            updatedLines = state.renglones.map(line => {
                if (line._id !== idOflineToModify) return line
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity

                } else if (line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = (
                        line.fraccionamiento >= 1000
                            ? 1000
                            : (line.fraccionamiento >= 100 && line.fraccionamiento < 1000)
                                ? 100
                                : 1
                    ) / line.fraccionamiento
                    basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = 0
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = 0
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar && !line.precioNetoFijo) {
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = 0
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = 0
                    updatedDataOfLine.cantidadUnidades = 1
                    updatedDataOfLine.cantidadUnidadesFraccionadas = line.fraccionamiento
                    updatedDataOfLine.descuento = salePriceOfProductOfLine * discountDecimalVariation
                    updatedDataOfLine.precioBruto = salePriceOfProductOfLine
                    updatedDataOfLine.precioNeto = salePriceOfProductOfLine * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = salePriceOfProductOfLine * factorOfDecimalVariation - listUnitPriceOfProductOfLine
                    updatedDataOfLine.recargo = salePriceOfProductOfLine * surchargeDecimalVariation
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                    
                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        case 'lineNetPrice':
            updatedLines = state.renglones.map(line => {
                if (line._id !== idOflineToModify) return line
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar) {
                    quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = line.precioNeto / factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = line.precioNeto - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity

                } else if (!line.fraccionar) {
                    quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = line.precioNeto / factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = line.precioNeto - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        case 'lineQuantity':
            updatedLines = state.renglones.map(line => {
                if (line._id !== idOflineToModify) return line
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar) {
                    lineQuantityIsNaN = isNaN(line.cantidadUnidades)
                    basicGrossPrice = fractionatedSalePriceOfProductOfLine * (lineQuantityIsNaN ? 0 : line.cantidadUnidades)
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * line.cantidadUnidades
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar) {
                    lineQuantityIsNaN = isNaN(line.cantidadUnidades)
                    basicGrossPrice = salePriceOfProductOfLine * (lineQuantityIsNaN ? 0 : line.cantidadUnidades)
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * line.cantidadUnidades
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        case 'lineSurcharge':
            updatedLines = state.renglones.map(line => {
                if (line._id !== idOflineToModify) return line
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity

                } else if (line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else if (!line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        case 'paymentMethod':
            updatedLines = state.renglones.map(line => {
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity

                } else if (line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else if (!line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        case 'paymentPlan':
            updatedLines = state.renglones.map(line => {
                updatedDataOfLine = {}
                stateData.productOfLine = state.productos.find(product => product.nombre === line.nombre)
                const {
                    discountDecimalVariation,
                    factorOfDecimalVariation,
                    fractionatedSalePriceOfProductOfLine,
                    listUnitPriceOfProductOfLine,
                    salePriceOfProductOfLine,
                    surchargeDecimalVariation
                } = getDataFromLine(line, stateData)

                if (line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / fractionatedSalePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity

                } else if (line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = fractionatedSalePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = fractionatedSalePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else if (!line.fraccionar && line.precioNetoFijo) {
                    quantityWithoutVariations = line.precioNeto / salePriceOfProductOfLine
                    calculatedQuantity = quantityWithoutVariations / factorOfDecimalVariation
                    updatedDataOfLine.cantidadAgregadaPorDescuento_enKg = quantityWithoutVariations * discountDecimalVariation
                    updatedDataOfLine.cantidadQuitadaPorRecargo_enKg = quantityWithoutVariations * surchargeDecimalVariation
                    updatedDataOfLine.cantidadUnidades = calculatedQuantity
                    updatedDataOfLine.cantidadUnidadesFraccionadas = calculatedQuantity * line.fraccionamiento
                    updatedDataOfLine.precioBruto = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.cantidadg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedGrQuantity
                    updatedDataOfLine.cantidadKg = calculateGrAndKgQuantity(line, updatedDataOfLine).updatedKgQuantity
                
                } else if (!line.fraccionar && !line.precioNetoFijo) {
                    calculatedQuantity = line.cantidadUnidadesFraccionadas / line.fraccionamiento
                    basicGrossPrice = salePriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.descuento = basicGrossPrice * discountDecimalVariation
                    updatedDataOfLine.precioBruto = basicGrossPrice
                    updatedDataOfLine.precioNeto = basicGrossPrice * factorOfDecimalVariation
                    updatedDataOfLine.precioUnitario = salePriceOfProductOfLine
                    updatedDataOfLine.profit = basicGrossPrice * factorOfDecimalVariation - listUnitPriceOfProductOfLine * calculatedQuantity
                    updatedDataOfLine.recargo = basicGrossPrice * surchargeDecimalVariation

                } else updatedDataOfLine = {}

                updatedLine = { ...line, ...updatedDataOfLine }
                return updatedLine
            })
            break
        default:
            updatedLines = state.renglones
            break
    }
    updatedLines = updatedLines.map(line => {
        const lineWithRoundedNumericValues = {
            ...line,
            cantidadAgregadaPorDescuento_enKg: round(line.cantidadAgregadaPorDescuento_enKg),
            cantidadg: round(line.cantidadg),
            cantidadKg: round(line.cantidadKg),
            cantidadQuitadaPorRecargo_enKg: round(line.cantidadQuitadaPorRecargo_enKg),
            cantidadUnidades: lastModifiedParameter === 'lineQuantity' ? line.cantidadUnidades : round(line.cantidadUnidades),
            cantidadUnidadesFraccionadas: lastModifiedParameter === 'lineQuantity' ? line.cantidadUnidadesFraccionadas : round(line.cantidadUnidadesFraccionadas),
            descuento: round(line.descuento),
            precioBruto: roundToMultiple(line.precioBruto, 10),
            precioNeto: lastModifiedParameter === 'lineNetPrice' ? line.precioNeto : roundToMultiple(line.precioNeto, 10),
            precioUnitario: roundToMultiple(line.precioUnitario, 10),
            profit: round(line.profit),
            recargo: round(line.recargo)
        }
        return lineWithRoundedNumericValues
    })
    return updatedLines
}

const updateTotals = (state) => {
    const verified = verifyUpdateTotals(state)
    if (!verified) {
        state.baseImponible10 = 0
        state.baseImponible21 = 0
        state.baseImponible27 = 0
        state.iva10 = 0
        state.iva21 = 0
        state.iva27 = 0
        state.importeIva = 0
        state.profit = 0
        state.subTotal = 0
        state.total = 0
        state.totalDescuento = 0
        state.totalRecargo = 0
        return state
    }

    const fixDiscountAndSurcharge = (percentageValue) => {
        if (
            !percentageValue
            || percentageValue.toString().endsWith('.')
            || percentageValue.toString().endsWith(',')
        ) return 0
        else return parseFloat(percentageValue)
    }

    const fixNetPrice = (line) => {
        if (
            !line.precioNeto
            || !line.cantidadUnidades
            || !line.cantidadUnidadesFraccionadas
            || line.precioNeto.toString().endsWith('.')
            || line.precioNeto.toString().endsWith(',')
            || line.cantidadUnidades.toString().endsWith('.')
            || line.cantidadUnidades.toString().endsWith(',')
            || line.cantidadUnidadesFraccionadas.toString().endsWith('.')
            || line.cantidadUnidadesFraccionadas.toString().endsWith(',')
        ) return 0
        else return parseFloat(line.precioNeto)
    }

    // ---------------- Cálculos correspondientes a ítems de precio VARIABLE ---------------- //
    const variableAmountLines = state.renglones.filter(renglon => !renglon.precioNetoFijo)
    const variableLinesSumBasePrice = round(variableAmountLines.reduce((acc, line) => acc + fixNetPrice(line), 0))
    const totalDescuentoVariable = round(variableAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.descuento), 0))
    const totalRecargoVariable = round(variableAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.recargo), 0))

    // ---------------- Cálculos correspondientes a ítems de precio FIJADO ---------------- //
    const fixedAmountLines = state.renglones.filter(renglon => renglon.precioNetoFijo)
    const fixedLinesSumBasePrice = round(fixedAmountLines.reduce((acc, line) => acc + fixNetPrice(line), 0))
    const totalDescuentoFijo = round(fixedAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.descuento), 0))
    const totalRecargoFijo = round(fixedAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.recargo), 0))

    // ---------------- TOTALES (ítems de precio VARIABLE + ítems de precio FIJADO) ---------------- //
    const totalLinesSum = variableLinesSumBasePrice + fixedLinesSumBasePrice
    const totalRecargo = totalRecargoVariable + totalRecargoFijo
    const totalDescuento = totalDescuentoVariable + totalDescuentoFijo

    // ---------------- Cálculo de IVA, total y subtotal de la factura ---------------- //
    const iva21productosMontoVariable = variableAmountLines.filter(renglon => renglon.porcentajeIva === 21)
    const iva21productosMontoFijo = fixedAmountLines.filter(renglon => renglon.porcentajeIva === 21)
    const iva10productosMontoVariable = variableAmountLines.filter(renglon => renglon.porcentajeIva === 10.5)
    const iva10productosMontoFijo = fixedAmountLines.filter(renglon => renglon.porcentajeIva === 10.5)
    const iva27productosMontoVariable = variableAmountLines.filter(renglon => renglon.porcentajeIva === 27)
    const iva27productosMontoFijo = fixedAmountLines.filter(renglon => renglon.porcentajeIva === 27)
    const iva21Total = round(
        iva21productosMontoVariable.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
        + iva21productosMontoFijo.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
    )
    const iva10Total = round(
        iva10productosMontoVariable.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
        + iva10productosMontoFijo.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
    )
    const iva27Total = round(
        iva27productosMontoVariable.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
        + iva27productosMontoFijo.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
    )
    const baseImponible21 = round((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva21Total / 1.21) : iva21Total)
    const baseImponible10 = round((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva10Total / 1.105) : iva10Total)
    const baseImponible27 = round((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva27Total / 1.27) : iva27Total)
    const iva21 = round(iva21Total - baseImponible21)
    const iva10 = round(iva10Total - baseImponible10)
    const iva27 = round(iva27Total - baseImponible27)
    const importeIva = round(iva21 + iva10 + iva27)
    const total = round(totalLinesSum)
    const totalRedondeado = roundToMultiple(total, 10)
    const totalDiferencia = round(totalRedondeado - total)
    const subTotal = round(total - importeIva)
    const profit = state.renglones.reduce((acc, el) => acc + parseFloat(el.profit), 0)

    state.baseImponible21 = baseImponible21
    state.baseImponible10 = baseImponible10
    state.baseImponible27 = baseImponible27
    state.importeIva = importeIva
    state.iva21 = iva21
    state.iva10 = iva10
    state.iva27 = iva27
    state.profit = profit
    state.subTotal = subTotal
    state.total = total
    state.totalDescuento = totalDescuento
    state.totalDiferencia = totalDiferencia
    state.totalRecargo = totalRecargo
    state.totalRedondeado = totalRedondeado

    return state
}

const saleHelper = {
    updateLinesValues,
    updateTotals
}

export default saleHelper