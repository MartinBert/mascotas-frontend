// Views
import Clientes from '../views/Clientes'
import ClientesForm from '../views/Clientes/ClientesForm'
import CondicionesFiscales from '../views/CondicionesFiscales'
import CondicionesFiscalesForm from '../views/CondicionesFiscales/CondicionesFiscalesForm'
import DailyBusinessStatistics from '../views/DailyBusinessStatistics'
import DailyBusinessStatisticsGraphics from '../views/DailyBusinessStatistics/DailyBusinessStatisticsGraphics'
import Documentos from '../views/Documentos'
import DocumentosForm from '../views/Documentos/DocumentosForm'
import Empresas from '../views/Empresas'
import EmpresasForm from '../views/Empresas/EmpresasForm'
import Entradas from '../views/Entradas'
import EntradasForm from '../views/Entradas/EntradasForm'
import FormatPrivateComponent from './FormatPrivateComponent'
import Home from '../views/Home'
import InterfaceStyles from '../views/InterfaceStyles'
import Marcas from '../views/Marcas'
import MarcasForm from '../views/Marcas/MarcasForm'
import MediosPago from '../views/MediosPago'
import MediosPagoForm from '../views/MediosPago/MediosPagoForm'
import Productos from '../views/Productos'
import ProductosForm from '../views/Productos/ProductosForm'
import PuntosVenta from '../views/PuntosVenta'
import PuntosVentaForm from '../views/PuntosVenta/PuntosVentaForm'
import ProductStockHistory from '../views/ProductStockHistory'
import ProductStockHistoryGraphics from '../views/ProductStockHistory/ProductStockHistoryGraphics'
import Rubros from '../views/Rubros'
import RubrosForm from '../views/Rubros/RubrosForm'
import Salidas from '../views/Salidas'
import SalidasForm from '../views/Salidas/SalidasForm'
import UnidadesMedida from '../views/UnidadesMedida'
import UnidadesMedidaForm from '../views/UnidadesMedida/UnidadesMedidaForm'
import Usuarios from '../views/Usuarios'
import UsuariosForm from '../views/Usuarios/UsuariosForm'
import Ventas from '../views/Ventas'
import VentasList from '../views/Ventas/VentasList'
import ZonasDeVentas from '../views/ZonasDeVentas'
import ZonasDeVentasForm from '../views/ZonasDeVentas/ZonasDeVentasForm'


