// React Components and Hooks
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import messages from '../../components/messages'

// Custom Context Providers
import contexts from '../../contexts'

// Services
import api from '../../services'

// Design Components
import { Form, Input, Button } from 'antd'

// Imports Destructurings
const { Error } = messages
const { useAuthContext } = contexts.Auth

const LoginForm = () => {
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })
    const loggedUserContext = useAuthContext()
    const [, auth_dispatch] = loggedUserContext

    const loadCredentials = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const redirectToVentas = () => {
        navigate('/venta')
    }

    const redirectToLogin = () => {
        localStorage.clear()
        navigate('/login')
    }

    const login = async () => {
        const response = await api.auth.login(credentials)
        if (!response) {
            setError(true)
            return redirectToLogin()
        }
        const { token, data } = response
        if (!token) {
            setError(true)
            return redirectToLogin()
        }
        localStorage.setItem('token', token)
        localStorage.setItem('userId', data)
        auth_dispatch({ type: 'SET_LOADING', payload: false })
        return redirectToVentas()
    }

    return (
        <Form
            initialValues={{
                remember: true,
            }}
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
                    onClick={e => login(e)}
                    type='primary'
                >
                    Login
                </Button>
            </Form.Item>
        </Form>


    )
}

export default LoginForm