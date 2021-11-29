import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

const Header = () => {
    return(
        <Row>
            <Col>
                <Button 
                    style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)',
                    marginBottom: '20px', color: '#fff'}}> 
                    <Link to="/salidas/nuevo">
                        Nuevo    
                    </Link>
                </Button>
            </Col>
        </Row>
    ) 
}

export default Header
