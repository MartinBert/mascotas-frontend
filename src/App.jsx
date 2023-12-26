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
const { SaleCustomProductsContext } = contexts.SaleCustomProducts
const { DailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { DeleteModalContext } = contexts.DeleteModal
const { EntriesContext } = contexts.Entries
const { FiscalNoteModalContext } = contexts.FiscalNoteModal
const { OutputsContext } = contexts.Outputs
const { PrivateRouteContext } = contexts.PrivateRoute
const { ProductsContext } = contexts.Products
const { ProductSelectionModalContext } = contexts.ProductSelectionModal
const { SaleContext } = contexts.Sale
const { SaleProductsContext } = contexts.SaleProducts
const { SalesAreasContext } = contexts.SalesAreas


function App() {

    return (
        <div style={{ height: '100%' }}>
            <AuthContext>
                <DailyBusinessStatisticsContext>
                    <DeleteModalContext>
                        <EntriesContext>
                            <FiscalNoteModalContext>
                                <OutputsContext>
                                    <PrivateRouteContext>
                                        <ProductsContext>
                                            <ProductSelectionModalContext>
                                                <SaleContext>
                                                    <SaleCustomProductsContext>
                                                        <SaleProductsContext>
                                                            <SalesAreasContext>
                                                                <Router>
                                                                    <AppRouter />
                                                                </Router>
                                                            </SalesAreasContext>
                                                        </SaleProductsContext>
                                                    </SaleCustomProductsContext>
                                                </SaleContext>
                                            </ProductSelectionModalContext>
                                        </ProductsContext>
                                    </PrivateRouteContext>
                                </OutputsContext>
                            </FiscalNoteModalContext>
                        </EntriesContext>
                    </DeleteModalContext>
                </DailyBusinessStatisticsContext>
            </AuthContext>
        </div>
    )
}

export default App
