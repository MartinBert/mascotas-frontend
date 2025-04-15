import React from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services'
import contexts from '../../contexts'
import genericos from '../../components/generics'
import icons from '../../components/icons'
import helpers from '../../helpers'
import { Button, Checkbox, Col, Input, Row } from 'antd'
import { errorAlert, successAlert } from '../../components/alerts'

const { useBenefitsContext } = contexts.Benefits
const { useGenericComponentsContext } = contexts.GenericComponents
const { ButtonForm, CheckboxForm, InputForm, ProductSelector, SpanForm } = genericos
const { Delete } = icons
const { extractValuesFromParams } = helpers.dataParserHelper
const { round } = helpers.mathHelper
const { existsProperty } = helpers.objHelper
const { fixInputNumber, regExp } = helpers.stringHelper
const { ifNotNumbersCommaAndPoint } = regExp

const parseBenefitDescription = (params) => {
    let description = ''
    if (params?.description.length < 1 ?? true) {
        const fixedAmountBonus = params.fixedAmountBonus.length === 0 ? '' : `$${params.fixedAmountBonus + (params.percentageBonus.length === 0 ? '' : ', ')}`
        const percentageBonus = params.percentageBonus.length === 0 ? '' : `%${params.percentageBonus + (params.productsBonus.length < 1 ? '' : ', ')}`
        const productsBonus = params.productsBonus.length < 1
            ? ''
            : params.productsBonus.map(product => {
                const productBonusData = `${product.name} (${product.quantity} unid.)`
                return productBonusData
            }).join(', ')
        const purchaseAmountForActivation = !params.purchaseConditionsForActivation.amount ? '' : `Monto acumulado: $${params.purchaseAmountForActivation + (!params.purchaseConditionsForActivation.quantity ? '': ', ')}`
        const purchaseQuantityForActivation = !params.purchaseConditionsForActivation.quantity ? '' : `Cantidad de compras: ${params.purchaseQuantityForActivation}`
        description = `Bonificación: ${fixedAmountBonus + percentageBonus + productsBonus}. Condiciones: ${purchaseAmountForActivation + purchaseQuantityForActivation}.`
    } else description = params.description
    return description
}

