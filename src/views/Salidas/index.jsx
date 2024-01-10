// React Components and Hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import { DeleteModal } from '../../components/generics'
import icons from '../../components/icons'

// Custom Context Providers
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Row, Col, Table } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import DetailsModal from './DetailsModal'
import Header from './Header'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { Delete, Details, Edit } = icons
const { dateHelper } = helpers

const findOutput = async (outputID) => {
    const findOutput = await api.salidas.findById(outputID)
    return findOutput
}

const fixStock = async (outputToDelete) => {
    for (let productOfOutput of outputToDelete.productos) {
        const findProduct = await api.productos.findById(productOfOutput._id)
        const product = await findProduct.data
        await api.productos.modifyStock({
            product,
            isIncrement: true,
            quantity: productOfOutput.cantidadesSalientes
        })
    }
}


const Salidas = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [salidas_paginadas, setSalidas_paginadas] = useState(null)
    const [salidas_totales, setSalidas_totales] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [detailsData, setDetailsData] = useState(null)

    // ------------------ Fetch Outputs ------------------ //
    useEffect(() => {
        const fetchSalidas_paginadas = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.salidas.findPaginated({ page, limit, filters: stringFilters })
            setSalidas_paginadas(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchSalidas_paginadas()
    }, [
        deleteModal_state.loading,
        filters,
        limit,
        page,
    ])

    useEffect(() => {
        const fetchSalidas_totales = async () => {
            const data = await api.salidas.findAll()
            setSalidas_totales(data.docs)
        }
        fetchSalidas_totales()
    }, [])

    // ------------------ Output Deletion ------------------ //
    const outputDeletion = (outputID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: outputID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteSalida = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const findOutputToDelete = await findOutput(deleteModal_state.entityID)
            if (findOutputToDelete.message !== 'OK') return errorAlert('Fallo al corregir stock. Intente de nuevo.')
            fixStock(findOutputToDelete.data)
            const response = await api.salidas.deleteById(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteSalida()
    }, [
        deleteModal_state.confirmDeletion,
        deleteModal_state.entityID
    ])

    // ------------------ Output Edition ------------------ //
    const outputEdition = (id) => {
        navigate(`/salidas/${id}`)
    }

    // ------------------ Product Details ------------------ //
    const openProductDetails = (output) => {
        setDetailsData(output.productos)
        setDetailsVisible(true)
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
                <div
                    onClick={() => openProductDetails(output)}
                >
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
            render: (_, output) => output.gananciaNeta,
            title: 'Ganancia neta'
        },
        {
            dataIndex: 'output_actions',
            render: (_, output) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => outputEdition(output._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => outputDeletion(output._id)}
                        span={12}
                    >
                        <Delete />
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        },
    ]

    return (
        <Row
            gutter={[0, 16]}
        >
            <Col
                span={24}
            >
                <Header
                    filters={filters}
                    salidas_paginadas={salidas_paginadas}
                    salidas_totales={salidas_totales}
                    setFilters={setFilters}
                    setPage={setPage}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={salidas_paginadas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
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
            <DetailsModal
                detailsVisible={detailsVisible}
                setDetailsVisible={setDetailsVisible}
                detailsData={detailsData}
            />
            <DeleteModal
                title='Eliminar salida'
            />
        </Row>
    )
}

export default Salidas