import React, {useState, useEffect} from "react";
import api from '../../services';
import { Row, Col, Form, Input, Button } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { errorAlert, successAlert } from '../../components/alerts'

const { Error } = messages;
const { Spinner } = graphics;

const RubrosForm = () => {
  const history = useHistory();
  const {id} = useParams(); 
  const [rubro, setRubro] = useState({
    nombre: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRubroData = (e) => {
    setRubro({
      ...rubro,
      [e.target.name] : e.target.value
    })
  }

  //eslint-disable-next-line
  useEffect(() => {
    if(rubro.nombre) return;
    if(id === 'nuevo'){
      setLoading(false);
      return;
    }

    const fetchRubro = async() => {
      const searchedItem = await api.rubros.getById(id);
      setRubro({
        _id: searchedItem._id,
        nombre: searchedItem.nombre
      })
      setLoading(false);
    }
    fetchRubro();
  })

  const save = () => {
    if(!rubro.nombre){
      setError(true);
      return;
    }

    const saveItem = async() => {
      const response = (rubro._id) ? await api.rubros.edit(rubro) : await api.rubros.save(rubro);
      if(response === 'OK') return success();
      return fail();
    }
    saveItem();
  };

  const redirectToRubros = () => {
    history.push("/rubros")
  }

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToRubros();
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
          <h1>{(id === "nuevo") ? "Crear nuevo rubro" : "Editar rubro"}</h1>
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
              onChange={(e) => {loadRubroData(e)}}
              required={true}
            >
              <Input name="nombre" value={rubro.nombre} className="ml-5"/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
              <Button type="secondary" htmlType="button" onClick={() => {redirectToRubros()}} style={{marginLeft: "10px"}}>
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      }
    </Row>
  );
};

export default RubrosForm;