const parseErrors = (actions, params) => {
    const parseErrors = [
        {
            condition: (
                typeof params.title !== 'string'
                || params.title.length < 1
            ),
            dispatchType: [actions.SET_STATUS_OF_TITLE],
            message: 'Debe escribir un título.'
        },
        {
            condition: (
                typeof params.description !== 'string'
                || params.description.length < 0
            ),
            dispatchType: [actions.SET_STATUS_OF_DESCRIPTION],
            message: 'Descripción inválida. Contacte a su proveedor.'
        },
        {
            condition: (
                !params.purchaseConditionsForActivation.amount
                && !params.purchaseConditionsForActivation.quantity
            ),
            dispatchType: [actions.SET_STATUS_OF_PURCHASE_CONDITIONS_FOR_ACTIVATION],
            message: 'Debe seleccionar la condición de activación de la bonificación (monto acumulado o cantidad de compras).'
        },
        {
            condition: (
                params.purchaseConditionsForActivation.amount
                && (
                    isNaN(parseFloat(params.purchaseAmountForActivation))
                    || parseFloat(params.purchaseAmountForActivation) <= 0
                )
            ),
            dispatchType: [actions.SET_STATUS_OF_PURCHASE_AMOUNT_FOR_ACTIVATION],
            message: 'Debe indicar un monto acumulado de compra de activación mayor que cero.'
        },
        {
            condition: (
                params.purchaseConditionsForActivation.quantity
                && (
                    isNaN(parseFloat(params.purchaseQuantityForActivation))
                    || parseFloat(params.purchaseQuantityForActivation) <= 0
                )
            ),
            dispatchType: [actions.SET_STATUS_OF_PURCHASE_QUANTITY_FOR_ACTIVATION],
            message: 'Debe indicar una cantidad de compras de activación mayor que cero.'
        },
        {
            condition: (
                params.fixedAmountBonus === ''
                && params.percentageBonus === ''
                && params.productsBonus.length === 0
            ),
            dispatchType: [actions.SET_STATUS_OF_ACTIVE_BENEFITS],
            message: 'Debe especificar la bonificación (monto fijo, porcentaje o productos).'
        },
        {
            condition: (
                params.percentageBonus !== ''
                && (
                    isNaN(parseFloat(params.percentageBonus))
                    || parseFloat(params.percentageBonus) < 0
                    || parseFloat(params.percentageBonus) > 100
                )
            ),
            dispatchType: [actions.SET_STATUS_OF_PERCENTAGE_BONUS],
            message: 'Debe indicar un porcentaje de bonificación entre cero y cien.'
        },
        {
            condition: (
                params.fixedAmountBonus !== ''
                && (
                    isNaN(parseFloat(params.fixedAmountBonus))
                    || parseFloat(params.fixedAmountBonus) < 0
                )
            ),
            dispatchType: [actions.SET_STATUS_OF_FIXED_AMOUNT_BONUS],
            message: 'Debe indicar un monto de bonificación mayor que cero.'
        },
        {
            condition: (
                params.productsBonus.length > 0
                && (
                    params.productsBonus.map(product => {
                        const productHaveInvalidId = (
                            !existsProperty(product, 'id')
                            || typeof product.id !== 'string'
                        ) ?? true
                        const productHaveInvalidName = (
                            !existsProperty(product, 'name')
                            || typeof product.name !== 'string'
                        ) ?? true
                        const productHaveInvalidQuantity = (
                            !existsProperty(product, 'quantity')
                            || isNaN(parseFloat(product.quantity))
                            || parseFloat(product.quantity) <= 0
                        ) ?? true
                        const productHaveBadFormat = productHaveInvalidId || productHaveInvalidName || productHaveInvalidQuantity
                        return productHaveBadFormat
                    }).includes(true)
                )
            ),
            dispatchType: [actions.SET_STATUS_OF_PRODUCTS_BONUS],
            message: 'Los productos bonificados no tienen el formato requerido. Contacte a su proveedor.'
        }
    ]
    let dispatchType = []
    let message = ''
    let status = false
    for (let index = 0; index < parseErrors.length; index++) {
        const error = parseErrors[index]
        if (error.condition) {
            dispatchType = error.dispatchType
            message = error.message
            status = true
            break
        }
    }
    const data = { dispatchType, message, status }
    return data
}

const parseParamsToSave = (actions, stateParams) => {
    const unformattedParams = extractValuesFromParams(stateParams)
    const existsErrors = parseErrors(actions, unformattedParams)
    let data = {}
    if (existsErrors.status) {
        data.dispatchType = existsErrors.dispatchType
        data.message = existsErrors.message
        data.parseStatus = false
    } else {
        const parsedParams = {
            activeBenefits: unformattedParams.activeBenefits,
            description: parseBenefitDescription(unformattedParams),
            fixedAmountBonus: unformattedParams.fixedAmountBonus?.length > 0
                ? round(unformattedParams.fixedAmountBonus)
                : 0,
            percentageBonus: unformattedParams.percentageBonus?.length > 0
                ? round(unformattedParams.percentageBonus)
                : 0,
            productsBonus: unformattedParams.productsBonus.map(product => {
                const parsedProduct = { ...product, quantity: parseFloat(product.quantity) }
                return parsedProduct
            }),
            purchaseAmountForActivation: unformattedParams.purchaseAmountForActivation?.length > 0
                ? round(unformattedParams.purchaseAmountForActivation)
                : 0,
            purchaseConditionsForActivation: unformattedParams.purchaseConditionsForActivation,
            purchaseQuantityForActivation: unformattedParams.purchaseQuantityForActivation?.length > 0
                ? round(unformattedParams.purchaseQuantityForActivation)
                : 0,
            title: unformattedParams.title.toString()
        }
        data.parsedParams = parsedParams
        data.parseStatus = true
    }
    return data
}


