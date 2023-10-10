// React Components and Hooks
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom Components
import { GenericAutocomplete } from '../../components/generics'

// Design Components
import { Button, Col, Input, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Views
import PriceModificatorModal from './PriceModificatorModal'

// Imports Destructuring
const { exportSimpleExcel } = helpers.excel
const { roundToMultiple, roundTwoDecimals } = helpers.mathHelper


const Header = ({ setFilters, filters, setLoading, detailsData }) => {
    const navigate = useNavigate()
    const [productosToReport, setProductosToReport] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedHeading, setSelectedHeading] = useState(null)
    const [priceModalVisible, setPriceModalVisible] = useState(false)

    useEffect(() => {
        if (!selectedBrand) return
        setFilters({
            ...filters,
            marca: selectedBrand
        })
    }, [selectedBrand])

    useEffect(() => {
        if (!selectedHeading) return
        setFilters({
            ...filters,
            rubro: selectedHeading
        })
    }, [selectedHeading])

    useEffect(() => {
        const findProductos = async () => {
            const data = await api.productos.findAll()
            setProductosToReport(data.docs)
        }
        findProductos()
    }, [selectedBrand, selectedHeading])

    const cleanFilters = () => {
        setSelectedBrand(null)
        setSelectedHeading(null)
        setFilters(null)
    }

    const calculateSalePricePerUnit = (product) => {
        const precioVentaFraccionado = product.precioVentaFraccionado
        const fraccionamiento = product.unidadMedida.fraccionamiento
        const salePricePerUnit = (fraccionamiento < 1000)
            ? precioVentaFraccionado / fraccionamiento
            : precioVentaFraccionado * 1000 / fraccionamiento
        const salePricePerUnitFixed = roundToMultiple(salePricePerUnit, 10)
        return salePricePerUnitFixed
    }

    const calculateSaleProfitPerUnit = (product) => {
        const fraccionamiento = product.unidadMedida.fraccionamiento
        const gananciaNetaFraccionado = product.gananciaNetaFraccionado
        const saleProfitPerUnit = (fraccionamiento < 1000)
            ? gananciaNetaFraccionado / fraccionamiento
            : gananciaNetaFraccionado * 1000 / fraccionamiento
        const saleProfitPerUnitFixed = roundTwoDecimals(saleProfitPerUnit)
        return saleProfitPerUnitFixed
    }

    const exportExcel = async () => {
        const nameOfSheet = 'Hoja de productos'
        const nameOfDocument = 'Lista de productos'
        const columnHeaders = [
            'Producto',
            'Rubro',
            'Marca',
            'Cód. producto',
            'Cód. barras',
            '% IVA compra',
            'IVA compra ($)',
            'Precio de lista ($)',
            '% IVA venta',
            'IVA venta ($)',
            'Porcentaje ganancia',
            'Precio de venta ($)',
            'Ganancia venta ($)',
            'Porcentaje ganancia fraccionada',
            'Precio de venta fraccionada ($)',
            'Ganancia venta fraccionada ($)',
            'Precio de venta por unidad fraccionada ($)',
            'Ganancia venta por unidad fraccionada ($)',
            'Stock',
            'Stock fraccionado',
            'Unidad de medida',
            'Fraccionamiento',
        ]
        const lines = await processExcelLines(productosToReport)
        return exportSimpleExcel(columnHeaders, lines, nameOfSheet, nameOfDocument)
    }

    const processExcelLines = async (productosToReport) => {
        const processedLines = []
        for await (let product of productosToReport) {
            processedLines.push([
                (product.nombre) ? product.nombre : '-',
                (product.rubro) ? product.rubro.nombre : '-',
                (product.marca) ? product.marca.nombre : '-',
                (product.codigoProducto) ? product.codigoProducto : '-',
                (product.codigoBarras) ? product.codigoBarras : '-',
                (product.porcentajeIvaCompra) ? '% ' + product.porcentajeIvaCompra : '-',
                (product.ivaCompra) ? product.ivaCompra : '-',
                (product.precioUnitario) ? product.precioUnitario : '-',
                (product.porcentajeIvaVenta) ? '% ' + product.porcentajeIvaVenta : '-',
                (product.ivaVenta) ? product.ivaVenta : '-',
                (product.margenGanancia) ? '% ' + product.margenGanancia : '-',
                (product.precioVenta) ? product.precioVenta : '-',
                (product.gananciaNeta) ? product.gananciaNeta : '-',
                (product.margenGananciaFraccionado) ? '% ' + product.margenGananciaFraccionado : '-- Sin fraccionar --',
                (product.precioVentaFraccionado) ? product.precioVentaFraccionado : '-- Sin fraccionar --',
                (product.gananciaNetaFraccionado) ? product.gananciaNetaFraccionado : '-- Sin fraccionar --',
                (product.precioVentaFraccionado && product.unidadMedida) ? calculateSalePricePerUnit(product) : '-- Sin fraccionar --',
                (product.gananciaNetaFraccionado && product.unidadMedida) ? calculateSaleProfitPerUnit(product) : '-- Sin fraccionar --',
                (product.cantidadStock) ? product.cantidadStock : '-',
                (product.cantidadFraccionadaStock) ? product.cantidadFraccionadaStock : '-- Sin fraccionar --',
                (product.unidadMedida) ? product.unidadMedida.nombre : '-- Sin fraccionar --',
                (product.unidadMedida) ? product.unidadMedida.fraccionamiento : '-- Sin fraccionar --',
            ])
        }
        return processedLines
    }

    const redirectToForm = () => {
        navigate('/productos/nuevo')
    }

    const updateFilters = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <Row gutter={8}>
                        <Col>
                            <Button
                                className='btn-primary'
                                onClick={() => redirectToForm()}
                            >
                                Nuevo
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                className='btn-primary'
                                onClick={() => setPriceModalVisible(true)}
                            >
                                Modificar precios
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                className='btn-primary'
                                onClick={() => exportExcel()}
                            >
                                Exportar Excel
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <Row justify='space between' gutter={16}>
                        <Col span={6}>
                            <Input
                                color='primary'
                                name='nombre'
                                onChange={e => updateFilters(e)}
                                placeholder='Buscar por nombre'
                                style={{ width: 200, marginBottom: '10px' }}
                                value={filters ? filters.nombre : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                name='codigoBarras'
                                onChange={e => updateFilters(e)}
                                placeholder='Buscar por codigo de barras'
                                style={{ width: 200, marginBottom: '10px' }}
                                value={filters ? filters.codigoBarras : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                name='codigoProducto'
                                onChange={e => updateFilters(e)}
                                placeholder='Buscar por codigo de producto'
                                style={{ width: 200, marginBottom: '10px' }}
                                value={filters ? filters.codigoProducto : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Button
                                danger
                                onClick={() => cleanFilters()}
                                type='primary'
                            >
                                Limpiar filtros
                            </Button>
                        </Col>
                        <Col span={8}>
                            <GenericAutocomplete
                                label='Filtrar por marcas'
                                modelToFind='marca'
                                keyToCompare='nombre'
                                controller='marcas'
                                setResultSearch={setSelectedBrand}
                                selectedSearch={selectedBrand}
                                returnCompleteModel={true}
                                styles={{ backgroundColor: '#fff' }}
                            />
                        </Col>
                        <Col span={8}>
                            <GenericAutocomplete
                                label='Filtrar por rubros'
                                modelToFind='rubro'
                                keyToCompare='nombre'
                                controller='rubros'
                                setResultSearch={setSelectedHeading}
                                selectedSearch={selectedHeading}
                                returnCompleteModel={true}
                                styles={{ backgroundColor: '#fff' }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <PriceModificatorModal
                priceModalVisible={priceModalVisible}
                setPriceModalVisible={setPriceModalVisible}
                setLoading={setLoading}
            />
        </>
    )
}

export default Header
