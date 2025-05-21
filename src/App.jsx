// React Components and Hooks
import { BrowserRouter as Router } from 'react-router-dom'

// Custom Routers
import AppRouter from './routes'

// Custom Context Providers
import contexts from './contexts'

// Design Frameworks
import 'antd/dist/reset.css'

const { StoreContext } = contexts.Store

// Imports Destructurings
const { AuthContext } = contexts.Auth
const { BenefitsContext } = contexts.Benefits
const { BusinessContext } = contexts.Business
const { DailyBusinessStatisticsContext } = contexts.DailyBusinessStatistics
const { DeleteModalContext } = contexts.DeleteModal
const { EntriesContext } = contexts.Entries
const { FiscalNoteModalContext } = contexts.FiscalNoteModal
const { GenericComponentsContext } = contexts.GenericComponents
const { HomeContext } = contexts.Home
const { InterfaceStylesContext } = contexts.InterfaceStyles
const { OutputsContext } = contexts.Outputs
const { PrivateRouteContext } = contexts.PrivateRoute
const { ProductsContext } = contexts.Products
const { RenderConditionsContext } = contexts.RenderConditions
const { SaleContext } = contexts.Sale
const { SalesAreasContext } = contexts.SalesAreas
const { SalePointContext } = contexts.SalePoint


function App() {

    return (
        <div style={{ height: '100%' }}>
            <StoreContext>
                <AuthContext>
                    <BenefitsContext>
                        <BusinessContext>
                            <DailyBusinessStatisticsContext>
                                <DeleteModalContext>
                                    <EntriesContext>
                                        <FiscalNoteModalContext>
                                            <GenericComponentsContext>
                                                <HomeContext>
                                                    <InterfaceStylesContext>
                                                        <OutputsContext>
                                                            <PrivateRouteContext>
                                                                <ProductsContext>
                                                                    <RenderConditionsContext>
                                                                        <SaleContext>
                                                                            <SalesAreasContext>
                                                                                <SalePointContext>
                                                                                    <Router>
                                                                                        <AppRouter />
                                                                                    </Router>
                                                                                </SalePointContext>
                                                                            </SalesAreasContext>
                                                                        </SaleContext>
                                                                    </RenderConditionsContext>
                                                                </ProductsContext>
                                                            </PrivateRouteContext>
                                                        </OutputsContext>
                                                    </InterfaceStylesContext>
                                                </HomeContext>
                                            </GenericComponentsContext>
                                        </FiscalNoteModalContext>
                                    </EntriesContext>
                                </DeleteModalContext>
                            </DailyBusinessStatisticsContext>
                        </BusinessContext>
                    </BenefitsContext>
                </AuthContext>
            </StoreContext>
        </div>
    )
}

export default App