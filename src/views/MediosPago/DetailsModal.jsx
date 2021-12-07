import React from 'react';
import { Modal, Table } from 'antd';

const DetailsModal = ({detailsVisible, setDetailsVisible, detailsData}) => {
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Cant. de cuotas',
            dataIndex: 'cuotas',
        },
        {
            title: 'Porc. de variación',
            dataIndex: 'porcentaje',
        },
    ]
    return (
    <Modal 
        title="Detalle de planes" 
        visible={detailsVisible}
        onCancel={() => {setDetailsVisible(false)}}
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