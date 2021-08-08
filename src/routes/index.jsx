import React from 'react';
import PublicRouter from './PublicRouter';
import PrivateRouter from './PrivateRouter';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';

const routes = [
    {path: '/login', private: false, component: Login},
    {path: '/', private: true, component: Home},
]

const AppRouter  = () => {
    return (
        <Router>
            <Switch>
                {routes.map(route => (
                    (route.private)
                    ? <PrivateRouter path={route.path}/>
                    : <PublicRouter path={route.path} component={route.component}/>
                ))}
            </Switch>
        </Router>
    )
}

export default AppRouter;