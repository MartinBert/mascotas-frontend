// React Components and Hooks
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Context Providers
import contexts from '../../contexts'

// Design Components
import { Button, Col, Input, Row } from 'antd'

// Imports Destructuring
const { useSalesAreasContext } = contexts.SalesAreas


const Header = () => {
    const navigate = useNavigate()
    const [salesAreas_state, salesAreas_dispatch] = useSalesAreasContext()

    // ----------- Button to new Sales Area -------------- //
    const redirectToForm = () => {
        navigate('/zonasdeventas/nuevo')
    }

    const buttonToNewSalesArea = (
        <Button
            className='btn-primary'
            onClick={redirectToForm}
        >
            Nuevo
        </Button>
    )

    // ------------ Input to filter By Name -------------- //
    const updateFilters = (e) => {
        const paginationParams = {
            ...salesAreas_state.paginationParams,
            filters: {
                ...salesAreas_state.paginationParams.filters,
                [e.target.name]: e.target.value
            }
        }
        salesAreas_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const inputToFilterByName = (
        <Input
            name='name'
            onChange={updateFilters}
            placeholder='Buscar por nombre de zona'
            type='primary'
        />
    )


    const elementsToRender = [
        {
            element: buttonToNewSalesArea,
            name: 'salesAreas_buttonToNewSalesArea',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: inputToFilterByName,
            name: 'salesAreas_inputToFilterByName',
            order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 }
        },
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Row
            gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
            justify='space-around'
        >
            {
                elementsToRender.map(item => {
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
    )
}

export default Header
