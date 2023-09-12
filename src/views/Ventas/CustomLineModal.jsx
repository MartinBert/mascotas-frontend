// React Components and Hooks
import React, { useEffect, useState } from 'react'

// Design Components
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd'

// Custom Context Providers
import contexts from '../../contexts'

// Imports Destructuring
const { useCustomProductsContext } = contexts.CustomProducts
const { useSaleProductsContext } = contexts.SaleProducts

const initialProductState = {
    _id: '',
    concept: '',
    percentageIVA: 21,
    unitPrice: 0
}

const CustomLineModal = () => {
    const [customProducts_state, customProducts_dispatch] = useCustomProductsContext()
    const [saleProducts_state] = useSaleProductsContext()
    const [quantityOf_notSaved_customProducts, setNotSavedQuantity] = useState(0)
    const [quantityOf_saved_customProducts, setSavedQuantity] = useState(0)
    const [productID, setProductID] = useState(0)
    const [product, setProduct] = useState(initialProductState)

    const addLine = () => {
        customProducts_dispatch({ type: 'SET_CUSTOM_PRODUCT', payload: product })
        customProducts_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
    }

    const cancelAndCloseModal = () => {
        customProducts_dispatch({ type: 'HIDE_CUSTOM_PRODUCT_MODAL' })
    }

    const clearLineState = () => {
        setProduct({...initialProductState, id: productID})
    }

    const setLineValue = async (e) => {
        const target = e.target.id
        const value = (typeof initialProductState[e.target.id] === 'number')
            ? parseFloat(e.target.value)
            : e.target.value

        const updatedLine = {
            ...product,
            [target]: value
        }
        setProduct(updatedLine)
    }

    // Set quantity of custom products not saved
    useEffect(() => {
        const updateQuantityOf_notSaved_customProducts = () => {
            setNotSavedQuantity(customProducts_state.customSaleProducts.length)
        }
        updateQuantityOf_notSaved_customProducts()
    }, [customProducts_state.customSaleProducts.length])

    // Set quantity of custom products saved
    useEffect(() => {
        const updateQuantityOf_saved_customProducts = () => {
            const quantity = saleProducts_state.products.reduce(
                (acc, el) => acc + ((el._id).startsWith('customProduct_') ? 1 : 0), 0
            )
            setSavedQuantity(quantity)
        }
        updateQuantityOf_saved_customProducts()
    }, [saleProducts_state.products])

    // Set index of following custom product
    useEffect(() => {
        setProductID(
            'customProduct_' + (
                quantityOf_notSaved_customProducts
                + quantityOf_saved_customProducts
                + 1
            ))
    }, [quantityOf_notSaved_customProducts, quantityOf_saved_customProducts])

    // Set ID of following custom product
    useEffect(() => {
        setProduct(product => ({
            ...product,
            _id: productID
        }))
    }, [productID])

    return (
        <Modal
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            okButtonProps={{ style: { display: 'none' } }}
            open={customProducts_state.customProductModalIsVisible}
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