import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import icons from '../../components/icons';
import Header from './Header';
import { Link } from 'react-router-dom';
import { errorAlert } from '../../components/alerts';

const { Edit, Delete } = icons;

const Clientes = () => {
  const [clientes, setClientes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    const fetchClientes = async() => {
      const data = await api.clientes.getAll({page, limit, filters});
      setClientes(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchClientes();
  },[page, limit, filters, loading])

  const handleDelete = async(id) => {
    const response = await api.clientes.deleteCliente(id);
    
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
        <Row>
          <Link to={`/clientes/${_id}`}>
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
              dataSource={clientes}
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

export default Clientes;