// React Components
import React from 'react'

// Views
import Login from '../views/Login'

const publicRoutesPreData = [
    {
        path: '/login',
        element: <Login />,
        activeKey: null,
        private: false
    }
]

const publicRoutesData = publicRoutesPreData.map((route, i) => {
    const prefixKey = 'public_route_'
    return ({
        path: route.path,
        element: route.element,
        key: prefixKey + i,
        activeKey: route.activeKey,
        private: route.private
    })
})

const PublicRouter = {
    publicRoutesData
}

export default PublicRouter