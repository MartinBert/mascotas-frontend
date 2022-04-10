import React from 'react';
import { Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';

const Header = ({filters, setFilters}) => {
    return (
        <Row gutter={8}>
            <Col span={4}>
                <Link to="/salidas/nuevo">
                    <button className="btn-primary">
                        Nueva salida
                    </button>
                </Link>
            </Col>
            <Col span={20} align="right">
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
