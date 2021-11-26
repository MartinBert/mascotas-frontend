import React, {useEffect, useState} from 'react';
import { Row, Col, Button, Input, AutoComplete } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../services';

const Header = ({setFilters}) => {
    const [brandSearch, setBrandSearch] = useState(null);
    const [headingSearch, setHeadingSearch] = useState(null);
    const [brandOptions, setBrandOptions] = useState(null);
    const [headingOptions, setHeadingOptions] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState(null);

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

    useEffect(() => {
        if(selectedBrand === null && selectedHeading === null) return;
        const brandKey = (selectedBrand) ? selectedBrand.key : null;
        const headingKey = (selectedHeading) ? selectedHeading.key : null;
        setFilters(JSON.stringify({marca: brandKey, rubro: headingKey}))
    }, 
    //eslint-disable-next-line
    [selectedBrand, selectedHeading])

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
            console.log(selected) 
            setSelectedBrand(selected);
        }else{
            const selected = headingOptions.filter(el => el.value === e)[0];
            setSelectedHeading(selected);
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
                <Button type='primary'> 
                    <Link to="/productos/nuevo">
                        Nuevo    
                    </Link>
                </Button>
            </Col>
            <Col span={24}>
                <Row align="end" gutter={8}>
                    <Col>
                        <label htmlFor="marcas">Filtrar por marcas  </label>
                        <AutoComplete
                            style={{ width: 200 }}
                            options={brandOptions}
                            value={(selectedBrand) ? selectedBrand.value : null}
                            id="marcas"
                            onSearch={(e) => {handleSearch('marcas', e)}}
                            onSelect={(e) => {handleSelect('marcas', e)}}
                        />
                    </Col>
                    <Col>
                        <label htmlFor="marcas">Filtrar por rubros  </label>
                        <AutoComplete
                            style={{ width: 200 }}
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
                            placeholder="Buscar producto"
                            onChange={(e) => { setFilters(JSON.stringify({
                                marca: (selectedBrand) ? selectedBrand.key : null,
                                rubro: (selectedHeading) ? selectedHeading.key : null,
                                nombre: e.target.value,
                                codigoBarras: e.target.value,
                                codigoProducto: e.target.value
                            }))}}
                        /> 
                    </Col>
                    <Col>
                        <Button 
                            type="danger" 
                            onClick={() => {cleanFilters()}}
                        > 
                            Limpiar filtros
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        </>
    ) 
}

export default Header
