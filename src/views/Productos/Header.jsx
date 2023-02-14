import React, { useEffect, useState } from 'react'
import { GenericAutocomplete } from '../../components/generics'
import { Row, Col, Button, Input } from 'antd'
import { Link } from 'react-router-dom'
import PriceModificatorModal from './PriceModificatorModal'
import api from '../../services'
import helpers from '../../helpers'

const { exportSimpleExcel } = helpers.excel

const Header = ({ setFilters, filters, setLoading, detailsData }) => {
    const [productosToReport, setProductosToReport] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedHeading, setSelectedHeading] = useState(null)
    const [priceModalVisible, setPriceModalVisible] = useState(false)
    useEffect(() => { if (selectedBrand) { setFilters({ ...filters, marca: selectedBrand }) } }, [selectedBrand, filters, setFilters])
    useEffect(() => { if (selectedHeading) { setFilters({ ...filters, rubro: selectedHeading }) } }, [selectedHeading, filters, setFilters])
    useEffect(() => {
        const findProductos = async () => {
            const response = await api.productos.findAll({ page: 0, limit: 1000000, filters: null })
            setProductosToReport(response.docs)
        }
        findProductos()
    }, [selectedHeading])

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
        return salePricePerUnit
    }

    const calculateSaleProfitPerUnit = (product) => {
        const saleProfitPerUnit = product.gananciaNetaFraccionado / product.unidadMedida.fraccionamiento
        return saleProfitPerUnit
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
                (product.margenGananciaFraccionado) ? '% ' + product.margenGananciaFraccionado : '-',
                (product.precioVentaFraccionado) ? product.precioVentaFraccionado : '-',
                (product.gananciaNetaFraccionado) ? product.gananciaNetaFraccionado : '-',
                (product.precioVentaFraccionado && product.unidadMedida.fraccionamiento) ? calculateSalePricePerUnit(product) : '--error--',
                (product.gananciaNetaFraccionado && product.unidadMedida.fraccionamiento) ? calculateSaleProfitPerUnit(product) : '--error--',
                (product.cantidadStock) ? product.cantidadStock : '-',
                (product.cantidadFraccionadaStock) ? product.cantidadFraccionadaStock : '-',
                (product.unidadMedida) ? product.unidadMedida.nombre : '-',
                (product.unidadMedida) ? product.unidadMedida.fraccionamiento : '-',
            ])
        }
        return processedLines
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <Row gutter={8}>
                        <Col>
                            <button
                                className='btn-primary'
                            >
                                <Link to='/productos/nuevo'>
                                    Nuevo
                                </Link>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className='btn-primary'
                                onClick={() => { setPriceModalVisible(true) }}
                            >
                                Modificar precios
                            </button>
                        </Col>
                        <Col>
                            <button
                                className='btn-primary'
                                onClick={() => { exportExcel() }}
                            >
                                Exportar Excel
                            </button>
                        </Col>
                    </Row>
                    <Row justify='space between' gutter={16}>
                        <Col span={6}>
                            <Input
                                color='primary'
                                style={{ width: 200, marginBottom: '10px' }}
                                placeholder='Buscar por nombre'
                                onChange={(e) => {
                                    setFilters(
                                        {
                                            ...filters,
                                            nombre: e.target.value
                                        }
                                    )
                                }}
                                value={(filters) ? filters.nombre : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                style={{ width: 200, marginBottom: '10px' }}
                                placeholder='Buscar por codigo de barras'
                                onChange={(e) => {
                                    setFilters(
                                        {
                                            ...filters,
                                            codigoBarras: e.target.value
                                        }
                                    )
                                }}
                                value={(filters) ? filters.codigoBarras : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                style={{ width: 200, marginBottom: '10px' }}
                                placeholder='Buscar por codigo de producto'
                                onChange={(e) => {
                                    setFilters(
                                        {
                                            ...filters,
                                            codigoProducto: e.target.value
                                        }
                                    )
                                }}
                                value={(filters) ? filters.codigoProducto : null}
                            />
                        </Col>
                        <Col span={6}>
                            <Button
                                type='danger'
                                onClick={() => { cleanFilters() }}
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
