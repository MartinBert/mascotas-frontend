import React from 'react';
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
import Imagenes from '../views/Imagenes';
import Ventas from '../views/Ventas';

const routes = [
    {id: 1, activeKey: null, path: '/login', private: false, component: Login},
    {id: 2, activeKey: null, path: '/uploads/:image', private: true, component: Imagenes},
    {id: 3, activeKey: '1', submenu:'sub1', path: '/ventas', private: true, component: Ventas},
    {id: 4, activeKey: null, path: '/documentos/:id', private: true, component: DocumentosForm},
    {id: 5, activeKey: '2', submenu:'sub1', path: '/documentos', private: true, component: Documentos},
    {id: 6, activeKey: null, path: '/clientes/:id', private: true, component: ClientesForm},
    {id: 7, activeKey: '3', submenu:'sub1', path: '/clientes', private: true, component: Clientes},
    {id: 8, activeKey: null, path: '/mediospago/:id', private: true, component: MediosPagoForm},
    {id: 9, activeKey: '4', submenu:'sub1', path: '/mediospago', private: true, component: MediosPago},
    {id: 10, activeKey: null, path: '/productos/:id', private: true, component: ProductosForm},
    {id: 11, activeKey: '5', submenu:'sub2', path: '/productos', private: true, component: Productos},
    {id: 12, activeKey: null, path: '/salidas/:id', private: true, component: SalidasForm},
    {id: 13, activeKey: '6', submenu:'sub2', path: '/salidas', private: true, component: Salidas},
    {id: 14, activeKey: null, path: '/entradas/:id', private: true, component: EntradasForm},
    {id: 15, activeKey: '7', submenu:'sub2', path: '/entradas', private: true, component: Entradas},
    {id: 16, activeKey: null, path: '/marcas/:id', private: true, component: MarcasForm},
    {id: 17, activeKey: '8', submenu:'sub2', path: '/marcas', private: true, component: Marcas},
    {id: 18, activeKey: null, path: '/rubros/:id', private: true, component: RubrosForm},
    {id: 19, activeKey: '9', submenu:'sub2', path: '/rubros', private: true, component: Rubros},
    {id: 20, activeKey: null, path: '/usuarios/:id', private: true, component: UsuariosForm},
    {id: 21, activeKey: '10', submenu:'sub3', path: '/usuarios', private: true, component: Usuarios},
    {id: 22, activeKey: null, path: '/empresas/:id', private: true, component: EmpresasForm},
    {id: 23, activeKey: '11', submenu:'sub3', path: '/empresas', private: true, component: Empresas},
    {id: 24, activeKey: null, path: '/condicionesfiscales/:id', private: true, component: CondicionesFiscalesForm},
    {id: 25, activeKey: '12', submenu:'sub3', path: '/condicionesfiscales', private: true, component: CondicionesFiscales},
    {id: 26, activeKey: null, path: '/puntosventa/:id', private: true, component: PuntosVentaForm},
    {id: 27, activeKey: '13', submenu:'sub3', path: '/puntosventa', private: true, component: PuntosVenta},
    {id: 28, activeKey: null, path: '/', private: true, component: Home},

]

const AppRouter  = () => {
    return (
        <Router>
            <Switch>
                {routes.map(route => (
                    (route.private)
                    ? <PrivateRouter path={route.path} component={route.component} key={route.id} activeKey={route.activeKey} submenu={route.submenu}/>
                    : <PublicRouter path={route.path} component={route.component} key={route.id} />
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter;