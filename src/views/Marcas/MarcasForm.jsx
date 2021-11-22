import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Button } from "antd";
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
    fetchMarca();
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
    <Row flex>
      {
      (loading) ? <Spinner/> 
      :
        <Col>
          <h1>{(id === "nuevo") ? "Crear nueva marca" : "Editar marca"}</h1>
          {(error) ? <Error message="Debe completar todos los campos obligatorios *"/> : null}
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={() => { save() }}
            autoComplete="off"
            style={{marginTop: '10px'}}
          >
            <Form.Item
              label="Nombre"
              onChange={(e) => {loadMarcaData(e)}}
              required={true}
            >
              <Input name="nombre" value={marca.nombre} className="ml-5"/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
              <Button type="secondary" htmlType="button" onClick={() => {redirectToMarcas()}} style={{marginLeft: "10px"}}>
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      }
    </Row>
  );
};

export default MarcasForm;
