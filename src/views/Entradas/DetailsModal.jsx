import React, { useState } from 'react'
import ProductDetailsModal from '../../components/generics/productDetailsModal/ProductDetailsModal'
import { Modal, Table } from 'antd'
import icons from '../../components/icons'
import mathHelper from '../../helpers/mathHelper'

const { Details } = icons
const { roundTwoDecimals } = mathHelper

const DetailsModal = ({ detailsVisible, setDetailsVisible, detailsData }) => {

    const [productDetailsVisible, setProductDetailsVisible] = useState(false)
    const [productDetails, setProductDetails] = useState(null)

    const seeDetails = (data) => {
        setProductDetails(data)
        setProductDetailsVisible(true)
    }

    const columns = [
        {
            title: 'Producto',
            render: (product) => (
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
            render: product => roundTwoDecimals(product.cantidadesEntrantes * product.precioUnitario)
        },
        {
            title: 'Detalles',
            render: (product) => (
                <div onClick={() => { seeDetails(product) }}>
                    <Details title='Ver detalle' />
                </div>
            )
        },
    ]

    return (
        <Modal
            title='Detalle de producto'
            open={detailsVisible}
            onCancel={() => { setDetailsVisible(false) }}
            footer={false}
            width={1000}
        >
            <Table
                dataSource={detailsData}
                columns={columns}
                pagination={false}
                rowKey='_id'
            />

            <ProductDetailsModal
                detailsVisible={productDetailsVisible}
                setDetailsVisible={setProductDetailsVisible}
                detailsData={productDetails}
            />
        </Modal>
    )
}

export default DetailsModal