import React, { useState, useEffect } from 'react';
import api from '../../services';
import { Row, Col, Form, Input, Checkbox } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import messages from '../../components/messages';
import graphics from '../../components/graphics';
import { GenericAutocomplete } from '../../components/generics';
import { errorAlert, successAlert } from '../../components/alerts';

const { Error } = messages;
const { Spinner } = graphics;

const UsuariosForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    perfil: false
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSalePoint, setSelectedSalePoint] = useState(null);

  const loadUsuarioData = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: (e.target.name === 'perfil') ? e.target.checked : e.target.value,
    });
  };

  //eslint-disable-next-line
  useEffect(() => {
    if (usuario.nombre) return;
    if (id === 'nuevo') {
      setLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      const searchedItem = await api.usuarios.findById(id);
      setUsuario(searchedItem);
      if(searchedItem.empresa) setSelectedCompany({_id: searchedItem.empresa._id, razonSocial: searchedItem.empresa.razonSocial});
      setSelectedSalePoint(searchedItem.puntoVenta);
      setLoading(false);
    };
    fetchUsuario();
  });

  const setSelectedCompanyToUser = async(company) => {
    setSelectedCompany(company);
    setUsuario({
        ...usuario,
        empresa: company
    })
  }

  const setSelectedSalePointToUser = async(salePoint) => {
    setSelectedSalePoint(salePoint);
    setUsuario({
        ...usuario,
        puntoVenta: salePoint
    })
  }

  const save = () => {
    if (!usuario.nombre || !usuario.email || !usuario.password) {
      setError(true);
      return;
    }

    const saveItem = async () => {
      const response = usuario._id
        ? await api.usuarios.edit(usuario)
        : await api.usuarios.save(usuario);
      if (response === 'OK') return success();
      return fail();
    };
    saveItem();
  };

  const redirectToUsuarios = () => {
    history.push('/usuarios');
  };

  const success = () => {
    successAlert('El registro se guardo en la base de datos').then(() => {
      redirectToUsuarios();
    });
  };

  const fail = () => {
    errorAlert('Error al guardar el registro');
  };

  return (
    <Row>
      {loading ? (
        <Spinner />
      ) : (
        <Col span={12}>
          <h1>{id === 'nuevo' ? 'Crear nuevo usuario' : 'Editar usuario'}</h1>
          {error ? (
            <Error message='Debe completar todos los campos obligatorios *' />
          ) : null}
          <Form
            name='basic'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={() => {
              save();
            }}
            autoComplete='off'
            style={{ marginTop: '10px' }}
          >
            <Form.Item
              label='Nombre'
              onChange={(e) => {
                loadUsuarioData(e);
              }}
              required={true}
            >
              <Input name='nombre' value={usuario.nombre} className='ml-5' />
            </Form.Item>
            <Form.Item
              label='Email'
              onChange={(e) => {
                loadUsuarioData(e);
              }}
              required={true}
            >
              <Input name='email' value={usuario.email} className='ml-5' />
            </Form.Item>
            <Form.Item
              label='Password'
              onChange={(e) => {
                loadUsuarioData(e);
              }}
              required={true}
            >
              <Input
                name='password'
                value={usuario.password}
                type='password'
                className='ml-5'
              />
            </Form.Item>
            <Form.Item
              label='Perfil administrador'
              required={true}
            >
              <Checkbox 
                name='perfil'
                checked={usuario.perfil}
                onChange={(e) => {
                  loadUsuarioData(e);
                }}
              ></Checkbox>
            </Form.Item>
            <Form.Item
              label='Empresa'
              required={true}
            >
              <GenericAutocomplete
                label='Empresa'
                modelToFind='empresa'
                keyToCompare='razonSocial'
                controller='empresas'
                returnCompleteModel={true}
                setResultSearch={setSelectedCompanyToUser}
                selectedSearch={selectedCompany}
              />
            </Form.Item>
            <Form.Item
              label='Punto de venta'
              required={true}
            >
              <GenericAutocomplete
                label='Punto de venta'
                modelToFind='puntoventa'
                keyToCompare='nombre'
                controller='puntosventa'
                returnCompleteModel={true}
                setResultSearch={setSelectedSalePointToUser}
                selectedSearch={selectedSalePoint}
              />
            </Form.Item>
            <Row>
              <Col span={8} style={{display: 'flex'}}>
                <button type='submit' className='btn-primary'>
                  Guardar
                </button>
                <button
                  className='btn-secondary'
                  onClick={() => {
                    redirectToUsuarios();
                  }}
                  style={{ marginLeft: '10px'}}
                >
                  Cancelar
                </button>
              </Col>
            </Row>
          </Form>
        </Col>
      )}
    </Row>
  );
};

export default UsuariosForm;