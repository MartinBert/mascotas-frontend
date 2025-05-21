// React Components and Hooks
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

// Custom Routers
import PublicRouter from './PublicRouter'
import PrivateRouter from './PrivateRouter'

// Custom Context Providers
import contexts from '../contexts'

// Design Components
import { Spin } from 'antd'

// Helpers
import helpers from '../helpers'

// Services
import api from '../services'

// Imports Destructurings
const { publicRoutesData } = PublicRouter
const { privateRoutesData } = PrivateRouter
const { useAuthContext } = contexts.Auth
const { usePrivateRouteContext } = contexts.PrivateRoute
const { findNextVoucherNumber_fiscal, invoiceAndTicketCodes } = helpers.afipHelper

// Load Afip services
const getUserData = async () => {
    const userId = localStorage.getItem('userId')
    const loggedUser = await api.users.findById(userId)
    return loggedUser.data
}

const refreshAfipServices = async () => {
    const { loggedUser, isVerified } = verifyRefresh()
    if (!isVerified) return
    for (let index = 0; index < invoiceAndTicketCodes.length; index++) {
        const code = invoiceAndTicketCodes[index]
        const { empresa, puntoVenta } = loggedUser
        const fiscalVoucherNumber = await findNextVoucherNumber_fiscal(code, empresa.cuit, puntoVenta.numero)
        if (!fiscalVoucherNumber) window.location.reload()
        else return
    }
}

const verifyRefresh = async () => {
    // Haya un usuario logeado
    const loggedUser = await getUserData()

    // Sea entre las 2 y 2:11 de la mañana
    const hours = new Date().getHours()
    const minutes = new Date().getMinutes()
    const minutesElapsedToday = hours * 60 + minutes
    const correctSchedule = 120 < minutesElapsedToday < 131

    const isVerified = correctSchedule && loggedUser
    const data = { loggedUser, isVerified }
    return data
}

setInterval(refreshAfipServices, 600000)


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
        const loggedUser = await api.users.findById(userId)
        auth_dispatch({ type: 'LOAD_USER', payload: loggedUser.data })
        auth_dispatch({ type: 'SET_LOADING', payload: false })
        privateRoute_dispatch({ type: 'SET_OPEN_SUBMENU_KEY', payload: ['sub1'] })
    }

    useEffect(() => {
        accessToPrivateRoutes()
        // eslint-disable-next-line
    }, [privateRoute_state.openKey.length])

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