const privateRoutesPreData = [
    {
        activeKey: null,
        element: <ClientesForm />,
        onlySuperadmin: true,
        path: '/clientes/:id',
        private: true
    },
    {
        activeKey: null,
        element: <CondicionesFiscalesForm />,
        onlySuperadmin: true,
        path: '/condicionesfiscales/:id',
        private: true
    },
    {
        activeKey: null,
        element: <DocumentosForm />,
        onlySuperadmin: true,
        path: '/documentos/:id',
        private: true
    },
    {
        activeKey: null,
        element: <EmpresasForm />,
        onlySuperadmin: true,
        path: '/empresas/:id',
        private: true
    },
    {
        activeKey: null,
        element: <EntradasForm />,
        onlySuperadmin: true,
        path: '/entradas/:id',
        private: true
    },
    {
        activeKey: null,
        element: <Home />,
        onlySuperadmin: true,
        path: '/',
        private: true
    },
    {
        activeKey: null,
        element: <MarcasForm />,
        onlySuperadmin: true,
        path: '/marcas/:id',
        private: true
    },
    {
        activeKey: null,
        element: <MediosPagoForm />,
        onlySuperadmin: true,
        path: '/mediospago/:id',
        private: true
    },
    {
        activeKey: null,
        element: <ProductosForm />,
        onlySuperadmin: true,
        path: '/productos/:id',
        private: true
    },
    {
        activeKey: null,
        element: <PuntosVentaForm />,
        onlySuperadmin: true,
        path: '/puntosventa/:id',
        private: true
    },
    {
        activeKey: null,
        element: <RubrosForm />,
        onlySuperadmin: true,
        path: '/rubros/:id',
        private: true
    },
    {
        activeKey: null,
        element: <SalidasForm />,
        onlySuperadmin: true,
        path: '/salidas/:id',
        private: true
    },
    {
        activeKey: null,
        element: <UnidadesMedidaForm />,
        onlySuperadmin: true,
        path: '/unidadesmedida/:id',
        private: true
    },
    {
        activeKey: null,
        element: <UsuariosForm />,
        onlySuperadmin: true,
        path: '/usuarios/:id',
        private: true
    },
    {
        activeKey: null,
        element: <ZonasDeVentasForm />,
        onlySuperadmin: true,
        path: '/zonasdeventas/:id',
        private: true
    },
    {
        activeKey: '1',
        element: <Ventas />,
        onlySuperadmin: false,
        path: '/venta',
        private: true
    },
    {
        activeKey: '2',
        element: <VentasList />,
        onlySuperadmin: false,
        path: '/listaVentas',
        private: true
    },
    {
        activeKey: '3',
        element: <Documentos />,
        onlySuperadmin: true,
        path: '/documentos',
        private: true
    },
    {
        activeKey: '4',
        element: <Clientes />,
        onlySuperadmin: true,
        path: '/clientes',
        private: true
    },
    {
        activeKey: '5',
        element: <MediosPago />,
        onlySuperadmin: true,
        path: '/mediospago',
        private: true
    },
    {
        activeKey: '6',
        element: <ZonasDeVentas />,
        onlySuperadmin: true,
        path: '/zonasdeventas',
        private: true
    },
    {
        activeKey: '7',
        element: <Productos />,
        onlySuperadmin: true,
        path: '/productos',
        private: true
    },
    {
        activeKey: '8',
        element: <Salidas />,
        onlySuperadmin: true,
        path: '/salidas',
        private: true
    },
    {
        activeKey: '9',
        element: <Entradas />,
        path: '/entradas',
        private: true,
        onlySuperadmin: true,
    },
    {
        activeKey: '10',
        element: <Marcas />,
        onlySuperadmin: true,
        path: '/marcas',
        private: true
    },
    {
        activeKey: '11',
        element: <Rubros />,
        onlySuperadmin: true,
        path: '/rubros',
        private: true
    },
    {
        activeKey: '12',
        element: <UnidadesMedida />,
        onlySuperadmin: true,
        path: '/unidadesmedida',
        private: true
    },
    {
        activeKey: '13',
        element: <DailyBusinessStatistics />,
        onlySuperadmin: true,
        path: '/daily_business_statistics/daily_balance',
        private: true
    },
    {
        activeKey: '14',
        element: <DailyBusinessStatisticsGraphics />,
        onlySuperadmin: true,
        path: '/daily_business_statistics/graphics',
        private: true
    },
    {
        activeKey: '15',
        element: <ProductStockHistory />,
        onlySuperadmin: true,
        path: '/stock_history/history',
        private: true
    },
    {
        activeKey: '16',
        element: <ProductStockHistoryGraphics />,
        onlySuperadmin: true,
        path: '/stock_history/graphics',
        private: true
    },
    {
        activeKey: '17',
        element: <Usuarios />,
        onlySuperadmin: true,
        path: '/usuarios',
        private: true
    },
    {
        activeKey: '18',
        element: <Empresas />,
        onlySuperadmin: true,
        path: '/empresas',
        private: true
    },
    {
        activeKey: '19',
        element: <PuntosVenta />,
        onlySuperadmin: true,
        path: '/puntosventa',
        private: true
    },
    {
        activeKey: '20',
        element: <CondicionesFiscales />,
        onlySuperadmin: true,
        path: '/condicionesfiscales',
        private: true
    },
    {
        activeKey: '21',
        element: <InterfaceStyles />,
        onlySuperadmin: true,
        path: '/interfacestyles',
        private: true
    }
]

const privateRoutesData = privateRoutesPreData.map((route, i) => {
    const prefixKey = 'private_route_'
    return ({
        path: route.path,
        element: <FormatPrivateComponent children={route.element} activeKey={route.activeKey} />,
        key: prefixKey + i,
        activeKey: route.activeKey,
        private: route.private,
        onlySuperadmin: route.onlySuperadmin
    })
})

const PrivateRouter = {
    privateRoutesData
}

export default PrivateRouter