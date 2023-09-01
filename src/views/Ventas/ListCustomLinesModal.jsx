// React Components and Hooks
import React from 'react'

// Custom Components
import icons from '../../components/icons'

// Design Components
import { Button, Col, Modal, Row, Table } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Imports Destructurings
const { useProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider
const { Delete } = icons


const ListCustomLinesModal = () => {
    const [productSelectionModal_state, productSelectionModal_dispatch] = useProductSelectionModalContext()

    const cancelAndCloseModal = () => {
        productSelectionModal_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const openCustomProductModal = () => {
        productSelectionModal_dispatch({ type: 'SHOW_CUSTOM_PRODUCT_MODAL' })
    }

    const removeAllCustomProducts = () => {
        productSelectionModal_dispatch({ type: 'DELETE_ALL_CUSTOM_PRODUCTS' })
    }

    const removeCustomProduct = (lineId) => {
        productSelectionModal_dispatch({ type: 'DELETE_CUSTOM_PRODUCT', payload: lineId })
    }

    const saveProductsAndCloseModal = () => {
        productSelectionModal_dispatch({ type: 'UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS' })
        productSelectionModal_dispatch({ type: 'DELETE_ALL_CUSTOM_PRODUCTS' })
        productSelectionModal_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const columns = [
        {
            align: 'start',
            colSpan: 2,
            dataIndex: 'concept',
            ellipsis: true,
            key: 'concept',
            onCell: () => ({ colSpan: 2 }),
            render: (_, product) => product.nombre,
            title: 'Concepto'
        },
        {
            align: 'start',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (_, product) => product.precioUnitario,
            title: 'Precio unitario'
        },
        {
            align: 'start',
            dataIndex: 'percentageIVA',
            key: 'percentageIVA',
            render: (_, product) => product.porcentajeIvaVenta,
            title: 'Porcentaje IVA'
        },
        {
            align: 'start',
            dataIndex: 'remove',
            key: 'remove',
            onCell: () => ({ width: '100%' }),
            render: (_, product) => (
                <Col
                    align='start'
                    key={product._id}
                    onClick={() => removeCustomProduct(product._id)}
                >
                    <Delete />
                </Col>
            ),
            title: 'Quitar'
        }
    ]

    return (
        <Modal
            open={productSelectionModal_state.listOfCustomProductModalIsVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            width={1200}
        >
            <Table
                columns={columns}
                dataSource={productSelectionModal_state.selectedCustomProducts}
            />
            <br />
            <Row justify='space-around'>
                <Col span={8}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Button
                                danger
                                onClick={() => cancelAndCloseModal()}
                                style={{ width: '100%' }}
                                type='primary'
                            >
                                Cancelar
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                danger
                                onClick={() => removeAllCustomProducts()}
                                style={{ width: '100%' }}
                                type='default'
                            >
                                Eliminar todos
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Button
                                className='btn-primary'
                                onClick={() => openCustomProductModal()}
                            >
                                Añadir
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                onClick={() => saveProductsAndCloseModal()}
                                style={{ width: '100%' }}
                                type='primary'
                            >
                                Aceptar
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}

export default ListCustomLinesModal