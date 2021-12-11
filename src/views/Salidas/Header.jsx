import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Header = () => {
    return(
        <Row>
            <Col>
                <Button 
                    type="primary"
                    style={{marginBottom: '20px'}}
                    icon={<FaPlus style={{marginRight:'10px'}}/>}> 
                    <Link to="/salidas/nuevo">
                        Nuevo    
                    </Link>
                </Button>
            </Col>
        </Row>
    ) 
}

export default Header
