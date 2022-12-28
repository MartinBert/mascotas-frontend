import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import Header from './Header';
import DetailsModal from './DetailsModal';
import icons from '../../components/icons';
import {OpenImage} from '../../components/generics';
import {useHistory} from 'react-router-dom';
import {DeleteModal} from '../../components/generics';

const { Details, Edit, Delete } = icons;
const Productos = ({userState}) => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [limit, setLimit] = useState(6);
  const [filters, setFilters] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState(null);
  const [deleteEntityIdConfirmation, setDeleteEntityIdConfirmation] = useState(null);
  const history = useHistory();


  useEffect(() => {
    const fetchProducts = async() => {
      const stringFilters = JSON.stringify(filters)
      const data = await api.productos.findAll({page, limit, filters: stringFilters});
      setProducts(data.docs);
      setTotalDocs(data.totalDocs);
      setLoading(false);
    }
    fetchProducts();
  },[page, limit, filters, loading, deleteEntityIdConfirmation])

  useEffect(() => {
    if(deleteEntityId === null) return;
    const deleteProduct = async() => {
      setLoading(true);
      api.productos.deleteById(deleteEntityId)
      .then(() => {
        setDeleteEntityId(null)
        setLoading(false);
      })
    }
    deleteProduct();
  }, [deleteEntityId])

  const seeDetails = (data) => {
    setDetailsData(data);
    setDetailsVisible(true);
  }

  const editProduct = (id) => {
    history.push(`/productos/${id}`);
  }

  const columnsForTable = [
      {
        title: 'Nombre',
        dataIndex: 'nombre',
        visible:true
      },
      {
        title: 'Codigo de producto',
        dataIndex: 'codigoProducto',
        visible:true
      },
      {
        title: 'Codigo de barras',
        dataIndex: 'codigoBarras',
        visible:true
      },
      {
        title: 'Stock',
        dataIndex: 'cantidadStock',
        visible:true
      },
      {
        title: 'Detalles',
        render: (product) => (
          <div onClick={() => {seeDetails(product)}}>
            <Details title='Ver detalle'/>
          </div>
        ),
        visible: userState.user.perfil
      },
      {
        title: 'Imagen',
        render: (product) => (
          <OpenImage 
            alt='Ver imagen' 
            imageUrl={
              (product.imagenes && product.imagenes.length > 0) 
                ? product.imagenes[product.imagenes.length - 1].url 
                : '/no-image.png'
            }
          />
        ),
        visible:true
      },
      {
        title: 'Acciones',
        render: (product) => (
          <Row style={{display: 'inline-flex'}}>
            <div onClick={() => {editProduct(product._id)}}>
              <Edit/>
            </div>
            <div onClick={() => {
              setDeleteEntityIdConfirmation(product._id);
              setDeleteVisible(true);
            }}>
              <Delete/>
            </div>
          </Row>
        ),
        visible:true
      },
  ].filter(item => item.visible)

  return (
    <>
      <Row>
        <Col span={24} style={{marginBottom: '10px'}}>
          <Header setFilters={setFilters} filters={filters} setLoading={setLoading}/>
        </Col>
        <Col span={24}>
          <Table
              width={'100%'}
              dataSource={products}
              columns={columnsForTable}
              pagination={{
                  defaultCurrent: page,
                  limit: limit,
                  total: totalDocs,
                  showSizeChanger: true,
                  defaultPageSize: 7,
                  pageSizeOptions: [7, 14, 28, 56],
                  onChange: (e) => { setPage(e) },
                  onShowSizeChange: (e, val) => { setLimit(val) }
              }}
              loading={loading}
              rowKey='_id'
              tableLayout='auto'
              size='small'
          />
        </Col>
        <DetailsModal 
          detailsVisible={detailsVisible}
          setDetailsVisible={setDetailsVisible}
          detailsData={detailsData}
        />
      </Row>
      <DeleteModal
        title='Eliminar producto'
        deleteVisible={deleteVisible}
        setLoading={setLoading}
        setDeleteVisible={setDeleteVisible}
        setDeleteEntityId={setDeleteEntityId}
        deleteEntityIdConfirmation={deleteEntityIdConfirmation}
      />
    </>
  )
}

export default Productos;