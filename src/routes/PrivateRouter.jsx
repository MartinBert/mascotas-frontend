import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    MenuOutlined,
    UserOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {
    FaDollarSign,
    FaTag
} from 'react-icons/fa'

const { Header, Sider, Content } = Layout;

const PrivateRouter = ({ path, component: Component }) => {
    const history = useHistory();
    const [collapsed, setCollapsed] = useState(false);
    const [userStatus, setUserStatus] = useState(false);

    useEffect(() => {
        if(userStatus) return;
        const verifyUser = () => {
            const token = localStorage.getItem('token');
            if(!token) return redirectToLogin();
            setUserStatus(true);
        } 
        verifyUser()
    })

    const redirectToLogin = () => {
        localStorage.clear();
        history.push('/login');
    }

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{height: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)'}}>
                <div style={{height:"57px", background: "transparent", marginTop: "3px", marginLeft: "3px"}}></div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{background: 'transparent'}}>
                    <Menu.Item key="1" icon={<FaTag />}>
                        <Link to="/productos">
                            Productos
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<FaDollarSign />}>
                        <Link to="/salidas">
                            Salidas
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        <Link to="/marcas">
                            Marcas
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UploadOutlined />}>
                        <Link to="/rubros">
                            Rubros
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<UploadOutlined />}>
                        <Link to="/clientes">
                            Clientes
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<UserOutlined />}>
                        <Link to="/usuarios">
                            Usuarios
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, background:  'rgb(2,0,36) linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)'}}>
                    <MenuOutlined style={{color: "#fff", marginLeft: '20px'}} onClick={() => { toggle() }}/>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Route exact path={path}>
                        <Component />
                    </Route>
                </Content>
            </Layout>
        </Layout>
    )
}

export default PrivateRouter;