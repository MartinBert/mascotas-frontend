// React Components
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaAddressBook,
    FaBars,
    FaBookmark,
    FaBusinessTime,
    FaChartArea,
    FaChartBar,
    FaChartLine,
    FaCheck,
    FaClosedCaptioning,
    FaCodeBranch,
    FaCogs,
    FaCubes,
    FaFile,
    FaFileInvoiceDollar,
    FaInbox,
    FaList,
    FaMoneyBillWave,
    FaShoppingCart,
    FaTag,
    FaTags,
    FaUser,
    FaUsers,
    FaWeightHanging,
} from 'react-icons/fa'

// Design Components
import { Layout, Menu } from 'antd'

// Custom Context Providers
import contexts from '../contexts'

// Imports Destructurings
const { useAuthContext } = contexts.Auth


const FormatPrivateComponent = ({ children, activeKey }) => {
    const [auth_state] = useAuthContext()
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
        auth_state.user.perfil ? getItem('3', 'Documentos', <FaFile />, '/documentos') : null,
        auth_state.user.perfil ? getItem('4', 'Clientes', <FaUsers />, '/clientes') : null,
        auth_state.user.perfil ? getItem('5', 'Medios de pago', <FaMoneyBillWave />, '/mediospago') : null,
        auth_state.user.perfil ? getItem('6', 'Zonas de Ventas', <FaChartArea />, '/zonasdeventas') : null,
    ]

    const productAndStockMenu = [
        auth_state.user.perfil ? getItem('7', 'Productos', <FaBookmark />, '/productos') : null,
        auth_state.user.perfil ? getItem('8', 'Salidas', <FaCheck />, '/salidas') : null,
        auth_state.user.perfil ? getItem('9', 'Entradas', <FaInbox />, '/entradas') : null,
        auth_state.user.perfil ? getItem('10', 'Marcas', <FaTag />, '/marcas') : null,
        auth_state.user.perfil ? getItem('11', 'Rubros', <FaTags />, '/rubros') : null,
        auth_state.user.perfil ? getItem('12', 'Unid. medida', <FaWeightHanging />, '/unidadesmedida') : null,
    ]

    const businessStatisticsMenu = [
        auth_state.user.perfil ? getItem('13', 'Estadísticas diarias', <FaChartLine />, '/daily_business_statistics') : null,
    ]

    const configurationMenu = [
        auth_state.user.perfil ? getItem('14', 'Usuarios', <FaUser />, '/usuarios') : null,
        auth_state.user.perfil ? getItem('15', 'Empresas', <FaBusinessTime />, '/empresas') : null,
        auth_state.user.perfil ? getItem('16', 'Puntos de venta', <FaCodeBranch />, '/puntosventa') : null,
        auth_state.user.perfil ? getItem('17', 'Condiciones fiscales', <FaAddressBook />, '/condicionesfiscales') : null,
    ]

    const subMenusToSidebar = [
        getItem('sub1', 'Ventas', <FaFileInvoiceDollar />, null, saleMenu),
        auth_state.user.perfil ? getItem('sub2', 'Productos y Stock', <FaCubes />, null, productAndStockMenu) : null,
        auth_state.user.perfil ? getItem('sub3', 'Estadísticas de negocio', <FaChartBar />, null, businessStatisticsMenu) : null,
        auth_state.user.perfil ? getItem('sub4', 'Configuraciones', <FaCogs />, null, configurationMenu) : null,
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