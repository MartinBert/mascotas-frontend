import React, { useState, useEffect } from 'react'
import api from '../../services'
import {Row, Col, Table} from 'antd'
import Header from './Header'
import {useNavigate} from 'react-router-dom'
import {DeleteModal} from '../../components/generics'
import icons from '../../components/icons'

const { Edit, Delete } = icons

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(null)
    const [limit, setLimit] = useState(10)
    const [filters, setFilters] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteEntityId, setDeleteEntityId] = useState(null)
    const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
      const fetchUsuarios = async() => {
        const data = await api.usuarios.findAll({page, limit, filters})
        setUsuarios(data.docs)
        setTotalDocs(data.totalDocs)
        setLoading(false)
      }
      fetchUsuarios()
    },[page, limit, filters, loading, deleteEntityIdConfirmation])

    useEffect(() => {
      if(deleteEntityId === null) return
      const deleteUser = async() => {
        setLoading(true)
        api.usuarios.deleteUsuario(deleteEntityId)
        .then(() => {
          setDeleteEntityId(null)
          setLoading(false)
        })
      }
      deleteUser()
    }, [deleteEntityId])

    const editUser = (id) => {
      navigate(`/usuarios/${id}`)
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
        render: (data) => ((data.perfil) ? 'Super administrador' : 'Administrador')
      },
      {
        title: 'Acciones',
        render: ({_id}) => (
          <Row>
            <div onClick={() => {editUser(_id)}}>
              <Edit/>
            </div>
            <div onClick={() => {
              setDeleteEntityIdConfirmation(_id)
              setDeleteVisible(true)
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
              width={'100%'}
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
              tableLayout='auto'
              size='small'
          />
          <DeleteModal
            title='Eliminar usuario'
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

export default Usuarios