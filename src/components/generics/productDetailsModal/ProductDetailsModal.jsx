// React Components And Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Modal, Row, Col, Table } from 'antd'

// Helpers
import helpers from '../../../helpers'

// Imports Destructuring
const { useProductsContext } = contexts.Products
const { existsProperty } = helpers.objHelper

const margin0 = { margin: 0 }


const ProductDetailsModal = () => {
    const [products_state, products_dispatch] = useProductsContext()
    const productData = products_state.detailsModal.product

    const onCancel = () => {
        products_dispatch({ type: 'HIDE_PRODUCT_DETAILS_MODAL' })
    }

    const columnsTable1 = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235 },
    ]

    const dataTable1 = [
        { label: 'Nombre', value: <h3 style={margin0}>{existsProperty(productData, 'nombre') ? productData.nombre : '-'}</h3>, key: 1 },
        { label: 'Marca', value: <h3 style={margin0}>{existsProperty(productData, 'marca') ? productData.marca.nombre : '-'}</h3>, key: 2 },
        { label: 'Rubro', value: <h3 style={margin0}>{existsProperty(productData, 'rubro') ? productData.rubro.nombre : '-'}</h3>, key: 3 },
        { label: 'Cód. producto', value: <h3 style={margin0}>{existsProperty(productData, 'codigoProducto') ? productData.codigoProducto : '-'}</h3>, key: 4 },
        { label: 'Cód. barras', value: <h3 style={margin0}>{existsProperty(productData, 'codigoBarras') ? productData.codigoBarras : '-'}</h3>, key: 5 },
        { label: 'Unidad de medida', value: <h3 style={margin0}>{existsProperty(productData, 'unidadMedida') ? productData.unidadMedida.nombre : '-'}</h3>, key: 6 },
        { label: 'Cant. en Stock', value: <h3 style={margin0}>{existsProperty(productData, 'cantidadStock') ? productData.cantidadStock : '-'}</h3>, key: 7 },
        { label: 'Cant. fracc. en Stock', value: <h3 style={margin0}>{existsProperty(productData, 'cantidadFraccionadaStock') ? productData.cantidadFraccionadaStock : '-'}</h3>, key: 8 },
        { label: '% IVA compra', value: <h3 style={margin0}>{existsProperty(productData, 'porcentajeIvaCompra') ? productData.porcentajeIvaCompra : '-'}</h3>, key: 9 },
        { label: 'IVA compra', value: <h3 style={margin0}>{existsProperty(productData, 'ivaCompra') ? productData.ivaCompra : '-'}</h3>, key: 10 },
    ]

    const columnsTable2 = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235 },
    ]
    const dataTable2 = [
        { label: 'Precio de lista', value: <h3 style={margin0}>{existsProperty(productData, 'precioUnitario') ? productData.precioUnitario : '-'}</h3>, key: 11 },
        { label: 'Margen ganancia', value: <h3 style={margin0}>{existsProperty(productData, 'margenGanancia') ? productData.margenGanancia : '-'}</h3>, key: 12 },
        { label: 'Margen ganancia fracc.', value: <h3 style={margin0}>{existsProperty(productData, 'margenGananciaFraccionado') ? productData.margenGananciaFraccionado : '-'}</h3>, key: 13 },
        { label: '% IVA', value: <h3 style={margin0}>{existsProperty(productData, 'porcentajeIvaVenta') ? productData.porcentajeIvaVenta : '-'}</h3>, key: 14 },
        { label: 'IVA', value: <h3 style={margin0}>{existsProperty(productData, 'ivaVenta') ? productData.ivaVenta : '-'}</h3>, key: 15 },
        { label: 'Precio de venta', value: <h3 style={margin0}>{existsProperty(productData, 'precioVenta') ? productData.precioVenta : '-'}</h3>, key: 16 },
        { label: 'Ganancia neta', value: <h3 style={margin0}>{existsProperty(productData, 'gananciaNeta') ? productData.gananciaNeta : '-'}</h3>, key: 17 },
        { label: 'Precio de venta fracc.', value: <h3 style={margin0}>{existsProperty(productData, 'precioVentaFraccionado') ? productData.precioVentaFraccionado : '-'}</h3>, key: 18 },
        { label: 'Ganancia neta fracc.', value: <h3 style={margin0}>{existsProperty(productData, 'gananciaNetaFraccionado') ? productData.gananciaNetaFraccionado : '-'}</h3>, key: 19 }
    ]

    return (
        <Modal
            open={products_state.detailsModal.modalVisibility}
            onCancel={onCancel}
            footer={false}
            width={1000}
        >
            <Row justify='center'>
                <Col><Table dataSource={dataTable1} columns={columnsTable1} pagination={false} bordered /></Col>
                <Col><Table dataSource={dataTable2} columns={columnsTable2} pagination={false} bordered /></Col>
            </Row>
        </Modal>
    )
}

export default ProductDetailsModal