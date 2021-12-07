import React from 'react';
import { Modal, Table, Row, Col } from 'antd';

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
        <Row>
            <Col span={24}>
                <h2>
                    Marca: {(detailsData) ? detailsData.marca.nombre : null}
                </h2>
                <h2>
                    Rubro: {(detailsData) ? detailsData.rubro.nombre : null}
                </h2>
            </Col>
            <Col span={24}>
                <Table 
                    dataSource={[detailsData]} 
                    columns={columns}
                    pagination={false}
                />
            </Col>
        </Row>
    </Modal>
  )
}

export default DetailsModal;