// React Components
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaAddressBook,
    FaBalanceScale,
    FaBars,
    FaBookmark,
    FaBusinessTime,
    FaChartArea,
    FaChartBar,
    FaChartLine,
    FaChartPie,
    FaCheck,
    FaClosedCaptioning,
    FaCodeBranch,
    FaCogs,
    FaCubes,
    FaFile,
    FaFileInvoiceDollar,
    FaHighlighter,
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

// Design components
import { errorAlert, successAlert } from '../components/alerts'

// Design Components
import { Button, Layout, Menu } from 'antd'

// Custom Context Providers
import contexts from '../contexts'

// Services
import api from '../services'

// Imports Destructurings
const { useAuthContext } = contexts.Auth
const { useInterfaceStylesContext } = contexts.InterfaceStyles
const { usePrivateRouteContext } = contexts.PrivateRoute
const { Header, Sider, Content } = Layout


const FormatPrivateComponent = ({ children, activeKey }) => {
    const navigate = useNavigate()
    const [auth_state] = useAuthContext()
    const [interfaceStyles_state, interfaceStyles_dispatch] = useInterfaceStylesContext()
    const [privateRoute_state, privateRoute_dispatch] = usePrivateRouteContext()

    // ------------------------------------- Load data --------------------------------------- //
    const loadStyles = async () => {
        const res = await api.interfaceStyles.findAll()
        if (res.length < 1) interfaceStyles_dispatch({ type: 'LOAD_STYLES', payload: null })
        else interfaceStyles_dispatch({ type: 'LOAD_STYLES', payload: res[0] })
    }

    useEffect(() => {
        loadStyles()
        // eslint-disable-next-line
    }, [])

    // -------------------------------------- Actions ---------------------------------------- //
    const redirectToHome = (e) => {
        navigate('/')
    }

    const redirectToPath = (e) => {
        navigate(e.item.props.routepath)
    }

    const reloadPage = () => {
        window.location.reload()
    }

    const toggle = () => {
        privateRoute_dispatch({
            type: 'SET_COLLAPSED',
            payload: !privateRoute_state.collapsed
        })
    }

    const getItem = (key, label, icon, routepath, children) => {
        return { key, label, icon, routepath, children }
    }

    // ------------------------------- Button to restart data -------------------------------- //
    const restartData = async () => {
        const res = await api.seed.deleteData()
        if (res.code !== 200) errorAlert('Error al reiniciar los datos. Intente de nuevo.')
        else {
            const alertRes = await successAlert('¡Datos reiniciados!')
            if (alertRes.isConfirmed) {
                redirectToHome()
                reloadPage()
            }
        }
    }

    const buttonToRestartData = (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
            }}
        >
            <Button
                onClick={restartData}
                type='primary'
            >
                Reiniciar datos
            </Button>
        </div>
    )

    // ---------------------------------------- Data ----------------------------------------- //
    const backgroundColor = `
        #020024 linear-gradient(180deg,
        #020024 0%,
        ${interfaceStyles_state.isDarknessActive
            ? interfaceStyles_state.darknessBackgroundPrimaryColor
            : interfaceStyles_state.lightBackgroundPrimaryColor
        } 0%,
        ${interfaceStyles_state.isDarknessActive
            ? interfaceStyles_state.darknessBackgroundSecondaryColor
            : interfaceStyles_state.lightBackgroundSecondaryColor
        } 100%)
    `

    const saleMenu = [
        getItem('1', 'Ventas', <FaShoppingCart />, '/venta'),
        getItem('2', 'Lista de ventas', <FaList />, '/listaVentas'),
        auth_state.user.perfil ? getItem('3', 'Documentos', <FaFile />, '/documentos') : null,
        auth_state.user.perfil ? getItem('4', 'Clientes', <FaUsers />, '/clientes') : null,
        // auth_state.user.perfil ? getItem('5', 'Beneficios', <FaMoneyBillWave />, '/benefits') : null,
        auth_state.user.perfil ? getItem('6', 'Medios de pago', <FaMoneyBillWave />, '/mediospago') : null,
        auth_state.user.perfil ? getItem('7', 'Zonas de Ventas', <FaChartArea />, '/zonasdeventas') : null,
    ]

    const productAndStockMenu = [
        auth_state.user.perfil ? getItem('8', 'Productos', <FaBookmark />, '/productos') : null,
        auth_state.user.perfil ? getItem('9', 'Salidas', <FaCheck />, '/salidas') : null,
        auth_state.user.perfil ? getItem('10', 'Entradas', <FaInbox />, '/entradas') : null,
        auth_state.user.perfil ? getItem('11', 'Marcas', <FaTag />, '/marcas') : null,
        auth_state.user.perfil ? getItem('12', 'Rubros', <FaTags />, '/rubros') : null,
        auth_state.user.perfil ? getItem('13', 'Unid. medida', <FaWeightHanging />, '/unidadesmedida') : null,
    ]

    const businessStatisticsMenu = [
        auth_state.user.perfil ? getItem('14', 'Balance diario', <FaChartLine />, '/daily_business_statistics/daily_balance') : null,
        auth_state.user.perfil ? getItem('15', 'Gráficos de balance diario', <FaChartPie />, '/daily_business_statistics/graphics') : null,
        auth_state.user.perfil ? getItem('16', 'Historial de stock de productos', <FaBalanceScale />, '/stock_history/history') : null,
        auth_state.user.perfil ? getItem('17', 'Gráficos de historial de stock', <FaChartPie />, '/stock_history/graphics') : null,
    ]

    const configurationMenu = [
        auth_state.user.perfil ? getItem('18', 'Usuarios', <FaUser />, '/usuarios') : null,
        auth_state.user.perfil ? getItem('19', 'Empresas', <FaBusinessTime />, '/empresas') : null,
        auth_state.user.perfil ? getItem('20', 'Puntos de venta', <FaCodeBranch />, '/puntosventa') : null,
        auth_state.user.perfil ? getItem('21', 'Condiciones fiscales', <FaAddressBook />, '/condicionesfiscales') : null,
        auth_state.user.perfil ? getItem('22', 'Estilos de interfaz', <FaHighlighter />, '/interfacestyles') : null,
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
            {
                !auth_state.user.empresa || !auth_state.user.puntoVenta
                    ? null
                    : (
                        <Sider
                            collapsed={privateRoute_state.collapsed}
                            collapsible
                            style={{ background: backgroundColor }}
                            trigger={null}
                        >
                            <div
                                style={{
                                    height: '57px',
                                    background: 'transparent',
                                    marginTop: '3px',
                                    marginLeft: '3px'
                                }}
                            ></div>
                            <Menu
                                defaultSelectedKeys={[(activeKey) ? activeKey[0] : '1']}
                                defaultOpenKeys={[(activeKey) ? activeKey[1] : 'sub1']}
                                items={subMenusToSidebar}
                                mode='inline'
                                onSelect={(e) => redirectToPath(e)}
                                style={{ background: 'transparent' }}
                                theme='dark'
                            />
                            {
                                auth_state.user.email === process.env.REACT_APP_EMAIL_ADMIN
                                    ? buttonToRestartData
                                    : null
                            }
                        </Sider>
                    )
            }
            <Layout className='site-layout' style={{ height: '100%' }}>
                <Header className='site-layout-background'
                    style={{
                        background: backgroundColor,
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 0
                    }}
                >
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