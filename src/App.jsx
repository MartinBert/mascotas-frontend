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
const { BusinessContext } = contexts.Business
const { DailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { DeleteModalContext } = contexts.DeleteModal
const { EntriesContext } = contexts.Entries
const { FiscalNoteModalContext } = contexts.FiscalNoteModal
const { HomeContext } = contexts.Home
const { OutputsContext } = contexts.Outputs
const { PrivateRouteContext } = contexts.PrivateRoute
const { ProductsContext } = contexts.Products
const { SaleContext } = contexts.Sale
const { SalesAreasContext } = contexts.SalesAreas
const { SalePointContext } = contexts.SalePoint


function App() {

    return (
        <div style={{ height: '100%' }}>
            <AuthContext>
                <BusinessContext>
                    <DailyBusinessStatisticsContext>
                        <DeleteModalContext>
                            <EntriesContext>
                                <FiscalNoteModalContext>
                                    <HomeContext>
                                        <OutputsContext>
                                            <PrivateRouteContext>
                                                <ProductsContext>
                                                    <SaleContext>
                                                        <SalesAreasContext>
                                                            <SalePointContext>
                                                                <Router>
                                                                    <AppRouter />
                                                                </Router>
                                                            </SalePointContext>
                                                        </SalesAreasContext>
                                                    </SaleContext>
                                                </ProductsContext>
                                            </PrivateRouteContext>
                                        </OutputsContext>
                                    </HomeContext>
                                </FiscalNoteModalContext>
                            </EntriesContext>
                        </DeleteModalContext>
                    </DailyBusinessStatisticsContext>
                </BusinessContext>
            </AuthContext>
        </div>
    )
}

export default App
