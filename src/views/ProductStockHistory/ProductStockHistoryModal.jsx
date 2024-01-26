// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Modal, Row, Table } from 'antd'

// Helpers
import actions from '../../actions'

// Services
import api from '../../services'

// Imports Destructuring
const { useProductsContext } = contexts.Products
const { formatFindParams } = actions.paginationParams


const ProductStockHistoryModal = () => {
    const [products_state, products_dispatch] = useProductsContext()

    // --------------------- Actions --------------------- //
    const closeModal = () => {
        products_dispatch({ type: 'HIDE_PRODUCT_STOCK_HISTORY_MODAL' })
    }

    const setLimit = (val) => {
        const stockHistoryPaginationParams = {
            ...products_state.stockHistoryPaginationParams,
            limit: parseInt(val)
        }
        products_dispatch({
            type: 'SET_STOCK_HISTORY_PAGINATION_PARAMS',
            payload: stockHistoryPaginationParams
        })
    }

    const setPage = (e) => {
        const stockHistoryPaginationParams = {
            ...products_state.stockHistoryPaginationParams,
            page: parseInt(e)
        }
        products_dispatch({
            type: 'SET_STOCK_HISTORY_PAGINATION_PARAMS',
            payload: stockHistoryPaginationParams
        })
    }

    // --------------- Fetch stock history --------------- //
    const fetchStockHistory = async () => {
        const findStockHistory = formatFindParams(products_state.stockHistoryPaginationParams)
        const data = await api.stockHistory.findPaginated(findStockHistory)
        if (!data) return console.log('falló')
        console.log(data)
        products_dispatch({ type: 'SET_STOCK_HISTORY_FOR_RENDER', payload: data })
    }

    useEffect(() => { fetchStockHistory() }, [
        products_state.stockHistoryLoading,
        products_state.stockHistoryPaginationParams
    ])


    const columnsForTable = [
        {
			dataIndex: 'stockHistoryModal_period',
			// render: (_, stockHistory) => stockHistory.date,
			title: 'Período'
		},
        {
			dataIndex: 'stockHistoryModal_totalEntries',
			// render: (_, stockHistory) => stockHistory.date,
			title: 'Entradas totales'
		},
        {
			dataIndex: 'stockHistoryModal_totalOutputs',
			// render: (_, stockHistory) => stockHistory.date,
			title: 'Salidas totales'
		}
    ]

    const responsiveGrid = {
        gutter: { horizontal: 24, vertical: 8 },
        span: { lg: 6, md: 6, sm: 12, xl: 6, xs: 12, xxl: 6 }
    }

    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={products_state.productStockHistoryModalVisibility}
            width={1200}
        >
            <Row>
                <Col span={24}>
                    <h1>{products_state.productForStockHistoryModal.nombre}</h1>
                </Col>
                <Col span={24}>
                    <Table
                        columns={columnsForTable}
                        dataSource={products_state.stockHistoryForRender}
                        loading={products_state.stockHistoryLoading}
                        pagination={{
                            current: products_state.stockHistoryPaginationParams.page,
                            limit: products_state.stockHistoryPaginationParams.limit,
                            total: products_state.stockHistoryTotalRecords,
                            showSizeChanger: true,
                            onChange: e => setPage(e),
                            onShowSizeChange: (e, val) => setLimit(val)
                        }}
                        rowKey='_id'
                        size='small'
                        tableLayout='auto'
                        width={'100%'}
                    />
                </Col>
                <Col span={24}>
                    <Row justify='center'>
                        <Col
                            lg={{ span: responsiveGrid.span.lg }}
                            md={{ span: responsiveGrid.span.md }}
                            sm={{ span: responsiveGrid.span.sm }}
                            xl={{ span: responsiveGrid.span.xl }}
                            xs={{ span: responsiveGrid.span.xs }}
                            xxl={{ span: responsiveGrid.span.xxl }}
                        >
                            <Button
                                danger
                                onClick={closeModal}
                                style={{ width: '100%' }}
                                type='primary'
                            >
                                Cerrar
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal >
    )
}

export default ProductStockHistoryModal