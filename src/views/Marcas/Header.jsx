
import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

const Header = () => {
    return(
        <Row>
            <Col>
                <Button color="primary"> 
                    <Link to="/marcas/nuevo">
                        Nuevo    
                    </Link>
                </Button>
            </Col>
        </Row>
    ) 
}

export default Header
