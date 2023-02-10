import React from 'react'
import { Modal, Table } from 'antd'
import mathHelper from '../../../helpers/mathHelper'

const { roundTwoDecimals } = mathHelper
const margin0 = { margin: 0 }

const GiselaDetailsModal = ({ detailsVisible, setDetailsVisible, detailsData }) => {

    const nombre = detailsData.nombre
    const precioVenta = detailsData.precioVenta
    const precioUnitario = detailsData.precioUnitario
    const precioVentaFraccionado = detailsData.precioVentaFraccionado
    const fraccionamiento = detailsData.unidadMedida.fraccionamiento
    const salePricePerUnit = (fraccionamiento < 1000)
            ? precioVentaFraccionado / fraccionamiento
            : precioVentaFraccionado * 1000 / fraccionamiento

    const columnsTable = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235 },
    ]
    const dataTable = [
        { label: 'Nombre', value: <h3 style={margin0}>{nombre ? nombre : '-'}</h3>, key: 1 },
        { label: 'Precio de lista', value: <h3 style={margin0}>{precioUnitario ? roundTwoDecimals(precioUnitario) : '-'}</h3>, key: 2 },
        { label: 'Precio de venta total', value: <h3 style={margin0}>{precioVenta ? roundTwoDecimals(precioVenta) : '-'}</h3>, key: 3 },
        { label: 'Precio de venta fraccionado en kg (o unidades)', value: <h3 style={margin0}>{precioVentaFraccionado && fraccionamiento !== 1 ? roundTwoDecimals(salePricePerUnit) : precioVenta}</h3>, key: 4 },
    ]

    return (
        <Modal
            open={detailsVisible}
            onCancel={() => { setDetailsVisible(false) }}
            footer={false}
            width={1000}
        >
            <div justify='center'>
                <Table dataSource={dataTable} columns={columnsTable} pagination={false} bordered />
            </div>
        </Modal>
    )
}

export default GiselaDetailsModal