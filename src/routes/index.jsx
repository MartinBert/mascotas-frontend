import React, { useReducer } from 'react';
import reducers from '../reducers';
import PublicRouter from './PublicRouter';
import PrivateRouter from './PrivateRouter';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import Productos from '../views/Productos';
import ProductosForm from '../views/Productos/ProductosForm';
import Salidas from '../views/Salidas';
import SalidasForm from '../views/Salidas/SalidasForm';
import Entradas from '../views/Entradas';
import EntradasForm from '../views/Entradas/EntradasForm';
import Marcas from '../views/Marcas';
import MarcasForm from '../views/Marcas/MarcasForm';
import Clientes from '../views/Clientes';
import ClientesForm from '../views/Clientes/ClientesForm';
import Documentos from '../views/Documentos';
import DocumentosForm from '../views/Documentos/DocumentosForm';
import MediosPago from '../views/MediosPago';
import MediosPagoForm from '../views/MediosPago/MediosPagoForm';
import Rubros from '../views/Rubros';
import RubrosForm from '../views/Rubros/RubrosForm';
import Usuarios from '../views/Usuarios';
import UsuariosForm from '../views/Usuarios/UsuariosForm';
import Empresas from '../views/Empresas';
import EmpresasForm from '../views/Empresas/EmpresasForm';
import PuntosVenta from '../views/PuntosVenta';
import PuntosVentaForm from '../views/PuntosVenta/PuntosVentaForm';
import CondicionesFiscales from '../views/CondicionesFiscales';
import CondicionesFiscalesForm from '../views/CondicionesFiscales/CondicionesFiscalesForm';
import Ventas from '../views/Ventas';

const routes = [
    {id: 1, activeKey: null, path: '/login', private: false, component: Login},
    {id: 2, activeKey: '1', path: '/ventas', private: true, component: Ventas},
    {id: 3, activeKey: null, path: '/documentos/:id', private: true, component: DocumentosForm},
    {id: 4, activeKey: '2', path: '/documentos', private: true, component: Documentos},
    {id: 5, activeKey: null, path: '/clientes/:id', private: true, component: ClientesForm},
    {id: 6, activeKey: '3', path: '/clientes', private: true, component: Clientes},
    {id: 7, activeKey: null, path: '/mediospago/:id', private: true, component: MediosPagoForm},
    {id: 8, activeKey: '4', path: '/mediospago', private: true, component: MediosPago},
    {id: 9, activeKey: null, path: '/productos/:id', private: true, component: ProductosForm},
    {id: 10, activeKey: '5', path: '/productos', private: true, component: Productos},
    {id: 11, activeKey: null, path: '/salidas/:id', private: true, component: SalidasForm},
    {id: 12, activeKey: '6', path: '/salidas', private: true, component: Salidas},
    {id: 13, activeKey: null, path: '/entradas/:id', private: true, component: EntradasForm},
    {id: 14, activeKey: '7', path: '/entradas', private: true, component: Entradas},
    {id: 15, activeKey: null, path: '/marcas/:id', private: true, component: MarcasForm},
    {id: 16, activeKey: '8', path: '/marcas', private: true, component: Marcas},
    {id: 17, activeKey: null, path: '/rubros/:id', private: true, component: RubrosForm},
    {id: 18, activeKey: '9', path: '/rubros', private: true, component: Rubros},
    {id: 19, activeKey: null, path: '/usuarios/:id', private: true, component: UsuariosForm},
    {id: 20, activeKey: '10', path: '/usuarios', private: true, component: Usuarios},
    {id: 21, activeKey: null, path: '/empresas/:id', private: true, component: EmpresasForm},
    {id: 22, activeKey: '11', path: '/empresas', private: true, component: Empresas},
    {id: 23, activeKey: null, path: '/condicionesfiscales/:id', private: true, component: CondicionesFiscalesForm},
    {id: 24, activeKey: '12', path: '/condicionesfiscales', private: true, component: CondicionesFiscales},
    {id: 25, activeKey: null, path: '/puntosventa/:id', private: true, component: PuntosVentaForm},
    {id: 26, activeKey: '13', path: '/puntosventa', private: true, component: PuntosVenta},
    {id: 27, activeKey: null, path: '/', private: true, component: Home},
]

const {reducer, initialState} = reducers.privateRouteReducer;

const AppRouter  = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Router>
            <Switch>
                {routes.map(route => (
                    (route.private)
                    ? <PrivateRouter path={route.path} component={route.component} key={route.id} activeKey={route.activeKey} state={state} dispatch={dispatch}/>
                    : <PublicRouter path={route.path} component={route.component} key={route.id} />
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter;