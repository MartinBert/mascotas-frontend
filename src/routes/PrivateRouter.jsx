// Views
import Clientes from '../views/Clientes'
import ClientesForm from '../views/Clientes/ClientesForm'
import CondicionesFiscales from '../views/CondicionesFiscales'
import CondicionesFiscalesForm from '../views/CondicionesFiscales/CondicionesFiscalesForm'
import Documentos from '../views/Documentos'
import DocumentosForm from '../views/Documentos/DocumentosForm'
import Empresas from '../views/Empresas'
import EmpresasForm from '../views/Empresas/EmpresasForm'
import Entradas from '../views/Entradas'
import EntradasForm from '../views/Entradas/EntradasForm'
import FormatPrivateComponent from './FormatPrivateComponent'
import Home from '../views/Home'
import Marcas from '../views/Marcas'
import MarcasForm from '../views/Marcas/MarcasForm'
import MediosPago from '../views/MediosPago'
import MediosPagoForm from '../views/MediosPago/MediosPagoForm'
import Productos from '../views/Productos'
import ProductosForm from '../views/Productos/ProductosForm'
import PuntosVenta from '../views/PuntosVenta'
import PuntosVentaForm from '../views/PuntosVenta/PuntosVentaForm'
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

const privateRoutesPreData = [
    {
        path: '/venta',
        element: <Ventas />,
        activeKey: '1',
        private: true
    },
    {
        path: '/listaVentas',
        element: <VentasList />,
        activeKey: '2',
        private: true
    },
    {
        path: '/documentos/:id',
        element: <DocumentosForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/documentos',
        element: <Documentos />,
        activeKey: '3',
        private: true
    },
    {
        path: '/clientes/:id',
        element: <ClientesForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/clientes',
        element: <Clientes />,
        activeKey: '4',
        private: true
    },
    {
        path: '/mediospago/:id',
        element: <MediosPagoForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/mediospago',
        element: <MediosPago />,
        activeKey: '5',
        private: true
    },
    {
        path: '/productos/:id',
        element: <ProductosForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/productos',
        element: <Productos />,
        activeKey: '6',
        private: true
    },
    {
        path: '/salidas/:id',
        element: <SalidasForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/salidas',
        element: <Salidas />,
        activeKey: '7',
        private: true
    },
    {
        path: '/entradas/:id',
        element: <EntradasForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/entradas',
        element: <Entradas />,
        activeKey: '8',
        private: true
    },
    {
        path: '/marcas/:id',
        element: <MarcasForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/marcas',
        element: <Marcas />,
        activeKey: '9',
        private: true
    },
    {
        path: '/rubros/:id',
        element: <RubrosForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/rubros',
        element: <Rubros />,
        activeKey: '10',
        private: true
    },
    {
        path: '/unidadesmedida/:id',
        element: <UnidadesMedidaForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/unidadesmedida',
        element: <UnidadesMedida />,
        activeKey: '11',
        private: true
    },
    {
        path: '/usuarios/:id',
        element: <UsuariosForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/usuarios',
        element: <Usuarios />,
        activeKey: '12',
        private: true
    },
    {
        path: '/empresas/:id',
        element: <EmpresasForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/empresas',
        element: <Empresas />,
        activeKey: '13',
        private: true
    },
    {
        path: '/puntosventa/:id',
        element: <PuntosVentaForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/puntosventa',
        element: <PuntosVenta />,
        activeKey: '14',
        private: true
    },
    {
        path: '/condicionesfiscales/:id',
        element: <CondicionesFiscalesForm />,
        activeKey: null,
        private: true
    },
    {
        path: '/condicionesfiscales',
        element: <CondicionesFiscales />,
        activeKey: '15',
        private: true
    },
    {
        path: '/',
        element: <Home />,
        activeKey: null,
        private: true
    },
]

const privateRoutesData = privateRoutesPreData.map((route, i) => {
    const prefixKey = 'private_route_'
    return ({
        path: route.path,
        element: <FormatPrivateComponent children={route.element} activeKey={route.activeKey} />,
        key: prefixKey + i,
        activeKey: route.activeKey,
        private: route.private
    })
})

const PrivateRouter = {
    privateRoutesData
}

export default PrivateRouter