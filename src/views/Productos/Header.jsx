import React, {useEffect, useState} from 'react';
import { GenericAutocomplete } from '../../components/generics';
import { Row, Col, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import PriceModificatorModal from './PriceModificatorModal';
import '../../index.css';

const Header = ({setFilters, filters, setLoading}) => {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [priceModalVisible, setPriceModalVisible] = useState(false);

    useEffect(() => {
        if(selectedBrand){
            setFilters({
                ...filters,
                marca: selectedBrand
            })
        }
    }, 
    //eslint-disable-next-line
    [selectedBrand])

    useEffect(() => {
        if(selectedHeading){
            setFilters({
                ...filters,
                rubro: selectedHeading
            })
        }
    }, 
    //eslint-disable-next-line
    [selectedHeading]);

    const cleanFilters = () => {
        setSelectedBrand(null);
        setSelectedHeading(null);
        setFilters(null);
    }

    return(
        <>
        <Row>            
            <Col span={24}>
                <Row>
                    <Col span={2} style={{marginRight: '15px'}}>
                        <Button
                            className="btn-primary-bg"
                            style={{ marginBottom: '20px'}}> 
                            <Link to="/productos/nuevo">
                                Nuevo    
                            </Link>
                        </Button>
                    </Col>
                    <Col span={2}>                       
                        <Button
                            style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)',
                            color: '#fff', marginBottom: '20px'}} 
                            onClick={() => {setPriceModalVisible(true)}}
                        >
                                Modificar precios    
                        </Button>
                    </Col>
                </Row>
                <Row justify="space between" gutter={16}>
                <Col span={6}>
                        <Input 
                            color="primary" 
                            style={{ width: 200, marginBottom: '10px' }}
                            placeholder="Buscar por nombre"
                            onChange={(e) => { setFilters(
                                {
                                    ...filters,
                                    nombre: e.target.value
                                }
                            )}}
                            value={(filters) ? filters.nombre : null}
                        /> 
                    </Col>
                    <Col span={6}>
                        <Input 
                            color="primary" 
                            style={{ width: 200, marginBottom: '10px' }}
                            placeholder="Buscar por codigo de barras"
                            onChange={(e) => { setFilters(
                                {
                                    ...filters,
                                    codigoBarras: e.target.value
                                }
                            )}}
                            value={(filters) ? filters.codigoBarras : null}
                        /> 
                    </Col>
                    <Col span={6}>
                        <Input 
                            color="primary" 
                            style={{ width: 200, marginBottom: '10px' }}
                            placeholder="Buscar por codigo de producto"
                            onChange={(e) => { setFilters(
                                {
                                    ...filters,
                                    codigoProducto: e.target.value
                                }
                            )}}
                            value={(filters) ? filters.codigoProducto : null}
                        /> 
                    </Col>
                    <Col span={6}>
                        <Button 
                            type="danger" 
                            onClick={() => {cleanFilters()}}
                        > 
                            Limpiar filtros
                        </Button>
                    </Col>
                    <Col span={8}>
                        <GenericAutocomplete
                            label="Filtrar por marcas"
                            modelToFind="marca"
                            keyToCompare="nombre"
                            setResultSearch={setSelectedBrand}
                            selectedSearch={selectedBrand}
                            styles={{backgroundColor: '#fff'}}
                        />
                    </Col>
                    <Col span={8}>
                        <GenericAutocomplete
                            label="Filtrar por rubros"
                            modelToFind="rubro"
                            keyToCompare="nombre"
                            setResultSearch={setSelectedHeading}
                            selectedSearch={selectedHeading}
                            styles={{backgroundColor: '#fff'}}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
        <PriceModificatorModal 
            priceModalVisible={priceModalVisible} 
            setPriceModalVisible={setPriceModalVisible}
            setLoading={setLoading}
        />
        </>
    ) 
}

export default Header
