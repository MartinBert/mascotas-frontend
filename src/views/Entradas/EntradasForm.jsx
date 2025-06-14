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
const { useEntriesContext } = contexts.Entries
const { localFormat, localFormatToDateObj, numberOrderDate, resetDateTo00hs, simpleDateWithHours } = helpers.dateHelper
const { round } = helpers.mathHelper
const { fixInputNumber, nonCaseSensitive, normalizeString, regExp } = helpers.stringHelper
const { Delete } = icons
const { ifNotNumbersCommaAndPoint } = regExp

const findStatisticByStringDate = async (stringDate) => {
    const filters = JSON.stringify({ dateString: stringDate.substring(0, 10) })
    const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
    const statisticToEdit = findStatisticToEdit.data.docs[0] || null
    return statisticToEdit
}


const EntradasForm = () => {
    const entryID = useLocation().pathname.replace('/entradas/', '')
    const navigate = useNavigate()
    const [deleteModal_state] = useDeleteModalContext()
    const [entries_state, entries_dispatch] = useEntriesContext()

    const returnToIndex = () => { navigate('/entradas') }

    // ---------------------- Actions -------------------- //
    const focusOnButtonToCancelWhenPressingEsc = (e) => {
        if (e.keyCode === 27) { // Escape
            e.preventDefault()
            entries_state.refs.buttonToCancel.focus()
        } else return
    }

    const loadParams = async () => {
        if (entryID !== 'nuevo') {
            const response = await api.entries.findById(entryID)
            entries_dispatch({ type: 'SET_PARAMS', payload: response.data })
        } else {
            const usuario = localStorage.getItem('userId')
            const newParams = { ...entries_state.params, usuario }
            entries_dispatch({ type: 'SET_PARAMS', payload: newParams })
        }
    }

    const loadRefs = () => {
        const refs = {
            buttonToCancel: document.getElementById('entriesForm_buttonToCancel'),
            buttonToSave: document.getElementById('entriesForm_buttonToSave'),
            datePicker: document.getElementById('entriesForm_datePicker'),
            inputDescription: document.getElementById('entriesForm_inputDescription'),
            selectToAddProductByBarcode: document.getElementById('entriesForm_selectToAddProductByBarcode'),
            selectToAddProductByName: document.getElementById('entriesForm_selectToAddProductByName')
        }
        entries_dispatch({ type: 'SET_REFS', payload: refs })
    }

    const productHasNoQuantity = (product) => {
        const quantityNotExists = (
            !product.cantidadesEntrantes
            || product.cantidadesEntrantes === '0'
            || product.cantidadesEntrantes === ''
            || product.cantidadesEntrantes === 0
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
        const productsWithoutDefindedQuantity = entries_state.params.productos
            .filter(product => productHasNoQuantity(product))
        const firstProductWithoutDefindedQuantity = entries_state.params.productos
            .find(product => productHasNoQuantity(product))
        let unfilledField
        if (entries_state.params.descripcion === '') unfilledField = entries_state.refs.inputDescription
        else if (!entries_state.params.fecha) unfilledField = entries_state.refs.datePicker
        else if (entries_state.params.productos.length === 0) unfilledField = entries_state.refs.selectToAddProductByName
        else if (productsWithoutDefindedQuantity.length > 0) unfilledField = document.getElementById(firstProductWithoutDefindedQuantity._id)
        else unfilledField = entries_state.refs.buttonToSave
        unfilledField.focus()
    }

    const updateLoading = () => {
        if (!entries_state.params.usuario) entries_dispatch({ type: 'SET_LOADING', payload: true })
        entries_dispatch({ type: 'SET_LOADING', payload: false })
    }

    const updateState = () => {
        entries_dispatch({ type: 'CALCULATE_ENTRY_TOTAL_COST_AND_PRODUCTS_QUANTITY' })
    }

    /* eslint-disable */
    useEffect(() => { loadRefs() }, [])
    useEffect(() => { loadParams() }, [entryID])
    useEffect(() => { updateLoading() }, [entries_state.params.usuario])
    useEffect(() => { updateState() }, [entries_state.params.cantidad, entries_state.params.productos])
    /* eslint-enable */

    // ----------------- Button to cancel ---------------- //
    const buttonToCancel = (
        <Button
            danger
            id='entriesForm_buttonToCancel'
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
        const quantityOfSelectedProducts = entries_state.params.productos.length
        if (quantityOfSelectedProducts === 0) {
            errorAlert('¡Debes seleccionar al menos un producto!')
            return 'FAIL'
        }
        for (const product of entries_state.params.productos) {
            if (productHasNoQuantity(product)) {
                errorAlert(`Indica una cantidad mayor que cero a: ${product.nombre}`)
                return 'FAIL'
            }
            product.cantidadesEntrantes = parseFloat(product.cantidadesEntrantes)
        }
        if (entries_state.params.descripcion === '') entries_state.params.descripcion = '-- Sin descripción --'
        return 'OK'
    }

    const fillPreviousDates = async () => {
        const currentDate = localFormatToDateObj(entries_state.params.fechaString.substring(0, 10))
        const newerRecord = await api.dailyBusinessStatistics.findNewer()
        const newerRecordDate = newerRecord.data.date
        const differenceOfDaysBetweenNewerRecordDateAndCurrentDate = round(
            (Date.parse(currentDate) - Date.parse(newerRecordDate)) / 86400000
        )
        let filled = false
        if (differenceOfDaysBetweenNewerRecordDateAndCurrentDate < 2) filled = true
        else {
            const recordsToFill = []
            for (let index = 1; index < differenceOfDaysBetweenNewerRecordDateAndCurrentDate; index++) {
                const recordDate = new Date(Date.parse(newerRecordDate) + index * 86400000)
                const recordToFill = {
                    balanceViewExpense: 0,
                    balanceViewIncome: 0,
                    balanceViewProfit: 0,
                    concept: 'Generado automáticamente',
                    date: recordDate,
                    dateOrder: numberOrderDate(localFormat(recordDate)),
                    dateString: localFormat(recordDate),
                    salesViewExpense: 0,
                    salesViewIncome: 0,
                    salesViewProfit: 0
                }
                recordsToFill.push(recordToFill)
            }
            const response = await api.dailyBusinessStatistics.save(recordsToFill)
            if (!response || response.status !== 'OK') filled = false
            else filled = true
        }
        return filled
    }

    const generateNewStatistic = () => {
        const newStatistic = {
            balanceViewExpense: parseFloat(entries_state.params.costoTotal),
            balanceViewIncome: 0,
            balanceViewProfit: - parseFloat(entries_state.params.costoTotal),
            concept: 'Generado automáticamente',
            date: localFormatToDateObj(entries_state.params.fechaString.substring(0, 10)),
            dateOrder: numberOrderDate(entries_state.params.fechaString.substring(0, 10)),
            dateString: entries_state.params.fechaString.substring(0, 10),
            salesViewExpense: 0,
            salesViewIncome: 0,
            salesViewProfit: 0
        }
        return newStatistic
    }

    const generateStockHistory = async () => {
        for (const product of entries_state.params.productos) {
            const dateString = entries_state.params.fechaString.substring(0, 10)
            const filters = JSON.stringify({ dateString, product })
            const findStockHistory = await api.stockHistory.findAllByFilters(filters)
            const stockHistory = findStockHistory.data.docs
            let response
            const data = {
                date: resetDateTo00hs(entries_state.params.fecha),
                dateString,
                itIsAManualCorrection: false,
                product: product._id
            }
            if (stockHistory.length < 1) {
                data.entries = round(entries_state.params.cantidad)
                data.outputs = 0
                response = await api.stockHistory.save(data)
            } else {
                data._id = stockHistory[0]._id
                data.entries = round(stockHistory[0].entries) + round(entries_state.params.cantidad)
                if (entryID !== 'nuevo') {
                    const entryToEdit = await api.entries.findById(entryID)
                    const previousQuantity = round(entryToEdit.data.cantidad)
                    data.entries -= previousQuantity
                }
                data.outputs = round(stockHistory[0].outputs)
                response = await api.stockHistory.edit(data)
            }
            if (response.status !== 'OK') errorAlert(`No se pudo generar el historial de stock para el producto "${product.nombre}". Cree el registro manualmente en la sección "Estadísticas de Negocio" / "Historial de Stock".`)
        }
    }

    const saveNew = async () => {
        const result = validateSave()
        if (result === 'FAIL') return

        // Corregir historial de stock de productos pertenecientes a la salida
        generateStockHistory()

        // Corregir stock de productos pertenecientes a la entrada
        for (const product of entries_state.params.productos) {
            await api.products.modifyStock({
                product,
                isIncrement: true,
                quantity: round(product.cantidadesEntrantes)
            })
        }

        // Corregir o crear la estadística diaria correspondiente a la fecha de la entrada
        const statisticToEdit = await findStatisticByStringDate(entries_state.params.fechaString)
        if (statisticToEdit) {
            const filledPreviousDates = await fillPreviousDates()
            if (!filledPreviousDates) errorAlert('No se pudieron generar las estadísticas de negocio anteriores a la fecha. Contacte con su proveedor.')
            else {
                const currentBalanceViewExpense = statisticToEdit.balanceViewExpense
                const currentBalanceViewIncome = statisticToEdit.balanceViewIncome
                const newAddedBalanceViewExpense = parseFloat(entries_state.params.costoTotal)
                const balanceViewExpense = round(currentBalanceViewExpense + newAddedBalanceViewExpense)
                const balanceViewProfit = round(currentBalanceViewIncome - balanceViewExpense)
                const updatedStatistic = {
                    ...statisticToEdit,
                    balanceViewExpense,
                    balanceViewProfit
                }
                await api.dailyBusinessStatistics.edit(updatedStatistic)
            }
        } else {
            const filledPreviousDates = await fillPreviousDates()
            if (!filledPreviousDates) errorAlert('No se pudieron generar las estadísticas de negocio anteriores a la fecha. Contacte con su proveedor.')
            const newStatistic = generateNewStatistic()
            await api.dailyBusinessStatistics.save(newStatistic)
        }

        // Guardar la entrada nueva
        const response = await api.entries.save(entries_state.params)
        if (response.status === 'OK') {
            successAlert('El registro se guardó correctamente')
            entries_dispatch({ type: 'CLEAN_STATE' })
            returnToIndex()
        } else errorAlert('Fallo al guardar el registro. Intente de nuevo.')
    }

    const saveEdit = async () => {
        const result = validateSave()
        if (result === 'FAIL') return

        // Datos necesarios para corregir el stock y las estadísticas diarias
        const findEntryToEdit = await api.entries.findById(entryID)
        const entryToEdit = findEntryToEdit.data

        // Corregir historial de stock de productos pertenecientes a la salida
        generateStockHistory()

        // Corregir stock de productos pertenecientes a la entrada
        for (let product of entries_state.params.productos) {
            const productOfEntryToEdit = entryToEdit.productos.find(el => el._id === product._id)
            if (productOfEntryToEdit && productOfEntryToEdit.cantidadesEntrantes !== product.cantidadesEntrantes) {
                const removeWrongStockResponse = await api.products.modifyStock({
                    product,
                    isIncrement: false,
                    quantity: round(productOfEntryToEdit.cantidadesEntrantes)
                })
                if (removeWrongStockResponse.status !== 'OK') {
                    errorAlert('No se pudo remover el stock erróneo. Intente de nuevo.')
                } else {
                    const setCorrectedStockResponse = await api.products.modifyStock({
                        product,
                        isIncrement: true,
                        quantity: round(product.cantidadesEntrantes)
                    })
                    if (setCorrectedStockResponse.status !== 'OK') {
                        errorAlert('No se pudo guardar el stock corregido. Modifíquelo editando el producto.')
                    }
                }

            } else {
                await api.products.modifyStock({
                    product,
                    isIncrement: true,
                    quantity: round(product.cantidadesEntrantes)
                })
            }
        }

        // Corregir la estadística diaria correspondiente a la fecha de la entrada
        const dateChanged = entryToEdit.fechaString.substring(0, 10) !== entries_state.params.fechaString.substring(0, 10)
        const previousStatisticToEdit = await findStatisticByStringDate(entryToEdit.fechaString)
        if (previousStatisticToEdit && dateChanged) {
            const balanceViewExpense = round(previousStatisticToEdit.balanceViewExpense - parseFloat(entries_state.params.costoTotal))
            const balanceViewProfit = round(previousStatisticToEdit.balanceViewIncome - parseFloat(balanceViewExpense))
            const edittedPreviousStatistic = {
                ...previousStatisticToEdit,
                balanceViewExpense,
                balanceViewProfit
            }
            await api.dailyBusinessStatistics.edit(edittedPreviousStatistic)
        }
        const statisticToEdit = await findStatisticByStringDate(entries_state.params.fechaString)
        if (statisticToEdit) {
            const expenseFromEntryToEdit = entryToEdit.costoTotal
            const currentBalanceViewExpense = statisticToEdit.balanceViewExpense
            const currentBalanceViewIncome = statisticToEdit.balanceViewIncome
            const newAddedBalanceViewExpense = parseFloat(entries_state.params.costoTotal)
            const balanceViewExpense = round(
                currentBalanceViewExpense
                - (!dateChanged ? expenseFromEntryToEdit : 0)
                + newAddedBalanceViewExpense
            )
            const balanceViewProfit = round(currentBalanceViewIncome - balanceViewExpense)
            const editedStatistic = {
                ...statisticToEdit,
                balanceViewExpense,
                balanceViewProfit
            }
            await api.dailyBusinessStatistics.edit(editedStatistic)
        } else {
            const newStatistic = generateNewStatistic()
            await api.dailyBusinessStatistics.save(newStatistic)
        }

        // Guardar la entrada editada
        const recordToEdit = { ...entries_state.params, id: entryID }
        const response = await api.entries.edit(recordToEdit)
        if (response.status === 'OK') {
            successAlert('El registro se editó correctamente')
            entries_dispatch({ type: 'CLEAN_STATE' })
            returnToIndex()
        } else {
            errorAlert('Fallo al editar el registro. Intente de nuevo.')
        }
    }

    const save = () => {
        if (entryID === 'nuevo') saveNew()
        else saveEdit()
    }

    const buttonToSave = (
        <Button
            id='entriesForm_buttonToSave'
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
            ...entries_state.params,
            fecha: e ? new Date(e.$d) : new Date(),
            fechaString: e ? simpleDateWithHours(new Date(e.$d)) : simpleDateWithHours(new Date())
        }
        entries_dispatch({ type: 'SET_PARAMS', payload: params })
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
            id='entriesForm_datePicker'
            onChange={onChangeDate}
            onKeyUp={onKeyUpDatePicker}
            style={{ width: '100%' }}
            value={entries_state.datePickerValue}
        />
    )

    // ---------------- Input description ---------------- //
    const onChangeDescription = (e) => {
        const params = { ...entries_state.params, descripcion: e.target.value }
        entries_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    const onKeyUpDescription = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            if (entries_state.params.descripcion === '') {
                const params = { ...entries_state.params, descripcion: '-- Sin descripción --' }
                entries_dispatch({ type: 'SET_PARAMS', payload: params })
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
            id='entriesForm_inputDescription'
            onChange={onChangeDescription}
            onKeyUp={onKeyUpDescription}
            placeholder='Descripción'
            value={entries_state.params.descripcion}
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
        const findProducts = await api.products.findPaginated(params)
        const products = findProducts.data.docs
        const productsAlreadySelected = entries_state.params.productos.map(product => product.normalizedBarcode)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedBarcode))
        const options = productsNotYetSelected.map(product => {
            return {
                label: product.codigoBarras + ` (${product.nombre})`,
                value: product.normalizedBarcode
            }
        })
        entries_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: options })
    }

    const onSelectProductByBarcode = async (e) => {
        const filters = JSON.stringify({ normalizedBarcode: normalizeString(e) })
        const params = { page: 1, limit: 8, filters }
        const findProducts = await api.products.findPaginated(params)
        const products = findProducts.data.docs
        const productsToSet = [...entries_state.params.productos, ...products]
        entries_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        entries_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE', payload: [] })
        entries_state.refs.selectToAddProductByBarcode.focus()
    }

    const selectToAddProductByBarcode = (
        <Select
            allowClear
            id='entriesForm_selectToAddProductByBarcode'
            onKeyUp={onKeyUpSelectToAddProductByBarcode}
            onSearch={onSearchProductByBarcode}
            onSelect={onSelectProductByBarcode}
            options={entries_state.selectToAddProductByBarcode.options}
            placeholder='Buscar producto por cód. barras'
            showSearch
            style={{ width: '100%' }}
            value={entries_state.selectToAddProductByBarcode.selectedValue}
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
        const findProducts = await api.products.findPaginated(params)
        const products = findProducts.data.docs
        const productsAlreadySelected = entries_state.params.productos.map(product => product.normalizedName)
        const productsNotYetSelected = products.filter(product => !productsAlreadySelected.includes(product.normalizedName))
        const options = productsNotYetSelected.map(product => { return { label: product.nombre, value: product.normalizedName } })
        entries_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: options })
    }

    const onSelectProductByName = async (e) => {
        const filters = JSON.stringify({ normalizedName: e })
        const findProducts = await api.products.findAllByFilters(filters)
        const products = findProducts.data.docs
        const productsToSet = [...entries_state.params.productos, ...products]
        entries_dispatch({ type: 'SET_PRODUCTS', payload: productsToSet })
        entries_dispatch({ type: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME', payload: [] })
        entries_state.refs.selectToAddProductByName.focus()
    }

    const selectToAddProductByName = (
        <Select
            allowClear
            filterOption={nonCaseSensitive}
            id='entriesForm_selectToAddProductByName'
            onKeyUp={onKeyUpSelectToAddProductByName}
            onSearch={onSearchProductByName}
            onSelect={onSelectProductByName}
            options={entries_state.selectToAddProductByName.options}
            placeholder='Buscar producto por nombre'
            showSearch
            style={{ width: '100%' }}
            value={entries_state.selectToAddProductByName.selectedValue}
        />
    )

    // ----------- Table of selected products  ----------- //
    const changeQuantity = (e, product) => {
        const productsEditted = entries_state.params.productos.map(productInState => {
            if (productInState._id === product._id) {
                const prevValue = productInState?.cantidadesEntrantes ?? ''
                const currentValue = e.target.value.replace(ifNotNumbersCommaAndPoint, '')
                const fixedValue = fixInputNumber(currentValue, prevValue)
                productInState.cantidadesEntrantes = fixedValue
            }
            return productInState
        })
        const params = { ...entries_state.params, productos: productsEditted }
        entries_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    const deleteProduct = (product) => {
        const remainingProducts = entries_state.params.productos
            .filter(currentProduct => currentProduct._id !== product._id)
        entries_dispatch({ type: 'SET_PRODUCTS', payload: remainingProducts })
    }

    const onKeyUpProductQuantity = (e) => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault()
            setFocus()
        } else if (e.keyCode === 27) { // Escape
            e.preventDefault()
            entries_state.refs.buttonToCancel.focus()
        } else return
    }

    const tableOfSelectedProductsColumns = [
        {
            align: 'start',
            dataIndex: 'entry_productBarcode',
            key: 'entry_productBarcode',
            render: (_, product) => product.codigoBarras,
            title: 'Código de barras'
        },
        {
            align: 'start',
            dataIndex: 'entry_productName',
            key: 'entry_productName',
            render: (_, product) => product.nombre,
            title: 'Producto'
        },
        {
            align: 'start',
            dataIndex: 'entry_productQuantity',
            key: 'entry_productQuantity',
            render: (_, product) => (
                <Input
                    id={product._id}
                    onChange={e => changeQuantity(e, product)}
                    onKeyUp={onKeyUpProductQuantity}
                    value={product.cantidadesEntrantes}
                />
            ),
            title: 'Cantidad'
        },
        {
            align: 'start',
            dataIndex: 'entry_deleteProduct',
            key: 'entry_deleteProduct',
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
            dataSource={entries_state.params.productos}
            rowKey='_id'
        />
    )

    // -------------- Title of total cost  --------------- //
    const titleOfTotalCost = <h1>Costo Total: {round(entries_state.params.costoTotal)}</h1>


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
                <h1>{entryID === 'nuevo' ? 'Nueva entrada' : 'Editar entrada'}</h1>
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
                                                        key={'entriesForm_itemsToRender_' + index}
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
                                    {titleOfTotalCost}
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

export default EntradasForm