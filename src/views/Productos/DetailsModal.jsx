import React from 'react';
import { Modal, Table } from 'antd';

const DetailsModal = ({detailsVisible, setDetailsVisible, detailsData}) => {
    const columns = [
        {
            title: 'Precio Unitario',
            dataIndex: 'precioUnitario',
        },
        {
            title: 'Margen de Ganancia',
            dataIndex: 'margenGanancia',
        },
        {
            title: 'Precio de Venta',
            dataIndex: 'precioVenta',
        },
        {
            title: 'Ganancia Neta',
            dataIndex: 'gananciaNeta',
        },
        {
            title: 'Iva',
            dataIndex: 'iva',
        },
    ]
    return (
    <Modal 
        title="Detalle de producto" 
        visible={detailsVisible}
        onCancel={() => {setDetailsVisible(false)}}
        footer={false}
        width={800}
    >
        <Table 
            dataSource={[detailsData]} 
            columns={columns}
            pagination={false}
        />
    </Modal>
  )
}

export default DetailsModal;