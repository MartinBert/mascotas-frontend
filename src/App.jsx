// React Components and Hooks
import { BrowserRouter as Router } from 'react-router-dom'

// Custom Routers
import AppRouter from './routes'

// Custom Context Providers
import contexts from './contexts'

// Design Frameworks
import 'antd/dist/reset.css'

// Imports Destructurings
const { CustomProductsContext } = contexts.CustomProducts
const { AuthContext } = contexts.Auth
const { PrivateRouteContext } = contexts.PrivateRoute
const { EntriesContext } = contexts.Entries
const { OutputsContext } = contexts.Outputs
const { ProductSelectionModalContext } = contexts.ProductSelectionModal
const { SaleContext } = contexts.Sale
const { SaleProductsContext } = contexts.SaleProducts


function App() {

    return (
        <div style={{ height: '100%' }}>
            <AuthContext>
                <PrivateRouteContext>
                    <ProductSelectionModalContext>
                        <SaleProductsContext>
                            <CustomProductsContext>
                                <EntriesContext>
                                    <OutputsContext>
                                        <SaleContext>
                                            <Router>
                                                <AppRouter />
                                            </Router>
                                        </SaleContext>
                                    </OutputsContext>
                                </EntriesContext>
                            </CustomProductsContext>
                        </SaleProductsContext>
                    </ProductSelectionModalContext>
                </PrivateRouteContext>
            </AuthContext>
        </div>
    )
}

export default App
