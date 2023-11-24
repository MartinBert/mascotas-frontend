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
            name: 'cleanFilters',
            order: { lg: 9, md: 9, sm: 10, xl: 9, xs: 10, xxl: 9 }
        },
        {
            element: (
                <Row gutter={8}>
                    <Col span={12}>
                        <ExportExcel
                            productosToReport={productosToReport}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectSalesArea />
                    </Col>
                </Row>
            ),
            name: 'exportExcel',
            order: { lg: 5, md: 5, sm: 3, xl: 5, xs: 3, xxl: 5 }
        },
        {
            element: <FilterByBarcode updateFilters={updateFilters} />,
            name: 'filterByBarcode',
            order: { lg: 4, md: 4, sm: 6, xl: 4, xs: 6, xxl: 4 }
        },
        {
            element: (
                <FilterByBrand
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                />
            ),
            name: 'filterByBrand',
            order: { lg: 8, md: 8, sm: 8, xl: 8, xs: 8, xxl: 8 }
        },
        {
            element: (
                <FilterByCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            ),
            name: 'filterByCategory',
            order: { lg: 10, md: 10, sm: 9, xl: 10, xs: 9, xxl: 10 }
        },
        {
            element: <FilterByName updateFilters={updateFilters} />,
            name: 'filterByName',
            order: { lg: 2, md: 2, sm: 5, xl: 2, xs: 5, xxl: 2 }
        },
        {
            element: <FilterByProductcode updateFilters={updateFilters} />,
            name: 'filterByProductcode',
            order: { lg: 6, md: 6, sm: 7, xl: 6, xs: 7, xxl: 6 }
        },
        {
            element: <InputHidden />,
            name: 'inputHidden_1',
            order: { lg: 7, md: 7, sm: 4, xl: 7, xs: 4, xxl: 7 }
        },
        {
            element: <ModifyPrices setPriceModalVisible={setPriceModalVisible} />,
            name: 'modifyPrices',
            order: { lg: 3, md: 3, sm: 2, xl: 3, xs: 2, xxl: 3 }
        },
        {
            element: <NewProduct />,
            name: 'newProduct',
            order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
        }
    ]

    const responsiveGrid = { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12, horizontal: 8, vertical: 8 }

    return (
        <Row
            gutter={[responsiveGrid.horizontal, responsiveGrid.vertical]}
            justify='space-around'
        >
            {
                productsRender.map(item => {
                    return (
                        <Col
                            key={item.name}
                            lg={{ order: item.order.lg, span: responsiveGrid.lg }}
                            md={{ order: item.order.md, span: responsiveGrid.md }}
                            sm={{ order: item.order.sm, span: responsiveGrid.sm }}
                            xl={{ order: item.order.xl, span: responsiveGrid.xl }}
                            xs={{ order: item.order.xs, span: responsiveGrid.xs }}
                            xxl={{ order: item.order.xxl, span: responsiveGrid.xxl }}
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
