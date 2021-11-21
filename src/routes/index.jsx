import React from 'react';
import PublicRouter from './PublicRouter';
import PrivateRouter from './PrivateRouter';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import Productos from '../views/Productos';
import ProductosForm from '../views/Productos/ProductsForm';
import Salidas from '../views/Salidas';
import Marcas from '../views/Marcas';
import Rubros from '../views/Rubros';
import RubrosForm from '../views/Rubros/RubrosForm';
import Usuarios from '../views/Usuarios';
import Imagenes from '../views/Imagenes';

const routes = [
    {path: '/login', private: false, component: Login},
    {path: '/productos/:id', private: true, component: ProductosForm},
    {path: '/productos', private: true, component: Productos},
    {path: '/salidas', private: true, component: Salidas},
    {path: '/marcas', private: true, component: Marcas},
    {path: '/rubros/:id', private: true, component: RubrosForm},
    {path: '/rubros', private: true, component: Rubros},
    {path: '/usuarios', private: true, component: Usuarios},
    {path: '/uploads/:image', private: true, component: Imagenes},
    {path: '/', private: true, component: Home},
]

const AppRouter  = () => {
    return (
        <Router>
            <Switch>
                {routes.map((route, index) => (
                    (route.private)
                    ? <PrivateRouter path={route.path} component={route.component} key={index} />
                    : <PublicRouter path={route.path} component={route.component} key={index} />
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter;