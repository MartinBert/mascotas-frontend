// React Components and Hooks
import React from 'react'

// Custom Components
import ProductDetailsModal from '../../components/generics/productDetailsModal/ProductDetailsModal'
import icons from '../../components/icons'

// Custom Contexts
import contexts from '../../contexts'

// Design Components
import { Modal, Table } from 'antd'

// Helpers
import mathHelper from '../../helpers/mathHelper'

// Imports Destructuring
const { useOutputsContext } = contexts.Outputs
const { useProductsContext } = contexts.Products
const { Details } = icons
const { roundTwoDecimals } = mathHelper


const DetailsModal = () => {
    const [outputs_state, outputs_dispatch] = useOutputsContext()
    const [, products_dispatch] = useProductsContext()

    const onCancel = () => {
        outputs_dispatch({ type: 'HIDE_DETAILS_MODAL' })
    }

    const setdetailsModal = (product) => {
        products_dispatch({ type: 'SET_PRODUCT_FOR_DETAILS_MODAL', payload: product })
    }

    const columns = [
        {
            title: 'Producto',
            render: (_, product) => (
                <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    <p>{product.nombre}</p>
                </div>
            ),
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'precioUnitario',
        },
        {
            title: 'Iva',
            dataIndex: 'ivaVenta',
        },
        {
            title: 'Porcentaje de Ganancia',
            dataIndex: 'margenGanancia',
        },
        {
            title: 'Precio de Venta',
            dataIndex: 'precioVenta',
        },
        {
            title: 'Ganancia Neta por unidad',
            dataIndex: 'gananciaNeta',
        },
        {
            title: 'Cantidad saliente',
            dataIndex: 'cantidadesSalientes',
        },
        {
            title: 'Ganancia neta total',
            render: (_, product) => roundTwoDecimals(
                product.cantidadesSalientes * product.precioUnitario
            )
        },
        {
            title: 'Detalles',
            render: (_, product) => (
                <div onClick={() => setdetailsModal.product(product)}>
                    <Details title='Ver detalle' />
                </div>
            )
        }
    ]

    return (
        <Modal
            title='Detalle de producto'
            open={outputs_state.detailsModalVisibility}
            onCancel={onCancel}
            footer={false}
            width={1000}
        >
            <Table
                dataSource={outputs_state.dataForDetailsModal}
                columns={columns}
                pagination={false}
                rowKey='_id'
            />
            <ProductDetailsModal />
        </Modal>
    )
}

export default DetailsModal