import React from 'react';
import { Modal, Table, Row, Col } from 'antd';
import helpers from '../../helpers';

const { dateHelper } = helpers;

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
            title: 'Iva venta',
            dataIndex: 'ivaVenta',
        },
        {
            title: 'Precio de Venta',
            dataIndex: 'precioVenta',
        },
        {
            title: 'Ganancia Neta',
            dataIndex: 'gananciaNeta',
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
                <div>
                    <h3>
                        Marca: {(detailsData && detailsData.marca) ? detailsData.marca.nombre : "Sin Marca"}
                    </h3>
                </div>
                <div>
                    <h3>
                        Rubro: {(detailsData && detailsData.rubro) ? detailsData.rubro.nombre : "Sin Rubro"}
                    </h3>
                </div>
                <div>
                    <h3>Última modificación: {(detailsData) ? dateHelper.simpleDateWithHours(detailsData.updatedAt) : null}</h3>
                </div>
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