// React Components and Hooks
import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

// Custom Components
import { ProductSelectionModal } from '../../components/generics'

// Design Components
import { Row, Col, Spin } from 'antd'

// Context Providers
import contexts from '../../contexts'

// Services
import api from '../../services'

// Views
import EntradasElements from './elements'

// Imports Destructuring
const { useAuthContext } = contexts.Auth
const { useEntriesContext } = contexts.Entries
const {
    AddButton,
    CancelButton,
    CleanFields,
    CleanProducts,
    InputHidden,
    ProductDate,
    ProductDescription,
    SaveButton,
    SelectedProductsTable,
    TotalCost
} = EntradasElements


const EntradasForm = () => {
    const location = useLocation()
    const { id } = useParams()
    const [auth_state, auth_dispatch] = useAuthContext()
    const [entries_state, entries_dispatch] = useEntriesContext()

    // ---------------- First load ---------------- //
    useEffect(() => {
        const loadEntryData = async () => {
            // Load User
            const userID = localStorage.getItem('userId')
            const loggedUser = await api.usuarios.findById(userID)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })

            // Recover entry data for edit
            if (id !== 'nuevo') {
                const entryID = location.pathname.replace('/entradas/', '')
                const response = await api.entradas.findById(entryID)
                entries_dispatch({ type: 'SET_ENTRY', payload: response.data })
            }
        }
        loadEntryData()
    }, [auth_dispatch, entries_dispatch, id])

    // ---------------- Loading state ---------------- //
    useEffect(() => {
        if (!auth_state.user) entries_dispatch({ type: 'SET_LOADING', payload: true })
        entries_dispatch({ type: 'SET_LOADING', payload: false })
    }, [auth_state.user])

    // ---------------- Update state values ---------------- //
    useEffect(() => {
        const updateEntriesState = () => {
            entries_dispatch({ type: 'CALCULATE_TOTAL_COST' })
            entries_dispatch({ type: 'SET_QUANTITY' })
        }
        updateEntriesState()
    }, [entries_state.products])


    const entryData = [
        {
            element: <AddButton />,
            name: 'addProduct',
            order_lg: 1,
            order_md: 1,
            order_sm: 1,
            order_xl: 1,
            order_xs: 1,
            order_xxl: 1
        },
        {
            element: <CleanFields />,
            name: 'cleanFields',
            order_lg: 3,
            order_md: 2,
            order_sm: 5,
            order_xl: 3,
            order_xs: 5,
            order_xxl: 3
        },
        {
            element: <CleanProducts />,
            name: 'cleanProducts',
            order_lg: 6,
            order_md: 4,
            order_sm: 6,
            order_xl: 6,
            order_xs: 6,
            order_xxl: 6
        },
        {
            element: <InputHidden />,
            name: 'complement_1',
            order_lg: 4,
            order_md: 6,
            order_sm: 4,
            order_xl: 4,
            order_xs: 4,
            order_xxl: 4
        },
        {
            element: <InputHidden />,
            name: 'complement_2',
            order_lg: 7,
            order_md: 7,
            order_sm: 7,
            order_xl: 7,
            order_xs: 7,
            order_xxl: 7
        },
        {
            element: <ProductDate />,
            name: 'productDate',
            order_lg: 5,
            order_md: 5,
            order_sm: 3,
            order_xl: 5,
            order_xs: 3,
            order_xxl: 5
        },
        {
            element: <ProductDescription />,
            name: 'productDescription',
            order_lg: 2,
            order_md: 3,
            order_sm: 2,
            order_xl: 2,
            order_xs: 2,
            order_xxl: 2
        },
    ]

    const responsiveFormGutter = { horizontal: 0, vertical: 16 }
    const responsiveHeadGutter = { horizontal: 8, vertical: 8 }
    const responsiveColSpan = { lg: 8, md: 12, sm: 24, xl: 8, xs: 24, xxl: 8 }

    return (
        <>
            <h1>{id === 'nuevo' ? 'Nueva entrada' : 'Editar entrada'}</h1>
            {
                entries_state.loading
                    ? <Spin />
                    : (
                        <>
                            <Row
                                gutter={[
                                    responsiveFormGutter.horizontal,
                                    responsiveFormGutter.vertical
                                ]}
                            >
                                <Col>
                                    <Row
                                        gutter={[
                                            responsiveHeadGutter.horizontal,
                                            responsiveHeadGutter.vertical
                                        ]}
                                    >
                                        {
                                            entryData.map(item => {
                                                return (
                                                    <Col
                                                        key={item.name}
                                                        lg={{
                                                            order: item.order_lg,
                                                            span: responsiveColSpan.lg
                                                        }}
                                                        md={{
                                                            order: item.order_md,
                                                            span: responsiveColSpan.md
                                                        }}
                                                        sm={{
                                                            order: item.order_sm,
                                                            span: responsiveColSpan.sm
                                                        }}
                                                        xl={{
                                                            order: item.order_xl,
                                                            span: responsiveColSpan.xl
                                                        }}
                                                        xs={{
                                                            order: item.order_xs,
                                                            span: responsiveColSpan.xs
                                                        }}
                                                        xxl={{
                                                            order: item.order_xxl,
                                                            span: responsiveColSpan.xxl
                                                        }}
                                                    >
                                                        {item.element}
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>
                                <Col
                                    span={24}
                                    style={{ textAlign: 'right' }}
                                >
                                    <TotalCost />
                                </Col>
                                <Col
                                    span={24}
                                >
                                    <SelectedProductsTable />
                                </Col>
                                <Col
                                    span={24}
                                >
                                    <Row
                                        justify='space-around'
                                    >
                                        <Col
                                            span={6}
                                        >
                                            <CancelButton />
                                        </Col>
                                        <Col
                                            span={6}
                                        >
                                            <SaveButton />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    )
            }
            <ProductSelectionModal />
        </>
    )
}

export default EntradasForm