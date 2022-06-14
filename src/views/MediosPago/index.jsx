import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import icons from '../../components/icons';
import Header from './Header';
import {DeleteModal} from '../../components/generics';
import {useHistory} from 'react-router-dom';
import DetailsModal from './DetailsModal';

const { Edit, Delete, Details } = icons;

const MediosPago = () => {
  const [mediospago, setMediosPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState(null);
  const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchMediosPago = async() => {
      const data = await api.mediospago.getAll({page, limit, filters});
      setMediosPago(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchMediosPago();
  },[page, limit, filters, loading, deleteEntityIdConfirmation])

  useEffect(() => {
    if(deleteEntityId === null) return;
    const deleteMedioPago = async() => {
      setLoading(true);
      api.mediospago.deleteMedioPago(deleteEntityId)
      .then(() => {
        setDeleteEntityId(null)
        setLoading(false);
      })
    }
    deleteMedioPago();
  }, [deleteEntityId])

  const editMedioPago = (id) => {
    history.push(`/mediospago/${id}`);
  }

  const seeDetails = (data) => {
    setDetailsData(data);
    setDetailsVisible(true);
  }

  const columnsForTable = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
    },
    {
      title: 'Suma en cierre z',
      render: (data) => (
        (data.cierrez) ? 'Si' : 'No' 
      )
    },
    {
      title: 'Suma en arqueo',
      render: (data) => (
        (data.arqueoCaja) ? 'Si' : 'No' 
      )
    },
    {
      title: 'Detalles',
      render: (data) => (
        <div onClick={() => {seeDetails(data.planes)}}>
          <Details title='Ver detalle'/>
        </div>
      )
    },
    {
      title: 'Acciones',
      render: ({_id}) => (
        <Row>
          <div onClick={() => {editMedioPago(_id)}}>
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
              dataSource={mediospago}
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
            title="Eliminar medio de pago"
            deleteVisible={deleteVisible}
            setLoading={setLoading}
            setDeleteVisible={setDeleteVisible}
            setDeleteEntityId={setDeleteEntityId}
            deleteEntityIdConfirmation={deleteEntityIdConfirmation}
          />
          <DetailsModal 
            detailsVisible={detailsVisible}
            setDetailsVisible={setDetailsVisible}
            detailsData={detailsData}
          />
        </Col>
    </Row>
  )
}

export default MediosPago;