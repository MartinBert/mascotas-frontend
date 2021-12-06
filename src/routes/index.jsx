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
import Rubros from '../views/Rubros';
import RubrosForm from '../views/Rubros/RubrosForm';
import Usuarios from '../views/Usuarios';
import UsuariosForm from '../views/Usuarios/UsuariosForm';
import Imagenes from '../views/Imagenes';

const routes = [
    {id: 1, path: '/login', private: false, component: Login},
    {id: 2, path: '/productos/:id', private: true, component: ProductosForm},
    {id: 3, path: '/productos', private: true, component: Productos},
    {id: 4, path: '/salidas/:id', private: true, component: SalidasForm},
    {id: 5, path: '/salidas', private: true, component: Salidas},
    {id: 6, path: '/marcas/:id', private: true, component: MarcasForm},
    {id: 7, path: '/marcas', private: true, component: Marcas},
    {id: 8, path: '/clientes/:id', private: true, component: ClientesForm},
    {id: 9, path: '/clientes', private: true, component: Clientes},
    {id: 10, path: '/rubros/:id', private: true, component: RubrosForm},
    {id: 11, path: '/rubros', private: true, component: Rubros},
    {id: 12, path: '/usuarios/:id', private: true, component: UsuariosForm},
    {id: 13, path: '/usuarios', private: true, component: Usuarios},
    {id: 14, path: '/uploads/:image', private: true, component: Imagenes},
    {id: 15, path: '/', private: true, component: Home},
]

const AppRouter  = () => {
    return (
        <Router>
            <Switch>
                {routes.map(route => (
                    (route.private)
                    ? <PrivateRouter path={route.path} component={route.component} key={route.id} />
                    : <PublicRouter path={route.path} component={route.component} key={route.id} />
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter;