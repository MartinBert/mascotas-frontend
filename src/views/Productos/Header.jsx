// React Components and Hooks
import React, { useEffect, useState } from 'react'

// Design Components
import { Col, Row } from 'antd'

// Services
import api from '../../services'

// Views
import ProductElements from './elements'
import PriceModificatorModal from './PriceModificatorModal'

// Imports Destructuring
const {
    CleanFilters,
    ExportExcel,
    ExportExcelOptions,
    FilterByBarcode,
    FilterByBrand,
    FilterByCategory,
    FilterByName,
    FilterByProductcode,
    InputHidden,
    ModifyPrices,
    NewProduct,
    SelectSalesArea
} = ProductElements


const Header = ({ setFilters, filters, setLoading, detailsData }) => {
    const [productosToReport, setProductosToReport] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [priceModalVisible, setPriceModalVisible] = useState(false)

    useEffect(() => {
        if (!selectedBrand) return
        setFilters({
            ...filters,
            marca: selectedBrand
        })
    }, [selectedBrand])

    useEffect(() => {
        if (!selectedCategory) return
        setFilters({
            ...filters,
            rubro: selectedCategory
        })
    }, [selectedCategory])

    useEffect(() => {
        const findProductos = async () => {
            const data = await api.productos.findAll()
            setProductosToReport(data.docs)
        }
        findProductos()
    }, [selectedBrand, selectedCategory])

    const cleanFilters = () => {
        setSelectedBrand(null)
        setSelectedCategory(null)
        setFilters(null)
    }

    const updateFilters = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    const productsRender = [
        {
            element: <CleanFilters cleanFilters={cleanFilters} />,
            name: 'product_cleanFilters',
            order: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12, xxl: 12 }
        },
        {
            element: <ExportExcel productosToReport={productosToReport} />,
            name: 'product_exportExcel',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: (
                <Row align='middle' gutter={8}>
                    <Col span={8}>
                        Opciones a exportar
                    </Col>
                    <Col span={16}>
                        <ExportExcelOptions />
                    </Col>
                </Row>
            ),
            name: 'product_exportExcelOptions',
            order: { lg: 9, md: 9, sm: 5, xl: 9, xs: 5, xxl: 9 }
        },
        {
            element: <FilterByBarcode updateFilters={updateFilters} />,
            name: 'product_filterByBarcode',
            order: { lg: 4, md: 4, sm: 8, xl: 4, xs: 8, xxl: 4 }
        },
        {
            element: (
                <FilterByBrand
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                />
            ),
            name: 'product_filterByBrand',
            order: { lg: 8, md: 8, sm: 10, xl: 8, xs: 10, xxl: 8 }
        },
        {
            element: (
                <FilterByCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            ),
            name: 'product_filterByCategory',
            order: { lg: 10, md: 10, sm: 11, xl: 10, xs: 11, xxl: 10 }
        },
        {
            element: <FilterByName updateFilters={updateFilters} />,
            name: 'product_filterByName',
            order: { lg: 2, md: 2, sm: 7, xl: 2, xs: 7, xxl: 2 }
        },
        {
            element: <FilterByProductcode updateFilters={updateFilters} />,
            name: 'product_filterByProductcode',
            order: { lg: 6, md: 6, sm: 9, xl: 6, xs: 9, xxl: 6 }
        },
        {
            element: <InputHidden />,
            name: 'product_inputHidden_1',
            order: { lg: 11, md: 11, sm: 6, xl: 11, xs: 6, xxl: 11 }
        },
        {
            element: <ModifyPrices setPriceModalVisible={setPriceModalVisible} />,
            name: 'product_modifyPrices',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: <NewProduct />,
            name: 'product_newProduct',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        },
        {
            element: (
                <Row align='middle' gutter={8}>
                    <Col span={8}>
                        Zona de venta
                    </Col>
                    <Col span={16}>
                        <SelectSalesArea />
                    </Col>
                </Row>
            ),
            name: 'product_selectSalesArea',
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        }
    ]

    const responsiveGrid = {
        gutter: { horizontal: 8, vertical: 8 },
        span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
    }

    return (
        <Row
            gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}
            justify='space-around'
        >
            {
                productsRender.map(item => {
                    return (
                        <Col
                            key={item.name}
                            lg={{ order: item.order.lg, span: responsiveGrid.span.lg }}
                            md={{ order: item.order.md, span: responsiveGrid.span.md }}
                            sm={{ order: item.order.sm, span: responsiveGrid.span.sm }}
                            xl={{ order: item.order.xl, span: responsiveGrid.span.xl }}
                            xs={{ order: item.order.xs, span: responsiveGrid.span.xs }}
                            xxl={{ order: item.order.xxl, span: responsiveGrid.span.xxl }}
                        >
                            {item.element}
                        </Col>
                    )
                })
            }
            <PriceModificatorModal
                priceModalVisible={priceModalVisible}
                setPriceModalVisible={setPriceModalVisible}
                setLoading={setLoading}
            />
        </Row>
    )
}

export default Header
