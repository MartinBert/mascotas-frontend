// React Components and Hooks
import { BrowserRouter as Router } from 'react-router-dom'

// Custom Routers
import AppRouter from './routes'

// Custom Context Providers
import contextProviders from './contextProviders'

// Design Frameworks
import 'antd/dist/reset.css'

// Imports Destructurings
const { CustomProductsContext } = contextProviders.CustomProducts
const { LoggedUserContext } = contextProviders.LoggedUserContextProvider
const { PrivateRouteContext } = contextProviders.PrivateRouteContextProvider
const { ProductEntriesContext } = contextProviders.ProductEntries
const { ProductOutputsContext } = contextProviders.ProductOutputs
const { ProductSelectionModalContext } = contextProviders.ProductSelectionModalContextProvider
const { SaleContext } = contextProviders.SaleContextProvider
const { SaleProductsContext } = contextProviders.SaleProducts


function App() {

    return (
        <div style={{ height: '100%' }}>
            <LoggedUserContext>
                <PrivateRouteContext>
                    <ProductSelectionModalContext>
                        <SaleProductsContext>
                            <CustomProductsContext>
                                <ProductEntriesContext>
                                    <ProductOutputsContext>
                                        <SaleContext>
                                            <Router>
                                                <AppRouter />
                                            </Router>
                                        </SaleContext>
                                    </ProductOutputsContext>
                                </ProductEntriesContext>
                            </CustomProductsContext>
                        </SaleProductsContext>
                    </ProductSelectionModalContext>
                </PrivateRouteContext>
            </LoggedUserContext>
        </div>
    )
}

export default App
