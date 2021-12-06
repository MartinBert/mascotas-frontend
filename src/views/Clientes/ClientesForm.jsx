import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Button, Select } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;
const { Option } = Select;

const ClientesForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [cliente, setCliente] = useState({
    razonSocial: '',
    cuit: '',
    condicionFiscal: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const conditions = [
    {value: 'Consumidor Final', key: 1},
    {value: 'Monotributista', key: 2},
    {value: 'Responsable Ins.', key: 3},
  ]

  const loadClienteData = (e) => {
    setCliente({
      ...cliente,
      [e.target.name] : e.target.value
    })
  }

  useEffect(() => {
    setCliente({
      ...cliente,
      condicionFiscal: selectedCondition
    })
  }, 
  //eslint-disable-next-line
  [selectedCondition])

  useEffect(() => {
    if(selectedCondition) return;
    setSelectedCondition(cliente.condicionFiscal);
  }, 
  //eslint-disable-next-line
  [cliente])

  //eslint-disable-next-line
  useEffect(() => {
    if(cliente.razonSocial) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchCliente = async() => {
      const searchedItem = await api.clientes.getById(id);
      setCliente(searchedItem);
      setLoading(false);
    }
    fetchCliente()
  })

  const save = () => {
    if(!cliente.razonSocial){
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
      initialValues={{ remember: true }}
      onFinish={() => { save() }}
      autoComplete="off"
      style={{marginTop: '10px'}}
    >
    <Row gutter={8}>
      <Col span={24}>
        <h1>{(id === "nuevo") ? "Crear nuevo cliente" : "Editar cliente"}</h1>
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Razón social:</p></div>
          <div>
            <Input name="razonSocial" value={cliente.razonSocial}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*CUIT:</p></div>
          <div>
            <Input name="cuit" value={cliente.cuit}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Cond. fiscal:</p></div>
          <div>
              <Select 
                onChange={(e) => { 
                    setSelectedCondition(e)    
                }}
                defaultValue={selectedCondition}
              >
                {conditions.map(condition => (
                    <Option key={condition.key} value={condition.value}>{condition.value}</Option>
                ))}
            </Select>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Email:</p></div>
          <div>
            <Input name="email" value={cliente.email}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Dirección:</p></div>
          <div>
            <Input name="direccion" value={cliente.direccion}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Ciudad:</p></div>
          <div>
            <Input name="ciudad" value={cliente.ciudad}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Provincia:</p></div>
          <div>
            <Input name="provincia" value={cliente.provincia}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadClienteData(e)}}
          required={true}
        >
          <div><p>*Teléfono:</p></div>
          <div>
            <Input name="telefono" value={cliente.telefono}/>
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
