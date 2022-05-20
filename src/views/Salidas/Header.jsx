import React from 'react';
import { Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../services';
import helpers from '../../helpers';

const {exportSimpleExcel} = helpers.excel;
const {simpleDateWithHours} = helpers.dateHelper;

const Header = ({ filters, setFilters }) => {
    const exportExcel = async() => {
        const response = await api.salidas.getAll({page: 0, limit: 1000000, filters: null});
        const nameOfSheet = "Hoja de salidas";
        const nameOfDocument = "Lista de salidas";
        const columnHeaders = [
            'Fecha', 
            'Descripción' , 
            'Productos',
            'Ganancia neta total', 
            'Usuario',
        ];
        const lines = await processExcelLines(response.data.docs);
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument);
    }

    const processExcelLines = async(salidas) => {
        const processedLines = [];
        for await (let salida of salidas){
            processedLines.push([
                simpleDateWithHours(salida.fecha),
                salida.descripcion,
                salida.productos.reduce((acc, item) => { 
                    acc = acc + item.nombre + '(' + item.cantidadesSalientes + '),'
                    return acc;
                }, ''),
                salida.cantidad,
                salida.gananciaNetaTotal,
                salida.usuario.nombre
            ])
        }
        return processedLines;
    }

    return (
        <Row gutter={8}>
            <Col span={4}>
                <Link to="/salidas/nuevo">
                    <button 
                        className="btn-primary"
                    >
                        Nueva salida
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
