import React from 'react';
import { Modal, Table } from 'antd';

const DetailsModal = ({ detailsVisible, setDetailsVisible, detailsData }) => {
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
            title: 'Iva',
            dataIndex: 'iva',
        },
        {
            title: 'Cantidad entrante',
            dataIndex: 'cantidadesEntrantes',
        },
        {
            title: 'Costo total',
            render: (product) => (
                <p>{product.cantidadesEntrantes * product.precioUnitario}</p>
            ),
        },
    ]
    return (
        <Modal
            title='Detalle de producto'
            open={detailsVisible}
            onCancel={() => { setDetailsVisible(false) }}
            footer={false}
            width={800}
        >
            <Table
                dataSource={detailsData}
                columns={columns}
                pagination={false}
                rowKey='_id'
            />
        </Modal>
    )
}

export default DetailsModal;