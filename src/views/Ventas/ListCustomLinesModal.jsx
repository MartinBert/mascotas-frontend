// React Components and Hooks
import React from 'react'

// Custom Components
import icons from '../../components/icons'

// Design Components
import { Button, Col, Modal, Row, Table } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Imports Destructurings
const { useCustomProductsContext } = contexts.CustomProducts
const { useSaleProductsContext } = contexts.SaleProducts
const { Delete } = icons


const ListCustomLinesModal = () => {
    const [customProducts_state, customProducts_dispatch] = useCustomProductsContext()
    const [, saleProducts_dispatch] = useSaleProductsContext()

    const cancelAndCloseModal = () => {
        customProducts_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const openCustomProductModal = () => {
        customProducts_dispatch({ type: 'SHOW_CUSTOM_PRODUCT_MODAL' })
    }

    const removeAllCustomProducts = () => {
        customProducts_dispatch({ type: 'DELETE_ALL_CUSTOM_PRODUCTS' })
    }

    const removeCustomProduct = (lineId) => {
        customProducts_dispatch({ type: 'DELETE_CUSTOM_PRODUCT', payload: lineId })
    }

    const saveProductsAndCloseModal = () => {
        saleProducts_dispatch({
            type: 'UNIFY_PRODUCTS_WITH_CUSTOM_PRODUCTS',
            payload: customProducts_state.customSaleProducts
        })
        customProducts_dispatch({ type: 'DELETE_ALL_CUSTOM_PRODUCTS' })
        customProducts_dispatch({ type: 'HIDE_LIST_OF_CUSTOM_PRODUCT_MODAL' })
    }

    const columns = [
        {
            align: 'start',
            colSpan: 2,
            dataIndex: 'customLinesModal_concept',
            ellipsis: true,
            key: 'customLinesModal_concept',
            onCell: () => ({ colSpan: 2 }),
            render: (_, product) => product.nombre,
            title: 'Concepto'
        },
        {
            align: 'start',
            dataIndex: 'customLinesModal_unitPrice',
            key: 'customLinesModal_unitPrice',
            render: (_, product) => product.precioVenta,
            title: 'Precio unitario'
        },
        {
            align: 'start',
            dataIndex: 'customLinesModal_percentageIVA',
            key: 'customLinesModal_percentageIVA',
            render: (_, product) => product.porcentajeIvaVenta,
            title: 'Porcentaje IVA'
        },
        {
            align: 'start',
            dataIndex: 'customLinesModal_remove',
            key: 'customLinesModal_remove',
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
            open={customProducts_state.listOfCustomProductModalIsVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            width={1200}
        >
            <Table
                columns={columns}
                dataSource={customProducts_state.customSaleProducts}
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