// React Components and Hooks
import React, { useState, useEffect } from 'react'
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
import Header from './Header'
import DetailsModal from './DetailsModal'

// Imports Destructuring
const { validateDeletion } = actions.deleteModal
const { useDeleteModalContext } = contexts.DeleteModal
const { DeleteModal } = generics
const { Edit, Delete, Details } = icons


const MediosPago = () => {
    const navigate = useNavigate()
    const [deleteModal_state, deleteModal_dispatch] = useDeleteModalContext()
    const [mediospago, setMediosPago] = useState(null)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [detailsData, setDetailsData] = useState(null)

    // ------------------ Fetch Payment Methods ------------------ //
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            const stringFilters = JSON.stringify(filters)
            const data = await api.paymentMethods.findPaginated({ page, limit, filters: stringFilters })
            setMediosPago(data.docs)
            setTotalDocs(data.totalDocs)
            deleteModal_dispatch({ type: 'SET_LOADING', payload: false })
        }
        fetchPaymentMethods()
        // eslint-disable-next-line
    }, [deleteModal_state.loading, filters, limit, page])

    // ------------------ Payment Methods Deletion ------------------ //
    const paymentMethodDeletion = (paymentMethodID) => {
        deleteModal_dispatch({ type: 'SET_ENTITY_ID', payload: paymentMethodID })
        deleteModal_dispatch({ type: 'SHOW_DELETE_MODAL' })
    }

    useEffect(() => {
        const deleteMedioPago = async () => {
            const validation = validateDeletion(
                deleteModal_state.confirmDeletion,
                deleteModal_state.entityID
            )
            if (validation === 'FAIL') return
            deleteModal_dispatch({ type: 'SET_LOADING', payload: true })
            const response = await api.paymentMethods.remove(deleteModal_state.entityID)
            if (response.message !== 'OK') return errorAlert('Fallo al eliminar el registro. Intente de nuevo.')
            successAlert('El registro se eliminó correctamente.')
            deleteModal_dispatch({ type: 'CLEAN_STATE' })
        }
        deleteMedioPago()
        // eslint-disable-next-line
    }, [deleteModal_state.confirmDeletion, deleteModal_state.entityID])

    // ------------------ Payment Methods Edition ------------------ //
    const paymentMethodEdition = (id) => {
        navigate(`/mediospago/${id}`)
    }

    // ------------------ Payment Methods Details ------------------ //
    const seeDetails = (data) => {
        setDetailsData(data)
        setDetailsVisible(true)
    }


    const columnsForTable = [
        {
            dataIndex: 'paymentMethod_name',
            render: (_, paymentMethod) => paymentMethod.nombre,
            title: 'Nombre'
        },
        {
            dataIndex: 'paymentMethod_zClose',
            render: (_, paymentMethod) => paymentMethod.cierrez ? 'Si' : '-',
            title: 'Suma en cierre z'
        },
        {
            dataIndex: 'paymentMethod_additionInCashRegister',
            render: (_, paymentMethod) => paymentMethod.arqueoCaja ? 'Si' : '-',
            title: 'Suma en arqueo'
        },
        {
            dataIndex: 'paymentMethod_details',
            render: (_, paymentMethod) => (
                <div
                    onClick={() => seeDetails(paymentMethod.planes)}
                >
                    <Details
                        title='Ver detalle'
                    />
                </div>
            ),
            title: 'Detalles'
        },
        {
            dataIndex: 'paymentMethod_actions',
            render: (_, paymentMethod) => (
                <Row
                    justify='start'
                >
                    <Col
                        onClick={() => paymentMethodEdition(paymentMethod._id)}
                        span={12}
                    >
                        <Edit />
                    </Col>
                    <Col
                        onClick={() => paymentMethodDeletion(paymentMethod._id)}
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
        <Row
            gutter={[0, 16]}
        >
            <Col
                span={24}
            >
                <Header
                    filters={filters}
                    setFilters={setFilters}
                />
            </Col>
            <Col
                span={24}
            >
                <Table
                    width={'100%'}
                    dataSource={mediospago}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: e => setPage(e),
                        onShowSizeChange: (e, val) => setLimit(val)
                    }}
                    rowKey='_id'
                    tableLayout='auto'
                    size='small'
                    loading={deleteModal_state.loading}
                />
                <DeleteModal
                    title='Eliminar medio de pago'
                />
                <DetailsModal
                    detailsVisible={detailsVisible}
                    setDetailsVisible={setDetailsVisible}
                    detailsData={detailsData}
                />
            </Col>
        </Row>
    )
}

export default MediosPago