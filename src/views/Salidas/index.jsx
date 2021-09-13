import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import Header from './Header';
import icons from '../../components/icons';

const { Details } = icons;

const Salidas = () => {
    const [salidas, setSalidas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(null);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState(null);

    useEffect(() => {
      const fetchSalidas = async() => {
        const data = await api.salidas.getAll({page, limit, filters});
        setSalidas(data.docs);
        setTotalDocs(data.totalDocs);
        setLoading(false);
      }
      fetchSalidas();
    },[page, limit, filters])

    const columnsForTable = [
      {
        title: 'Descripción',
        dataIndex: 'descripcion',
      },
      {
        title: 'Ganancia neta',
        dataIndex: 'gananciaNeta',
      },
      {
        title: 'Productos que salieron',
        dataIndex: 'productos',
        render: () => (<Details/>)
      },
      {
        title: 'Cantidad total de unidades',
        dataIndex: 'cantidad',
      },
      {
        title: 'Usuario',
        dataIndex: 'usuario',
        render: usuario => usuario.nombre
      },
      {
        title: 'Acciones',
        dataIndex: 'cantidadStock',
      },
    ]

    return (
        <Row>
            <Header/>
            <Col>
                <Table 
                    width={"100%"}
                    dataSource={salidas}
                    columns={columnsForTable}
                    pagination={{
                        defaultCurrent: page,
                        limit: limit,
                        total: totalDocs,
                        showSizeChanger: true,
                        onChange: (e) => { setPage(e) },
                        onShowSizeChange: (e, val) => { setLimit(val) }
                    }}
                    loading={loading}
                    rowKey='_id'
                    tableLayout='fixed'
                    size="small"
                />
            </Col>
        </Row>
    )
}

export default Salidas;