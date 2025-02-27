// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import InputHidden from '../../components/generics/InputHidden'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Row } from 'antd'

// Imports Destructuring
const { useBenefitsContext } = contexts.Benefits


const Header = () => {
    const navigate = useNavigate()
    const [benefits_state, benefits_dispatch] = useBenefitsContext()

    // ------- Button of redirect to benefit form -------- //
    const redirectToForm = () => {
        navigate('/benefits/new')
    }

    const buttonOfRedirectToBenefitForm = (
        <Button
            className='btn-primary'
            onClick={redirectToForm}
        >
            Nuevo
        </Button>
    )

    // --------- Input to filter by description ---------- //
    const onChangeDescription = (e) => {
        benefits_dispatch({ type: 'SET_FILTER_BY_DESCRIPTION', payload: e.target.value })
        benefits_dispatch({ type: 'SET_PAGE', payload: 1 })
    }

    const inputToFilterByDescription = (
        <Input
            color='primary'
            onChange={onChangeDescription}
            placeholder='Descripción...'
            style={{ width: '100%' }}
            value={benefits_state.paginationParams.filters.description}
        />
    )

    // ------------ Input to filter by title ------------- //
    const onChangeTitle = (e) => {
        benefits_dispatch({ type: 'SET_FILTER_BY_TITLE', payload: e.target.value })
        benefits_dispatch({ type: 'SET_PAGE', payload: 1 })
    }

    const inputToFilterByTitle = (
        <Input
            color='primary'
            onChange={onChangeTitle}
            placeholder='Título...'
            style={{ width: '100%' }}
            value={benefits_state.paginationParams.filters.title}
        />
    )

    const headerElements = [
        {
            element: buttonOfRedirectToBenefitForm,
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: <InputHidden />,
            order: { lg: 2, md: 2, sm: 3, xl: 2, xs: 3, xxl: 2 }
        },
        {
            element: inputToFilterByDescription,
            order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4 }
        },
        {
            element: inputToFilterByTitle,
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 6, md: 6, sm: 12, xl: 6, xs: 12, xxl: 6 }
    }

    return (
        <Row
            gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
            justify='space-around'
        >
            {
                headerElements.map((item, index) => {
                    return (
                        <Col
                            key={'benefits_header_' + index}
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
    )
}

export default Header
