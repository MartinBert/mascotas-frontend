import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const MarcasForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [marca, setMarca] = useState({
    nombre: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMarcaData = (e) => {
    setMarca({
      ...marca,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(marca.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchMarca = async() => {
      const searchedItem = await api.marcas.getById(id);
      setMarca({
        _id: searchedItem._id,
        nombre: searchedItem.nombre
      })
      setLoading(false);
    }
    fetchMarca()
  })

  const save = () => {
    if(!marca.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (marca._id) ? await api.marcas.edit(marca) : await api.marcas.save(marca);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToMarcas = () => {
    history.push("/marcas")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToMarcas();
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
        <h1>{(id === "nuevo") ? "Crear nueva marca" : "Editar marca"}</h1>
      </Col>
      <Col span={12} >
        {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
          <Form.Item
            onChange={(e) => {loadMarcaData(e)}}
            required={true}
          >
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '15px'}}><p>*Nombre:</p></div>
              <Input name="nombre" value={marca.nombre}/>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}></Col>
        <Col span={8} style={{display: 'flex'}}>
          <button className="btn-primary" type="submit">
            Guardar
          </button>
          <button className="btn-secondary" type="button" onClick={() => {redirectToMarcas()}} style={{marginLeft: "10px"}}>
            Cancelar
          </button>
        </Col>
      </Row>
    </Form>
  );
};

export default MarcasForm;
