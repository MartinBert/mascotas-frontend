// React Components and Hooks
import React, { useEffect } from 'react'

// Custom components
import { errorAlert } from '../../components/alerts'

// Design Components
import { Button, Col, Input, Modal, Row, Select } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Helpers
import helpers from '../../helpers'

// Imports Destructurings
const { useSaleContext } = contexts.Sale
const { fixInputNumber, regExp } = helpers.stringHelper
const { ifNotNumbersCommaAndPoint } = regExp

const DiscountSurchargeModal = () => {
    const [sale_state, sale_dispatch] = useSaleContext()

    // ---------------------- Actions -------------------- //
    const closeModalWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            sale_dispatch({ type: 'HIDE_DISCOUNT_SURCHARGE_MODAL' })
            setFocus(false)
        } else return
    }

    const existsRefs = () => {
        const refs = {
            buttonToSavePercentage: sale_state.refs.buttonToSaveDiscountSurchargeModal,
            clientField: sale_state.refs.autocompleteClient,
            dateField: sale_state.refs.datePicker,
            documentField: sale_state.refs.autocompleteDocument,
            finalizeButton: sale_state.refs.buttonToFinalizeSale,
            openProductSelectionModalButton: sale_state.refs.buttonToOpenProductSelectionModal,
            paymentMethodField: sale_state.refs.autocompletePaymentMethod,
            paymentPlanField: sale_state.refs.autocompletePaymentPlan,
            percentageField: sale_state.refs.inputPercentageOfDiscountAndSurchargeModal,
            selectPercentageType: sale_state.refs.selectPercentageTypeOfDiscountAndSurchargeModal
        }
        const exists = !Object.values(refs).includes(null)
        const data = { exists, refs }
        return data
    }

    // Get status
    const invalidStatusOfPercentage = (currentValue) => {
        if (
            parseFloat(currentValue) < 0
            || parseFloat(currentValue) > 100
            || currentValue == 0
            || currentValue.endsWith('.')
            || currentValue.endsWith(',')
        ) return true
        else return false
    }

    const invalidStatusOfPercentageType = (currentValue) => {
        if (currentValue === '') return true
        else return false
    }

    const invalidStatus = () => {
        const percentageValueType = sale_state.discountSurchargeModalActiveOptionInput
        const percentageValue = percentageValueType === 'discount'
            ? sale_state.percentageOfGlobalDiscountInput
            : sale_state.percentageOfGlobalSurchargeInput
        const isPercentageInvalid = invalidStatusOfPercentage(percentageValue)
        const isPercentageTypeInvalid = invalidStatusOfPercentageType(percentageValueType)
        const status = [isPercentageInvalid, isPercentageTypeInvalid].includes(true)
        const data = { isPercentageInvalid, isPercentageTypeInvalid, status }
        return data
    }

    const setFocus = (e) => { // e: true when modal is open, false when is close
        const { exists, refs } = existsRefs()
        if (!exists) return
        let unfilledField
        if (e) {
            if (refs.percentageField.value === '') unfilledField = refs.percentageField
            else if (sale_state.discountSurchargeModalActiveOptionInput === '') unfilledField = refs.selectPercentageType
            else unfilledField = refs.buttonToSavePercentage
        } else {
            if (!sale_state.valueForDatePicker) unfilledField = refs.dateField
            else if (refs.clientField.value === '') unfilledField = refs.clientField
            else if (refs.documentField.value === '') unfilledField = refs.documentField
            else if (refs.paymentMethodField.value === '') unfilledField = refs.paymentMethodField
            else if (refs.paymentPlanField.value === '') unfilledField = refs.paymentPlanField
            else if (sale_state.renglones.length === 0) unfilledField = refs.openProductSelectionModalButton
            else unfilledField = refs.finalizeButton
        }
        unfilledField.focus()
    }

    useEffect(() => { setFocus(true) }, [sale_state.discountSurchargeModalActiveOptionInput])

    const buttonActionsWithKeyboard = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            setFocus(true)
        } else if (e.keyCode === 27) { // Escape
            e.preventDefault()
            sale_dispatch({ type: 'HIDE_DISCOUNT_SURCHARGE_MODAL' })
        } else return
    }

    // ----------------- Button to cancel ---------------- //
    const cancel = () => {
        sale_dispatch({ type: 'HIDE_DISCOUNT_SURCHARGE_MODAL' })
    }

    const buttonToCancel = (
        <Button
            danger
            id='buttonToCancelDiscountSurchargeModal'
            onClick={cancel}
            onKeyUp={closeModalWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // ------------ Button to save percentage ------------ //
    const save = () => {
        const { isPercentageInvalid, isPercentageTypeInvalid, status } = invalidStatus()
        if (status) {
            const fieldStatus = {
                percentage: isPercentageInvalid ? 'error' : null,
                percentageType: isPercentageTypeInvalid ? 'error' : null
            }
            sale_dispatch({ type: 'SET_FIELD_STATUS', payload: fieldStatus })
            return
        }
        let value
        const percentageType = sale_state.discountSurchargeModalActiveOptionInput
        if (percentageType === 'discount') value = sale_state.percentageOfGlobalDiscountInput
        else if (percentageType === 'surcharge') value = sale_state.percentageOfGlobalSurchargeInput
        else errorAlert('Error. Cierre la ventana de descuentos y recargos e inténtelo de nuevo.')
        const fixedValue = parseFloat(value)
        if (percentageType === 'discount') {
            sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_PERCENT', payload: fixedValue })
            sale_dispatch({ type: 'SET_GLOBAL_SURCHARGE_PERCENT', payload: 0 })
        } else {
            sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_PERCENT', payload: 0 })
            sale_dispatch({ type: 'SET_GLOBAL_SURCHARGE_PERCENT', payload: fixedValue })
        }
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION', payload: percentageType })
        sale_dispatch({ type: 'HIDE_DISCOUNT_SURCHARGE_MODAL' })
        sale_dispatch({ type: 'SET_TOTAL' })
    }

    const buttonToSave = (
        <Button
            id='buttonToSaveDiscountSurchargeModal'
            onClick={save}
            onKeyUp={buttonActionsWithKeyboard}
            style={{ width: '100%' }}
            type='primary'
        >
            Aceptar
        </Button>
    )

    // ----------------- Input percentage ---------------- //
    const changePercentage = (e) => {
        const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
        const fieldStatus = { ...sale_state.fieldStatus, percentage: invalidStatusOfPercentage(currentValue) ? 'error' : null }
        sale_dispatch({ type: 'SET_FIELD_STATUS', payload: fieldStatus })
        let prevValue
        const percentageType = sale_state.discountSurchargeModalActiveOptionInput
        if (percentageType === 'discount') prevValue = sale_state.percentageOfGlobalDiscountInput
        else if (percentageType === 'surcharge') prevValue = sale_state.percentageOfGlobalSurchargeInput
        else errorAlert('Error. Cierre la ventana de descuentos y recargos e inténtelo de nuevo.')
        const fixedValue = fixInputNumber(currentValue, prevValue)
        sale_dispatch({
            type: percentageType === 'discount'
                ? 'SET_PERCENTAGE_OF_GLOBAL_DISCOUNT_INPUT'
                : 'SET_PERCENTAGE_OF_GLOBAL_SURCHARGE_INPUT',
            payload: !fixedValue ? '' : fixedValue
        })
    }

    const inputPercentage = (
        <>
            <Input
                color='primary'
                id='inputPercentageOfDiscountAndSurchargeModal'
                onKeyUp={buttonActionsWithKeyboard}
                onChange={changePercentage}
                placeholder='Ingrese el porcentaje de modificación'
                status={sale_state.fieldStatus.percentage}
                style={{ width: '100%' }}
                value={
                    sale_state.discountSurchargeModalActiveOptionInput === 'discount'
                        ? sale_state.percentageOfGlobalDiscountInput
                        : sale_state.percentageOfGlobalSurchargeInput
                }
            />
            <span
                style={{
                    color: 'red',
                    display: sale_state.fieldStatus.percentage === 'error' ? 'block' : 'none'
                }}
            >
                {
                    sale_state.discountSurchargeModalActiveOptionInput === 'discount'
                        ? 'Escribe un porcentaje válido entre cero y 100.'
                        : 'Escribe un porcentaje válido mayor que cero.'
                }
            </span>
        </>
    )

    // -------------- Select percentage type ------------- //
    const selectTypePercentage = (e) => {
        const fieldStatus = { ...sale_state.fieldStatus, percentageType: invalidStatusOfPercentageType(e) ? 'error' : null }
        sale_dispatch({ type: 'SET_FIELD_STATUS', payload: fieldStatus })
        const discount = sale_state.percentageOfGlobalDiscountInput
        const surcharge = sale_state.percentageOfGlobalSurchargeInput
        if (e === 'discount') {
            sale_dispatch({ type: 'SET_PERCENTAGE_OF_GLOBAL_DISCOUNT_INPUT', payload: surcharge })
            sale_dispatch({ type: 'SET_PERCENTAGE_OF_GLOBAL_SURCHARGE_INPUT', payload: '0' })
        } else {
            sale_dispatch({ type: 'SET_PERCENTAGE_OF_GLOBAL_SURCHARGE_INPUT', payload: discount })
            sale_dispatch({ type: 'SET_PERCENTAGE_OF_GLOBAL_DISCOUNT_INPUT', payload: '0' })
        }
        sale_dispatch({ type: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION_INPUT', payload: e })
    }

    const selectPercentageType = (
        <>
            <Select
                id='selectPercentageTypeOfDiscountAndSurchargeModal'
                onChange={selectTypePercentage}
                onKeyUp={buttonActionsWithKeyboard}
                options={sale_state.discountSurchargeModalOptions}
                style={{ width: '100%' }}
                value={sale_state.discountSurchargeModalActiveOptionInput}
            />
            <span
                style={{
                    color: 'red',
                    display: sale_state.fieldStatus.percentageType === 'error' ? 'block' : 'none'
                }}
            >
                Elige descuento/recargo.
            </span>
        </>
    )


    const itemsToRender = [
        {
            element: buttonToCancel,
            order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 3, xxl: 3 }
        },
        {
            element: buttonToSave,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: inputPercentage,
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        },
        {
            element: selectPercentageType,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 24 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Modal
            afterOpenChange={setFocus}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            forceRender
            id='discountSurchargeModal'
            okButtonProps={{ style: { display: 'none' } }}
            open={sale_state.discountSurchargeModalVisible}
            title='Agregar descuento o recargo a la factura'
            width={1200}
        >
            <Row
                gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
                justify='space-around'
            >
                {
                    itemsToRender.map((item, index) => {
                        return (
                            <Col
                                key={'discountSurchargeModal_itemsToRender_' + index}
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

export default DiscountSurchargeModal