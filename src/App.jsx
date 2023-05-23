// React Components
import { BrowserRouter as Router } from 'react-router-dom'

// Custom Routers
import AppRouter from './routes'

// Custom Context Providers
import contextProviders from './contextProviders'

// Design Frameworks
// import 'antd/dist/antd.css'

// Imports Destructurings
const { LoggedUserContext } = contextProviders.LoggedUserContextProvider
const { PrivateRouteContext } = contextProviders.PrivateRouteContextProvider
const { ProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider
const { SaleContext } = contextProviders.SaleContextProvider


function App() {

    return (
        <div style={{ height: '100%' }}>
            <LoggedUserContext>
                <PrivateRouteContext>
                    <ProductSelectionModalContext>
                        <SaleContext>
                            <Router>
                                <AppRouter />
                            </Router>
                        </SaleContext>
                    </ProductSelectionModalContext>
                </PrivateRouteContext>
            </LoggedUserContext>
        </div>
    )
}

export default App
