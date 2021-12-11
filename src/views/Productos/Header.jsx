import React, {useEffect, useState} from 'react';
import { Row, Col, Button, Input, AutoComplete, Space } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../services';
import PriceModificatorModal from './PriceModificatorModal';
import {
    FaDollarSign, 
    FaFile,    
    FaPlus
} from 'react-icons/fa'
import '../../index.css';
import { sizeHeight } from '@mui/system';

const Header = ({setFilters, filters, setLoading}) => {
    const [brandSearch, setBrandSearch] = useState(null);
    const [headingSearch, setHeadingSearch] = useState(null);
    const [brandOptions, setBrandOptions] = useState(null);
    const [headingOptions, setHeadingOptions] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);
    const [priceModalVisible, setPriceModalVisible] = useState(false);

    useEffect(() => {
        if(brandSearch && brandSearch !== ''){
            const fetchBrands = async() => {
                const response = await api.marcas.getByName(brandSearch);
                const formattedOptions = response.docs.map(el => ({value: el.nombre, key: el._id}));
                setBrandOptions(formattedOptions);
            }
            fetchBrands();
        }

        if(headingSearch && headingSearch !== ''){
            const fetchHeadings = async() => {
                const response = await api.rubros.getByName(headingSearch);
                const formattedOptions = response.docs.map(el => ({value: el.nombre, key: el._id}));
                setHeadingOptions(formattedOptions);
            }
            fetchHeadings();
        }
    }, [brandSearch, headingSearch])


    const handleSearch = (searchType, e) => {
        if(searchType === 'marcas'){
            setBrandSearch(e);
        }else{
            setHeadingSearch(e);
        }
    }

    const handleSelect = (selectedType, e) => {
        if(selectedType === 'marcas'){
            const selected = brandOptions.filter(el => el.value === e)[0];
            setFilters({
                ...filters,
                marca: selected.key
            });
        }else{
            const selected = headingOptions.filter(el => el.value === e)[0];
            setFilters({
                ...filters,
                rubro: selected.key
            });
        }
    }

    const cleanFilters = () => {
        setBrandSearch(null);
        setHeadingSearch(null);
        setBrandOptions(null);
        setHeadingOptions(null);
        setSelectedBrand(null);
        setSelectedHeading(null);
        setFilters(null);
    }

    return(
        <>
        <Row>            
            <Col span={24}>            
                <Row gutter={10}>
                    <Col>                     
                        <Button
                            type="primary"
                            
                            style={{ marginBottom: '20px'}}
                            icon={<FaPlus style={{marginRight:'10px'}}/>}> 
                            <Link to="/productos/nuevo">
                                Nuevo    
                            </Link>
                        </Button>
                    </Col>
                    <Col>                       
                        <Button
                            type="primary"
                            icon={<FaFile style={{marginRight:'10px'}}/>}                            
                        >
                                Cargar desde archivo    
                        </Button>
                    </Col>
                    <Col>                       
                        <Button
                            type="primary" 
                            onClick={() => {setPriceModalVisible(true)}}
                            icon={<FaDollarSign style={{marginRight:'10px'}}/>}
                        >
                                Modificar precios    
                        </Button>
                    </Col>
                </Row>
                <Row style={{display:'flex', justifyContent:'space-around'}}>
                    <Col>
                        <label htmlFor="marcas">Filtrar por marcas  </label>
                        <AutoComplete
                            style={{ width: 200, marginBottom: '10px' }}
                            options={brandOptions}
                            value={(selectedBrand) ? selectedBrand.value : null}
                            id="marcas"
                            onSearch={(e) => {handleSearch('marcas', e)}}
                            onSelect={(e) => {handleSelect('marcas', e)}}
                        />
                    </Col>
                    <Col>
                        <label htmlFor="marcas">Filtrar por rubros </label>
                        <AutoComplete
                            style={{ width: 200, marginBottom: '10px' }}
                            options={headingOptions}
                            value={(selectedHeading) ? selectedHeading.value : null}
                            id="rubros"
                            onSearch={(e) => {handleSearch('rubros', e)}}
                            onSelect={(e) => {handleSelect('rubros', e)}}
                        />
                    </Col>                    
                    <Col>
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
                    <Col>
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
                    <Col>
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
                    <Col style={{display:'flex', justifyContent:'flex-end'}}>
                        <Button 
                            type='danger'                                                       
                            onClick={() => {cleanFilters()}}
                        > 
                            Limpiar filtros
                        </Button>
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
