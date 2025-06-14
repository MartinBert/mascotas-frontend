// React Components and Hooks
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import generics from '../../components/generics'
import icons from '../../components/icons'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Row, Col, Table } from 'antd'

// Services
import api from '../../services'

// Views
import DetailsModal from './DetailsModal'
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { formatFindParams } = actions.paginationParams
const { useDeleteModalContext } = contexts.DeleteModal
const { useOutputsContext } = contexts.Outputs
const { useRenderConditionsContext } = contexts.RenderConditions
const { DeleteModal } = generics
const { Delete, Details, Edit } = icons


const fixDailyBusinessStatistics = async (outputToDelete) => {
    const filters = JSON.stringify({ concept: 'Generado automáticamente', dateString: outputToDelete.fechaString.substring(0, 10) })
    const findStatisticToFix = await api.dailyBusinessStatistics.findAllByFilters(filters)
    const [statisticToFix] = findStatisticToFix.data.docs
    if (!statisticToFix) return
    const fixedDailyIncome = statisticToFix.balanceViewIncome - outputToDelete.ingreso
    const fixedStatistic = {
        ...statisticToFix,
        balanceViewIncome: fixedDailyIncome,
        balanceViewProfit: fixedDailyIncome - statisticToFix.balanceViewExpense
    }
    const result = await api.dailyBusinessStatistics.edit(fixedStatistic)
    if (result.status !== 'OK') errorAlert('No se pudo corregir la estadística diaria. Hágalo manualmente en "Estadísticas de negocio" / "Balance diario" / "Acciones" / "Editar".')
}

const fixStock = async (outputToDelete) => {
    for (let productOfOutput of outputToDelete.productos) {
        const findProduct = await api.products.findById(productOfOutput._id)
        const product = await findProduct.data
        await api.products.modifyStock({
            product,
            isIncrement: true,
            quantity: productOfOutput.cantidadesSalientes
        })
    }
}

const fixStockHistory = async (outputToDelete) => {
    for (let index = 0; index < outputToDelete.productos.length; index++) {
        const product = outputToDelete.productos[index]
        const filters = JSON.stringify({
            dateString: outputToDelete.fechaString.substring(0, 10),
            itIsAManualCorrection: false,
            product
        })
        const findStockHistoryToFix = await api.stockHistory.findAllByFilters(filters)
        const [stockHistoryToFix] = findStockHistoryToFix.data.docs
        if (stockHistoryToFix) {
            const fixedStockHistory = {
                ...stockHistoryToFix,
                outputs: stockHistoryToFix.outputs - product.cantidadesSalientes
            }
            const result = await api.stockHistory.edit(fixedStockHistory)
            if (result.status !== 'OK') errorAlert(`No se pudo corregir el historial de stock de "${product.nombre}". Hágalo manualmente en "Estadísticas de negocio" / "Historial de stock" / (Elegir producto) "Abrir historial" / (Elegir fecha) "Editar".`)
        }
    }
}


const Salidas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [outputs_state, outputs_dispatch] = useOutputsContext()
    const [renderConditions_state, renderConditions_dispatch] = useRenderConditionsContext()

    // ------------------ Fetch Outputs ------------------ //
    const loadRenderConditions = async () => {
        const recordsQuantityOfProducts = await api.products.countRecords()
        renderConditions_dispatch({
            type: 'SET_EXISTS_PRODUCTS',
            payload: recordsQuantityOfProducts.data < 1 ? false : true
        })
    }

    const fetchOutputs_paginated = async () => {
        const findParams = formatFindParams(outputs_state.paginationParams)
        const findRecords = await api.outputs.findPaginated(findParams)
        outputs_dispatch({ type: 'SET_OUTPUTS_FOR_RENDER', payload: findRecords.data })
        deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
    }

    useEffect(() => {
        fetchOutputs_paginated()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, outputs_state.paginationParams])

    useEffect(() => {
        loadRenderConditions()
        // eslint-disable-next-line
    }, [])

    // ------------------ Output Deletion ------------------ //
    const outputDeletion = (output) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: output._id })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    const deleteOutput = async () => {
        const validation = validateDeletion(
            deleteModal_state.confirmDeletion,
            deleteModal_state.entityID
        )
        if (validation === 'FAIL') return
        deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
        const findOutputToDelete = await api.outputs.findById(deleteModal_state.entityID)
        if (findOutputToDelete.status !== 'OK') return errorAlert('Fallo al corregir stock. Intente de nuevo.')
        fixDailyBusinessStatistics(findOutputToDelete.data)
        fixStock(findOutputToDelete.data)
        fixStockHistory(findOutputToDelete.data)
        const response = await api.outputs.remove(deleteModal_state.entityID)
        if (response.status !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
        successAlert('El registro se eliminó correctamente.')
        deleteModal_dispatch({ type: 'CLEAN_STATE' })
    }

    useEffect(() => {
        deleteOutput()
        // eslint-disable-next-line
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Output Edition ------------------ //
    const outputEdition = (output) => {
        navigate(`/salidas/${output._id}`)
    }

    // --------------------- Actions --------------------- //
    const setLimit = (val) => {
        const paginationParams = {
            ...outputs_state.paginationParams,
            limit: parseInt(val)
        }
        outputs_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const setPage = (e) => {
        const paginationParams = {
            ...outputs_state.paginationParams,
            page: parseInt(e)
        }
        outputs_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    // ------------------ Product Details ------------------ //
    const openDetailsModal = (output) => {
        outputs_dispatch({ type: 'SET_DATA_FOR_DETAILS_MODAL', payload: output.productos })
    }


    const columnsForTable = [
        {
            dataIndex: 'output_user',
            render: (_, output) => output.usuario ? output.usuario.nombre : 'Usuario inexistente',
            title: 'Usuario'
        },
        {
            dataIndex: 'output_details',
            render: (_, output) => (
                <div onClick={() => openDetailsModal(output)}>
                    <Details />
                </div>
            ),
            title: 'Productos que salieron'
        },
        {
            dataIndex: 'output_date',
            render: (_, output) => output.fechaString,
            title: 'Fecha'
        },
        {
            dataIndex: 'output_description',
            render: (_, output) => output.descripcion,
            title: 'Descripción'
        },
        {
            dataIndex: 'output_netProfit',
            render: (_, output) => output.ingreso,
            title: 'Ingreso'
        },
        {
            dataIndex: 'output_actions',
            render: (_, output) => (
                <Row justify='start'>
                    <Col
                        onClick={() => outputEdition(output)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => outputDeletion(output)}
                        span={12}
                    >
                        <Delete />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        }
    ]

    
    return (
        <>
            {
                !renderConditions_state.existsProducts
                    ? <h1>Debes registrar al menos un producto antes de comenzar a utilizar esta función.</h1>
                    : (
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Header />
                            </Col>
                            <Col span={24} >
                                <Table
                                    width={'100%'}
                                    dataSource={outputs_state.outputsForRender}
                                    columns={columnsForTable}
                                    pagination={{
                                        defaultCurrent: outputs_state.paginationParams.page,
                                        limit: outputs_state.paginationParams.limit,
                                        total: outputs_state.outputsTotalQuantity,
                                        showSizeChanger: true,
                                        onChange: e => setPage(e),
                                        onShowSizeChange: (e, val) => setLimit(val)
                                    }}
                                    loading={deleteModal_state.loading}
                                    rowKey='_id'
                                    tableLayout='auto'
                                    size='small'
                                />
                            </Col>
                            <DetailsModal />
                            <DeleteModal title='Eliminar salida' />
                        </Row>
                    )
            }
        </>
    )
}

export default Salidas