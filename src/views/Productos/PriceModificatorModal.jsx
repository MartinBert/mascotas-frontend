// React Components and Hooks
import React, { useState, useEffect } from 'react'

// Custom Components
import { GenericAutocomplete } from '../../components/generics'
import { errorAlert, successAlert } from '../../components/alerts'
import icons from '../../components/icons'

// Design Components
import { Modal, Row, Col, Select, Input, Table, Checkbox } from 'antd'

// Helpers
import helper from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { decimalPercent, roundToMultiple, roundTwoDecimals } = helper.mathHelper
const { Delete } = icons
const { Option } = Select


const PriceModificatorModal = ({
    priceModalVisible,
    setPriceModalVisible,
    setLoading,
}) => {
    const [brands, setBrands] = useState(null)
    const [headings, setHeadings] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedHeading, setSelectedHeading] = useState(null)
    const [productNameSearch, setProductNameSearch] = useState('')
    const [products, setProducts] = useState(null)
    const [productsLoading, setProductsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [limitPerPage, setLimitPerPage] = useState(5)
    const [totalDocsInPage, setTotalDocsInPage] = useState(0)
    const [addedProducts, setAddedProducts] = useState([])
    const [modificationValue, setModificationValue] = useState(0)
    const [selectedModificationType, setSelectedModificationType] =
        useState(null)
    const modificationTypes = [
        { key: 1, value: 'Porcentual' },
        { key: 2, value: 'Monto fijo' },
    ]

    useEffect(() => {
        const fetchBrands = async () => {
            if (brands) return
            const response = await api.marcas.findAll()
            setBrands(response)
        }
        fetchBrands()
    })

    useEffect(() => {
        if (headings) return
        const fetchHeadings = async () => {
            const response = await api.rubros.findAll()
            setHeadings(response)
        }
        fetchHeadings()
    })

    useEffect(() => {
        const fetchProducts = async () => {
            setProductsLoading(true)
            const filtersToParams = {
                nombre: productNameSearch,
            }
            if (selectedHeading) {
                filtersToParams.rubro = selectedHeading
            }
            if (selectedBrand) {
                filtersToParams.marca = selectedBrand
            }
            const params = {
                page: currentPage,
                limit: limitPerPage,
                filters: JSON.stringify(filtersToParams),
            }
            const response = await api.productos.findPaginated(params)
            setProducts(response.docs)
            setTotalDocsInPage(response.totalDocs)
            setProductsLoading(false)
        }
        fetchProducts()
    }, [
        selectedBrand,
        selectedHeading,
        productNameSearch,
        currentPage,
        limitPerPage,
    ])

    const handleOk = () => {
        setLoading(true)
        if (!selectedModificationType)
            return errorAlert(
                'Debe seleccionar el tipo de modificación a aplicar en el precio de los productos...'
            )
        if (modificationValue === 0)
            return errorAlert('El valor de la modificación no puede ser 0...')
        if (addedProducts.length < 1)
            return errorAlert(
                'Debe seleccionar al menos 1 producto para modificar su precio...'
            )

        for (let product of addedProducts) {
            const decimalIvaCompra = decimalPercent(parseFloat(product.porcentajeIvaCompra))
            const decimalIvaVenta = decimalPercent(parseFloat(product.porcentajeIvaVenta))
            const decimalMargenGanancia = decimalPercent(parseFloat(product.margenGanancia))
            const decimalMargenGananciaFraccionado = decimalPercent(parseFloat(product.margenGananciaFraccionado))

            const newPrecioUnitario =
                selectedModificationType === '1'
                    ? roundTwoDecimals(Number(product.precioUnitario) * (1 + decimalPercent(modificationValue)))
                    : roundTwoDecimals(Number(product.precioUnitario) + Number(modificationValue))
            const newGananciaNeta = roundTwoDecimals(newPrecioUnitario * decimalMargenGanancia)
            const newGananciaNetaFraccionado = roundTwoDecimals(newPrecioUnitario * decimalMargenGananciaFraccionado)
            const newIvaCompra = roundTwoDecimals(newPrecioUnitario - (newPrecioUnitario / (1 + decimalIvaCompra)))
            const newIvaVenta = roundTwoDecimals(newPrecioUnitario * decimalIvaVenta)
            const newPrecioVentaSinRedondear = roundTwoDecimals(newPrecioUnitario + newIvaVenta + newGananciaNeta)
            const newPrecioVenta = roundToMultiple(newPrecioVentaSinRedondear, 10)
            const newPrecioVentaFraccionadoSinRedondear = roundTwoDecimals(newPrecioUnitario + newIvaVenta + newGananciaNetaFraccionado)
            const newPrecioVentaFraccionado = roundToMultiple(newPrecioVentaFraccionadoSinRedondear, 10)

            product.precioUnitario = newPrecioUnitario
            product.ivaCompra = newIvaCompra
            product.ivaVenta = newIvaVenta
            product.gananciaNeta = newGananciaNeta + newPrecioVenta - newPrecioVentaSinRedondear
            product.gananciaNetaFraccionado = newGananciaNetaFraccionado + newPrecioVentaFraccionado - newPrecioVentaFraccionadoSinRedondear
            product.precioVenta = newPrecioVenta
            product.precioVentaFraccionado = newPrecioVentaFraccionado
            api.productos.edit(product)
        }
        setPriceModalVisible(false)
        cleanModificator()
        successAlert('Los precios fueron modificados!').then(() => {
            window.location.reload()
        })
    }

    const addProductToModification = (product) => {
        const duplicated = addedProducts.find(item => item._id === product._id)
        if (duplicated) {
            const stateWithoutThisElement = addedProducts.filter(item => item._id !== product._id)
            setAddedProducts(stateWithoutThisElement)
        } else {
            setAddedProducts([...addedProducts, product])
        }
    }

    const cleanFilters = () => {
        setSelectedBrand(null)
        setSelectedHeading(null)
        setProductNameSearch('')
    }

    const cleanModificator = () => {
        setSelectedBrand(null)
        setSelectedHeading(null)
        setProductNameSearch('')
        setAddedProducts([])
        setModificationValue(0)
        setSelectedModificationType(null)
    }

    const checkPage = () => {
        setAddedProducts(products)
    }

    const uncheckPage = () => {
        setAddedProducts([])
    }

    const columnsForTable = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Cod prod.',
            dataIndex: 'codigoProducto',
        },
        {
            title: 'Agregar',
            render: (product) => (
                <Row style={{ display: 'inline-flex' }}>
                    <Checkbox
                        onChange={() => {
                            addProductToModification(product)
                        }}
                        checked={addedProducts.find((item) => item._id === product._id)}
                    />
                </Row>
            ),
        },
    ]

    const columnsInAddedProductsTable = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Cod. barras',
            dataIndex: 'codigoBarras',
        },
        {
            title: 'Quitar producto',
            render: (product) => (
                <div
                    onClick={() => {
                        products.forEach((el) => {
                            if (el._id === product._id) {
                                el.selected = false
                            }
                        })
                        const sliceElement = addedProducts.filter(
                            (item) => item._id !== product._id
                        )
                        setAddedProducts(sliceElement)
                    }}
                >
                    <Delete />
                </div>
            ),
        },
    ]

    return (
        <Modal
            header={false}
            open={priceModalVisible}
            footer={null}
            width={1200}
            closable={false}
        >
            <Row>
                <Col span={24}>
                    <h3>Filtrar artículos</h3>
                </Col>
                <Col span={24} style={{ marginBottom: '15px' }}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <GenericAutocomplete
                                label='Filtrar por marcas'
                                modelToFind='marca'
                                keyToCompare='nombre'
                                controller='marcas'
                                returnCompleteModel={true}
                                setResultSearch={setSelectedBrand}
                                selectedSearch={selectedBrand}
                                styles={{ backgroundColor: '#fff' }}
                            />
                        </Col>
                        <Col span={6}>
                            <GenericAutocomplete
                                label='Filtrar por rubros'
                                modelToFind='rubro'
                                keyToCompare='nombre'
                                controller='rubros'
                                returnCompleteModel={true}
                                setResultSearch={setSelectedHeading}
                                selectedSearch={selectedHeading}
                                styles={{ backgroundColor: '#fff' }}
                            />
                        </Col>
                        <Col span={6}>
                            <Input
                                color='primary'
                                placeholder='Nombre'
                                onChange={(e) => {
                                    setProductNameSearch(e.target.value)
                                }}
                                value={productNameSearch}
                            />
                        </Col>
                        <Col span={6}>
                            <button
                                className='btn-secondary'
                                onClick={() => {
                                    cleanFilters()
                                }}
                            >
                                Limpiar filtros
                            </button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }} align='start' gutter={8}>
                        <Col>
                            <Select
                                placeholder='Tipo de modificación'
                                onChange={(e) => {
                                    setSelectedModificationType(e)
                                }}
                                value={selectedModificationType}
                            >
                                {modificationTypes.map((modificationType) => (
                                    <Option key={modificationType.key}>
                                        {modificationType.value}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <Input
                                color='primary'
                                type='number'
                                placeholder='Porcentaje o monto fijo de modificación'
                                onChange={(e) => {
                                    setModificationValue(e.target.value)
                                }}
                                value={modificationValue}
                            />
                        </Col>
                        <Col>
                            <button
                                className='btn-primary'
                                onClick={() => {
                                    checkPage()
                                }}
                            >
                                Marcar página
                            </button>
                        </Col>
                        <Col>
                            <button
                                className='btn-secondary'
                                onClick={() => {
                                    uncheckPage()
                                }}
                            >
                                Desmarcar todo
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={12}>
                    <div align='center'>
                        <h3>Tabla de selección de artículos</h3>
                    </div>
                    <Table
                        width={'100%'}
                        dataSource={products}
                        columns={columnsForTable}
                        pagination={{
                            defaultCurrent: currentPage,
                            pageSize: limitPerPage,
                            total: totalDocsInPage,
                            showSizeChanger: false,
                            onChange: (e) => {
                                setCurrentPage(e)
                            },
                            onShowSizeChange: (e, val) => {
                                setLimitPerPage(val)
                            },
                        }}
                        loading={productsLoading}
                        rowKey='_id'
                        tableLayout='auto'
                        size='small'
                    />
                </Col>
                <Col span={12}>
                    <div align='center'>
                        <h3>Artículos seleccionados</h3>
                    </div>
                    <Table
                        width={'100%'}
                        dataSource={addedProducts}
                        columns={columnsInAddedProductsTable}
                        pagination={false}
                        rowKey='_id'
                        tableLayout='auto'
                        size='small'
                    />
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={16}></Col>
                <Col span={4}>
                    <button
                        className='btn-secondary'
                        onClick={() => {
                            setPriceModalVisible(false)
                        }}
                    >
                        Cancelar
                    </button>
                </Col>
                <Col span={4}>
                    <button
                        className='btn-primary'
                        onClick={() => {
                            handleOk()
                        }}
                    >
                        Aplicar
                    </button>
                </Col>
            </Row>
        </Modal>
    )
}

export default PriceModificatorModal
