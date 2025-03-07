// React Components and Hooks
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaTrashAlt } from 'react-icons/fa'

// Custom Components
import generics from '../../components/generics'
import graphics from '../../components/graphics'
import { errorAlert, questionAlert, successAlert } from '../../components/alerts'

// Design Components
import { Row, Col, Form, Input, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// Helpers
import actions from '../../actions'
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructuring
const { GenericAutocomplete } = generics
const { Spinner } = graphics
const { formatFindFilters } = actions.paginationParams
const { decimalPercent, roundToMultiple, round } = helpers.mathHelper
const { fiscalNotesCodes } = helpers.afipHelper
const { normalizeString } = helpers.stringHelper


const ProductosForm = () => {
    const location = useLocation()
    const id = location.pathname.substring(11)
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        nombre: '',
        codigoProducto: '',
        codigoBarras: '',
        marca: null,
        rubro: null,
        unidadMedida: null,
        cantidadStock: 0,
        cantidadFraccionadaStock: 1,
        precioUnitario: 0,
        margenGanancia: 0,
        margenGananciaFraccionado: 0,
        normalizedBarcode: '',
        normalizedBrand: '',
        normalizedName: '',
        normalizedProductCode: '',
        normalizedType: '',
        precioVenta: 0,
        precioVentaFraccionado: 0,
        gananciaNeta: 0,
        gananciaNetaFraccionado: 0,
        porcentajeIvaCompra: 0,
        porcentajeIvaVenta: 0,
        ivaCompra: 0,
        ivaVenta: 0,
        imagenes: null
    })
    const [loading, setLoading] = useState(true)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedHeading, setSelectedHeading] = useState(null)
    const [selectedMeasure, setSelectedMeasure] = useState(null)
    const [uploadedImages, setUploadedImages] = useState([])

    const fetchProductById = async () => {
        if (id === 'nuevo') return setLoading(false)
        const response = await api.productos.findById(id)
        const product = response.data
        setSelectedBrand({ _id: product?.marca?._id ?? null, nombre: product?.marca?.nombre ?? null })
        setSelectedHeading({ _id: product?.rubro?._id ?? null, nombre: product?.rubro?.nombre ?? null })
        setSelectedMeasure({ _id: product?.unidadMedida?._id ?? null, nombre: product?.unidadMedida?.nombre ?? null })
        setProduct(product)
        setUploadedImages(product.imagenes)
        setLoading(false)
    }

    useEffect(() => {
        fetchProductById()
        // eslint-disable-next-line
    }, [id])

    const updateProductValues = () => {
        const margenGanancia = decimalPercent(product.margenGanancia)
        const margenGananciaFraccionado = decimalPercent(product.margenGananciaFraccionado)
        const precioUnitario = parseFloat(product.precioUnitario)
        const porcentajeIvaCompra = decimalPercent(product.porcentajeIvaCompra)
        const porcentajeIvaVenta = decimalPercent(product.porcentajeIvaVenta)
        const gananciaNeta = round(precioUnitario * margenGanancia)
        const gananciaNetaFraccionado = round(precioUnitario * margenGananciaFraccionado)
        const ivaCompra = round(precioUnitario - (precioUnitario / (1 + porcentajeIvaCompra)))
        const ivaVenta = round(precioUnitario * porcentajeIvaVenta)
        const precioVentaSinRedondear = round(precioUnitario + ivaVenta + gananciaNeta)
        const precioVenta = roundToMultiple(round(precioUnitario + ivaVenta + gananciaNeta), 10)
        const diferenciaPrecioVenta = precioVenta - precioVentaSinRedondear
        const precioVentaFraccionadoSinRedondear = round(precioUnitario + ivaVenta + gananciaNetaFraccionado)
        const precioVentaFraccionado = roundToMultiple(round(precioUnitario + ivaVenta + gananciaNetaFraccionado), 10)
        const diferenciaPrecioVentaFraccionado = precioVentaFraccionado - precioVentaFraccionadoSinRedondear
        setProduct({
            ...product,
            ivaCompra,
            ivaVenta,
            gananciaNeta: round(gananciaNeta + diferenciaPrecioVenta),
            gananciaNetaFraccionado: round(gananciaNetaFraccionado + diferenciaPrecioVentaFraccionado),
            precioVenta,
            precioVentaFraccionado
        })
    }

    useEffect(() => {
        updateProductValues()
        // eslint-disable-next-line
    }, [
        product.precioUnitario,
        product.margenGanancia,
        product.margenGananciaFraccionado,
        product.porcentajeIvaCompra,
        product.porcentajeIvaVenta
    ])

    const setFormDataToProduct = async (e) => {
        const target = e.target.name
        const value = e.target.value
        if (target === 'codigoBarras') {
            setProduct({
                ...product,
                codigoBarras: value,
                normalizedBarcode: normalizeString(value)
            })
        }
        else if (target === 'codigoProducto') {
            setProduct({
                ...product,
                codigoProducto: value,
                normalizedProductCode: normalizeString(value)
            })
        }
        else if (target === 'nombre') {
            setProduct({
                ...product,
                nombre: value,
                normalizedName: normalizeString(value)
            })
        } else {
            setProduct({
                ...product,
                [target]: value
            })
        }
    }

    const setSelectedBrandToProduct = async (brand) => {
        setSelectedBrand(brand)
        const response = await api.marcas.findById(brand._id)
        setProduct({
            ...product,
            marca: response,
            normalizedBrand: response.nombre
        })
    }

    const setSelectedHeadingToProduct = async (heading) => {
        setSelectedHeading(heading)
        const response = await api.rubros.findById(heading._id)
        setProduct({
            ...product,
            rubro: response,
            normalizedType: response.nombre
        })
    }

    const setSelectedMeasureToProduct = async (measure) => {
        setSelectedMeasure(measure)
        const response = await api.unidadesmedida.findById(measure._id)
        setProduct({
            ...product,
            unidadMedida: response,
            cantidadFraccionadaStock: response.fraccionamiento
        })
    }

    const saveValidation = () => {
        if (product.nombre === '') {
            errorAlert('Agregue un NOMBRE a su producto.')
            return false
        }
        if (product.codigoBarras === '') {
            errorAlert('Agregue un COD. BARRAS a su producto.')
            return false
        }
        if (product.codigoProducto === '') {
            errorAlert('Agregue un COD. PRODUCTO a su producto.')
            return false
        }
        if (!product.marca) {
            errorAlert('Agregue una MARCA a su producto.')
            return false
        }
        if (!product.rubro) {
            errorAlert('Agregue un RUBRO a su producto.')
            return false
        }
        if (!product.unidadMedida) {
            errorAlert('Agregue una UNIDAD MEDIDA a su producto.')
            return false
        }
        return true
    }

    const saveProduct = () => {
        const validated = saveValidation()
        if (!validated) return

        product.imagenes = uploadedImages
        product.nombre = product.nombre.trim()
        
        const saveProduct = async () => {
            const response = await api.productos.save(product)
            if (response.code === 200) {
                successAlert('El registro fue grabado con exito').then(redirectToProducts())
            } else {
                errorAlert('Error al guardar el registro')
            }
        }

        const editProduct = async () => {
            const filters = formatFindFilters({
                cashRegister: true,
                documentoCodigo: { $nin: fiscalNotesCodes },
                productos: { $all: [ { $elemMatch: { _id: product._id } } ] }
            })
            const findSalesThatContainProduct = await api.ventas.findAllByFilters(filters)
            const salesThatContainProduct = findSalesThatContainProduct.docs
            console.log(salesThatContainProduct)
            // const updatedSales = salesThatContainProduct.map(sale => {
            //     const updatedSale = {
            //         ...sale,
            //         productos: sale.productos.map(producto => {
            //             let updatedProduct
            //             if (producto._id === product._id) {
            //                 updatedProduct = {
            //                     ...producto,
            //                     nombre: product.nombre
            //                 }
            //             } else updatedProduct = producto
            //             return updatedProduct
            //         })
            //     }
            //     return updatedSale
            // })
            // const salesEditionResponse = await api.ventas.editAll(updatedSales)
            // if (salesEditionResponse.code !== 200) {
            //     return errorAlert('Error al actualizar el nombre del producto en las ventas anteriores.')
            // }
            // const productEditionResponse = await api.productos.edit(product)
            // if (productEditionResponse.code !== 200) {
            //     errorAlert('Error al guardar el registro.')
            // } else {
            //     successAlert('El registro fue grabado con éxito.').then(redirectToProducts())
            // }
        }

        if (id === 'nuevo') saveProduct()
        else editProduct()
    }

    const handleCancel = () => {
        redirectToProducts()
    }

    const redirectToProducts = () => {
        navigate('/productos')
    }

    const uploaderProps = {
        name: 'file',
        accept: '.jpg,.png',
        multiple: false,
        onChange: (info) => uploadImageToServer(info.file),
        onRemove: () => removeImage(uploadedImages[0]._id),
        beforeUpload: () => false
    }

    const uploadImageToServer = async (file) => {
        const response = await api.uploader.uploadImage(file)
        if (response.file) {
            setUploadedImages([
                ...uploadedImages,
                ...response.file
            ])
            return response.code
        }
    }

    const removeImage = async (id) => {
        const response = await api.uploader.deleteImage(id)
        setUploadedImages([])
        return response
    }

    return (
        <Row>
            <Col span={24}>
                <h1>{(id === 'nuevo') ? 'Crear nuevo producto' : 'Editar producto'}</h1>
                {(loading)
                    ? <Spinner />
                    :
                    <Form
                        autoComplete='off'
                    >
                        <Row gutter={8}>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Nombre'
                                >
                                    <Input
                                        name='nombre'
                                        placeholder='Nombre'
                                        value={product.nombre}
                                        onChange={setFormDataToProduct}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Código prod.'
                                >
                                    <Input
                                        name='codigoProducto'
                                        placeholder='Código de producto'
                                        value={product.codigoProducto}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Cód. barras'
                                >
                                    <Input
                                        name='codigoBarras'
                                        placeholder='Código de barras'
                                        value={product.codigoBarras}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Marca'
                                >
                                    <GenericAutocomplete
                                        label='Marca'
                                        modelToFind='marca'
                                        keyToCompare='nombre'
                                        controller='marcas'
                                        returnCompleteModel={true}
                                        setResultSearch={setSelectedBrandToProduct}
                                        selectedSearch={selectedBrand}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Rubro'
                                >
                                    <GenericAutocomplete
                                        label='Rubro'
                                        modelToFind='rubro'
                                        keyToCompare='nombre'
                                        controller='rubros'
                                        returnCompleteModel={true}
                                        setResultSearch={setSelectedHeadingToProduct}
                                        selectedSearch={selectedHeading}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='U. Medida'
                                >
                                    <GenericAutocomplete
                                        label='U. Medida'
                                        modelToFind='unidadmedida'
                                        keyToCompare='nombre'
                                        controller='unidadesmedida'
                                        returnCompleteModel={true}
                                        setResultSearch={setSelectedMeasureToProduct}
                                        selectedSearch={selectedMeasure}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Fraccionamiento'
                                >
                                    <Input
                                        name='cantidadFraccionadaStock'
                                        placeholder='Fraccionamiento'
                                        type='number'
                                        value={(product.unidadMedida) ? product.unidadMedida.fraccionamiento : 1}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Cant. stock'
                                >
                                    <Input
                                        name='cantidadStock'
                                        placeholder='Cantidad de stock'
                                        type='number'
                                        value={product.cantidadStock}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Cant. fracc.'
                                >
                                    <Input
                                        name='cantidadFraccionadaStock'
                                        placeholder='Cantidad de stock fraccionado'
                                        type='number'
                                        value={product.cantidadFraccionadaStock}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Prec. unit.'
                                >
                                    <Input
                                        name='precioUnitario'
                                        placeholder='Precio unitario'
                                        type='number'
                                        value={product.precioUnitario}
                                        onChange={e => setFormDataToProduct(e)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='% Ganancia'
                                >
                                    <Input
                                        name='margenGanancia'
                                        placeholder='Margen de ganancia'
                                        type='number'
                                        value={product.margenGanancia}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='% Ganancia Fracc.'
                                >
                                    <Input
                                        name='margenGananciaFraccionado'
                                        placeholder='Margen de ganancia prod. fracc.'
                                        type='number'
                                        value={product.margenGananciaFraccionado}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Porc. Iva Compra'
                                >
                                    <Input
                                        name='porcentajeIvaCompra'
                                        type='number'
                                        value={product.porcentajeIvaCompra}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Porc. Iva Venta'
                                >
                                    <Input
                                        name='porcentajeIvaVenta'
                                        type='number'
                                        value={product.porcentajeIvaVenta}
                                        onChange={e => { setFormDataToProduct(e) }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Iva Compra'
                                >
                                    <Input
                                        name='ivaCompra'
                                        type='number'
                                        value={product.ivaCompra}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Iva Venta'
                                >
                                    <Input
                                        name='ivaVenta'
                                        type='number'
                                        value={product.ivaVenta}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Prec. Vta.'
                                >
                                    <Input
                                        name='precioVenta'
                                        placeholder='Precio de venta'
                                        type='number'
                                        value={product.precioVenta}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Prec. Vta. Fracc.'
                                >
                                    <Input
                                        name='precioVentaFraccionado'
                                        placeholder='Precio de venta de producto fraccionado'
                                        type='number'
                                        value={product.precioVentaFraccionado}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Gan. Neta'
                                >
                                    <Input
                                        name='gananciaNeta'
                                        placeholder='Ganancia Neta'
                                        type='number'
                                        value={product.gananciaNeta}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    required
                                    label='Gan. Neta. Fracc.'
                                >
                                    <Input
                                        name='gananciaNetaFraccionado'
                                        placeholder='Ganancia Neta prod. fracc.'
                                        type='number'
                                        value={product.gananciaNetaFraccionado}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Upload
                                    {...uploaderProps}
                                >
                                    <button type='button' className='btn-primary' icon={<UploadOutlined />}>Subir imagen</button>
                                </Upload>
                            </Col>
                            {
                                (product.imagenes && product.imagenes.length > 0)
                                    ?
                                    <Col span={24} style={{ display: 'flex', marginBottom: '20px' }}>
                                        {product.imagenes.map(imageData => (
                                            <div style={{ position: 'relative', marginRight: '10px' }} key={imageData._id}>
                                                <div
                                                    style={{
                                                        padding: '3px',
                                                        backgroundColor: 'black',
                                                        position: 'absolute',
                                                        right: '2px',
                                                        top: '2px',
                                                        width: '25px',
                                                        height: '25px',
                                                        textAlign: 'center',
                                                        borderRadius: '5px 5px 5px 5px',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        questionAlert('Esto eliminará permanentemente la imágen del producto, ¿Desea continuar?')
                                                            .then(result => {
                                                                const reload = async () => {
                                                                    await api.uploader.deleteImage(imageData._id)
                                                                    window.location.reload()
                                                                }
                                                                if (result.isConfirmed) return reload()
                                                            })
                                                    }}
                                                >
                                                    <FaTrashAlt color='red' />
                                                </div>
                                                <img src={imageData.url} alt='Producto Mascotafeliz' width='100' height='100' crossOrigin='anonymus' />
                                            </div>
                                        ))}
                                    </Col>
                                    : null
                            }
                            <Col span={24} align='start' style={{ display: 'flex' }}>
                                <Form.Item style={{ marginRight: '15px' }}>
                                    <button
                                        className='btn-primary'
                                        onClick={() => saveProduct()}
                                    >
                                        Guardar
                                    </button>
                                </Form.Item>
                                <Form.Item>
                                    <button
                                        className='btn-secondary'
                                        onClick={() => handleCancel()}
                                        type='button'
                                    >
                                        Cancelar
                                    </button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }
            </Col>
            <Col span={24} align='justify'>
                <h1>
                    Para realizar ventas AFIP exige que se declare el IVA de la operación,
                    el porcentaje del mismo puede variar dependiendo del producto, pero generalmente es del 21%.
                    El procedimiento estandar es considerar dicho porcentaje al momento de aplicar un margen de ganancia
                    al producto, puesto que un 21% de la ganancia es absorbida por el IVA de las operaciones cuando el
                    contribuyente realiza el devengamiento fiscal del impuesto.
                </h1><br />
                <h1>
                    Ejemplo: si se desea obtener un 15% de ganancia sobre una operación,
                    el porcentaje de recargo total del producto será de 36% (21% de IVA, 15% de ganancia).
                </h1><br />
                <h1>
                    En el sistema hemos tenido en cuenta esta regulación, por lo que ahora se muestran campos nuevos en el producto para
                    mayor comodidad del usuario al momento de calcular el iva y la ganancia de sus productos:
                    <ul>
                        <li>
                            Porcentaje de iva compra: corresponde al porcentaje de IVA del costo del producto al momento en el que fue comprado
                            a un proveedor. Es un campo informativo, para control del usuario del sistema.
                        </li>
                        <li>
                            Iva compra: corresponde al importe de IVA que conforma al precio de costo del producto.
                            Es un campo informativo, para control del usuario del sistema.
                        </li>
                        <li>
                            Porcentaje de iva venta:
                            Es el porcentaje de IVA que se aplicará al precio del producto en la venta (21% predeterminadamente).
                        </li>
                        <li>
                            Iva venta: Es el importe de IVA del precio del producto que se esté vendiendo.
                        </li>
                    </ul>
                </h1>

            </Col>
        </Row>
    )
}

export default ProductosForm