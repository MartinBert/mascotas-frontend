// React Components and Hooks
import React, { useCallback, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

// Custom Routers
import PublicRouter from './PublicRouter'
import PrivateRouter from './PrivateRouter'

// Custom Context Providers
import contexts from '../contexts'

// Design Components
import { Spin } from 'antd'

// Services
import api from '../services'

// Imports Destructurings
const { publicRoutesData } = PublicRouter
const { privateRoutesData } = PrivateRouter
const { useAuthContext } = contexts.Auth
const { usePrivateRouteContext } = contexts.PrivateRoute


const AppRouter = () => {
    const navigate = useNavigate()
    const loggedUserContext = useAuthContext()
    const [auth_state, auth_dispatch] = loggedUserContext
    const privateRouteContext = usePrivateRouteContext()
    const [privateRoute_state, privateRoute_dispatch] = privateRouteContext

    const redirectToLogin = useCallback(() => {
        localStorage.clear()
        navigate('/login')
    }, [navigate])

    useEffect(() => {
        const accessToPrivateRoutes = async () => {
            const token = localStorage.getItem('token')
            const userId = localStorage.getItem('userId')
            if (!token || !userId || token === undefined || userId === undefined) {
                auth_dispatch({ type: 'SET_LOADING', payload: true })
                return redirectToLogin()
            }
            const loggedUser = await api.usuarios.findById(userId)
            auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })
            auth_dispatch({ type: 'SET_LOADING', payload: false })
            if (privateRoute_state.openKey.length === 0)
                privateRoute_dispatch({ type: 'SET_OPEN_SUBMENU_KEY', payload: ['sub1'] })
            else redirectToLogin()
        }
        accessToPrivateRoutes()
    }, [
        privateRoute_state.openKey.length,
        privateRoute_dispatch,
        auth_dispatch,
        redirectToLogin
    ])

    const publicRoutes = publicRoutesData.map(route => (
        <Route
            exact
            path={route.path}
            element={route.element}
            key={route.key}
            activeKey={route.activeKey}
            private={route.private}
        />
    ))

    const privateRoutes = privateRoutesData.map(route => (
        <Route
            exact
            path={route.path}
            element={
                (auth_state.loading || !auth_state.user)
                ? <Spin />
                : (auth_state.user.perfil === false && route.onlySuperadmin === true)
                    ? <Navigate to={'/ventas'} />
                    : route.element
            }
            key={route.key}
            activeKey={route.activeKey}
            private={route.private}
        />
    ))

    return (
        <Routes>
            {publicRoutes}
            {privateRoutes}
        </Routes>
    )
}

export default AppRouter