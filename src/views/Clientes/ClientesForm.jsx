import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Button } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const ClientesForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [cliente, setCliente] = useState({
    nombre: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadClienteData = (e) => {
    setCliente({
      ...cliente,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(cliente.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchCliente = async() => {
      const searchedItem = await api.clientes.getById(id);
      setCliente({
        _id: searchedItem._id,
        nombre: searchedItem.nombre
      })
      setLoading(false);
    }
    fetchCliente()
  })

  const save = () => {
    if(!cliente.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (cliente._id) ? await api.clientes.edit(cliente) : await api.clientes.save(cliente);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToClientes = () => {
    history.push("/clientes")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToClientes();
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
        <h1>{(id === "nuevo") ? "Crear nuevo cliente" : "Editar cliente"}</h1>
      </Col>
      <Col span={12} >
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
          <Form.Item
            onChange={(e) => {loadClienteData(e)}}
            required={true}
          >
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Nombre:</p></div>
              <Input name="nombre" value={cliente.nombre}/>
            </div>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button type="primary" htmlType="submit"
            style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)',
            color: '#fff'}}>
            Guardar
          </Button>
          <Button type="secondary" htmlType="button" onClick={() => {redirectToClientes()}} style={{marginLeft: "10px"}}>
            Cancelar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ClientesForm;
