// React Components and Hooks
import React, { useEffect } from 'react'
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
    const [auth_state, auth_dispatch] = useAuthContext()
    const [privateRoute_state, privateRoute_dispatch] = usePrivateRouteContext()

    const accessToPrivateRoutes = async () => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        if (!token || !userId || privateRoute_state.openKey.length !== 0) {
            auth_dispatch({ type: 'SET_LOADING', payload: true })
            localStorage.clear()
            navigate('/login')
            return
        }
        const loggedUser = await api.usuarios.findById(userId)
        auth_dispatch({ type: 'LOAD_USER', payload: loggedUser })
        auth_dispatch({ type: 'SET_LOADING', payload: false })
        privateRoute_dispatch({ type: 'SET_OPEN_SUBMENU_KEY', payload: ['sub1'] })
    }

    useEffect(() => { accessToPrivateRoutes() }, [privateRoute_state.openKey.length])

    const publicRoutes = publicRoutesData.map(route => (
        <Route
            activeKey={route.activeKey}
            element={route.element}
            exact
            key={route.key}
            path={route.path}
            private={route.private}
        />
    ))

    const getElementOfPrivateRoute = (route) => {
        if (auth_state.loading || !auth_state.user) return <Spin />
        else if (auth_state.user.perfil === false && route.onlySuperadmin === true) {
            return navigate('/ventas')
        }
        else return route.element
    }

    const privateRoutes = privateRoutesData.map(route => (
        <Route
            activeKey={route.activeKey}
            element={getElementOfPrivateRoute(route)}
            exact
            key={route.key}
            path={route.path}
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