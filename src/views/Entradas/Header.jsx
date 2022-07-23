import React from 'react';
import { Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../services';
import helpers from '../../helpers';

const {exportSimpleExcel} = helpers.excel;
const {simpleDateWithHours} = helpers.dateHelper;

const Header = ({ filters, setFilters }) => {
    const exportExcel = async() => {
        const response = await api.entradas.findAll({page: 0, limit: 1000000, filters: null});
        const nameOfSheet = "Hoja de entradas";
        const nameOfDocument = "Lista de entradas";
        const columnHeaders = [
            'Fecha',
            'Descripción' , 
            'Productos',
            'Costo total', 
            'Usuario',
        ];
        const lines = await processExcelLines(response.data.docs);
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument);
    }

    const processExcelLines = async(entradas) => {
        const processedLines = [];
        for await (let entrada of entradas){
            processedLines.push([
                simpleDateWithHours(entrada.fecha),
                entrada.descripcion,
                entrada.productos.reduce((acc, item) => { 
                    acc = acc + item.nombre + ' (' + item.cantidadesEntrantes + '),'
                    return acc;
                }, ''),
                entrada.costoTotal,
                entrada.usuario.nombre
            ])
        }
        return processedLines;
    }

    return (
        <Row gutter={8}>
            <Col span={4}>
                <Link to="/entradas/nuevo">
                    <button 
                        className="btn-primary"
                    >
                        Nueva entrada
                    </button>
                </Link>
            </Col>
            <Col span={4}>
                <button
                    className="btn-primary"
                    onClick={() => {exportExcel()}}
                >
                    Exportar Excel
                </button>
            </Col>
            <Col span={16} align="right">
                <Input 
                    color="primary" 
                    style={{ width: 200, marginBottom: '10px' }}
                    placeholder="Buscar por descripción"
                    onChange={(e) => { setFilters(
                        {
                            ...filters,
                            descripcion: e.target.value
                        }
                    )}}
                    value={(filters) ? filters.descripcion : null}
                /> 
            </Col>
        </Row>
    )
}

export default Header
