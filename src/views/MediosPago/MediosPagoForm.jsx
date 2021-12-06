import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Button } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const MediosPagoForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [mediopago, setMedioPago] = useState({
    nombre: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMedioPagoData = (e) => {
    setMedioPago({
      ...mediopago,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(mediopago.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchMedioPago = async() => {
      const searchedItem = await api.mediospago.getById(id);
      setMedioPago({
        _id: searchedItem._id,
        nombre: searchedItem.nombre
      })
      setLoading(false);
    }
    fetchMedioPago()
  })

  const save = () => {
    if(!mediopago.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (mediopago._id) ? await api.mediospago.edit(mediopago) : await api.mediospago.save(mediopago);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToMediosPago = () => {
    history.push("/mediospago")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToMediosPago();
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
        <h1>{(id === "nuevo") ? "Crear nuevo medio de pago" : "Editar medio de pago"}</h1>
      </Col>
      <Col span={12} >
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
          <Form.Item
            onChange={(e) => {loadMedioPagoData(e)}}
            required={true}
          >
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Nombre:</p></div>
              <Input name="nombre" value={mediopago.nombre}/>
            </div>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button type="primary" htmlType="submit"
            style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)',
            color: '#fff'}}>
            Guardar
          </Button>
          <Button type="secondary" htmlType="button" onClick={() => {redirectToMediosPago()}} style={{marginLeft: "10px"}}>
            Cancelar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default MediosPagoForm;
