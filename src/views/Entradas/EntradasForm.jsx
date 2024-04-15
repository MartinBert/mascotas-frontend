// React Components and Hooks
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { ProductSelectionModal } from '../../components/generics'
import icons from '../../components/icons'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, DatePicker, Input, InputNumber, Row, Spin, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { useDeleteModalContext } = contexts.DeleteModal
const { useEntriesContext } = contexts.Entries
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { simpleDateWithHours } = helpers.dateHelper
const { Delete } = icons


const EntradasForm = () => {
    const entryID = useLocation().pathname.replace('/entradas/', '')
    const navigate = useNavigate()
    const [deleteModal_state] = useDeleteModalContext()
    const [entries_state, entries_dispatch] = useEntriesContext()
    const [, productSelectionModal_dispatch] = useProductSelectionModalContext()

    // ------------------------------------- First load ------------------------------------- //
    useEffect(() => {
        const loadEntryData = async () => {
            if (entryID !== 'nuevo') {
                const response = await api.entradas.findById(entryID)
                entries_dispatch({ type: 'SET_PARAMS', payload: response.data })
            } else {
                const usuario = localStorage.getItem('userId')
                const newParams = { ...entries_state.params, usuario }
                entries_dispatch({ type: 'SET_PARAMS', payload: newParams })
            }
        }
        loadEntryData()
    }, [entryID])

    // ------------------------------------- Actions ------------------------------------- //
    const redirectToEntradas = () => {
        navigate('/entradas')
    }

    // ------------------------------- Update state values -------------------------------- //
    const dispatchParams = (newParams) => {
        const params = { ...entries_state.params }
        for (let index = 0; index < newParams.targets.length; index++) {
            const target = newParams.targets[index]
            const value = newParams.values[index]
            params[target] = value
        }
        entries_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    useEffect(() => {
        const updateEntriesLoadingState = () => {
            if (!entries_state.params.usuario) entries_dispatch({ type: 'SET_LOADING', payload: true })
            entries_dispatch({ type: 'SET_LOADING', payload: false })
        }
        updateEntriesLoadingState()
    }, [entries_state.params.usuario])

    useEffect(() => {
        const updateEntriesState = () => {
            entries_dispatch({ type: 'CALCULATE_ENTRY_TOTAL_COST_AND_PRODUCTS_QUANTITY' })
        }
        updateEntriesState()
    }, [entries_state.params.productos])

    // ------------------- Button to cancel modal of entries product -------------------- //
    const button_cancelModal = (
        <Button
            danger
            onClick={redirectToEntradas}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // -------------------- Button to clear inputs of entries form --------------------- //
    const clearFields = () => {
        entries_dispatch({ type: 'CLEAR_INPUTS' })
    }

    const button_clearInputs = (
        <Button
            className='btn-primary'
            onClick={clearFields}
        >
            Borrar campos
        </Button>
    )

    // ------------------ Button to clear products of entries form ------------------- //
    const clearProducts = () => {
        entries_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
    }

    const button_clearProducts = (
        <Button
            className='btn-primary'
            onClick={clearProducts}
        >
            Borrar productos
        </Button>
    )

    // -------------------- Button to open modal of entries form --------------------- //
    const openModal = () => {
        productSelectionModal_dispatch({ type: 'SHOW_PRODUCT_MODAL' })
    }

    const button_openModal = (
        <Button
            className='btn-primary'
            onClick={openModal}
        >
            Añadir producto
        </Button>
    )

    // ---------------------------- Button to save entry ---------------------------- //
    const validateEntrySave = () => {
        const quantityOfSelectedProducts = entries_state.params.productos.length
        if (quantityOfSelectedProducts === 0) {
            errorAlert('¡Debes seleccionar al menos un producto!')
            return 'FAIL'
        }
        for (const product of entries_state.params.productos) {
            if (product.cantidadesEntrantes === 0) {
                errorAlert(`Indica una cantidad mayor que cero a: ${product.nombre}`)
                return 'FAIL'
            }
        }
        return 'OK'
    }

    const saveNew = async () => {
        const result = validateEntrySave()
        if (result === 'FAIL') return

        // Datos necesarios para corregir el stock y las estadísticas diarias
        const filters = JSON.stringify({ dateString: entries_state.params.fechaString.substring(0, 10) })
        const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
        const statisticToEdit = findStatisticToEdit.docs[0] || null

        // Corregir stock de productos pertenecientes a la entrada
        for (const product of entries_state.params.productos) {
            await api.productos.modifyStock({
                product,
                isIncrement: true,
                quantity: product.cantidadesEntrantes
            })
        }

        // Corregir la estadística diaria correspondiente a la fecha de la entrada
        if (statisticToEdit) {
            const currentExpense = statisticToEdit.dailyExpense
            const newExpense = entries_state.params.costoTotal
            const updatedExpense = currentExpense + newExpense
            const updatedProfit = statisticToEdit.dailyIncome - updatedExpense
            const updatedStatistic = {
                ...statisticToEdit,
                dailyExpense: updatedExpense,
                dailyProfit: updatedProfit
            }
            await api.dailyBusinessStatistics.edit(updatedStatistic)
        }

        // Guardar la entrada nueva
        const response = await api.entradas.save(entries_state.params)
        if (response.code === 200) {
            successAlert('El registro se guardó correctamente')
            entries_dispatch({ type: 'CLEAN_STATE' })
            redirectToEntradas()
        } else errorAlert('Fallo al guardar el registro. Intente de nuevo.')
    }

    const saveEdit = async () => {
        // Datos necesarios para corregir el stock y las estadísticas diarias
        const findEntryToEdit = await api.entradas.findById(entryID)
        const entryToEdit = findEntryToEdit.data
        const filters = JSON.stringify({ dateString: entryToEdit.fechaString.substring(0, 10) })
        const findStatisticToEdit = await api.dailyBusinessStatistics.findAllByFilters(filters)
        const statisticToEdit = findStatisticToEdit.docs[0]

        // Corregir stock de productos pertenecientes a la entrada
        for (let product of entries_state.params.productos) {
            const productOfEntryToEdit = entryToEdit.productos.find(el => el._id === product._id)
            if (productOfEntryToEdit && productOfEntryToEdit.cantidadesEntrantes !== product.cantidadesEntrantes) {
                const findProductToModifyStock = await api.productos.findById(product._id)
                const productToModifyStock = findProductToModifyStock.data
                productToModifyStock.cantidadStock -= productOfEntryToEdit.cantidadesEntrantes
                productToModifyStock.cantidadStock += parseFloat(product.cantidadesEntrantes)
                await api.productos.edit(productToModifyStock)
            } else {
                await api.productos.modifyStock({
                    product,
                    isIncrement: true,
                    quantity: product.cantidadesEntrantes
                })
            }
        }

        // Corregir la estadística diaria correspondiente a la fecha de la entrada
        const currentStatisticExpense = statisticToEdit.dailyExpense
        const currentStatisticIncome = statisticToEdit.dailyIncome
        const currentExpenseOfEntry = entryToEdit.costoTotal
        const newExpenseOfEntry = entries_state.params.costoTotal
        const newStatisticDailyExpense = currentStatisticExpense - currentExpenseOfEntry + newExpenseOfEntry
        const newStatisticDailyProfit = currentStatisticIncome - newStatisticDailyExpense
        const newStatisticToSave = {
            ...statisticToEdit,
            dailyExpense: newStatisticDailyExpense,
            dailyProfit: newStatisticDailyProfit
        }
        await api.dailyBusinessStatistics.edit(newStatisticToSave)

        // Guardar la entrada editada
        const recordToEdit = { ...entries_state.params, id: entryID }
        const response = await api.entradas.edit(recordToEdit)
        if (response.code === 200) {
            successAlert('El registro se editó correctamente')
            entries_dispatch({ type: 'CLEAN_STATE' })
            redirectToEntradas()
        } else {
            errorAlert('Fallo al editar el registro. Intente de nuevo.')
        }
    }

    const saveEntry = () => {
        if (entryID === 'nuevo') saveNew()
        else saveEdit()
    }

    const button_saveEntry = (
        <Button
            onClick={saveEntry}
            style={{ width: '100%' }}
            type='primary'
        >
            Guardar
        </Button>
    )

    // --------------------- Input to set product description ----------------------- //
    const setDescription = (e) => {
        const newParams = {
            targets: ['descripcion'],
            values: e.target.value !== '' ? [e.target.value] : ['-- Sin descripción --']
        }
        dispatchParams(newParams)
    }

    const input_productsDescription = (
        <Input
            onChange={setDescription}
            placeholder='-- Sin descripción --'
            value={
                entries_state.params.descripcion === '-- Sin descripción --'
                    ? ''
                    : entries_state.params.descripcion
            }
        />
    )

    // ------------------------- Picker to set product date -------------------------- //
    const setDate = (date) => {
        const newParams = {
            targets: ['fecha', 'fechaString'],
            values: date
                ? [new Date(date.$d), simpleDateWithHours(new Date(date.$d))]
                : [new Date(), simpleDateWithHours(new Date())]
        }
        dispatchParams(newParams)
    }

    const picker_productsDate = (
        <DatePicker
            format={['DD/MM/YYYY']}
            onChange={setDate}
            style={{ width: '100%' }}
            value={entries_state.datePickerValue}
        />
    )

    // ------------------------- Table of selected products -------------------------- //
    const deleteProduct = (product) => {
        const remainingProducts = entries_state.params.productos
            .filter(currentProduct => currentProduct._id !== product._id)
        entries_dispatch({ type: 'SET_PRODUCTS', payload: remainingProducts })
    }

    const changeQuantity = (e, product) => {
        const productsEditted = entries_state.params.productos.map(productInState => {
            if (productInState._id === product._id) productInState.cantidadesEntrantes = e
            return productInState
        })
        const newParams = { targets: ['productos'], values: [productsEditted] }
        dispatchParams(newParams)
    }

    const header = [
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
                <InputNumber
                    onChange={e => changeQuantity(e, product)}
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

    const table_selectedProducts = (
        <Table
            columns={header}
            dataSource={entries_state.params.productos}
            rowKey='_id'
        />
    )

    // -------------------------- Title of total cost of entry --------------------------- //
    useEffect(() => {
        entries_dispatch({ type: 'CALCULATE_ENTRY_TOTAL_COST_AND_PRODUCTS_QUANTITY' })
    }, [entries_state.params.cantidad, entries_state.params.productos])

    const title_totalCost = <h1>Neto Total: {entries_state.params.costoTotal}</h1>


    const entriesRender = [
        {
            element: button_openModal,
            name: 'entries_addProduct',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: button_clearInputs,
            name: 'entries_clearFields',
            order: { lg: 2, md: 2, sm: 5, xl: 2, xs: 5, xxl: 2 }
        },
        {
            element: button_clearProducts,
            name: 'entries_clearProducts',
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 }
        },
        {
            element: picker_productsDate,
            name: 'entries_productDate',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: input_productsDescription,
            name: 'entries_productDescription',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        }
    ]

    const responsiveGrid = {
        formGutter: { horizontal: 0, vertical: 16 },
        headGutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
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
                                            entriesRender.map(item => {
                                                return (
                                                    <Col
                                                        key={item.name}
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
                                    {title_totalCost}
                                </Col>
                                <Col span={24}>
                                    {table_selectedProducts}
                                </Col>
                                <Col span={24}>
                                    <Row justify='space-around'>
                                        <Col span={6}>
                                            {button_cancelModal}
                                        </Col>
                                        <Col span={6}>
                                            {button_saveEntry}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )
                }
            </Col>
            <ProductSelectionModal />
        </Row>
    )
}

export default EntradasForm