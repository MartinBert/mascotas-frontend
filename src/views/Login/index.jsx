// React Components and Hooks
import React from 'react'

// Styles
import './login.scss'

// Design Components
import { Row } from 'antd'

// Views
import LoginForm from './LoginForm'
import TenantRegistrationForm from './TenantRegistrationForm'


const Login = () => {
    const bubbles = []
    for (let index = 0; index < 25; index++) {
        bubbles.push(
            <div
                className='bubble'
                key={index}
            ></div>
        )
    }

    return (
        <Row className='login'>
            <div className='bubbles'>
                {bubbles}
                <div style={{ width: '100%', marginTop: '10%', justifyContent: 'center', display: 'flex' }}>
                    <div style={{ width: '300px', height: '200px' }}>
                        <LoginForm />
                    </div>
                </div>
                <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                    <div style={{ width: '300px', height: '200px' }}>
                        <TenantRegistrationForm />
                    </div>
                </div>
                {bubbles}
            </div>
        </Row>
    )
}

export default Login