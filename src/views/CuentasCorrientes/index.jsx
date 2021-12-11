import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import icons from '../../components/icons';
import Header from './Header';
import { useHistory } from 'react-router-dom';
import DeleteModal from './DeleteModal';

const { Edit, Delete } = icons;

const CuentasCorrientes = () => {
  const [cuentasCorrientes, setCuentasCorrientes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState(null);
  const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchCuentasCorrientes = async() => {
      const data = await api.cuentasCorrientes.getAll({page, limit, filters});
      setCuentasCorrientes(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchCuentasCorrientes();
  },[page, limit, filters, loading, deleteEntityIdConfirmation])

  useEffect(() => {
    if(deleteEntityId === null) return;
    const deleteCurrentAccount = async() => {
      setLoading(true);
      api.cuentasCorrientes.deleteCuentaCorriente(deleteEntityId)
      .then(() => {
        setDeleteEntityId(null)
        setLoading(false);
      })
    }
    deleteCurrentAccount();
  }, [deleteEntityId])

  const editCurrentAccount = (id) => {
    history.push(`/cuentasCorrientes/${id}`);
  }

  const columnsForTable = [
    {
      title: 'Razón social',
      dataIndex: 'razonSocial',
    },
    {
      title: 'CUIT',
      dataIndex: 'cuit',
    },
    {
      title: 'Cond. Fiscal',
      dataIndex: 'condicionFiscal',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
    },
    {
      title: 'Ciudad',
      dataIndex: 'ciudad',
    },
    {
      title: 'Provincia',
      dataIndex: 'provincia',
    },
    {
      title: 'Acciones',
      render: ({_id}) => (
        <Row>
          <div onClick={() => {editCurrentAccount(_id)}}>
            <Edit/>
          </div>
          <div onClick={() => {
            setDeleteEntityIdConfirmation(_id);
            setDeleteVisible(true);
          }}>
            <Delete/>
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
              dataSource={cuentasCorrientes}
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
          <DeleteModal 
            deleteVisible={deleteVisible}
            setLoading={setLoading}
            setDeleteVisible={setDeleteVisible}
            setDeleteEntityId={setDeleteEntityId}
            deleteEntityIdConfirmation={deleteEntityIdConfirmation}
          />
        </Col>
    </Row>
  )
}

export default CuentasCorrientes;