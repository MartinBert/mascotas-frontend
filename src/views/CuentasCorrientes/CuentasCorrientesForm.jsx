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

const CuentasCorrientesForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [cuentaCorriente, setCuentaCorriente] = useState({
    mediosPago: [],
    cliente: null,
    fechaUltimoPago: null,
    productos: [],
    deuda: 0,
    deudaMaxima: 0,
    estado: true
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCuentaCorrienteData = (e) => {
    setCuentaCorriente({
      ...cuentaCorriente,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(cuentaCorriente.deuda) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchCuentaCorriente = async() => {
      const searchedItem = await api.cuentasCorrientes.findById(id);
      setCuentaCorriente(searchedItem);
      setLoading(false);
    }
    fetchCuentaCorriente()
  })

  const save = () => {
    if(!cuentaCorriente.razonSocial){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (cuentaCorriente._id) ? await api.cuentasCorrientes.edit(cuentaCorriente) : await api.cuentasCorrientes.save(cuentaCorriente);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToCuentasCorrientes = () => {
    history.push("/cuentasCorrientes")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToCuentasCorrientes();
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
        <h1>{(id === "nuevo") ? "Crear nuevo cuentaCorriente" : "Editar cuentaCorriente"}</h1>
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*Raz??n social:</p></div>
          <div>
            <Input name="razonSocial" value={cuentaCorriente.razonSocial}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*CUIT:</p></div>
          <div>
            <Input name="cuit" value={cuentaCorriente.cuit}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
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
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*Email:</p></div>
          <div>
            <Input name="email" value={cuentaCorriente.email}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*Direcci??n:</p></div>
          <div>
            <Input name="direccion" value={cuentaCorriente.direccion}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*Ciudad:</p></div>
          <div>
            <Input name="ciudad" value={cuentaCorriente.ciudad}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*Provincia:</p></div>
          <div>
            <Input name="provincia" value={cuentaCorriente.provincia}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadCuentaCorrienteData(e)}}
          required={true}
        >
          <div><p>*Tel??fono:</p></div>
          <div>
            <Input name="telefono" value={cuentaCorriente.telefono}/>
          </div>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Button type="primary" htmlType="submit"
          style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)',
          color: '#fff'}}>
          Guardar
        </Button>
        <Button type="secondary" htmlType="button" onClick={() => {redirectToCuentasCorrientes()}} style={{marginLeft: "10px"}}>
          Cancelar
        </Button>
      </Col>
    </Row>
  </Form>
  );
};

export default CuentasCorrientesForm;
