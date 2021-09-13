import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import Header from './Header';

const Rubros = () => {
    const [rubros, setRubros] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(null);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState(null);

    useEffect(() => {
      const fetchRubros = async() => {
        const data = await api.rubros.getAll({page, limit, filters});
        setRubros(data.docs);
        setTotalDocs(data.totalDocs);
        setLoading(false);
      }
      fetchRubros();
    },[page, limit, filters])

    const columnsForTable = [
      {
        title: 'Nombre',
        dataIndex: 'nombre',
      }
    ]

    return (
        <Row>
            <Header/>
            <Col>
                <Table 
                    width={"100%"}
                    dataSource={rubros}
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

export default Rubros;