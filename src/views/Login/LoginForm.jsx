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
    const [auth_state, auth_dispatch] = useAuthContext()

    const loadCredentials = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const redirectToHome = () => {
        navigate('/')
    }

    const redirectToLogin = () => {
        localStorage.clear()
        navigate('/login')
    }

    const redirectToVentas = () => {
        navigate('/venta')
    }

    const reloadPage = () => {
        window.location.reload()
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
        verifyUserAndRedirect()
        reloadPage()
    }

    const verifyUserAndRedirect = () => {
        if (!auth_state.user) return redirectToHome()
        const existsBusiness = auth_state.user.empresa ? true : false
        const existsSalePoint = auth_state.user.puntoVenta ? true : false
        if (existsBusiness && existsSalePoint) return redirectToVentas()
        else return redirectToHome()
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
                    onChange={loadCredentials}
                    required
                    style={{ marginTop: '25px' }}
                />
            </Form.Item>

            <Form.Item>
                <Input.Password
                    type='password'
                    name='password'
                    placeholder='Contraseña'
                    onChange={loadCredentials}
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