import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRouter = ({ path, component: Component }) => {
    const authorized = useSelector(state => state.auth.authorizedUser);
    return (
        (authorized)
        ?
        <Route exact path={path}>
            <Component/>
        </Route>
        : <Redirect to='/login'/>
    )
}

export default PrivateRouter;