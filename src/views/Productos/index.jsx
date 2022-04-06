import React, { useState, useEffect } from 'react';
import api from '../../services';
import {Row, Col, Table} from 'antd';
import Header from './Header';
import DetailsModal from './DetailsModal';
import icons from '../../components/icons';
import OpenImage from './OpenImage';
import {useHistory} from 'react-router-dom';
import DeleteModal from './DeleteModal';

const { Details, Edit, Delete } = icons;
const Productos = () => {
    const [products, setProducts] = useState(null);
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
      const fetchProducts = async() => {
        const stringFilters = JSON.stringify(filters)
        const data = await api.productos.getAll({page, limit, filters: stringFilters});
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
        },
        {
          title: 'Codigo de producto',
          dataIndex: 'codigoProducto',
        },
        {
          title: 'Codigo de barras',
          dataIndex: 'codigoBarras',
        },
        {
          title: 'Stock',
          dataIndex: 'cantidadStock',
        },
        {
          title: 'Detalles',
          render: (product) => (
            <div onClick={() => {seeDetails(product)}}>
              <Details title='Ver detalle'/>
            </div>
          )
        },
        {
          title: 'Imagen',
          render: (product) => (
            <OpenImage title='Ver imagen' imageUrl={(product.imagenes[0]) ? product.imagenes[0].url : ''}/>
          )
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
          )
        },
    ]

    return (
      <>
        <Row>
          <Col span={24} style={{marginBottom: '10px'}}>
            <Header setFilters={setFilters} filters={filters} setLoading={setLoading}/>
          </Col>
          <Col span={24}>
            <Table
                width={"100%"}
                dataSource={products}
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
        </Row>
        <DeleteModal 
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