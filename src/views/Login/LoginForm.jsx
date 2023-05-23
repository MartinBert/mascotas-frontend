// React Components and Hooks
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import messages from '../../components/messages'

// Services
import api from '../../services'

// Design Components
import { Form, Input, Button } from 'antd'

// Imports Destructurings
const { Error } = messages


const LoginForm = () => {

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const loadCredentials = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const login = async () => {
        const response = await api.auth.login(credentials)
        if (response) {
            const { token, data } = response
            if (!token) {
                setError(true)
                return
            }
            localStorage.setItem('token', token)
            localStorage.setItem('userId', data)
            return redirectToHome()
        } else {
            setError(true)
            return
        }
    }

    const redirectToHome = () => {
        navigate('/')
    }

    return (
        <Form
            initialValues={{
                remember: true,
            }}
            onSubmitCapture={e => login(e)}
        >
            {(error) ? <Error message='Credenciales invalidas' /> : null}
            <Form.Item>
                <Input
                    type='email'
                    name='email'
                    placeholder='Usuario'
                    onChange={e => loadCredentials(e)}
                    required
                    style={{ marginTop: '25px' }}
                />
            </Form.Item>

            <Form.Item>
                <Input.Password
                    type='password'
                    name='password'
                    placeholder='Contraseña'
                    onChange={e => loadCredentials(e)}
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
                    type='primary'
                    htmlType='submit'
                >
                    Login
                </Button>
            </Form.Item>
        </Form>


    )
}

export default LoginForm