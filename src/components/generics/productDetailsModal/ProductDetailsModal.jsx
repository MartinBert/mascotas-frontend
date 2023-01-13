import React from 'react';
import { Modal, Row, Col, Table } from 'antd'

const ProductDetailsModal = ({ detailsVisible, setDetailsVisible, detailsData }) => {

    const dataTable1 = [
        { label: 'Nombre', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.nombre) ? detailsData.nombre : '-'}</h3>, key: 1 },
        { label: 'Marca', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.marca) ? detailsData.marca.nombre : '-'}</h3>, key: 2 },
        { label: 'Rubro', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.rubro) ? detailsData.rubro.nombre : '-'}</h3>, key: 3 },
        { label: 'Cód. producto', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.codigoProducto) ? detailsData.codigoProducto : '-'}</h3>, key: 4 },
        { label: 'Cód. barras', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.codigoBarras) ? detailsData.codigoBarras : '-'}</h3>, key: 5 },
        { label: 'Unidad de medida', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.unidadMedida.nombre) ? detailsData.unidadMedida.nombre : '-'}</h3>, key: 6 },
        { label: 'Cant. en Stock', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.cantidadStock) ? detailsData.cantidadStock : '-'}</h3>, key: 7 },
        { label: 'Cant. fracc. en Stock', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.cantidadFraccionadaStock) ? detailsData.cantidadFraccionadaStock : '-'}</h3>, key: 8 },
        { label: '% IVA compra', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.porcentajeIvaCompra) ? detailsData.porcentajeIvaCompra : '-'}</h3>, key: 9 },
        { label: 'IVA compra', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.ivaCompra) ? detailsData.ivaCompra : '-'}</h3>, key: 10 },
    ]

    const dataTable2 = [
        { label: 'Precio de lista', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.precioUnitario) ? detailsData.precioUnitario : '-'}</h3>, key: 11 },
        { label: 'Margen ganancia', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.margenGanancia) ? detailsData.margenGanancia : '-'}</h3>, key: 12 },
        { label: 'Margen ganancia fracc.', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.margenGananciaFraccionado) ? detailsData.margenGananciaFraccionado : '-'}</h3>, key: 13 },
        { label: '% IVA', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.porcentajeIvaVenta) ? detailsData.porcentajeIvaVenta : '-'}</h3>, key: 14 },
        { label: 'IVA', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.ivaVenta) ? detailsData.ivaVenta : '-'}</h3>, key: 15 },
        { label: 'Precio de venta', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.precioVenta) ? detailsData.precioVenta : '-'}</h3>, key: 16 },
        { label: 'Ganancia neta', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.gananciaNeta) ? detailsData.gananciaNeta : '-'}</h3>, key: 17 },
        { label: 'Precio de venta fracc.', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.precioVentaFraccionado) ? detailsData.precioVentaFraccionado : '-'}</h3>, key: 18 },
        { label: 'Ganancia neta fracc.', value: <h3 style={{margin: 0}}>{(detailsData && detailsData.gananciaNetaFraccionado) ? detailsData.gananciaNetaFraccionado : '-'}</h3>, key: 19 }
    ]

    const columnsTable1 = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235},
    ]

    const columnsTable2 = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235 },
    ]

    return (
        <Modal
            open={detailsVisible}
            onCancel={() => { setDetailsVisible(false) }}
            footer={false}
            width={1000}
        >
            <Row justify='center'>
                <Col><Table dataSource={dataTable1} columns={columnsTable1} pagination={false} bordered /></Col>
                <Col><Table dataSource={dataTable2} columns={columnsTable2} pagination={false} bordered /></Col>
            </Row>
        </Modal>
    )
}

export default ProductDetailsModal