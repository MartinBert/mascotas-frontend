import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const PuntosVentaForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [puntoVenta, setPuntoVenta] = useState({
    nombre: '',
    numero: 1
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPuntoVentaData = (e) => {
    setPuntoVenta({
      ...puntoVenta,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(puntoVenta.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchPuntoVenta = async() => {
      const searchedItem = await api.puntosventa.findById(id);
      setPuntoVenta({
        _id: searchedItem._id,
        nombre: searchedItem.nombre
      })
      setLoading(false);
    }
    fetchPuntoVenta()
  })

  const save = () => {
    if(!puntoVenta.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (puntoVenta._id) ? await api.puntosventa.edit(puntoVenta) : await api.puntosventa.save(puntoVenta);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToPuntosVenta = () => {
    history.push("/puntosventa")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToPuntosVenta();
    })
  }

  const fail = () => {
    errorAlert('Error al guardar el registro')
  }

  return (
    (loading) ? <Spinner/> 
    :
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={() => { save() }}
      autoComplete="off"
      style={{marginTop: '10px'}}
    >
    <Row>
      <Col span={24}>
        <h1>{(id === "nuevo") ? "Crear nuevo punto de venta" : "Editar punto de venta"}</h1>
      </Col>
      <Col span={12} >
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
          <Form.Item
            onChange={(e) => {loadPuntoVentaData(e)}}
            required={true}
          >
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Nombre:</p></div>
              <Input name="nombre" value={puntoVenta.nombre}/>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            onChange={(e) => {loadPuntoVentaData(e)}}
            required={true}
          >
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Número:</p></div>
              <Input type="number" name="numero" value={puntoVenta.numero}/>
            </div>
          </Form.Item>
        </Col>
        <Col span={8} style={{display: 'flex'}}>
          <button className="btn-primary" type="submit">
            Guardar
          </button>
          <button className="btn-secondary" type="button" onClick={() => {redirectToPuntosVenta()}} style={{marginLeft: "10px"}}>
            Cancelar
          </button>
        </Col>
      </Row>
    </Form>
  );
};

export default PuntosVentaForm;
