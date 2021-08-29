import React, { useState } from 'react';
import { Form, Input, Button} from 'antd';

//Redux
import { getNewToken } from '../../redux/actions/auth';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    //Redux
    const dispatch = useDispatch();
    const login = credentials => dispatch( getNewToken(credentials) );
    
    const attempLogin = (e) => {
        e.preventDefault();
        login(credentials)
    };

    const loadCredentials = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name] : e.target.value
        })
    }

    return (
        <Form
            initialValues={{
                remember: true,
            }}
            onSubmitCapture={(e) => { attempLogin(e) }}
        >
            <Form.Item>
                <Input 
                    type="email"
                    name="email"
                    placeholder="Usuario"
                    onChange={ (e) => {loadCredentials(e)} }
                    required
                />
            </Form.Item>

            <Form.Item>
                <Input.Password 
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={ (e) => {loadCredentials(e)} }
                    required
                />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Button 
                    type="primary" 
                    htmlType="submit"
                >
                    Login
                </Button>
            </Form.Item>
        </Form>
  

    )
}

export default LoginForm;