import React from 'react'
import { Modal, Table } from 'antd'
import mathHelper from '../../../helpers/mathHelper'

const { roundTwoDecimals } = mathHelper
const margin0 = { margin: 0 }

const GiselaDetailsModal = ({ detailsVisible, setDetailsVisible, detailsData }) => {

    const divisor = (detailsData.nombre.includes('.'))
        ? parseFloat(detailsData.nombre.replace(/[^0-9]+(\.[0-9]+)?/g,''))/10
        : (detailsData.nombre.includes(','))
            ? parseFloat(detailsData.nombre.replace(/[^0-9]+(\,[0-9]+)?/g,''))/10
            : (detailsData.nombre.replace(/[^0-9]+/g,'') !== '')
                ? parseFloat(detailsData.nombre.replace(/[^0-9]+/g,''))
                : 1

    const columnsTable = [
        { title: 'Característica', dataIndex: 'label', key: 'key', width: 190 },
        { title: 'Valor', dataIndex: 'value', key: 'key', width: 235 },
    ]
    const dataTable = [
        { label: 'Nombre', value: <h3 style={margin0}>{(detailsData && detailsData.nombre) ? detailsData.nombre : '-'}</h3>, key: 1 },
        { label: 'Precio de lista', value: <h3 style={margin0}>{(detailsData && detailsData.precioUnitario) ? roundTwoDecimals(detailsData.precioUnitario) : '-'}</h3>, key: 2 },
        { label: 'Precio de venta', value: <h3 style={margin0}>{(detailsData && detailsData.precioVenta) ? roundTwoDecimals(detailsData.precioVenta) : '-'}</h3>, key: 3 },
        { label: 'Precio de venta por kg o unidad', value: <h3 style={margin0}>{(detailsData && detailsData.precioVenta) ? roundTwoDecimals(detailsData.precioVenta / divisor) : '-'}</h3>, key: 4 },
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