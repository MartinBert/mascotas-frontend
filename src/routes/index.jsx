import React from 'react';
import PublicRouter from './PublicRouter';
import PrivateRouter from './PrivateRouter';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import Productos from '../views/Productos';

const routes = [
    {path: '/login', private: false, component: Login},
    {path: '/productos', private: true, component: Productos},
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