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

const PrivateRouter = ({ path, component: Component, activeKey, state, dispatch, userState, userDispatch, userActions}) => {
    const history = useHistory();
    const [collapsed, setCollapsed] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    useEffect(() => {
        if (userStatus) return;
        const verifyUser = () => {
            const token = localStorage.getItem('token');
            if(!token) return redirectToLogin();
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

    const generateSubMenus = () => {
        const subMenus = [
            { 
                title: 'Ventas',
                key: 'sub1',
                items: [
                    createSubMenuItem('1', <FaShoppingCart/>, '/venta', 'Ventas'),
                    createSubMenuItem('2', <FaShoppingCart/>, '/listaVentas', 'Lista de ventas'),
                    createSubMenuItem('3', <FaFile/>, '/documentos', 'Documentos'),
                    createSubMenuItem('4', <FaUsers/>, '/clientes', 'Clientes'),
                    createSubMenuItem('5', <FaMoneyBillWave/>, '/mediospago', 'Medios de pago')
                ]
            },
            {
                title: 'Productos y stock',
                key: 'sub2',
                items: [
                    createSubMenuItem('6', <FaBookmark/>, '/productos', 'Productos'),
                    createSubMenuItem('7', <FaDollarSign/>, '/salidas', 'Salidas'),
                    createSubMenuItem('8', <FaDollarSign/>, '/entradas', 'Entradas'),
                    createSubMenuItem('9', <FaTag/>, '/marcas', 'Marcas'),
                    createSubMenuItem('10', <FaTags/>, '/rubros', 'Rubros'),
                    createSubMenuItem('11', <FaTags/>, '/unidadesmedida', 'Unid. medida'),
                ]
            },
            {
                title: 'Configuraciones',
                key: 'sub3',
                items: [
                    createSubMenuItem('12', <FaUser/>, '/usuarios', 'Usuarios'),
                    createSubMenuItem('13', <FaBusinessTime/>, '/empresas', 'Empresas'),
                    createSubMenuItem('14', <FaCodeBranch/>, '/puntosventa', 'Puntos de venta'),
                    createSubMenuItem('15', <FaAddressBook/>, '/condicionesfiscales', 'Condiciones fiscales'),
                ]
            },
        ]

        return subMenus.map(sub => {
            const subMenu = <Menu.SubMenu key={sub.key} title={sub.title}>
                {sub.items.map(item => item)}
            </Menu.SubMenu>
            return subMenu;
        })
    }

    const createSubMenuItem = (key, icon, path, title) => (
        <Menu.Item key={key} icon={icon} style={{background: 'rgb(117, 0, 146)', margin: '0px'}}>
            <Link to={path}>
                {title}
            </Link>
        </Menu.Item>
    ) 

    return (
        (userState.loading)
        ? <Spin/>
        :
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
                    {generateSubMenus()}
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
                            <Component userState={userState} userDispatch={userDispatch} userAction={userActions}/>
                        </Route>
                    </Content>
                    : <Spin />}
            </Layout>
        </Layout>


    )
}

export default PrivateRouter;