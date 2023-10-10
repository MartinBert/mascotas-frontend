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
const { useEntriesContext } = contexts.Entries


const SelectedProductsTable = () => {
    const [entries_state] = useEntriesContext()

    const entryProductProps = [
        {
            align: 'start',
            dataIndex: 'entry_productBarcode',
            key: 'entry_productBarcode',
            render: (_, product) => product.codigoBarras,
            title: 'Código de barras'
        },
        {
            align: 'start',
            dataIndex: 'entry_productName',
            key: 'entry_productName',
            render: (_, product) => product.nombre,
            title: 'Producto'
        },
        {
            align: 'start',
            dataIndex: 'entry_productQuantity',
            key: 'entry_productQuantity',
            render: (_, product) => (
                <ProductQuantity
                    product={product}
                />
            ),
            title: 'Cantidad'
        },
        {
            align: 'start',
            dataIndex: 'entry_deleteProduct',
            key: 'entry_deleteProduct',
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
            columns={entryProductProps}
            dataSource={entries_state.products}
            rowKey='_id'
        />
    )
}

export default SelectedProductsTable