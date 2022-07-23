import React, { useState, useEffect } from "react";
import api from "../../services";
import { Row, Col, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import graphics from "../../components/graphics";
import { GenericAutocomplete } from "../../components/generics";
import { errorAlert, successAlert } from "../../components/alerts";
const { Spinner } = graphics;

const EmpresasForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [empresa, setEmpresa] = useState({
    razonSocial: "",
    cuit: "",
    actividad: "",
    fechaInicioActividad: null,
    ingresosBrutos: "",
    direccion: "",
    telefono: "",
    email: "",
    logo: null,
    condicionFiscal: null,
    puntosVenta: null,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedSalePoint, setSelectedSalePoint] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEmpresaData = (e) => {
    setEmpresa({
      ...empresa,
      [e.target.name]: e.target.value,
    });
  };

  //eslint-disable-next-line
  useEffect(() => {
    if (empresa.razonSocial) return;
    if (id === "nuevo") {
      setLoading(false);
      return;
    }

    const fetchEmpresa = async () => {
      const searchedItem = await api.empresas.findById(id);
      const {
        _id,
        razonSocial,
        cuit,
        actividad,
        fechaInicioActividad,
        ingresosBrutos,
        direccion,
        telefono,
        email,
        logo,
        condicionFiscal,
        puntosVenta
      } = searchedItem;
      setEmpresa({
        _id,
        razonSocial,
        cuit,
        actividad,
        fechaInicioActividad,
        ingresosBrutos,
        direccion,
        telefono,
        email,
        logo,
        condicionFiscal,
        puntosVenta
      });
      setSelectedCondition(condicionFiscal);
      setSelectedSalePoint(puntosVenta[0]);
      setLoading(false);
    };
    fetchEmpresa();
  });

  const save = () => {
    if (!empresa.logo) {
      empresa.logo = uploadedImages[0];
    }

    const saveBusiness = async () => {
      const response = await api.empresas.save(empresa);
      if (response.code === 200) {
        successAlert("El registro fue grabado con exito").then(
          redirectToEmpresas()
        );
      } else {
        errorAlert("Error al guardar el registro");
      }
    };

    const editBusiness = async () => {
      const response = await api.empresas.edit(empresa);
      if (response.code === 200) {
        success();
      } else {
        fail();
      }
    };

    if (id === "nuevo") {
      saveBusiness();
    } else {
      editBusiness();
    }
  };

  const redirectToEmpresas = () => {
    history.push("/empresas");
  };

  const success = () => {
    successAlert("El registro se guardo en la base de datos").then(() => {
      redirectToEmpresas();
    });
  };

  const fail = () => {
    errorAlert("Error al guardar el registro");
  };

  const setSelectedConditionToBusiness = async (condition) => {
    setSelectedCondition(condition);
    const response = await api.condicionesfiscales.findById(condition._id);
    setEmpresa({
      ...empresa,
      condicionFiscal: response,
    });
  };

  const setSelectedSalePointToBusiness = async (salePoint) => {
    setSelectedSalePoint(salePoint);
    const response = await api.puntosventa.findById(salePoint._id);
    setEmpresa({
      ...empresa,
      puntosVenta: [response],
    });
  };

  const uploaderProps = {
    name: "file",
    accept: ".jpg,.png",
    multiple: false,
    onChange: (info) => {
      uploadImageToServer(info.file)
    },
    onRemove: () => {
      removeImage(uploadedImages[0]._id);
    },
    beforeUpload: () => false
  };

  const uploadImageToServer = async (file) => {
    const response = await api.uploader.uploadImage(file);
    if (response.file) {
      console.log(file);
      setUploadedImages(response.file);
      return response.code;
    }
  };

  const removeImage = async (id) => {
    const response = await api.uploader.deleteImage(id);
    setUploadedImages([]);
    return response;
  };

  return loading ? (
    <Spinner />
  ) : (
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
      <Row gutter={8}>
        <Col span={24}>
          <h1>{id === "nuevo" ? "Crear nueva empresa" : "Editar empresa"}</h1>
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <Input
            name="razonSocial"
            placeholder="Razón social"
            value={empresa.razonSocial}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <Input
            name="cuit"
            placeholder="CUIT"
            value={empresa.cuit}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <Input
            name="telefono"
            placeholder="Teléfono"
            value={empresa.telefono}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <Input
            name="email"
            placeholder="Email"
            value={empresa.email}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={12} style={{ marginBottom: "10px" }}>
          <Input
            name="direccion"
            placeholder="Dirección"
            value={empresa.direccion}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={12} style={{ marginBottom: "10px" }}>
          <Input
            name="actividad"
            placeholder="Actividad principal"
            value={empresa.actividad}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <Input
            name="fechaInicioActividad"
            placeholder="Fecha de inicio de actividad"
            value={empresa.fechaInicioActividad}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <Input
            name="ingresosBrutos"
            placeholder="Ingresos brutos"
            value={empresa.ingresosBrutos}
            onChange={(e) => {
              loadEmpresaData(e);
            }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <GenericAutocomplete
            label="Condición Fiscal"
            modelToFind="condicionfiscal"
            keyToCompare="nombre"
            setResultSearch={setSelectedConditionToBusiness}
            selectedSearch={selectedCondition}
            styles={{ backgroundColor: "#fff" }}
          />
        </Col>
        <Col span={6} style={{ marginBottom: "10px" }}>
          <GenericAutocomplete
            label="Punto de venta"
            modelToFind="puntoventa"
            keyToCompare="nombre"
            setResultSearch={setSelectedSalePointToBusiness}
            selectedSearch={selectedSalePoint}
            styles={{ backgroundColor: "#fff" }}
          />
        </Col>
        <Col span={24} style={{ marginBottom: "10px" }}>
          <Upload {...uploaderProps}>
            <button
              style={{ width: "200px", marginBottom: 0 }}
              type="button"
              className="btn-primary"
              icon={<UploadOutlined />}
              disabled={uploadedImages.length > 0 ? true : false}
            >
              Subir logo
            </button>
          </Upload>
        </Col>
        <Col span={6} style={{ display: "flex" }}>
          <button className="btn-primary" type="submit">
            Guardar
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => {
              redirectToEmpresas();
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        </Col>
      </Row>
    </Form>
  );
};

export default EmpresasForm;
