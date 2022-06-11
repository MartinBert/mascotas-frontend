import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import Header from './Header';
import icons from '../../components/icons';
import DetailsModal from './DetailsModal';
import DeleteModal from './DeleteModal';
import helpers from '../../helpers';

const { Details, Edit, Delete } = icons;
const { dateHelper } = helpers;

const Salidas = () => {
    const history = useHistory();
    const [salidas, setSalidas] = useState(null);
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

    useEffect(() => {
      const fetchSalidas = async() => {
        const response = await api.salidas.getAll({page, limit, filters: JSON.stringify(filters)});
        setSalidas(response.data.docs);
        setTotalDocs(response.data.totalDocs);
        setLoading(false);
      }
      fetchSalidas();
    },[page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
      if(deleteEntityId === null) return;
      const deleteSalida = async() => {
        setLoading(true);
        api.salidas.deleteById(deleteEntityId)
        .then(() => {
          setDeleteEntityId(null)
          setLoading(false);
        })
      }
      deleteSalida();
    }, [deleteEntityId])

    const editSalida = (id) => {
      history.push(`/salidas/${id}`);
    }

    const columnsForTable = [
      {
        title: 'Descripción',
        dataIndex: 'descripcion',
      },
      {
        title: 'Fecha',
        render: (data) => (
          <p>{dateHelper.simpleDateWithHours(data.fecha)+' hs'}</p>
        ),
      },
      {
        title: 'Productos que salieron',
        render: data => (
          <div onClick={() => {
            console.log(data.productos)
            setDetailsData(data.productos);
            setDetailsVisible(true)
          }}>
            <Details/>
          </div>
        )
      },
      {
        title: 'Ganancia neta',
        dataIndex: 'gananciaNeta',
      },
      {
        title: 'Usuario',
        dataIndex: 'usuario',
        render: usuario => usuario.nombre
      },
      {
        title: 'Acciones',
        render: (salida) => (
          <Row style={{display: 'inline-flex'}}>
            <div onClick={() => {editSalida(salida._id)}}>
              <Edit/>
            </div>
            <div onClick={() => {
              setDeleteEntityIdConfirmation(salida._id);
              setDeleteVisible(true);
            }}>
              <Delete/>
            </div>
          </Row>
        )
      },
    ]

    return (
        <Row>
            <Col span={24}>
              <Header setFilters={setFilters} filters={filters}/>
            </Col>
            <Col span={24}>
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
                    tableLayout='auto'
                    size="small"
                />
            </Col>
            <DetailsModal 
              detailsVisible={detailsVisible}
              setDetailsVisible={setDetailsVisible}
              detailsData={detailsData}
            />
            <DeleteModal 
              deleteVisible={deleteVisible}
              setLoading={setLoading}
              setDeleteVisible={setDeleteVisible}
              setDeleteEntityId={setDeleteEntityId}
              deleteEntityIdConfirmation={deleteEntityIdConfirmation}
            />
        </Row>
    )
}

export default Salidas;