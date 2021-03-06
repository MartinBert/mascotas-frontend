import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Checkbox } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const CondicionesFiscalesForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [condicionFiscal, setCondicionFiscal] = useState({
    nombre: '',
    porcentajeIva: 21,
    adicionaIva: true
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCondicionFiscalData = (e) => {
    setCondicionFiscal({
      ...condicionFiscal,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(condicionFiscal.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchCondicionFiscal = async() => {
      const searchedItem = await api.condicionesfiscales.findById(id);
      setCondicionFiscal({
        _id: searchedItem._id,
        nombre: searchedItem.nombre
      })
      setLoading(false);
    }
    fetchCondicionFiscal()
  })

  const save = () => {
    if(!condicionFiscal.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (condicionFiscal._id) ? await api.condicionesfiscales.edit(condicionFiscal) : await api.condicionesfiscales.save(condicionFiscal);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToCondicionesFiscales = () => {
    history.push("/condicionesfiscales")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToCondicionesFiscales();
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
    <Row gutter={8}>
      <Col span={24}>
        <h1>{(id === "nuevo") ? "Crear nueva condicion fiscal" : "Editar condicion fiscal"}</h1>
      </Col>
      <Col span={12}>
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Nombre:</p></div>
              <Input name="nombre" value={condicionFiscal.nombre} style={{width: '100%'}} onChange={(e) => {loadCondicionFiscalData(e)}}/>
            </div>
        </Col>
        <Col span={4} style={{display: 'flex'}}>
          <div style={{marginRight: '15px'}}><p>Adiciona IVA:</p></div>
          <div>
            <Checkbox 
              onChange={(e) => {setCondicionFiscal({
                  ...condicionFiscal,
                  adicionaIva: e.target.checked
              })}} 
              checked={condicionFiscal.adicionaIva}
            />
          </div>
        </Col>
        <Col span={8}>
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Porc. IVA:</p></div>
              <Input type="number" name="porcentajeIva" value={condicionFiscal.porcentajeIva} style={{width: '150px'}} onChange={(e) => {loadCondicionFiscalData(e)}}/>
            </div>
        </Col>
        <Col span={6} style={{display: 'flex', marginTop: '15px'}}>
          <button className="btn-primary" type="submit">
            Guardar
          </button>
          <button className="btn-secondary" type="button" onClick={() => {redirectToCondicionesFiscales()}} style={{marginLeft: "10px"}}>
            Cancelar
          </button>
        </Col>
      </Row>
    </Form>
  );
};

export default CondicionesFiscalesForm;
