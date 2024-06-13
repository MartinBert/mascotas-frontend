// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Modal, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Imports Destructuring
const { useSaleContext } = contexts.Sale
const { useSaleCustomProductsContext } = contexts.SaleCustomProducts
const { useSaleProductsContext } = contexts.SaleProducts
const { fixInputNumber, regExp } = helpers.stringHelper
const { ifNotNumbersCommaAndPoint } = regExp


const CustomLineModal = () => {
    const [sale_state] = useSaleContext()
    const [customProducts_state, customProducts_dispatch] = useSaleCustomProductsContext()
    const [saleProducts_state] = useSaleProductsContext()

    // ---------------------- Actions -------------------- //
    const closeModalWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            customProducts_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
        } else return
    }

    const existsRefs = () => {
        const refs = {
            buttonToAdd: sale_state.refs.buttonToAddCustomProduct,
            buttonToSaveAddedCustomProducts: sale_state.refs.buttonToSaveAddedCustomProducts,
            buttonToSaveCustomProduct: sale_state.refs.buttonToSaveCustomProduct,
            inputConcept: sale_state.refs.inputConceptOfCustomProduct,
            inputPercentageIVA: sale_state.refs.inputPercentageIVAOfCustomProduct,
            inputUnitPrice: sale_state.refs.inputUnitPriceOfCustomProduct
        }
        const exists = !Object.values(refs).includes(null)
        const data = { exists, refs }
        return data
    }

    const generateParams = () => {
        const params = {
            ...customProducts_state.params,
            concept: customProducts_state.paramsInputs.concept,
            percentageIVA: customProducts_state.paramsInputs.percentageIVA,
            unitPrice: customProducts_state.paramsInputs.unitPrice
        }
        return params
    }

    const keyboardActions = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            const params = generateParams()
            customProducts_dispatch({ type: 'SAVE_PARAMS', payload: params })
        }
        else if (e.keyCode === 27) { // Escape
            e.preventDefault()
            customProducts_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
        } else return
    }

    // Get status
    const invalidStatusOfConcept = (currentValue) => {
        if (currentValue === '') return true
        else return false
    }

    const invalidStatusOfPercentageIVA = (currentValue) => {
        if (
            parseFloat(currentValue) < 0
            || parseFloat(currentValue) > 100
            || currentValue === ''
            || currentValue.endsWith('.')
            || currentValue.endsWith(',')
        ) return true
        else return false
    }

    const invalidStatusOfUnitPrice = (currentValue) => {
        if (
            parseFloat(currentValue) < 0
            || currentValue == 0
            || currentValue.endsWith('.')
            || currentValue.endsWith(',')
        ) return true
        else return false
    }

    const invalidStatus = () => {
        const isConceptInvalid = invalidStatusOfConcept(customProducts_state.paramsInputs.concept)
        const isPercentageIVAInvalid = invalidStatusOfPercentageIVA(customProducts_state.paramsInputs.percentageIVA)
        const isUnitPriceInvalid = invalidStatusOfUnitPrice(customProducts_state.paramsInputs.unitPrice)
        const status = [isConceptInvalid, isPercentageIVAInvalid, isUnitPriceInvalid].includes(true)
        const data = { isConceptInvalid, isPercentageIVAInvalid, isUnitPriceInvalid, status }
        return data
    }

    // Set focus
    const setFocus = (e) => { // e: true when modal is open, false when is close
        const { exists, refs } = existsRefs()
        if (!exists) return
        let unfilledField
        if (e) {
            if (refs.inputConcept.value === '') unfilledField = refs.inputConcept
            else if (refs.inputPercentageIVA.value === '') unfilledField = refs.inputPercentageIVA
            else if (refs.inputUnitPrice.value === '') unfilledField = refs.inputUnitPrice
            else unfilledField = refs.buttonToSaveCustomProduct
        } else {
            const existingCustomProducts = sale_state.renglones
                .filter(line => line._id.startsWith('customProduct_'))
                .concat(customProducts_state.saleCustomProducts)
                .length
            if (existingCustomProducts === 0) unfilledField = refs.buttonToAdd
            else unfilledField = refs.buttonToSaveAddedCustomProducts
        }
        unfilledField.focus()
    }

    useEffect(() => { setFocus(true) }, [
        customProducts_state.params.concept,
        customProducts_state.params.percentageIVA,
        customProducts_state.params.unitPrice
    ])

    // Set index of following custom product
    const setProductID = () => {
        const id = 'customProduct_' + (
            customProducts_state.quantityOfNotSavedCustomProducts
            + customProducts_state.quantityOfSavedCustomProducts
            + 1
        )
        const productWithID = {
            ...customProducts_state.params,
            _id: id
        }
        customProducts_dispatch({ type: 'SAVE_PARAMS', payload: productWithID })
    }

    useEffect(() => { setProductID() }, [
        customProducts_state.quantityOfNotSavedCustomProducts,
        customProducts_state.quantityOfSavedCustomProducts
    ])

    // Set quantity of custom products not saved
    const updateQuantityOfNotSavedCustomProducts = () => {
        customProducts_dispatch({
            type: 'SET_QUANTITY_OF_NOT_SAVED_CUSTOM_PRODUCTS',
            payload: customProducts_state.saleCustomProducts.length
        })
    }

    useEffect(() => {
        updateQuantityOfNotSavedCustomProducts()
    }, [customProducts_state.saleCustomProducts.length])

    // Set quantity of custom products saved
    const updateQuantityOfSavedCustomProducts = () => {
        const quantity = saleProducts_state.params.productos.reduce(
            (acc, el) => acc + ((el._id).startsWith('customProduct_') ? 1 : 0), 0
        )
        customProducts_dispatch({
            type: 'SET_QUANTITY_OF_SAVED_CUSTOM_PRODUCTS',
            payload: quantity
        })
    }

    useEffect(() => {
        updateQuantityOfSavedCustomProducts()
    }, [saleProducts_state.params.productos.length])

    // ------------------ Action buttons ----------------- //
    // Button to cancel
    const cancelAndCloseModal = () => {
        customProducts_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
    }

    const buttonToCancel = (
        <Button
            danger
            onClick={cancelAndCloseModal}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // Button to restart fields
    const clearLineState = () => {
        customProducts_dispatch({ type: 'CLEAR_LINE_PARAMS' })
        setFocus(true)
    }

    const buttonToRestartFields = (
        <Button
            danger
            htmlType='reset'
            onClick={clearLineState}
            onKeyUp={keyboardActions}
            style={{ width: '100%' }}
            type='default'
        >
            Reiniciar
        </Button>
    )

    // Button to save
    const addLine = () => {
        const { isConceptInvalid, isPercentageIVAInvalid, isUnitPriceInvalid, status } = invalidStatus()
        if (status) {
            const inputStatus = {
                concept: isConceptInvalid ? 'error' : null,
                percentageIVA: isPercentageIVAInvalid ? 'error' : null,
                unitPrice: isUnitPriceInvalid ? 'error' : null
            }
            customProducts_dispatch({ type: 'SET_INPUT_STATUS', payload: inputStatus })
            return
        }
        const params = generateParams()
        customProducts_dispatch({ type: 'SET_CUSTOM_PRODUCT', payload: params })
        customProducts_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
    }

    const buttonToSave = (
        <Button
            htmlType='submit'
            id='buttonToSaveCustomProduct'
            onClick={addLine}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '50%' }}
            type='primary'
        >
            Añadir
        </Button>
    )

    const actionButtons = (
        <Row gutter={8}>
            <Col span={6}>
                {buttonToCancel}
            </Col>
            <Col span={6}>
                {buttonToRestartFields}
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
                {buttonToSave}
            </Col>
        </Row>
    )

    // ------------------ Input concept ------------------ //
    const onChangeConcept = async (e) => {
        const currentValue = e.target.value
        const inputStatus = { ...customProducts_state.inputStatus, concept: invalidStatusOfConcept(currentValue) ? 'error' : null }
        customProducts_dispatch({ type: 'SET_INPUT_STATUS', payload: inputStatus })
        const params = { ...customProducts_state.paramsInputs, concept: e.target.value }
        customProducts_dispatch({ type: 'SET_PARAMS_OF_INPUTS', payload: params })
    }

    const inputConcept = (
        <>
            <Input
                id='inputConceptOfCustomProduct'
                onChange={onChangeConcept}
                onKeyUp={keyboardActions}
                placeholder='Concepto'
                status={customProducts_state.inputStatus.concept}
                value={customProducts_state.paramsInputs.concept}
            />
            <span
                style={{
                    color: 'red',
                    display: customProducts_state.inputStatus.concept === 'error' ? 'block' : 'none'
                }}
            >
                Escribe un concepto.
            </span>
        </>
    )

    // ------------------- Input values ------------------ //
    // Input price
    const onChangePrice = async (e) => {
        const prevValue = customProducts_state.paramsInputs.unitPrice
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const inputStatus = { ...customProducts_state.inputStatus, unitPrice: invalidStatusOfUnitPrice(currentValue) ? 'error' : null }
        customProducts_dispatch({ type: 'SET_INPUT_STATUS', payload: inputStatus })
        const fixedValue = fixInputNumber(currentValue, prevValue)
        const params = { ...customProducts_state.paramsInputs, unitPrice: fixedValue }
        customProducts_dispatch({ type: 'SET_PARAMS_OF_INPUTS', payload: params })
    }

    const inputUnitPrice = (
        <>
            <Input
                id='inputUnitPriceOfCustomProduct'
                onChange={onChangePrice}
                onKeyUp={keyboardActions}
                status={customProducts_state.inputStatus.unitPrice}
                style={{ width: '100%' }}
                value={customProducts_state.paramsInputs.unitPrice}
            />
            <span
                style={{
                    color: 'red',
                    display: customProducts_state.inputStatus.unitPrice === 'error' ? 'block' : 'none'
                }}
            >
                Escribe un precio válido mayor que cero.
            </span>
        </>
    )

    // Input percentage of IVA
    const onChangePercentageIVA = async (e) => {
        const prevValue = customProducts_state.paramsInputs.percentageIVA
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const inputStatus = { ...customProducts_state.inputStatus, percentageIVA: invalidStatusOfPercentageIVA(currentValue) ? 'error' : null }
        customProducts_dispatch({ type: 'SET_INPUT_STATUS', payload: inputStatus })
        const fixedValue = fixInputNumber(currentValue, prevValue)
        const params = { ...customProducts_state.paramsInputs, percentageIVA: fixedValue }
        customProducts_dispatch({ type: 'SET_PARAMS_OF_INPUTS', payload: params })
    }

    const inputPercentageIVA = (
        <>
            <Input
                id='inputPercentageIVAOfCustomProduct'
                onChange={onChangePercentageIVA}
                onKeyUp={keyboardActions}
                status={customProducts_state.inputStatus.percentageIVA}
                style={{ width: '100%' }}
                value={customProducts_state.paramsInputs.percentageIVA}
            />
            <span
                style={{
                    color: 'red',
                    display: customProducts_state.inputStatus.percentageIVA === 'error' ? 'block' : 'none'
                }}
            >
                Igrese un valor entre cero y 100.
            </span>
        </>
    )

    const inputValues = (
        <Row gutter={8} justify='center'>
            <Col span={12}>
                {inputUnitPrice}
            </Col>
            <Col span={12}>
                {inputPercentageIVA}
            </Col>
        </Row>
    )


    const itemsToRender = [
        {
            element: actionButtons,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: inputConcept,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: inputValues,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 16 },
        span: { lg: 24, md: 24, sm: 24, xl: 24, xs: 24, xxl: 24 }
    }


    return (
        <Modal
            afterClose={setFocus}
            afterOpenChange={setFocus}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            forceRender
            okButtonProps={{ style: { display: 'none' } }}
            open={customProducts_state.customProductModalIsVisible}
            title='Concepto personalizado para el comprobante'
            width={800}
            zIndex={1000}
        >
            <Row
                gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                justify='space-around'
            >
                {
                    itemsToRender.map((item, index) => {
                        return (
                            <Col
                                key={'custom_line_modal_item_' + index}
                                lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                                md={{ order: item.order.md, span: responsiveGrid.span.md }}
                                sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                                xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                                xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                                xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                            >
                                {item.element}
                            </Col>
                        )
                    })
                }
            </Row>
        </Modal>
    )
}

export default CustomLineModal