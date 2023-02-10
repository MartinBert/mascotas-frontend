import React, { useReducer } from 'react'
import reducers from '../reducers'
import PublicRouter from './PublicRouter'
import PrivateRouter from './PrivateRouter'
import {BrowserRouter as Router, Switch} from 'react-router-dom'
import Login from '../views/Login'
import Home from '../views/Home'
import Productos from '../views/Productos'
import ProductosForm from '../views/Productos/ProductosForm'
import Salidas from '../views/Salidas'
import SalidasForm from '../views/Salidas/SalidasForm'
import Entradas from '../views/Entradas'
import EntradasForm from '../views/Entradas/EntradasForm'
import Marcas from '../views/Marcas'
import MarcasForm from '../views/Marcas/MarcasForm'
import Clientes from '../views/Clientes'
import ClientesForm from '../views/Clientes/ClientesForm'
import Documentos from '../views/Documentos'
import DocumentosForm from '../views/Documentos/DocumentosForm'
import MediosPago from '../views/MediosPago'
import MediosPagoForm from '../views/MediosPago/MediosPagoForm'
import Rubros from '../views/Rubros'
import RubrosForm from '../views/Rubros/RubrosForm'
import Usuarios from '../views/Usuarios'
import UsuariosForm from '../views/Usuarios/UsuariosForm'
import Empresas from '../views/Empresas'
import EmpresasForm from '../views/Empresas/EmpresasForm'
import PuntosVenta from '../views/PuntosVenta'
import PuntosVentaForm from '../views/PuntosVenta/PuntosVentaForm'
import UnidadesMedida from '../views/UnidadesMedida'
import UnidadesMedidaForm from '../views/UnidadesMedida/UnidadesMedidaForm'
import CondicionesFiscales from '../views/CondicionesFiscales'
import CondicionesFiscalesForm from '../views/CondicionesFiscales/CondicionesFiscalesForm'
import Ventas from '../views/Ventas'
import VentasList from '../views/Ventas/VentasList'

const routes = [
    {id: 1, activeKey: null, path: '/login', private: false, component: Login},
    {id: 2, activeKey: '1', path: '/venta', private: true, component: Ventas},
    {id: 3, activeKey: '2', path: '/listaVentas', private: true, component: VentasList},
    {id: 4, activeKey: null, path: '/documentos/:id', private: true, component: DocumentosForm},
    {id: 5, activeKey: '3', path: '/documentos', private: true, component: Documentos},
    {id: 6, activeKey: null, path: '/clientes/:id', private: true, component: ClientesForm},
    {id: 7, activeKey: '4', path: '/clientes', private: true, component: Clientes},
    {id: 8, activeKey: null, path: '/mediospago/:id', private: true, component: MediosPagoForm},
    {id: 9, activeKey: '5', path: '/mediospago', private: true, component: MediosPago},
    {id: 10, activeKey: null, path: '/productos/:id', private: true, component: ProductosForm},
    {id: 11, activeKey: '6', path: '/productos', private: true, component: Productos},
    {id: 12, activeKey: null, path: '/salidas/:id', private: true, component: SalidasForm},
    {id: 13, activeKey: '7', path: '/salidas', private: true, component: Salidas},
    {id: 14, activeKey: null, path: '/entradas/:id', private: true, component: EntradasForm},
    {id: 15, activeKey: '8', path: '/entradas', private: true, component: Entradas},
    {id: 16, activeKey: null, path: '/marcas/:id', private: true, component: MarcasForm},
    {id: 17, activeKey: '9', path: '/marcas', private: true, component: Marcas},
    {id: 18, activeKey: null, path: '/rubros/:id', private: true, component: RubrosForm},
    {id: 19, activeKey: '10', path: '/rubros', private: true, component: Rubros},
    {id: 20, activeKey: null, path: '/unidadesmedida/:id', private: true, component: UnidadesMedidaForm},
    {id: 21, activeKey: '11', path: '/unidadesmedida', private: true, component: UnidadesMedida},
    {id: 22, activeKey: null, path: '/usuarios/:id', private: true, component: UsuariosForm},
    {id: 23, activeKey: '12', path: '/usuarios', private: true, component: Usuarios},
    {id: 24, activeKey: null, path: '/empresas/:id', private: true, component: EmpresasForm},
    {id: 25, activeKey: '13', path: '/empresas', private: true, component: Empresas},
    {id: 26, activeKey: null, path: '/puntosventa/:id', private: true, component: PuntosVentaForm},
    {id: 27, activeKey: '14', path: '/puntosventa', private: true, component: PuntosVenta},
    {id: 28, activeKey: null, path: '/condicionesfiscales/:id', private: true, component: CondicionesFiscalesForm},
    {id: 29, activeKey: '15', path: '/condicionesfiscales', private: true, component: CondicionesFiscales},
    {id: 30, activeKey: null, path: '/', private: true, component: Home},
]

const {reducer, initialState} = reducers.privateRouteReducer

const AppRouter  = ({userState, userDispatch, userActions}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <Router>
            <Switch>
                {routes.map(route => (
                    (route.private)
                    ? 
                    <PrivateRouter 
                        path={route.path} 
                        component={route.component} 
                        key={route.id} 
                        activeKey={route.activeKey} 
                        state={state} 
                        dispatch={dispatch} 
                        userState={userState}
                        userDispatch={userDispatch}
                        userActions={userActions} 
                    />
                    : <PublicRouter path={route.path} component={route.component} key={route.id} />
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter