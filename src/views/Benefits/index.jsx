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
import { Col, Row, Table } from 'antd'

// Services
import api from '../../services'

// Views
import Header from './Header'
import BenefitsForm from './BenefitsForm'

// Imports destructuring
const { validateDeletion } = actions.deleteModal
const { formatFindParams } = actions.paginationParams
const { useBenefitsContext } = contexts.Benefits
const { Delete, Edit } = icons


const Benefits = () => {
    const navigate = useNavigate()
    const {
        benefits_actions,
        benefits_dispatch,
        benefits_state
    } = useBenefitsContext()

    // ----------------- Button to delete ---------------- //
    const deleteBenefit = async (benefit) => {
        const response = await api.products.remove(benefit._id)
    }

    const buttonToDeleteBenefit = (benefit) => {
        const button = (
            <div onClick={() => deleteBenefit(benefit)}>
                <Delete />
            </div>
        )
        return button
    }

    // ------------------ Button to edit ----------------- //
    const editBenefit = (benefit) => {
        navigate(`/benefits/${benefit._id}`)
    }

    const buttonToEditBenefit = (benefit) => {
        const button = (
            <div onClick={() => editBenefit(benefit)}>
                <Edit />
            </div>
        )
        return button
    }

    // ------------------ Records table ------------------ //
    const findRecords = async () => {
        const findPaginatedParams = formatFindParams(benefits_state.paginationParams)
        console.log(findPaginatedParams)
        const recordsData = await api.benefits.findPaginated(findPaginatedParams)
        benefits_dispatch({ type: 'SET_RECORDS_TO_RENDER', payload: recordsData.data })
    }
    // eslint-disable-next-line
    useEffect(()=> { findRecords() }, [benefits_state.paginationParams])

    const setPageAndLimit = (page, limit) => {
        benefits_dispatch({ type: 'SET_PAGE', payload: parseInt(page) })
        benefits_dispatch({ type: 'SET_LIMIT', payload: parseInt(limit) })
    }

    const columns = [
        {
            dataIndex: 'benefit_title',
            render: (_, benefit) => benefit.title,
            title: 'Beneficio'
        },
        {
            dataIndex: 'benefit_description',
            render: (_, benefit) => benefit.description,
            title: 'Descripción'
        },
        {
            dataIndex: 'benefit_actions',
            render: (_, benefit) => (
                <Row justify='start'>
                    <Col span={12}>
                        {buttonToEditBenefit(benefit)}
                    </Col>
                    <Col span={12}>
                        {buttonToDeleteBenefit(benefit)}
                    </Col>
                </Row>
            ),
            title: 'Acciones'
        }
    ]

    return (
        <div>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Header />
                </Col>
                <Col span={24} >
                    <Table
                        width={'100%'}
                        dataSource={benefits_state.recordsToRender}
                        columns={columns}
                        pagination={{
                            defaultCurrent: benefits_state.paginationParams.page,
                            defaultPageSize: benefits_state.paginationParams.limit,
                            limit: benefits_state.paginationParams.limit,
                            onChange: (page, limit) => setPageAndLimit(page, limit),
                            pageSizeOptions: [5, 10, 15, 20],
                            showSizeChanger: true,
                            total: benefits_state.totalRecordsQuantity
                        }}
                        loading={benefits_state.loading}
                        rowKey='_id'
                        tableLayout='auto'
                        size='small'
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Benefits