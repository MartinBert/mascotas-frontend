import React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../services';
import helpers from '../../helpers';

const {exportSimpleExcel} = helpers.excel;
const {simpleDateWithHours} = helpers.dateHelper;

const Header = () => {
    const exportExcel = async() => {
        const response = await api.entradas.getAll({page: 0, limit: 1000000, filters: null});
        const nameOfSheet = "Hoja de entradas";
        const nameOfDocument = "Lista de entradas";
        const columnHeaders = [
            'Fecha', 
            'Descripción' , 
            'Productos',
            'Cantidad total de unidades entrantes',
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
                    acc = acc + item.nombre + '(' + item.cantidadesEntrantes + '),'
                    return acc;
                }, ''),
                entrada.cantidad,
                entrada.costoTotal,
                entrada.usuario.nombre
            ])
        }
        return processedLines;
    }

    return (
        <Row gutter={8}>
            <Col>
                <Link to="/entradas/nuevo">
                    <button 
                        className="btn-primary"
                    >
                        Nueva entrada
                    </button>
                </Link>
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
    )
}

export default Header
