import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Checkbox } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const DocumentosForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [documento, setDocumento] = useState({
    nombre: '',
    fiscal: false,
    ticket: false,
    presupuesto: false,
    remito: false,
    letra: '',
    codigoUnico: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDocumentoData = (e) => {
    setDocumento({
      ...documento,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(documento.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchDocumento = async() => {
      const searchedItem = await api.documentos.findById(id);
      setDocumento(searchedItem);
      setLoading(false);
    }
    fetchDocumento()
  })

  const save = () => {
    if(!documento.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (documento._id) ? await api.documentos.edit(documento) : await api.documentos.save(documento);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToDocumentos = () => {
    history.push("/documentos")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToDocumentos();
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
        <h1>{(id === "nuevo") ? "Crear nuevo documento" : "Editar documento"}</h1>
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadDocumentoData(e)}}
          required={true}
        >
          <div><p>*Nombre:</p></div>
          <div>
            <Input name="nombre" value={documento.nombre}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={18} lg={16} md={12} sm={12} xs={24} style={{display: 'flex'}}>
        <Form.Item
          required={true}
          style={{marginRight: '25px'}}
        >
          <div><p>Fiscal:</p></div>
          <div>
            <Checkbox 
              onChange={(e) => {setDocumento({
                  ...documento,
                  fiscal: e.target.checked
              })}} 
              checked={documento.fiscal}
            />
          </div>
        </Form.Item>
        <Form.Item
          required={true}
          style={{marginRight: '25px'}}
        >
          <div><p>Ticket:</p></div>
          <div>
            <Checkbox 
              onChange={(e) => {setDocumento({
                  ...documento,
                  ticket: e.target.checked
              })}} 
              checked={documento.ticket}
            />
          </div>
        </Form.Item>
        <Form.Item
          required={true}
          style={{marginRight: '25px'}}
        >
          <div><p>Presupuesto:</p></div>
          <div>
            <Checkbox 
              onChange={(e) => {setDocumento({
                  ...documento,
                  presupuesto: e.target.checked
              })}} 
              checked={documento.presupuesto}
            />
          </div>
        </Form.Item>
        <Form.Item
          required={true}
        >
          <div><p>Remito:</p></div>
          <div>
            <Checkbox 
              onChange={(e) => {setDocumento({
                  ...documento,
                  remito: e.target.checked
              })}} 
              checked={documento.remito}
            />
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadDocumentoData(e)}}
          required={true}
        >
          <div><p>*Letra:</p></div>
          <div>
            <Input name="letra" value={documento.letra}/>
          </div>
        </Form.Item>
      </Col>
      <Col xl={6} lg={8} md={12} sm={12} xs={24}>
        <Form.Item
          onChange={(e) => {loadDocumentoData(e)}}
          required={true}
        >
          <div><p>*Código único:</p></div>
          <div>
            <Input name="codigoUnico" value={documento.codigoUnico}/>
          </div>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={6} style={{display: 'flex'}}>
            <button className="btn-primary" type="submit">
              Guardar
            </button>
            <button className="btn-secondary" onClick={() => {redirectToDocumentos()}} style={{marginLeft: "10px"}}>
              Cancelar
            </button>
          </Col>
        </Row>
      </Col>
    </Row>
  </Form>
  );
};

export default DocumentosForm;
