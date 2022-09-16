import React, { useState, useEffect } from 'react';
import api from '../../../services';
import {Row, Col, Table} from 'antd';
import icons from '../../../components/icons';
import Header from './Header';
import {useHistory} from 'react-router-dom';

const { Edit } = icons;

const VentasList = () => {
  const [ventas, setVentas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchVentasList = async() => {
      const data = await api.ventas.findAll({page, limit, filters});
      setVentas(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchVentasList();
  },[page, limit, filters, loading])

  const editBrand = (id) => {
    history.push(`/ventas/${id}`);
  }

  const columnsForTable = [
    {
      title: 'Fecha',
      render: (venta) => (
        <p>{venta.fechaEmisionString}</p>
      ),
    },
    {
      title: 'Cliente',
      render: (venta) => (
        <p>{venta.clienteRazonSocial}</p>
      ),
    },
    {
      title: 'Comprobante',
      render: (venta) => (
        <p>{venta.documento.nombre}</p>
      ),
    },
    {
      title: 'Acciones',
      render: ({_id}) => (
        <Row>
          <div onClick={() => {editBrand(_id)}}>
            <Edit/>
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
        <Col span={24}>
          <Table 
              width={"100%"}
              dataSource={ventas}
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
              tableLayout='auto'
              size="small"
              loading={loading}
          />
        </Col>
    </Row>
  )
}

export default VentasList;