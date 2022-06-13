import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import {
    FaDollarSign,
    FaTag,
    FaTags,
    FaBookmark,
    FaUsers,
    FaMoneyBillWave,
    FaUser,
    FaBars,
    FaFile,
    FaShoppingCart,
    FaBusinessTime,
    FaCodeBranch,
    FaAddressBook
} from 'react-icons/fa'

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const PrivateRouter = ({ path, component: Component, activeKey, state, dispatch}) => {
    const history = useHistory();
    const [collapsed, setCollapsed] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    useEffect(() => {
        if (userStatus) return;
        const verifyUser = () => {
            const token = localStorage.getItem('token');
            if (!token) return redirectToLogin();
            setUserStatus(true);
            if(state.openKeys.length === 0){
                dispatch({type: 'SET_OPEN_SUBMENU_KEY', payload: ['sub1']});
            }
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

    const onOpenChange = (keys) => {
        dispatch({type: 'SET_OPEN_SUBMENU_KEY', payload: [keys[keys.length - 1]]});
    };

    return (
        <Layout style={{ height: '100%' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)' }}
            >
                <div style={{ height: "57px", background: "transparent", marginTop: "3px", marginLeft: "3px" }}></div>
                <Menu
                    theme='dark'
                    mode="inline"
                    style={{ background: 'transparent' }}
                    defaultSelectedKeys={[activeKey]}
                    selectedKeys={[activeKey]}
                    openKeys={state.openKeys}
                    onOpenChange={onOpenChange}
                >
                    <Menu.SubMenu key='sub1' title='Ventas'>
                        <Menu.Item key="1" icon={<FaShoppingCart />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/ventas">
                                Ventas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<FaFile />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/documentos">
                                Documentos
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<FaUsers />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/clientes">
                                Clientes
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<FaMoneyBillWave />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/mediospago">
                                Medios de pago
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key='sub2' title='Productos y stock'>
                        <Menu.Item key="5" icon={<FaBookmark />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/productos">
                                Productos
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6" icon={<FaDollarSign />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/salidas">
                                Salidas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="7" icon={<FaDollarSign />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/entradas">
                                Entradas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="8" icon={<FaTag />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/marcas">
                                Marcas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="9" icon={<FaTags />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/rubros">
                                Rubros
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key='sub3' title='Configuraciones'>
                        <Menu.Item key="10" icon={<FaUser />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/usuarios">
                                Usuarios
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="11" icon={<FaBusinessTime />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/empresas">
                                Empresa
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="12" icon={<FaAddressBook />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/condicionesfiscales">
                                Condiciones fiscales
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="13" icon={<FaCodeBranch />} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
                            <Link to="/puntosventa">
                                Puntos de venta
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout" style={{ height: '100%' }}>
                <Header className="site-layout-background" style={{ padding: 0, background: 'rgb(2,0,36) linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <FaBars style={{ color: "#fff", marginLeft: '20px', cursor: 'pointer' }} onClick={() => { toggle() }} />
                    </div>
                    <div>
                        <Menu
                            mode="horizontal"
                            onClick={() => {
                                localStorage.clear();
                                history.push('/login');
                            }}
                            style={{ background: 'transparent' }}
                            selectable={'false'}
                        >
                            <SubMenu
                                key="SubMenu"
                                icon={<FaUser style={{ color: "#fff", cursor: 'pointer', width: '25px', height: '25px' }} />}
                                selectable={'false'}
                                style={{ background: 'transparent' }}
                            >
                                <Menu.ItemGroup>
                                    <Menu.Item key="1">Cerrar sesión</Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                        </Menu>
                    </div>
                </Header>
                {(userStatus) ?
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
                    : <Spin />}
            </Layout>
        </Layout>


    )
}

export default PrivateRouter;