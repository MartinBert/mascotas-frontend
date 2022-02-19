import React, {useEffect, useState} from 'react';
import { GenericAutocomplete } from '../../components/generics';
import { Row, Col, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import PriceModificatorModal from './PriceModificatorModal';
import api from '../../services'
import { exportSimpleExcel } from '../../helpers/excel';

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
    }, [selectedBrand])

    useEffect(() => {
        if(selectedHeading){
            setFilters({
                ...filters,
                rubro: selectedHeading
            })
        }
    }, [selectedHeading]);

    const cleanFilters = () => {
        setSelectedBrand(null);
        setSelectedHeading(null);
        setFilters(null);
    }

    const exportExcel = async() => {
        const response = await api.productos.getAll({page: 0, limit: 1000000, filters: null});
        const nameOfSheet = "Hoja de productos";
        const nameOfDocument = "Lista de productos";
        const columnHeaders = [
            'Producto' , 
            'Marca', 
            'Rubro', 
            'Precio unitario', 
            'IVA', 
            'Precio de venta', 
            'Margen de ganancia', 
            'Ganancia por venta', 
            'Stock'
        ];
        const lines = await processExcelLines(response.docs);
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument);
    }

    const processExcelLines = async(products) => {
        const processedLines = [];
        for await (let product of products){
            processedLines.push([
                product.nombre,
                product.marca.nombre,
                product.rubro.nombre,
                '$'+product.precioUnitario,
                '$'+product.iva,
                '$'+product.precioVenta,
                '%'+product.margenGanancia,
                '$'+product.gananciaNeta,
                product.cantidadStock
            ])
        }
        return processedLines;
    }

    return(
        <>
        <Row>            
            <Col span={24}>
                <Row gutter={8}>
                    <Col>
                        <button
                            className="btn-primary"
                        > 
                            <Link to="/productos/nuevo">
                                Nuevo    
                            </Link>
                        </button>
                    </Col>
                    <Col>                       
                        <button
                            className="btn-primary"
                            onClick={() => {setPriceModalVisible(true)}}
                        >
                                Modificar precios    
                        </button>
                    </Col>
                    <Col>                       
                        <button
                            className="btn-primary"
                            onClick={() => {exportExcel()}}
                        >
                            Exportar Excel
                        </button>
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
