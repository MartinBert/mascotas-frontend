import React, { useState, useEffect } from "react";
import api from "../../services";
import { Row, Col, Form, Input } from "antd";
import { useHistory, useParams } from "react-router-dom";
import messages from "../../components/messages";
import graphics from "../../components/graphics";
import { GenericAutocomplete } from "../../components/generics";
import { errorAlert, successAlert } from "../../components/alerts";

const { Error } = messages;
const { Spinner } = graphics;

const ClientesForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [cliente, setCliente] = useState({
    razonSocial: "",
    cuit: "",
    condicionFiscal: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    documentoReceptor: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const loadClienteData = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  //eslint-disable-next-line
  useEffect(() => {
    if (cliente.razonSocial) return;
    if (id === "nuevo") {
      setLoading(false);
      return;
    }

    const fetchCliente = async () => {
      const searchedItem = await api.clientes.findById(id);
      setCliente(searchedItem);
      setSelectedCondition(searchedItem.condicionFiscal);
      setLoading(false);
    };
    fetchCliente();
  });

  const save = () => {
    if (!cliente.razonSocial) {
      setError(true);
      return;
    }

    const saveItem = async () => {
      const response = cliente._id
        ? await api.clientes.edit(cliente)
        : await api.clientes.save(cliente);
      if (response === "OK") return success();
      return fail();
    };
    saveItem();
  };

  const redirectToClientes = () => {
    history.push("/clientes");
  };

  const success = () => {
    successAlert("El registro se guardo en la base de datos").then(() => {
      redirectToClientes();
    });
  };

  const fail = () => {
    errorAlert("Error al guardar el registro");
  };

  const setSelectedConditionToBusiness = async (condition) => {
    setSelectedCondition(condition);
    setCliente({
      ...cliente,
      condicionFiscal: condition,
    });
  };

  return loading ? (
    <Spinner />
  ) : (
    <Form
      initialValues={{ remember: true }}
      onFinish={() => {
        save();
      }}
      autoComplete="off"
      style={{ marginTop: "10px" }}
    >
      <Row gutter={8}>
        <Col span={24}>
          <h1>{id === "nuevo" ? "Crear nuevo cliente" : "Editar cliente"}</h1>
          {error ? (
            <Error message="Debe completar todos los campos obligatorios *" />
          ) : null}
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Razón social:</p>
            </div>
            <div>
              <Input name="razonSocial" value={cliente.razonSocial} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*CUIT:</p>
            </div>
            <div>
              <Input name="cuit" value={cliente.cuit} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Tipo doc. receptor:</p>
            </div>
            <div>
              <Input name="documentoReceptor" value={cliente.documentoReceptor} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Cond. fiscal:</p>
            </div>
            <div>
              <GenericAutocomplete
                label="Condición Fiscal"
                modelToFind="condicionfiscal"
                keyToCompare="nombre"
                controller="condicionesfiscales"
                setResultSearch={setSelectedConditionToBusiness}
                selectedSearch={selectedCondition}
                returnCompleteModel={true}
              />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Email:</p>
            </div>
            <div>
              <Input name="email" value={cliente.email} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Dirección:</p>
            </div>
            <div>
              <Input name="direccion" value={cliente.direccion} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Ciudad:</p>
            </div>
            <div>
              <Input name="ciudad" value={cliente.ciudad} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Provincia:</p>
            </div>
            <div>
              <Input name="provincia" value={cliente.provincia} />
            </div>
          </Form.Item>
        </Col>
        <Col xl={6} lg={8} md={12} sm={12} xs={24}>
          <Form.Item
            onChange={(e) => {
              loadClienteData(e);
            }}
            required={true}
          >
            <div>
              <p>*Teléfono:</p>
            </div>
            <div>
              <Input name="telefono" value={cliente.telefono} />
            </div>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={8} style={{display: 'flex'}} align="start">
              <button className="btn btn-primary" type="submit">
                Guardar
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  redirectToClientes();
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancelar
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default ClientesForm;
