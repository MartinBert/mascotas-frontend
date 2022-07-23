import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import icons from '../../components/icons';
import {OpenImage} from '../../components/generics';
import Header from './Header';
import {DeleteModal} from '../../components/generics';
import {useHistory} from 'react-router-dom';

const { Edit, Delete } = icons;

const Empresas = () => {
  const [empresas, setEmpresas] = useState(null);
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
    const fetchEmpresas = async() => {
      const data = await api.empresas.findAll({page, limit, filters});
      setEmpresas(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchEmpresas();
  },[page, limit, filters, loading, deleteEntityIdConfirmation])

  useEffect(() => {
    if(deleteEntityId === null) return;
    const deleteBrand = async() => {
      setLoading(true);
      api.empresas.deleteEmpresa(deleteEntityId)
      .then(() => {
        setDeleteEntityId(null)
        setLoading(false);
      })
    }
    deleteBrand();
  }, [deleteEntityId])

  const editBrand = (id) => {
    history.push(`/empresas/${id}`);
  }

  const columnsForTable = [
    {
      title: 'Razón social',
      dataIndex: 'razonSocial',
    },
    {
      title: 'Cuit',
      dataIndex: 'razonSocial',
    },
    {
      title: 'Logo',
      render: ((empresa) => <OpenImage alt='Logo de empresa' imageUrl={(empresa.logo) ? empresa.logo.url : '/no-image.png'}/>)
    },
    {
      title: 'Acciones',
      render: ({_id}) => (
        <Row>
          <div onClick={() => {editBrand(_id)}}>
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
              dataSource={empresas}
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
            title="Eliminar empresa"
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

export default Empresas;