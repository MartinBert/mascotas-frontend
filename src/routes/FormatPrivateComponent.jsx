// React Components
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
    FaAddressBook,
    FaCogs,
    FaClosedCaptioning,
    FaList,
    FaCubes,
    FaInbox,
    FaCheck,
    FaWeightHanging,
    FaChartLine
} from 'react-icons/fa'

// Design Components
import { Layout, Menu } from 'antd'

// Custom Context Providers
import contextProviders from '../contextProviders'


// Imports Destructurings
const { useLoggedUserContext } = contextProviders.LoggedUserContextProvider
const { useSaleContext } = contextProviders.SaleContextProvider


const FormatPrivateComponent = ({ children, activeKey }) => {
    const [loggedUser_state, loggedUser_dispatch] = useLoggedUserContext()
    const [sale_state, sale_dispatch] = useSaleContext()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const { Header, Sider, Content } = Layout

    const redirectToPath = (e) => {
        navigate(e.item.props.routepath)
    }

    const toggle = () => {
        setCollapsed(!collapsed)
    }

    const getItem = (key, label, icon, routepath, children) => {
        return {
            key,
            label,
            icon,
            routepath,
            children,
        }
    }

    const saleMenu = [
        getItem('1', 'Ventas', <FaShoppingCart />, '/venta'),
        getItem('2', 'Lista de ventas', <FaList />, '/listaVentas'),
        loggedUser_state.user.perfil ? getItem('3', 'Documentos', <FaFile />, '/documentos') : null,
        loggedUser_state.user.perfil ? getItem('4', 'Clientes', <FaUsers />, '/clientes') : null,
        loggedUser_state.user.perfil ? getItem('5', 'Medios de pago', <FaMoneyBillWave />, '/mediospago') : null,
    ]

    const productAndStockMenu = [
        loggedUser_state.user.perfil ? getItem('6', 'Productos', <FaBookmark />, '/productos') : null,
        loggedUser_state.user.perfil ? getItem('7', 'Salidas', <FaCheck />, '/salidas') : null,
        loggedUser_state.user.perfil ? getItem('8', 'Entradas', <FaInbox />, '/entradas') : null,
        loggedUser_state.user.perfil ? getItem('9', 'Marcas', <FaTag />, '/marcas') : null,
        loggedUser_state.user.perfil ? getItem('10', 'Rubros', <FaTags />, '/rubros') : null,
        loggedUser_state.user.perfil ? getItem('11', 'Unid. medida', <FaWeightHanging />, '/unidadesmedida') : null,
    ]

    const configurationMenu = [
        loggedUser_state.user.perfil ? getItem('12', 'Usuarios', <FaUser />, '/usuarios') : null,
        loggedUser_state.user.perfil ? getItem('13', 'Empresas', <FaBusinessTime />, '/empresas') : null,
        loggedUser_state.user.perfil ? getItem('14', 'Puntos de venta', <FaCodeBranch />, '/puntosventa') : null,
        loggedUser_state.user.perfil ? getItem('15', 'Condiciones fiscales', <FaAddressBook />, '/condicionesfiscales') : null,
    ]

    const subMenusToSidebar = [
        getItem('sub1', 'Ventas', <FaChartLine />, null, saleMenu),
        loggedUser_state.user.perfil ? getItem('sub2', 'Productos y Stock', <FaCubes />, null, productAndStockMenu) : null,
        loggedUser_state.user.perfil ? getItem('sub3', 'Configuraciones', <FaCogs />, null, configurationMenu) : null,
    ]

    const toolbarMenu = [
        getItem('1', 'Cerrar Sesión', <FaClosedCaptioning />)
    ]

    const toolbarSubMenu = [
        getItem('sub1', null, <FaUser style={{ color: '#fff', cursor: 'pointer', width: '25px', height: '25px' }} />, null, toolbarMenu)
    ]

    return (
        <Layout style={{ height: '100%' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ background: 'rgb(2,0,36) linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)' }}
            >
                <div style={{ height: '57px', background: 'transparent', marginTop: '3px', marginLeft: '3px' }}></div>
                <Menu
                    theme='dark'
                    mode='inline'
                    style={{ background: 'transparent' }}
                    defaultSelectedKeys={[(activeKey) ? activeKey[0] : '1']}
                    defaultOpenKeys={[(activeKey) ? activeKey[1] : 'sub1']}
                    onSelect={(e) => redirectToPath(e)}
                    items={subMenusToSidebar}
                />
            </Sider>
            <Layout className='site-layout' style={{ height: '100%' }}>
                <Header className='site-layout-background' style={{ padding: 0, background: 'rgb(2,0,36) linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(154,0,191,1) 0%, rgba(45,0,136,1) 100%)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <FaBars style={{ color: '#fff', marginLeft: '20px', cursor: 'pointer' }} onClick={() => { toggle() }} />
                    </div>
                    <div>
                        <Menu
                            mode='horizontal'
                            onClick={() => {
                                localStorage.clear()
                                navigate('/login')
                            }}
                            style={{ background: 'transparent' }}
                            selectable={'false'}
                            items={toolbarSubMenu}
                        />
                    </div>
                </Header>
                <Content
                    className='site-layout-background'
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default FormatPrivateComponent