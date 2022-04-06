import React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Row>
            <Col>
                <Link to="/salidas/nuevo">
                    <button className="btn-primary">
                        Nueva salida
                    </button>
                </Link>
            </Col>
        </Row>
    )
}

export default Header
