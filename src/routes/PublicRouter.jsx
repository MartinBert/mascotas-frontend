import React from 'react';
import { Route } from 'react-router-dom';

const PublicRouter = ({ path, component: Component }) => (
    <Route exact path={path}>
        <Component/>
    </Route>
)

export default PublicRouter;