import React from 'react';
import { Row, Col } from 'antd';
import LoginForm from './LoginForm';
import './login.css';

const Login = () => {
    return(
        <Row className="login">
            <Col span={10}></Col>
            <Col span={4} style={{marginTop: '10%'}}>
                <LoginForm/>
            </Col>
            <Col span={10}></Col>
        </Row>
    )
}

export default Login;