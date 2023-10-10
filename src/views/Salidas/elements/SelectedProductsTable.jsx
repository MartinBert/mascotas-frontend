// React Components and Hooks
import React from 'react'

// Context Providers
import contexts from '../../../contexts'

// Design Components
import { Table } from 'antd'

// Views
import DeleteProduct from './DeleteProduct'
import ProductQuantity from './ProductQuantity'

// Imports Destructuring
const { useOutputsContext } = contexts.Outputs


const SelectedProductsTable = () => {
    const [outputs_state] = useOutputsContext()

    const outputProductProps = [
        {
            align: 'start',
            dataIndex: 'output_productBarcode',
            key: 'output_productBarcode',
            render: (_, product) => product.codigoBarras,
            title: 'Código de barras'
        },
        {
            align: 'start',
            dataIndex: 'output_productName',
            key: 'output_productName',
            render: (_, product) => product.nombre,
            title: 'Producto'
        },
        {
            align: 'start',
            dataIndex: 'output_productQuantity',
            key: 'output_productQuantity',
            render: (_, product) => (
                <ProductQuantity
                    product={product}
                />
            ),
            title: 'Cantidad'
        },
        {
            align: 'start',
            dataIndex: 'output_deleteProduct',
            key: 'output_deleteProduct',
            render: (_, product) => (
                <DeleteProduct
                    product={product}
                />
            ),
            title: 'Eliminar producto'
        }
    ]

    return (
        <Table
            columns={outputProductProps}
            dataSource={outputs_state.products}
            rowKey='_id'
        />
    )
}

export default SelectedProductsTable