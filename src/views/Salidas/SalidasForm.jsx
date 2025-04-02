// React Components and Hooks
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import icons from '../../components/icons'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Input, Row, Select, Spin, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { useDeleteModalContext } = contexts.DeleteModal
const { useOutputsContext } = contexts.Outputs
const { localFormatToDateObj, numberOrderDate, resetDateTo00hs, simpleDateWithHours } = helpers.dateHelper
const { round } = helpers.mathHelper
const { fixInputNumber, nonCaseSensitive, normalizeString, regExp } = helpers.stringHelper
const { Delete } = icons
const { ifNotNumbersCommaAndPoint } = regExp

const findStatisticByStringDate = async (stringDate) => {
    const filters = JSON.stringify({ dateString: stringDate.substring(0, 10) })
    const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
    const statisticToEdit = findStatisticToEdit.docs[0] || null
    return statisticToEdit
}


const SalidasForm = () => {
    const outputID = useLocation().pathname.replace('/salidas/', '')
    const navigate = useNavigate()
    const [deleteModal_state] = useDeleteModalContext()
    const [outputs_state, outputs_dispatch] = useOutputsContext()

    const returnToIndex = () => { navigate('/salidas') }

    // ---------------------- Actions -------------------- //
    const focusOnButtonToCancelWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            outputs_state.refs.buttonToCancel.focus()
        } else return
    }

    const loadParams = async () => {
        if (outputID !== 'nuevo') {
            const response = await api.salidas.findById(outputID)
            outputs_dispatch({ type: 'SET_PARAMS', payload: response.data })
        } else {
            const usuario = localStorage.getItem('userId')
            const newParams = { ...outputs_state.params, usuario }
            outputs_dispatch({ type: 'SET_PARAMS', payload: newParams })
        }
    }

    const loadRefs = () => {
        const refs = {
            buttonToCancel: document.getElementById('outputsForm_buttonToCancel'),
            buttonToSave: document.getElementById('outputsForm_buttonToSave'),
            datePicker: document.getElementById('outputsForm_datePicker'),
            inputDescription: document.getElementById('outputsForm_inputDescription'),
            selectToAddProductByBarcode: document.getElementById('outputsForm_selectToAddProductByBarcode'),
            selectToAddProductByName: document.getElementById('outputsForm_selectToAddProductByName')
        }
        outputs_dispatch({ type: 'SET_REFS', payload: refs })
    }

    const productHasNoQuantity = (product) => {
        const quantityNotExists = (
            !product.cantidadesSalientes
            || product.cantidadesSalientes === '0'
            || product.cantidadesSalientes === ''
            || product.cantidadesSalientes === 0
        )
        if (quantityNotExists) return true
        else return false
    }

    const returnToIndexWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            returnToIndex()
        } else return
    }

    const setFocus = () => {
        const productsWithoutDefindedQuantity = outputs_state.params.productos
            .filter(product => productHasNoQuantity(product))
        const firstProductWithoutDefindedQuantity = outputs_state.params.productos
            .find(product => productHasNoQuantity(product))
        let unfilledField
        if (outputs_state.params.descripcion === '') unfilledField = outputs_state.refs.inputDescription
        else if (!outputs_state.params.fecha) unfilledField = outputs_state.refs.datePicker
        else if (outputs_state.params.productos.length === 0) unfilledField = outputs_state.refs.selectToAddProductByName
        else if (productsWithoutDefindedQuantity.length > 0) unfilledField = document.getElementById(firstProductWithoutDefindedQuantity._id)
        else unfilledField = outputs_state.refs.buttonToSave
        unfilledField.focus()
    }

    const updateLoading = () => {
        if (!outputs_state.params.usuario) outputs_dispatch({ type: 'SET_LOADING', payload: true })
        outputs_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const updateState = () => {
        outputs_dispatch({ type: 'CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY' })
    }

    /* eslint-disable */
    useEffect(() => { loadParams() }, [outputID])
    useEffect(() => { loadRefs() }, [])
    useEffect(() => { updateLoading() }, [outputs_state.params.usuario])
    useEffect(() => { updateState() }, [outputs_state.params.cantidad, outputs_state.params.productos])
    /* eslint-enable */

    // ----------------- Button to cancel ---------------- //
    const buttonToCancel = (
        <Button
            danger
            id='outputsForm_buttonToCancel'
            onClick={returnToIndex}
            onKeyUp={returnToIndexWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // ----------------- Button to save ------------------ //
    const validateSave = () => {
        const quantityOfSelectedProducts = outputs_state.params.productos.length
        if (quantityOfSelectedProducts === 0) {
            errorAlert('¡Debes seleccionar al menos un producto!')
            return 'FAIL'
        }
        for (const product of outputs_state.params.productos) {
            if (productHasNoQuantity(product)) {
                errorAlert(`Indica una cantidad mayor que cero a: ${product.nombre}`)
                return 'FAIL'
            }
            product.cantidadesSalientes = parseFloat(product.cantidadesSalientes)
        }
        if (outputs_state.params.descripcion === '') outputs_state.params.descripcion = '-- Sin descripción --'
        return 'OK'
    }

    const generateNewStatistic = () => {
        const newStatistic = {
            balanceViewExpense: 0,
            balanceViewIncome: parseFloat(outputs_state.params.ingreso),
            balanceViewProfit: parseFloat(outputs_state.params.ingreso),
            concept: 'Generado automáticamente',
            date: localFormatToDateObj(outputs_state.params.fechaString.substring(0, 10)),
            dateOrder: numberOrderDate(outputs_state.params.fechaString.substring(0, 10)),
            dateString: outputs_state.params.fechaString.substring(0, 10),
            salesViewExpense: 0,
            salesViewIncome: 0,
            salesViewProfit: 0
        }
        return newStatistic
    }

    const generateStockHistory = async () => {
        for (const product of outputs_state.params.productos) {
            const dateString = outputs_state.params.fechaString.substring(0, 10)
            const filters = JSON.stringify({ dateString, product })
            const findStockHistory = await api.stockHistory.findAllByFilters(filters)
            const stockHistory = findStockHistory.docs
            let saveResponseCode
            const data = {
                date: resetDateTo00hs(outputs_state.params.fecha),
                dateString,
                itIsAManualCorrection: false,
                product: product._id
            }
            if (stockHistory.length < 1) {
                data.entries = 0
                data.outputs = round(outputs_state.params.cantidad)
                const saveNewRecord = await api.stockHistory.save(data)
                saveResponseCode = saveNewRecord.code
            } else {
                data._id = stockHistory[0]._id
                data.entries = round(stockHistory[0].entries)
                data.outputs = round(stockHistory[0].outputs) + round(outputs_state.params.cantidad)
                if (outputID !== 'nuevo') {
                    const outputToEdit = await api.salidas.findById(outputID)
                    const previousQuantity = round(outputToEdit.data.cantidad)
                    data.outputs -= previousQuantity
                }
                const editRecord = await api.stockHistory.edit(data)
                saveResponseCode = editRecord.code
            }
            if (saveResponseCode !== 200) errorAlert(`No se pudo generar el historial de stock para el producto "${product.nombre}". Cree el registro manualmente en la sección "Estadísticas de Negocio" / "Historial de Stock".`)
        }
    }

    const saveNew = async () => {
        const result = validateSave()
        if (result === 'FAIL') return
        
        // Corregir historial de stock de productos pertenecientes a la salida
        generateStockHistory()

        // Corregir stock de productos pertenecientes a la salida
        for (const product of outputs_state.params.productos) {
            await api.productos.modifyStock({
                product,
                isIncrement: false,
                quantity: round(product.cantidadesSalientes)
            })
        }

        // Corregir o crear la estadística diaria correspondiente a la fecha de la salida
        const statisticToEdit = await findStatisticByStringDate(outputs_state.params.fechaString)
        if (statisticToEdit) {
            const currentBalanceViewExpense = parseFloat(statisticToEdit.balanceViewExpense)
            const currentBalanceViewIncome = parseFloat(statisticToEdit.balanceViewIncome)
            const newAddedBalanceViewIncome = parseFloat(outputs_state.params.ingreso)
            const balanceViewIncome = round(currentBalanceViewIncome + newAddedBalanceViewIncome)
            const balanceViewProfit = round(balanceViewIncome - currentBalanceViewExpense)
            const updatedStatistic = {
                ...statisticToEdit,
                balanceViewIncome,
                balanceViewProfit
            }
            await api.dailyBusinessStatistics.edit(updatedStatistic)
        } else {
            const newStatistic = generateNewStatistic()
            await api.dailyBusinessStatistics.save(newStatistic)
        }

        // Guardar la salida nueva
        const response = await api.salidas.save(outputs_state.params)
        if (response.code === 200) {
            successAlert('El registro se guardó correctamente')
            outputs_dispatch({ type: 'CLEAN_STATE' })
            returnToIndex()
        } else errorAlert('Fallo al guardar el registro. Intente de nuevo.')
    }

    const saveEdit = async () => {
        const result = validateSave()
        if (result === 'FAIL') return

        // Datos necesarios para corregir el stock y las estadísticas diarias
        const findOutputToEdit = await api.salidas.findById(outputID)
        const outputToEdit = findOutputToEdit.data

        // Corregir historial de stock de productos pertenecientes a la salida
        generateStockHistory()

        // Corregir stock de productos pertenecientes a la salida
        for (let product of outputs_state.params.productos) {
            const productOfOutputToEdit = outputToEdit.productos.find(el => el._id === product._id)
            if (productOfOutputToEdit && productOfOutputToEdit.cantidadesSalientes !== product.cantidadesSalientes) {
                const findProductToModifyStock = await api.productos.findById(product._id)
                const productToModifyStock = findProductToModifyStock.data
                productToModifyStock.cantidadStock += productOfOutputToEdit.cantidadesSalientes
                productToModifyStock.cantidadStock -= parseFloat(product.cantidadesSalientes)
                await api.productos.edit(productToModifyStock)
            } else {
                await api.productos.modifyStock({
                    product,
                    isIncrement: false,
                    quantity: round(product.cantidadesSalientes)
                })
            }
        }
        
        // Corregir la estadística diaria correspondiente a la fecha de la salida
        const dateChanged = outputToEdit.fechaString.substring(0, 10) !== outputs_state.params.fechaString.substring(0, 10)
        const previousStatisticToEdit = await findStatisticByStringDate(outputToEdit.fechaString)
        if (previousStatisticToEdit && dateChanged) {
            const balanceViewIncome = parseFloat(previousStatisticToEdit.balanceViewIncome) - parseFloat(outputs_state.params.ingreso)
            const balanceViewProfit = parseFloat(balanceViewIncome) - parseFloat(previousStatisticToEdit.balanceViewExpense)
            const edittedPreviousStatistic = {
                ...previousStatisticToEdit,
                balanceViewIncome,
                balanceViewProfit
            }
            await api.dailyBusinessStatistics.edit(edittedPreviousStatistic)
        }
        const statisticToEdit = await findStatisticByStringDate(outputs_state.params.fechaString)
        if (statisticToEdit) {
            const incomeFromOutputToEdit = parseFloat(outputToEdit.ingreso)
            const currentBalanceViewExpense = parseFloat(statisticToEdit.balanceViewExpense)
            const currentBalanceViewIncome = parseFloat(statisticToEdit.balanceViewIncome)
            const newAddedBalanceViewIncome = parseFloat(outputs_state.params.ingreso)
            const balanceViewIncome = round(
                currentBalanceViewIncome
                - (!dateChanged ? incomeFromOutputToEdit : 0)
                + newAddedBalanceViewIncome
            )
            const balanceViewProfit = round(balanceViewIncome - currentBalanceViewExpense)
            const editedStatistic = {
                ...statisticToEdit,
                balanceViewIncome,
                balanceViewProfit
            }
            await api.dailyBusinessStatistics.edit(editedStatistic)
        } else {
            const newStatistic = generateNewStatistic()
            await api.dailyBusinessStatistics.save(newStatistic)
        }

        // Guardar la salida editada
        const recordToEdit = { ...outputs_state.params, id: outputID }
        const response = await api.salidas.edit(recordToEdit)
        if (response.code === 200) {
            successAlert('El registro se editó correctamente')
            outputs_dispatch({ type: 'CLEAN_STATE' })
            returnToIndex()
        } else {
            errorAlert('Fallo al editar el registro. Intente de nuevo.')
        }
    }

    const save = () => {
        if (outputID === 'nuevo') saveNew()
        else saveEdit()
    }

    const buttonToSave = (
        <Button
            id='outputsForm_buttonToSave'
            onClick={save}
            onKeyUp={focusOnButtonToCancelWhenPressingEsc}
            style={{ width: '100%' }}
            type='primary'
        >
            Guardar
        </Button>
    )

    // ------------------- Date picker ------------------- //
    const onChangeDate = (e) => {
        const params = {
            ...outputs_state.params,
            fecha: e ? new Date(e.$d) : new Date(),
            fechaString: e ? simpleDateWithHours(new Date(e.$d)) : simpleDateWithHours(new Date())
        }
        outputs_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    const onKeyUpDatePicker = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            setFocus()
        } else if (e.keyCode === 27) { // Escape
            e.preventDefault()
            focusOnButtonToCancelWhenPressingEsc(e)
        }
        else return
    }

    const datePicker = (
        <DatePicker
            format={['DD/MM/YYYY']}
            id='outputsForm_datePicker'
            onChange={onChangeDate}
            onKeyUp={onKeyUpDatePicker}
            style={{ width: '100%' }}
            value={outputs_state.datePickerValue}
        />
    )

    // ---------------- Input description ---------------- //
    const onChangeDescription = (e) => {
        const params = { ...outputs_state.params, descripcion: e.target.value }
        outputs_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    const onKeyUpDescription = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            if (outputs_state.params.descripcion === '') {
                const params = { ...outputs_state.params, descripcion: '-- Sin descripción --' }
                outputs_dispatch({ type: 'SET_PARAMS', payload: params })
            }
            setFocus()
        } else if (e.keyCode === 27) { // Escape
            e.preventDefault()
            focusOnButtonToCancelWhenPressingEsc(e)
        } else return
    }

    const inputDescription = (
        <Input
            allowClear
            autoFocus
            id='outputsForm_inputDescription'
            onChange={onChangeDescription}
            onKeyUp={onKeyUpDescription}
            placeholder='Descripción'
            value={outputs_state.params.descripcion}
        />
    )

    // -------- Select to add product by barcode --------- //
    const onKeyUpSelectToAddProductByBarcode = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            setFocus()
        } else return
    }

    const onSearchProductByBarcode = async (e) => {
        const filters = JSON.stringify({ normalizedBarcode: normalizeString(e) })
        const params = { page: 1, limit: 15, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsAlreadySelected = outputs_state.params.productos.map(product => product.normalizedBarcode)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedBarcode))
        const options = productsNotYetSelected.map(product => {
            return {
                label: product.codigoBarras + ` (${product.nombre})`,
                value: product.normalizedBarcode
            }
        })
        outputs_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: options })
    }

    const onSelectProductByBarcode = async (e) => {
        const filters = JSON.stringify({ normalizedBarcode: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsToSet = [...outputs_state.params.productos, ...products]
        outputs_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        outputs_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: [] })
        outputs_state.refs.selectToAddProductByBarcode.focus()
    }

    const selectToAddProductByBarcode = (
        <Select
            allowClear
            id='outputsForm_selectToAddProductByBarcode'
            onKeyUp={onKeyUpSelectToAddProductByBarcode}
            onSearch={onSearchProductByBarcode}
            onSelect={onSelectProductByBarcode}
            options={outputs_state.selectToAddProductByBarcode.options}
            placeholder='Buscar producto por cód. barras'
            showSearch
            style={{ width: '100%' }}
            value={outputs_state.selectToAddProductByBarcode.selectedValue}
        />
    )

    // ---------- Select to add product by name ---------- //
    const onKeyUpSelectToAddProductByName = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            setFocus()
        } else return
    }

    const onSearchProductByName = async (e) => {
        const filters = JSON.stringify({ normalizedName: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findProducts = await api.productos.findPaginated(params)
        const products = findProducts.docs
        const productsAlreadySelected = outputs_state.params.productos.map(product => product.normalizedName)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedName))
        const options = productsNotYetSelected.map(product => { return { label: product.nombre, value: product.normalizedName } })
        outputs_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: options })
    }

    const onSelectProductByName = async (e) => {
        const filters = JSON.stringify({ normalizedName: e })
        const findProducts = await api.productos.findAllByFilters(filters)
        const products = findProducts.docs
        const productsToSet = [...outputs_state.params.productos, ...products]
        outputs_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        outputs_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: [] })
        outputs_state.refs.selectToAddProductByName.focus()
    }

    const selectToAddProductByName = (
        <Select
            allowClear
            filterOption={nonCaseSensitive}
            id='outputsForm_selectToAddProductByName'
            onKeyUp={onKeyUpSelectToAddProductByName}
            onSearch={onSearchProductByName}
            onSelect={onSelectProductByName}
            options={outputs_state.selectToAddProductByName.options}
            placeholder='Buscar producto por nombre'
            showSearch
            style={{ width: '100%' }}
            value={outputs_state.selectToAddProductByName.selectedValue}
        />
    )

    // ----------- Table of selected products  ----------- //
    const changeQuantity = (e, product) => {
        const productsEditted = outputs_state.params.productos.map(productInState => {
            if (productInState._id === product._id) {
                const prevValue = productInState?.cantidadesSalientes ?? ''
                const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
                const fixedValue = fixInputNumber(currentValue, prevValue)
                productInState.cantidadesSalientes = fixedValue
            }
            return productInState
        })
        const params = { ...outputs_state.params, productos: productsEditted }
        outputs_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    const deleteProduct = (product) => {
        const remainingProducts = outputs_state.params.productos
            .filter(currentProduct => currentProduct._id !== product._id)
        outputs_dispatch({ type: 'SET_PRODUCTS', payload: remainingProducts })
    }

    const onKeyUpProductQuantity = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            setFocus()
        } else if (e.keyCode === 27) { // Escape
            e.preventDefault()
            outputs_state.refs.buttonToCancel.focus()
        } else return
    }

    const tableOfSelectedProductsColumns = [
        {
            align: 'start',
            dataIndex: 'output_productBarcode',
            key: 'output_productBarcode',
            render: (_, product) => product.codigoBarras,
            title: 'Código de barras'
        },
        {
            align: 'start',
            dataIndex: 'output_productName',
            key: 'output_productName',
            render: (_, product) => product.nombre,
            title: 'Producto'
        },
        {
            align: 'start',
            dataIndex: 'output_productQuantity',
            key: 'output_productQuantity',
            render: (_, product) => (
                <Input
                    id={product._id}
                    onChange={e => changeQuantity(e, product)}
                    onKeyUp={onKeyUpProductQuantity}
                    value={product.cantidadesSalientes}
                />
            ),
            title: 'Cantidad'
        },
        {
            align: 'start',
            dataIndex: 'output_deleteProduct',
            key: 'output_deleteProduct',
            render: (_, product) => (
                <div onClick={() => deleteProduct(product)}>
                    <Delete />
                </div>
            ),
            title: 'Eliminar producto'
        }
    ]

    const tableOfSelectedProducts = (
        <Table
            columns={tableOfSelectedProductsColumns}
            dataSource={outputs_state.params.productos}
            rowKey='_id'
        />
    )

    // -------------- Title of total cost  --------------- //
    const titleOfNetProfit = <h1>Ingreso Total: {round(outputs_state.params.ingreso)}</h1>


    const itemsToRender = [
        {
            element: datePicker,
            order: { lg: 4, md: 2, sm: 2, xl: 4, xs: 2, xxl: 4 }
        },
        {
            element: inputDescription,
            order: { lg: 2, md: 1, sm: 1, xl: 2, xs: 1, xxl: 2 }
        },
        {
            element: selectToAddProductByBarcode,
            order: { lg: 3, md: 4, sm: 4, xl: 3, xs: 4, xxl: 3 }
        },
        {
            element: selectToAddProductByName,
            order: { lg: 1, md: 3, sm: 3, xl: 1, xs: 3, xxl: 1 }
        }
    ]

    const responsiveGrid = {
        formGutter: { horizontal: 0, vertical: 16 },
        headGutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 24, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }


    return (
        <Row>
            <Col span={24}>
                <h1>{outputID === 'nuevo' ? 'Nueva salida' : 'Editar salida'}</h1>
            </Col>
            <Col span={24}>
                {
                    deleteModal_state.loading
                        ? <Spin />
                        : (
                            <Row
                                gutter={[
                                    responsiveGrid.formGutter.horizontal,
                                    responsiveGrid.formGutter.vertical
                                ]}
                            >
                                <Col span={24}>
                                    <Row
                                        gutter={[
                                            responsiveGrid.headGutter.horizontal,
                                            responsiveGrid.headGutter.vertical
                                        ]}
                                    >
                                        {
                                            itemsToRender.map((item, index) => {
                                                return (
                                                    <Col
                                                        key={'outputsForm_itemsToRender_' + index}
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
                                </Col>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    {titleOfNetProfit}
                                </Col>
                                <Col span={24}>
                                    {tableOfSelectedProducts}
                                </Col>
                                <Col span={24}>
                                    <Row justify='space-around'>
                                        <Col span={6}>
                                            {buttonToCancel}
                                        </Col>
                                        <Col span={6}>
                                            {buttonToSave}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )
                }
            </Col>
        </Row>
    )
}

export default SalidasForm