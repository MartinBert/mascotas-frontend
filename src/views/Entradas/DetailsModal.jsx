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
const { useEntriesContext } = contexts.Entries
const { useProductsContext } = contexts.Products
const { Details } = icons
const { roundTwoDecimals } = mathHelper


const DetailsModal = () => {
    const [entries_state, entries_dispatch] = useEntriesContext()
    const [, products_dispatch] = useProductsContext()

    const onCancel = () => {
        entries_dispatch({ type: 'HIDE_DETAILS_MODAL' })
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
            title: 'Cantidad entrante',
            dataIndex: 'cantidadesEntrantes',
        },
        {
            title: 'Costo total',
            render: (_, product) => roundTwoDecimals(product.cantidadesEntrantes * product.precioUnitario)
        },
        {
            title: 'Detalles',
            render: (_, product) => (
                <div onClick={() => setdetailsModal(product)}>
                    <Details title='Ver detalle' />
                </div>
            )
        }
    ]

    return (
        <Modal
            title='Detalle de producto'
            open={entries_state.detailsModalVisibility}
            onCancel={onCancel}
            footer={false}
            width={1000}
        >
            <Table
                dataSource={entries_state.dataForDetailsModal}
                columns={columns}
                pagination={false}
                rowKey='_id'
            />
            <ProductDetailsModal />
        </Modal>
    )
}

export default DetailsModal