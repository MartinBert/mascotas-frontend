import React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Row>
            <Col>
                <Link to="/entradas/nuevo">
                    <button className="btn-primary">
                        Nueva entrada
                    </button>
                </Link>
            </Col>
        </Row>
    )
}

export default Header
