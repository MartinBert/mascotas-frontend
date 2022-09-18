
import React from 'react';
import { Row, Col, Input} from 'antd';
import helpers from '../../../helpers';

const {exportSimpleExcel} = helpers.excel;

const Header = ({setFilters, ventas}) => {

    const processLines = (ventas) => {
        const processedLines = [];
        ventas.forEach(venta => {
            processedLines.push([
                venta.fechaEmisionString,
                (venta.usuario) ? venta.usuario.nombre : 'Usuario inexistente',
                venta.clienteRazonSocial,
                venta.documento.nombre,
                venta.total
            ])
        })
        return processedLines;
    }

    const exportExcel = () => {
        const nameOfSheet = "Hoja de ventas";
        const nameOfDocument = "Lista de ventas";
        const columnHeaders = [
            'Fecha',
            'Usuario',
            'Cliente',
            'Comprobante',
            'Total de venta', 
        ];
        const lines = processLines(ventas);
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    return(
        <Row>
            <Col span={24}>
                <Row align="end">
                    <Col span={4}>
                        <button 
                            className="btn-primary"
                            onClick={() => {exportExcel()}}
                        > 
                                Reporte de ventas    
                        </button>
                    </Col>
                    <Col span={16}></Col>
                    <Col span={4}>
                        <Input 
                            type="primary" 
                            placeholder="Buscar venta"
                            onChange={(e) => { setFilters(JSON.stringify({
                                nombre: e.target.value,
                            }))}}
                        /> 
                    </Col>
                </Row>
            </Col>
        </Row>
    ) 
}

export default Header
