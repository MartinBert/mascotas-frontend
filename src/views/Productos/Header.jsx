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
            element: (
                <CleanFilters
                    cleanFilters={cleanFilters}
                />
            ),
            name: 'cleanFilters',
            order_lg: 9,
            order_md: 9,
            order_sm: 10,
            order_xl: 9,
            order_xs: 10,
            order_xxl: 9
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
            order_lg: 5,
            order_md: 5,
            order_sm: 3,
            order_xl: 5,
            order_xs: 3,
            order_xxl: 5
        },
        {
            element: (
                <FilterByBarcode
                    updateFilters={updateFilters}
                />
            ),
            name: 'filterByBarcode',
            order_lg: 4,
            order_md: 4,
            order_sm: 6,
            order_xl: 4,
            order_xs: 6,
            order_xxl: 4
        },
        {
            element: (
                <FilterByBrand
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                />
            ),
            name: 'filterByBrand',
            order_lg: 8,
            order_md: 8,
            order_sm: 8,
            order_xl: 8,
            order_xs: 8,
            order_xxl: 8
        },
        {
            element: (
                <FilterByCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            ),
            name: 'filterByCategory',
            order_lg: 10,
            order_md: 10,
            order_sm: 9,
            order_xl: 10,
            order_xs: 9,
            order_xxl: 10
        },
        {
            element: (
                <FilterByName
                    updateFilters={updateFilters}
                />
            ),
            name: 'filterByName',
            order_lg: 2,
            order_md: 2,
            order_sm: 5,
            order_xl: 2,
            order_xs: 5,
            order_xxl: 2
        },
        {
            element: (
                <FilterByProductcode
                    updateFilters={updateFilters}
                />
            ),
            name: 'filterByProductcode',
            order_lg: 6,
            order_md: 6,
            order_sm: 7,
            order_xl: 6,
            order_xs: 7,
            order_xxl: 6
        },
        {
            element: <InputHidden />,
            name: 'inputHidden_1',
            order_lg: 7,
            order_md: 7,
            order_sm: 4,
            order_xl: 7,
            order_xs: 4,
            order_xxl: 7
        },
        {
            element: (
                <ModifyPrices
                    setPriceModalVisible={setPriceModalVisible}
                />
            ),
            name: 'modifyPrices',
            order_lg: 3,
            order_md: 3,
            order_sm: 2,
            order_xl: 3,
            order_xs: 2,
            order_xxl: 3
        },
        {
            element: <NewProduct />,
            name: 'newProduct',
            order_lg: 1,
            order_md: 1,
            order_sm: 1,
            order_xl: 1,
            order_xs: 1,
            order_xxl: 1
        }
    ]

    const responsiveGutter = { horizontal: 0, vertical: 16 }
    const responsiveHeadGutter = { horizontal: 8, vertical: 8 }
    const responsiveColSpan = { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }

    return (
        <Row
            gutter={[
                responsiveHeadGutter.horizontal,
                responsiveHeadGutter.vertical
            ]}
            justify='space-around'
        >
            {
                productsRender.map(item => {
                    return (
                        <Col
                            key={item.name}
                            lg={{
                                order: item.order_lg,
                                span: responsiveColSpan.lg
                            }}
                            md={{
                                order: item.order_md,
                                span: responsiveColSpan.md
                            }}
                            sm={{
                                order: item.order_sm,
                                span: responsiveColSpan.sm
                            }}
                            xl={{
                                order: item.order_xl,
                                span: responsiveColSpan.xl
                            }}
                            xs={{
                                order: item.order_xs,
                                span: responsiveColSpan.xs
                            }}
                            xxl={{
                                order: item.order_xxl,
                                span: responsiveColSpan.xxl
                            }}
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
