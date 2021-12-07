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
import Imagenes from '../views/Imagenes';

const routes = [
    {id: 1, activeKey: null, path: '/login', private: false, component: Login},
    {id: 2, activeKey: null, path: '/productos/:id', private: true, component: ProductosForm},
    {id: 3, activeKey: '1', path: '/productos', private: true, component: Productos},
    {id: 4, activeKey: null, path: '/salidas/:id', private: true, component: SalidasForm},
    {id: 5, activeKey: '2', path: '/salidas', private: true, component: Salidas},
    {id: 6, activeKey: null, path: '/marcas/:id', private: true, component: MarcasForm},
    {id: 7, activeKey: '3', path: '/marcas', private: true, component: Marcas},
    {id: 8, activeKey: null, path: '/rubros/:id', private: true, component: RubrosForm},
    {id: 9, activeKey: '4', path: '/rubros', private: true, component: Rubros},
    {id: 10, activeKey: null, path: '/clientes/:id', private: true, component: ClientesForm},
    {id: 11, activeKey: '5', path: '/clientes', private: true, component: Clientes},
    {id: 12, activeKey: null, path: '/mediospago/:id', private: true, component: MediosPagoForm},
    {id: 13, activeKey: '6', path: '/mediospago', private: true, component: MediosPago},
    {id: 14, activeKey: null, path: '/documentos/:id', private: true, component: DocumentosForm},
    {id: 15, activeKey: '7', path: '/documentos', private: true, component: Documentos},
    {id: 16, activeKey: null, path: '/usuarios/:id', private: true, component: UsuariosForm},
    {id: 17, activeKey: '8', path: '/usuarios', private: true, component: Usuarios},
    {id: 18, activeKey: null, path: '/uploads/:image', private: true, component: Imagenes},
    {id: 19, activeKey: null, path: '/', private: true, component: Home},
]

const AppRouter  = () => {
    return (
        <Router>
            <Switch>
                {routes.map(route => (
                    (route.private)
                    ? <PrivateRouter path={route.path} component={route.component} key={route.id} activeKey={route.activeKey}/>
                    : <PublicRouter path={route.path} component={route.component} key={route.id} />
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter;