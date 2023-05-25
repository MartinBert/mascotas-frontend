// React Components and Hooks
import React, { useCallback, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// Custom Routers
import PublicRouter from './PublicRouter'
import PrivateRouter from './PrivateRouter'

// Custom Context Providers
import contextProviders from '../contextProviders'

// Design Components
import { Spin } from 'antd'

// Imports Destructurings
const { publicRoutesData } = PublicRouter
const { privateRoutesData } = PrivateRouter
const { useLoggedUserContext } = contextProviders.LoggedUserContextProvider
const { usePrivateRouteContext } = contextProviders.PrivateRouteContextProvider


const AppRouter = () => {
    const navigate = useNavigate()
    const loggedUserContext = useLoggedUserContext()
    const [loggedUser_state, loggedUser_dispatch] = loggedUserContext
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
                loggedUser_dispatch({ type: 'SET_LOADING', payload: true })
                return redirectToLogin()
            }
            loggedUser_dispatch({ type: 'SET_LOADING', payload: false })
            if (privateRoute_state.openKey.length === 0)
                privateRoute_dispatch({ type: 'SET_OPEN_SUBMENU_KEY', payload: ['sub1'] })
            else redirectToLogin()
        }
        accessToPrivateRoutes()
    }, [
        privateRoute_state.openKey.length,
        privateRoute_dispatch,
        loggedUser_dispatch,
        redirectToLogin
    ])

    const privateRoutes = privateRoutesData.map(route => (
        <Route
            exact
            path={route.path}
            element={(loggedUser_state.loading === false) ? route.element : <Spin />}
            key={route.key}
            activeKey={route.activeKey}
            private={route.private}
        />
    ))

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

    return (
        <Routes>
            {privateRoutes}
            {publicRoutes}
        </Routes>
    )
}

export default AppRouter