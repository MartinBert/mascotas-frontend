import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { ConfigProvider } from 'antd'
import esES from 'antd/lib/locale/es_ES'
import moment from 'moment'

moment.locale('es')

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <ConfigProvider locale={esES}>
            <App />
        </ConfigProvider>
    </React.StrictMode>
)
