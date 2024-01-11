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
const { useOutputsContext } = contexts.Outputs
const { useProductSelectionModalContext } = contexts.ProductSelectionModal
const { simpleDateWithHours } = helpers.dateHelper
const { Delete } = icons


const SalidasForm = () => {
    const outputID = useLocation().pathname.replace('/salidas/', '')
    const navigate = useNavigate()
    const [deleteModal_state] = useDeleteModalContext()
    const [outputs_state, outputs_dispatch] = useOutputsContext()
    const [, productSelectionModal_dispatch] = useProductSelectionModalContext()

    // ------------------------------------- First load ------------------------------------- //
    useEffect(() => {
        const loadOutputData = async () => {
            if (outputID !== 'nuevo') {
                const response = await api.salidas.findById(outputID)
                outputs_dispatch({ type: 'SET_PARAMS', payload: response.data })
            } else {
                const usuario = localStorage.getItem('userId')
                const newParams = { ...outputs_state.params, usuario }
                outputs_dispatch({ type: 'SET_PARAMS', payload: newParams })
            }
        }
        loadOutputData()
    }, [outputID])

    // ------------------------------------- Actions ------------------------------------- //
    const redirectToSalidas = () => {
        navigate('/salidas')
    }

    // ------------------------------- Update state values -------------------------------- //
    const dispatchParams = (newParams) => {
        const params = { ...outputs_state.params }
        for (let index = 0; index < newParams.targets.length; index++) {
            const target = newParams.targets[index]
            const value = newParams.values[index]
            params[target] = value
        }
        outputs_dispatch({ type: 'SET_PARAMS', payload: params })
    }

    useEffect(() => {
        const updateOutputsLoadingState = () => {
            if (!outputs_state.params.usuario) outputs_dispatch({ type: 'SET_LOADING', payload: true })
            outputs_dispatch({ type: 'SET_LOADING', payload: false })
        }
        updateOutputsLoadingState()
    }, [outputs_state.params.usuario])

    useEffect(() => {
        const updateOutputsState = () => {
            outputs_dispatch({ type: 'CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY' })
        }
        updateOutputsState()
    }, [outputs_state.params.productos])

    // ------------------- Button to cancel modal of outputs product -------------------- //
    const button_cancelModal = (
        <Button
            danger
            onClick={redirectToSalidas}
            style={{ width: '100%' }}
            type='primary'
        >
            Cancelar
        </Button>
    )

    // -------------------- Button to clear inputs of outputs form --------------------- //
    const clearFields = () => {
        outputs_dispatch({ type: 'CLEAR_INPUTS' })
    }

    const button_clearInputs = (
        <Button
            className='btn-primary'
            onClick={clearFields}
        >
            Borrar campos
        </Button>
    )

    // ------------------ Button to clear products of outputs form ------------------- //
    const clearProducts = () => {
        outputs_dispatch({ type: 'DELETE_ALL_PRODUCTS' })
    }

    const button_clearProducts = (
        <Button
            className='btn-primary'
            onClick={clearProducts}
        >
            Borrar productos
        </Button>
    )

    // -------------------- Button to open modal of outputs form --------------------- //
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

    // ---------------------------- Button to save output ---------------------------- //
    const validateOutputSave = () => {
        const quantityOfSelectedProducts = outputs_state.params.productos.length
        if (quantityOfSelectedProducts === 0) {
            errorAlert('¡Debes seleccionar al menos un producto!')
            return 'FAIL'
        }
        for (const product of outputs_state.params.productos) {
            if (product.cantidadesSalientes === 0) {
                errorAlert(`Indica una cantidad mayor que cero a: ${product.nombre}`)
                return 'FAIL'
            }
        }
        return 'OK'
    }

    const saveNew = async () => {
        const result = validateOutputSave()
        if (result === 'FAIL') return
        for (const product of outputs_state.params.productos) {
            await api.productos.modifyStock({
                product,
                isIncrement: false,
                quantity: product.cantidadesSalientes
            })
        }
        const response = await api.salidas.save(outputs_state.params)
        if (response.code === 200) {
            successAlert('El registro se guardó correctamente')
            outputs_dispatch({ type: 'CLEAN_STATE' })
            redirectToSalidas()
        } else errorAlert('Fallo al guardar el registro. Intente de nuevo.')
    }

    const saveEdit = async () => {
        for (let product of outputs_state.params.productos) {
            const findOutputToEdit = await api.salidas.findById(outputID)
            const outputToEdit = findOutputToEdit.data
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
                    quantity: product.cantidadesSalientes
                })
            }
        }
        const outputToEdit = { ...outputs_state.params, id: outputID }
        const response = await api.salidas.edit(outputToEdit)
        if (response.code === 200) {
            successAlert('El registro se editó correctamente')
            outputs_dispatch({ type: 'CLEAN_STATE' })
            redirectToSalidas()
        } else {
            errorAlert('Fallo al editar el registro. Intente de nuevo.')
        }
    }

    const saveOutput = () => {
        if (outputID === 'nuevo') saveNew()
        else saveEdit()
    }

    const button_saveOutput = (
        <Button
            onClick={saveOutput}
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
                outputs_state.params.descripcion === '-- Sin descripción --'
                    ? ''
                    : outputs_state.params.descripcion
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
            value={outputs_state.datePickerValue}
        />
    )

    // ------------------------- Table of selected products -------------------------- //
    const deleteProduct = (product) => {
        outputs_dispatch({ type: 'DELETE_PRODUCT', payload: product._id })
    }

    const changeQuantity = (e, product) => {
        const productsEditted = outputs_state.params.productos.map(productInState => {
            if (productInState._id === product._id) {
                productInState.cantidadesSalientes = e
            }
            return productInState
        })
        const newParams = {
            targets: ['productos'],
            values: [productsEditted]
        }
        dispatchParams(newParams)
    }

    const header = [
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
                <InputNumber
                    onChange={e => changeQuantity(e, product)}
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

    const table_selectedProducts = (
        <Table
            columns={header}
            dataSource={outputs_state.params.productos}
            rowKey='_id'
        />
    )

    // -------------------------- Title of total cost of output --------------------------- //
    useEffect(() => {
        outputs_dispatch({ type: 'CALCULATE_OUTPUT_NET_PROFIT_AND_PRODUCTS_QUANTITY' })
    }, [outputs_state.params.cantidad, outputs_state.params.productos])

    const title_netProfit = <h1>Neto Total: {outputs_state.params.gananciaNeta}</h1>


    const outputsRender = [
        {
            element: button_openModal,
            name: 'outputs_addProduct',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: button_clearInputs,
            name: 'outputs_clearFields',
            order: { lg: 2, md: 2, sm: 5, xl: 2, xs: 5, xxl: 2 }
        },
        {
            element: button_clearProducts,
            name: 'outputs_clearProducts',
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 }
        },
        {
            element: picker_productsDate,
            name: 'outputs_productDate',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: input_productsDescription,
            name: 'outputs_productDescription',
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
                                            outputsRender.map(item => {
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
                                    {title_netProfit}
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
                                            {button_saveOutput}
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

export default SalidasForm