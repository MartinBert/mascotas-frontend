// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Button, Col, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { useProductsContext } = contexts.Products


const ProductStockHistoryGraphics = () => {
    const [ products_state, products_dispatch] = useProductsContext()


    return (
        <Row>
            <Col span={24}>
                <h2>Gráficos próximamente!</h2>
            </Col>
            <Col span={24}>

            </Col>
        </Row>
    )
}

export default ProductStockHistoryGraphics