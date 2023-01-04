import React from 'react';
import { Modal, Table, Row, Col } from 'antd';
import helpers from '../../helpers';

const { dateHelper } = helpers;

const DetailsModal = ({detailsVisible, setDetailsVisible, detailsData}) => {
    const columns = [
        {
            title: 'Iva venta',
            dataIndex: 'ivaVenta',
        },
        {
            title: 'Precio de venta',
            dataIndex: 'precioVenta',
        },
        {
            title: 'Precio de vta. prod. fraccionado',
            dataIndex: 'precioVentaFraccionado',
        },
    ]
    return (
    <Modal 
        title='Detalle de producto' 
        open={detailsVisible}
        onCancel={() => {setDetailsVisible(false)}}
        footer={false}
        width={800}
    >
        <Row>
            <Col span={24} style={{marginBottom: '15px'}}>
                <Row>
                    <Col span={16} style={{marginTop: '25px'}}>
                        <div>
                            <h3>
                                Marca: {(detailsData && detailsData.marca) ? detailsData.marca.nombre : 'Sin Marca'}
                            </h3>
                        </div>
                        <div>
                            <h3>
                                Rubro: {(detailsData && detailsData.rubro) ? detailsData.rubro.nombre : 'Sin Rubro'}
                            </h3>
                        </div>
                        <div>
                            <h3>Última modificación: {(detailsData) ? dateHelper.simpleDateWithHours(detailsData.updatedAt) : null}</h3>
                        </div>
                    </Col>
                    {
                        (detailsData && detailsData.imagenes[0])
                        ?
                        <Col span={8}>
                            <img 
                                src={detailsData.imagenes[0].url} 
                                alt='producto' 
                                height='150' 
                                width='150'
                                onClick={() => window.open(detailsData.imagenes[0].url, '_blank')}
                            />
                        </Col>
                        : null
                    }
                </Row>
            </Col>
            <Col span={24}>
                <Table 
                    dataSource={[detailsData]} 
                    columns={columns}
                    pagination={false}
                    rowKey='_id'
                />
            </Col>
        </Row>
    </Modal>
  )
}

export default DetailsModal;