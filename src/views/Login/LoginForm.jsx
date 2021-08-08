import React from 'react';
import { Form, Input, Button} from 'antd';

const LoginForm = () => {

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Nombre de usuario requerido',
                    },
                ]}
            >
                <Input placeholder="Usuario"/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Contraseña requerida',
                    },
                ]}
            >
                <Input.Password placeholder="Contraseña"/>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                Login
                </Button>
            </Form.Item>
        </Form>
  

    )
}

export default LoginForm;