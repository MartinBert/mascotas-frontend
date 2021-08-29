import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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

const PrivateRouter = ({ path, component: Component }) => {
    const { Header, Sider, Content } = Layout;

    const [collapsed, setCollapsed] = useState(false);

    //Redux
    const authorizedUser = useSelector(state => state.auth.authorizedUser);
    const processing = useSelector(state => state.auth.processing);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        (processing)
            ?
            <h1>Cargando</h1>
            :
            (authorizedUser)
                ?
                <Layout>
                    <Sider trigger={null} collapsible collapsed={collapsed}>
                        <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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
                            <Menu.Item key="5" icon={<UserOutlined />}>
                                <Link to="/usuarios">
                                    Usuarios
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background" style={{ padding: 0 }}>
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
                // <div>
                //     <Row align="center" style={{backgroundColor: 'white'}}>
                //         <h1>Nav bar</h1>
                //     </Row>
                //     <Row>
                //         <Col span={6} style={{backgroundColor: "white", height: '100vh'}}>
                //             <h1>asdfasdf</h1>
                //         </Col>
                //         <Col span={18}>
                //             <Route exact path={path}>
                //                 <Component/>
                //             </Route>
                //         </Col>
                //     </Row>
                // </div>
                : <Redirect to='/login' />
    )
}

export default PrivateRouter;