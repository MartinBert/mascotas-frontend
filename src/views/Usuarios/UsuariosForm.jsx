import React, { useState, useEffect } from "react";
import api from "../../services";
import { Row, Col, Form, Input, Button } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from "../../components/messages";
import graphics from "../../components/graphics";
import { errorAlert, successAlert } from "../../components/alerts";
import '../../index.css'

const { Error } = messages;
const { Spinner } = graphics;

const UsuariosForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    perfil: true
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsuarioData = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  //eslint-disable-next-line
  useEffect(() => {
    if (usuario.nombre) return;
    if (id === "nuevo") {
      setLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      const searchedItem = await api.usuarios.getById(id);
      setUsuario({
        _id: searchedItem._id,
        nombre: searchedItem.nombre,
        email: searchedItem.email,
        password: searchedItem.password,
        perfil: searchedItem.perfil
      });
      setLoading(false);
    };
    fetchUsuario();
  });

  const save = () => {
    if (!usuario.nombre || !usuario.email || !usuario.password) {
      setError(true);
      return;
    }

    const saveItem = async () => {
      const response = usuario._id
        ? await api.usuarios.edit(usuario)
        : await api.usuarios.save(usuario);
      if (response === "OK") return success();
      return fail();
    };
    saveItem();
  };

  const redirectToUsuarios = () => {
    history.push("/usuarios");
  };

  const success = () => {
    successAlert("El registro se guardo en la base de datos").then(() => {
      redirectToUsuarios();
    });
  };

  const fail = () => {
    errorAlert("Error al guardar el registro");
  };

  return (
    <Row flex>
      {loading ? (
        <Spinner />
      ) : (
        <Col>
          <h1>{id === "nuevo" ? "Crear nuevo usuario" : "Editar usuario"}</h1>
          {error ? (
            <Error message="Debe completar todos los campos obligatorios *" />
          ) : null}
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={() => {
              save();
            }}
            autoComplete="off"
            style={{ marginTop: "10px" }}
          >
            <Form.Item
              label="Nombre"
              onChange={(e) => {
                loadUsuarioData(e);
              }}
              required={true}
            >
              <Input name="nombre" value={usuario.nombre} className="ml-5" />
            </Form.Item>
            <Form.Item
              label="Email"
              onChange={(e) => {
                loadUsuarioData(e);
              }}
              required={true}
            >
              <Input name="email" value={usuario.email} className="ml-5" />
            </Form.Item>
            <Form.Item
              label="Password"
              onChange={(e) => {
                loadUsuarioData(e);
              }}
              required={true}
            >
              <Input
                name="password"
                value={usuario.password}
                htmlType="password"
                className="ml-5"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit"
                className="btn-primary-bg">
                Guardar
              </Button>
              <Button
                type="secondary"
                htmlType="button"
                onClick={() => {
                  redirectToUsuarios();
                }}
                style={{ marginLeft: "10px"}}
              >
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      )}
    </Row>
  );
};

export default UsuariosForm;