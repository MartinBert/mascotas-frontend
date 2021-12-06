import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import Header from './Header';
import { Link } from 'react-router-dom';
import { errorAlert } from '../../components/alerts';
import icons from '../../components/icons';

const { Edit, Delete } = icons;

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(null);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState(null);

    useEffect(() => {
      const fetchUsuarios = async() => {
        const data = await api.usuarios.getAll({page, limit, filters});
        setUsuarios(data.docs);
        setTotalDocs(data.totalDocs);
        setLoading(false);
      }
      fetchUsuarios();
    },[page, limit, filters, loading])

    const handleDelete = async(id) => {
      const response = await api.usuarios.deleteUsuario(id);
      
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
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Perfil',
        render: (data) => ((data.perfil) ? "Super administrador" : "Administrador")
      },
      {
        title: 'Acciones',
        render: ({_id}) => (
          <Row>
            <Link to={`/usuarios/${_id}`}>
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
              dataSource={usuarios}
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

export default Usuarios;