// React Components and Hooks
import React from 'react'

// Custom Contexts
import contexts from '../../../contexts'

// Design Components
import { Modal, Table } from 'antd'

// Helpers
import mathHelper from '../../../helpers/mathHelper'

// Imports Destructuring
const { roundToMultiple } = mathHelper
const { useProductsContext } = contexts.Products
const margin0 = { margin: 0 }


const GiselaDetailsModal = () => {
    const [products_state, products_dispatch] = useProductsContext()

    const calculateSalePricePerUnit = (fractionament, fractionamentPrice) => {
        const salePricePerUnit = fractionament < 1000
            ? fractionamentPrice / fractionament
            : fractionamentPrice * 1000 / fractionament
        return salePricePerUnit
    }

    const onCancel = () => {
        products_dispatch({ type: 'HIDE_PRODUCT_DETAILS_MODAL' })
    }


    const columnsTable = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235 },
    ]

    const dataTable = [
        {
            key: 1,
            label: 'Nombre',
            value: (
                <h3 style={margin0}>
                    {
                        products_state.productForDetailsModal
                            ? products_state.productForDetailsModal.nombre
                            : '-'
                    }
                </h3>
            )
        },
        {
            key: 2,
            label: 'Precio de venta total',
            value: (
                <h3 style={margin0}>
                    {
                        products_state.productForDetailsModal
                            ? products_state.productForDetailsModal.precioVenta
                            : '-'
                    }
                </h3>
            )
        },
        {
            key: 3,
            label: 'Precio de venta fraccionado en kg (o unidades)',
            value: (
                <h3 style={margin0}>
                    {
                        (
                            products_state.productForDetailsModal.precioVentaFraccionado
                            && products_state.productForDetailsModal.unidadMedida.fraccionamiento !== 1
                        )
                            ? roundToMultiple(calculateSalePricePerUnit(
                                products_state.productForDetailsModal.unidadMedida.fraccionamiento,
                                products_state.productForDetailsModal.precioVentaFraccionado
                            ), 10)
                            : products_state.productForDetailsModal.precioVenta
                    }
                </h3>
            )
        }
    ]

    return (
        <Modal
            footer={false}
            onCancel={onCancel}
            open={products_state.productDetailsModalVisibility}
            width={1000}
        >
            <div justify='center'>
                <Table
                    bordered
                    columns={columnsTable}
                    dataSource={dataTable}
                    pagination={false}
                />
            </div>
        </Modal>
    )
}

export default GiselaDetailsModal