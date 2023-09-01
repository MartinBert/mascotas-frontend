// React Components and Hooks
import React, { useEffect, useState } from 'react'

// Design Components
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd'

// Custom Context Providers
import contextProviders from '../../contextProviders'

// Imports Destructuring
const { useProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider
const { useSaleContext } = contextProviders.SaleContextProvider

const initialLineState = (index = 0) => {
    return {
        _id: 'customProduct_' + (1 + index),
        concept: '',
        percentageIVA: 21,
        unitPrice: 0
    }
}

const CustomLineModal = () => {
    const [productSelectionModal_state, productSelectionModal_dispatch] = useProductSelectionModalContext()
    const [sale_state] = useSaleContext()
    const [product, setProduct] = useState(initialLineState())

    const addLine = () => {
        productSelectionModal_dispatch({ type: 'SET_CUSTOM_PRODUCT', payload: product })
        productSelectionModal_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
    }

    const cancelAndCloseModal = () => {
        setProduct(initialLineState())
        productSelectionModal_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
    }

    const clearLineState = () => {
        setProduct(initialLineState(
            productSelectionModal_state.selectedCustomProducts.length
                + (sale_state.renglonesPersonalizados.length === 0)
                ? 0
                : sale_state.renglonesPersonalizados.length
                + 1
        ))
    }

    const setLineValue = async (e) => {
        const target = e.target.id
        const value = (typeof initialLineState()[e.target.id] === 'number')
            ? parseFloat(e.target.value)
            : e.target.value

        const updatedLine = {
            ...product,
            [target]: value
        }
        setProduct(updatedLine)
    }

    useEffect(() => {
        const updateProductId = () => {
            const savedCustomProductsQuantity = productSelectionModal_state.selectedProducts.reduce(
                (acc, el) => acc + ((el._id).startsWith('customProduct_') ? 1 : 0), 0
            )

            const nextProduct = {
                ...product,
                _id: 'customProduct_' + (
                    productSelectionModal_state.selectedCustomProducts.length
                    + savedCustomProductsQuantity
                    + 1
                )
            }
            setProduct(nextProduct)
        }
        updateProductId()
    }, [
        productSelectionModal_state.selectedCustomProducts.length,
        sale_state.renglonesPersonalizados.length
    ])

    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={productSelectionModal_state.customProductModalIsVisible}
            width={800}
        >
            <Form
                initialValues={product}
                onChangeCapture={e => setLineValue(e)}
                onFinish={() => addLine()}
                onResetCapture={() => clearLineState()}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label='Concepto'
                            name='concept'
                            rules={[
                                {
                                    message: '¡Debes especificar el concepto!',
                                    required: true
                                }
                            ]}
                        >
                            <Input.TextArea
                                rows={2}
                                value={product.concept}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} justify='center'>
                    <Col span={8}>
                        <Form.Item
                            label='Precio Unit.'
                            name='unitPrice'
                            rules={[
                                {
                                    message: '¡Debes especificar un precio unitario mayor que cero!',
                                    min: 0.00000000000000000001,
                                    required: true,
                                    type: 'number'
                                }
                            ]}
                        >
                            <InputNumber
                                value={product.unitPrice}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label='Porcentaje IVA'
                            name='percentageIVA'
                            rules={[
                                {
                                    message: '¡Debes especificar un porcentaje IVA mayor que cero!',
                                    min: 0.00000000000000000001,
                                    required: true,
                                    type: 'number'
                                }
                            ]}
                        >
                            <InputNumber
                                value={product.percentageIVA}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='space-around'>
                    <Col span={12}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item>
                                    <Button
                                        danger
                                        onClick={() => cancelAndCloseModal()}
                                        style={{ width: '100%' }}
                                        type='primary'
                                    >
                                        Cancelar
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    <Button
                                        danger
                                        htmlType='reset'
                                        style={{ width: '100%' }}
                                        type='default'
                                    >
                                        Reiniciar
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                htmlType='submit'
                                style={{ width: '100%' }}
                                type='primary'
                            >
                                Añadir
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default CustomLineModal