const BenefitsForm = () => {
    const navigate = useNavigate()
    const {
        benefits_actions,
        benefits_dispatch,
        benefits_paramStatus,
        benefits_state
    } = useBenefitsContext()
    const {
        genericComponents_actions,
        bgenericComponents_dispatch,
        genericComponents_params,
        bgenericComponents_state
    } = useGenericComponentsContext()

    // ---------------- Button to cancel ----------------- //
    const cancel = async () => {
        benefits_dispatch({ type: benefits_actions.RESTART_PARAMS })
        navigate('/benefits')
    }

    const buttonToCancel = (
        <ButtonForm
            buttonType={'cancel'}
            onClick={cancel}
        />
    )

    // ------------ Button to restart params ------------- //
    const restartParams = async () => {
        benefits_dispatch({ type: benefits_actions.RESTART_PARAMS })
    }

    const buttonToRestartParams = (
        <ButtonForm
            buttonType={'restart'}
            onClick={restartParams}
        />
    )

    // ----------------- Button to save ------------------ //
    const save = async () => {
        benefits_dispatch({ type: benefits_actions.SET_LOADING, payload: true })
        const benefitToSave = parseParamsToSave(benefits_actions, benefits_state.benefit)
        if (!benefitToSave.parseStatus) {
            for (let index = 0; index < benefitToSave.dispatchType.length; index++) {
                const dispatchType = benefitToSave.dispatchType[index]
                benefits_dispatch({
                    type: dispatchType,
                    payload: {
                        message: benefitToSave.message,
                        status: benefits_paramStatus.error
                    }
                })
            }
        }
        console.log(benefitToSave)
        // const response = await api.benefits.save(benefitToSave)
        // console.log(response)
        // successAlert('Registro guardado correctamente.')
        // benefits_dispatch({ type: benefits_actions.RESTART_PARAMS })
        // navigate('benefits')
        benefits_dispatch({ type: benefits_actions.SET_LOADING, payload: false })
    }

    const buttonToSave = (
        <ButtonForm
            buttonType={'save'}
            onClick={save}
        />
    )

    // --------------- Input description ----------------- //
    const onChangeDescription = (e) => {
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_DESCRIPTION,
            payload: e.target.value
        })
    }

    const inputDescription = (
        <InputForm
            onChange={onChangeDescription}
            param={benefits_state.benefit.description}
            placeholer={'Descripción'}
        />
    )

    // ------------ Input fixed amount bonus ------------- //
    const onChangeFixedAmountBonus = (e) => {
        const prevValue = benefits_state.benefit.fixedAmountBonus.value ?? ''
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const fixedValue = fixInputNumber(currentValue, prevValue)
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_FIXED_AMOUNT_BONUS,
            payload: fixedValue
        })
    }

    const inputFixedAmountBonus = (
        <InputForm
            onChange={onChangeFixedAmountBonus}
            param={benefits_state.benefit.fixedAmountBonus}
            placeholer={'Monto bonificado'}
            roundedNumberValue={true}
        />
    )

    // ------------- Input percentage bonus -------------- //
    const onChangePercentageBonus = (e) => {
        const prevValue = benefits_state.benefit.fixedAmountBonus.value ?? ''
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const fixedValue = fixInputNumber(currentValue, prevValue)
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_PERCENTAGE_BONUS,
            payload: fixedValue
        })
    }

    const inputPercentageBonusBonus = (
        <InputForm
            onChange={onChangePercentageBonus}
            param={benefits_state.benefit.percentageBonus}
            placeholer={'Porcentaje bonificado'}
            roundedNumberValue={true}
        />
    )

    // ------ Input purchase amount for activation ------- //
    const onChangePurchaseAmountForActivation = (e) => {
        const prevValue = benefits_state.benefit.purchaseAmountForActivation.value ?? ''
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const fixedValue = fixInputNumber(currentValue, prevValue)
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_PURCHASE_AMOUNT_FOR_ACTIVATION,
            payload: fixedValue
        })
    }

    const onCheckPurchaseAmountForActivation = (e) => {
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_PURCHASE_AMOUNT_CONDITION_FOR_ACTIVATION,
            payload: e.target.checked
        })
    }

    const spanOfCheckboxPurchaseAmountForActivation = { lg: 2, md: 2, sm: 2, xl: 1, xs: 3, xxl: 1 }
    const spanOfInputPurchaseAmountForActivation = { lg: 22, md: 22, sm: 22, xl: 23, xs: 21, xxl: 23 }

    const inputPurchaseAmountForActivation = (
        <Row align='middle' gutter={8}>
            <Col
                lg={{ span: spanOfCheckboxPurchaseAmountForActivation.lg }}
                md={{ span: spanOfCheckboxPurchaseAmountForActivation.md }}
                sm={{ span: spanOfCheckboxPurchaseAmountForActivation.sm }}
                xl={{ span: spanOfCheckboxPurchaseAmountForActivation.xl }}
                xs={{ span: spanOfCheckboxPurchaseAmountForActivation.xs }}
                xxl={{ span: spanOfCheckboxPurchaseAmountForActivation.xxl }}
            >
                <CheckboxForm
                    checked={benefits_state.benefit.purchaseConditionsForActivation.value.amount}
                    onChange={onCheckPurchaseAmountForActivation}
                />
            </Col>
            <Col
                lg={{ span: spanOfInputPurchaseAmountForActivation.lg }}
                md={{ span: spanOfInputPurchaseAmountForActivation.md }}
                sm={{ span: spanOfInputPurchaseAmountForActivation.sm }}
                xl={{ span: spanOfInputPurchaseAmountForActivation.xl }}
                xs={{ span: spanOfInputPurchaseAmountForActivation.xs }}
                xxl={{ span: spanOfInputPurchaseAmountForActivation.xxl }}
            >
               <InputForm
                    disabled={!benefits_state.benefit.purchaseConditionsForActivation.value.amount}
                    onChange={onChangePurchaseAmountForActivation}
                    param={benefits_state.benefit.purchaseAmountForActivation}
                    placeholer={'Monto acumulado de compras requerido'}
                    roundedNumberValue={true}
                />
            </Col>
        </Row>
    )

    // ----- Input purchase quantity for activation ------ //
    const onChangePurchaseQuantityForActivation = (e) => {
        const prevValue = benefits_state.benefit.purchaseQuantityForActivation.value ?? ''
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const fixedValue = fixInputNumber(currentValue, prevValue)
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_PURCHASE_QUANTITY_FOR_ACTIVATION,
            payload: fixedValue
        })
    }

    const onCheckPurchaseQuantityForActivation = (e) => {
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_PURCHASE_QUANTITY_CONDITION_FOR_ACTIVATION,
            payload: e.target.checked
        })
    }

    const spanOfCheckboxPurchaseQuantityForActivation = { lg: 2, md: 2, sm: 2, xl: 1, xs: 3, xxl: 1 }
    const spanOfInputPurchaseQuantityForActivation = { lg: 22, md: 22, sm: 22, xl: 23, xs: 21, xxl: 23 }

    const inputPurchaseQuantityForActivation = (
        <Row align='middle' gutter={8}>
            <Col
                lg={{ span: spanOfCheckboxPurchaseQuantityForActivation.lg }}
                md={{ span: spanOfCheckboxPurchaseQuantityForActivation.md }}
                sm={{ span: spanOfCheckboxPurchaseQuantityForActivation.sm }}
                xl={{ span: spanOfCheckboxPurchaseQuantityForActivation.xl }}
                xs={{ span: spanOfCheckboxPurchaseQuantityForActivation.xs }}
                xxl={{ span: spanOfCheckboxPurchaseQuantityForActivation.xxl }}
            >
                <CheckboxForm
                    checked={benefits_state.benefit.purchaseConditionsForActivation.value.quantity}
                    onChange={onCheckPurchaseQuantityForActivation}
                />
            </Col>
            <Col
                lg={{ span: spanOfInputPurchaseQuantityForActivation.lg }}
                md={{ span: spanOfInputPurchaseQuantityForActivation.md }}
                sm={{ span: spanOfInputPurchaseQuantityForActivation.sm }}
                xl={{ span: spanOfInputPurchaseQuantityForActivation.xl }}
                xs={{ span: spanOfInputPurchaseQuantityForActivation.xs }}
                xxl={{ span: spanOfInputPurchaseQuantityForActivation.xxl }}
            >
                <InputForm
                    disabled={!benefits_state.benefit.purchaseConditionsForActivation.value.quantity}
                    onChange={onChangePurchaseQuantityForActivation}
                    param={benefits_state.benefit.purchaseQuantityForActivation}
                    placeholer={'Número de compras requerido'}
                    roundedNumberValue={true}
                />
            </Col>
        </Row>
    )
    
    // ------------------ Input title -------------------- //
    const onChangeTitle = (e) => {
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_TITLE,
            payload: e.target.value
        })
    }

    const inputTitle = (
        <InputForm
            onChange={onChangeTitle}
            param={benefits_state.benefit.title}
            placeholer={'Título'}
        />
    )

    // -------------- Select products bonus -------------- //
    const onChangeProductBonusQuantity = (e, product) => {
        const productInState = benefits_state.benefit.productsBonus.value
            .filter(productInState => productInState.id === product.id)
        const prevValue = productInState.quantity
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const fixedValue = fixInputNumber(currentValue, prevValue)
        const updatedProduct = { ...product, quantity: fixedValue }
        benefits_dispatch({
            type: benefits_actions.SET_VALUE_OF_QUANTITY_OF_PRODUCTS_BONUS,
            payload: updatedProduct
        })
    }
    
    const inputQuantityOfProductBonus = (product) => {
        const inputQuantity = (
            <Input
                onChange={e => onChangeProductBonusQuantity(e, product)}
                value={product.quantity}
            />
        )
        return inputQuantity
    }

    const removeProduct = (product) => {
        benefits_dispatch({
            type: benefits_actions.REMOVE_PRODUCT_OF_PRODUCTS_BONUS,
            payload: product.id
        })
    }

    const productsBonusToRender = benefits_state.benefit.productsBonus.value.length > 0 && (
        <Row gutter={[8, 8]}>
            {
                benefits_state.benefit.productsBonus.value.map((product, index) => {
                    const item = (
                        <Col key={'productsBonusToRender_' + index} span={24}>
                            <Row
                                align='middle'
                                gutter={8}
                            >
                                <Col span={8}>
                                    {product.name}
                                </Col>
                                <Col span={8}>
                                    {inputQuantityOfProductBonus(product)}
                                </Col>
                                <Col onClick={() => removeProduct(product)} span={8}>
                                    <Delete />
                                </Col>
                            </Row>
                            <Row justify='center'>
                                <Col span={8}>
                                    <span
                                        style={{
                                            color: 'red',
                                            display: isNaN(product.quantity) || product.quantity <= 0
                                                ? 'block'
                                                : 'none'
                                        }}
                                    >
                                        Debes escribir una cantidad válida mayor que cero.
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                    )
                    return item
                })
            }
        </Row>
    )

    const productSelectorSpan = { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }

    const selectProductsBonuns = (
        <Row gutter={[8, 8]}>
            <Col
                lg={{ span: productSelectorSpan.lg }}
                md={{ span: productSelectorSpan.md }}
                sm={{ span: productSelectorSpan.sm }}
                xl={{ span: productSelectorSpan.xl }}
                xs={{ span: productSelectorSpan.xs }}
                xxl={{ span: productSelectorSpan.xxl }}
            >
                <ProductSelector
                    currentSelectedProducts={benefits_state.benefit.productsBonus.value}
                    dispatch={benefits_dispatch}
                    actionToDispatchProduct={benefits_actions.SET_VALUE_OF_ID_OF_PRODUCTS_BONUS}
                    searchParam={genericComponents_params.productSelector.searchParams.barCode}
                />
            </Col>
            <Col
                lg={{ span: productSelectorSpan.lg }}
                md={{ span: productSelectorSpan.md }}
                sm={{ span: productSelectorSpan.sm }}
                xl={{ span: productSelectorSpan.xl }}
                xs={{ span: productSelectorSpan.xs }}
                xxl={{ span: productSelectorSpan.xxl }}
            >
                <ProductSelector
                    currentSelectedProducts={benefits_state.benefit.productsBonus.value}
                    dispatch={benefits_dispatch}
                    actionToDispatchProduct={benefits_actions.SET_VALUE_OF_ID_OF_PRODUCTS_BONUS}
                    searchParam={genericComponents_params.productSelector.searchParams.name}
                />
            </Col>
            <Col span={24}>
                {productsBonusToRender}
            </Col>
        </Row>
    )

    // ----------- Span validation of benefits ----------- //
    const spanValidationOfBenefits = (
        <SpanForm
            param={benefits_state.benefit.activeBenefits}
        />
    )

    // ----- Span validation of purchase conditions ------ //
    const spanValidationOfPurchaseConditions = (
        <SpanForm
            param={benefits_state.benefit.purchaseConditionsForActivation}
        />
    )

    // ------------- Title and description --------------- //
    const titleAndDescription = <h3>Descripción del beneficio</h3>

    // -------- Title of activation conditions ----------- //
    const titleOfActivationConditions = <h3>Condiciones de activación</h3>

    // --------------- Title of benefits ----------------- //
    const titleOfBenefits = <h3>Beneficios</h3>

    
    const formElements = [
        {
            element: buttonToCancel,
            order: { lg: 13, md: 13, sm: 13, xl: 13, xs: 13, xxl: 13 },
            span: { lg: 8, md: 8, sm: 12, xl: 8, xs: 24, xxl: 8 }
        },
        {
            element: buttonToRestartParams,
            order: { lg: 14, md: 14, sm: 14, xl: 14, xs: 14, xxl: 14 },
            span: { lg: 8, md: 8, sm: 12, xl: 8, xs: 24, xxl: 8 }
        },
        {
            element: buttonToSave,
            order: { lg: 15, md: 15, sm: 15, xl: 15, xs: 15, xxl: 15 },
            span: { lg: 8, md: 8, sm: 24, xl: 8, xs: 24, xxl: 8 }
        },
        {
            element: inputDescription,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 },
            span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
        },
        {
            element: inputFixedAmountBonus,
            order: { lg: 10, md: 10, sm: 10, xl: 10, xs: 10, xxl: 10 },
            span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
        },
        {
            element: inputPercentageBonusBonus,
            order: { lg: 9, md: 9, sm: 9, xl: 9, xs: 9, xxl: 9 },
            span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
        },
        {
            element: inputPurchaseAmountForActivation,
            order: { lg: 5, md: 5, sm: 5, xl: 5, xs: 5, xxl: 5 },
            span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
        },
        {
            element: inputPurchaseQuantityForActivation,
            order: { lg: 6, md: 6, sm: 6, xl: 6, xs: 6, xxl: 6 },
            span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
        },
        {
            element: inputTitle,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 },
            span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
        },
        {
            element: selectProductsBonuns,
            order: { lg: 11, md: 11, sm: 11, xl: 11, xs: 11, xxl: 11 },
            span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
        },
        {
            element: spanValidationOfBenefits,
            order: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12, xxl: 12 },
            span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
        },
        {
            element: spanValidationOfPurchaseConditions,
            order: { lg: 7, md: 7, sm: 7, xl: 7, xs: 7, xxl: 7 },
            span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
        },
        {
            element: titleAndDescription,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 },
            span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
        },
        {
            element: titleOfActivationConditions,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 },
            span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
        },
        {
            element: titleOfBenefits,
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 },
            span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
        }
    ]


    return (
        <Row
            align='middle'
            gutter={[8, 8]}
        >
            {
                formElements.map((item, index) => {
                    return (
                        <Col
                            key={'benefits_header_' + index}
                            lg={{ order: item.order.lg, span: item.span.lg }}
                            md={{ order: item.order.md, span: item.span.md }}
                            sm={{ order: item.order.sm, span: item.span.sm }}
                            xl={{ order: item.order.xl, span: item.span.xl }}
                            xs={{ order: item.order.xs, span: item.span.xs }}
                            xxl={{ order: item.order.xxl, span: item.span.xxl }}
                        >
                            {item.element}
                        </Col>
                    )
                })
            }
        </Row>
    )
}

export default BenefitsForm