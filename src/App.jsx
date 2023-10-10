// React Components and Hooks
import { BrowserRouter as Router } from 'react-router-dom'

// Custom Routers
import AppRouter from './routes'

// Custom Context Providers
import contexts from './contexts'

// Design Frameworks
import 'antd/dist/reset.css'

// Imports Destructurings
const { AuthContext } = contexts.Auth
const { CustomProductsContext } = contexts.CustomProducts
const { DeleteModalContext } = contexts.DeleteModal
const { EntriesContext } = contexts.Entries
const { OutputsContext } = contexts.Outputs
const { PrivateRouteContext } = contexts.PrivateRoute
const { ProductSelectionModalContext } = contexts.ProductSelectionModal
const { SaleContext } = contexts.Sale
const { SaleProductsContext } = contexts.SaleProducts


function App() {

    return (
        <div style={{ height: '100%' }}>
            <AuthContext>
                <CustomProductsContext>
                    <DeleteModalContext>
                        <EntriesContext>
                            <OutputsContext>
                                <PrivateRouteContext>
                                    <ProductSelectionModalContext>
                                        <SaleContext>
                                            <SaleProductsContext>
                                                <Router>
                                                    <AppRouter />
                                                </Router>
                                            </SaleProductsContext>
                                        </SaleContext>
                                    </ProductSelectionModalContext>
                                </PrivateRouteContext>
                            </OutputsContext>
                        </EntriesContext>
                    </DeleteModalContext>
                </CustomProductsContext>
            </AuthContext>
        </div>
    )
}

export default App
