import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import icons from '../../components/icons';
import Header from './Header';
import { Link } from 'react-router-dom';
import { errorAlert } from '../../components/alerts';

const { Edit, Delete } = icons;

const Marcas = () => {
  const [marcas, setMarcas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    const fetchMarcas = async() => {
      const data = await api.marcas.getAll({page, limit, filters});
      setMarcas(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchMarcas();
  },[page, limit, filters, loading])

  const handleDelete = async(id) => {
    const response = await api.marcas.deleteMarca(id);
    
    if(response !== 'OK') {
      errorAlert('No se pudo eliminar el registro...');
      return;
    }

    setLoading(true);
  }

  const columnsForTable = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
    },
    {
      title: 'Acciones',
      render: ({_id}) => (
        <Row flex>
          <Link to={`/marcas/${_id}`}>
            <Edit />
          </Link>
          <div onClick={() => { handleDelete(_id) }}>
            <Delete />
          </div>
        </Row>
      )
    }
  ]

  return (
    <Row>
        <Col span={24} style={{marginBottom: '10px'}}>
          <Header setFilters={setFilters}/>
        </Col>
        <Col>
          <Table 
              width={"100%"}
              dataSource={marcas}
              columns={columnsForTable}
              pagination={{
                  defaultCurrent: page,
                  limit: limit,
                  total: totalDocs,
                  showSizeChanger: true,
                  onChange: (e) => { setPage(e) },
                  onShowSizeChange: (e, val) => { setLimit(val) }
              }}
              rowKey='_id'
              tableLayout='fixed'
              size="small"
              loading={loading}
          />
        </Col>
    </Row>
  )
}

export default Marcas;