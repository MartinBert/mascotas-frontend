// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import { errorAlert, successAlert } from '../../components/alerts'
import OpenImage from '../../components/generics/openImage/OpenImage'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Col, Row, Table } from 'antd'

// Services
import api from '../../services'

// Views
import Header from './Header'

// Imports Destructurings
const { formatFindParams } = actions.paginationParams
const { useProductsContext } = contexts.Products


const ProductStockHistory = () => {
	const [products_state, products_dispatch] = useProductsContext()

	// --------------------- Actions --------------------- //
    const setLimit = (val) => {
        const paginationParams = {
            ...products_state.paginationParams,
            limit: parseInt(val)
        }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

    const setPage = (e) => {
        const paginationParams = {
            ...products_state.paginationParams,
            page: parseInt(e)
        }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS', payload: paginationParams })
    }

	// ------------------ Fetch Products ------------------ //
	useEffect(() => {
		const fetchProducts = async () => {
			const findParams = formatFindParams(products_state.paginationParams)
			const data = await api.productos.findPaginated(findParams)
			products_dispatch({ type: 'SET_PRODUCTS_FOR_RENDER', payload: data })
		}
		fetchProducts()
	}, [products_state.loading, products_state.paginationParams])


	const columnsForTable = [
		{
			dataIndex: 'productStockHistory_name',
			render: (_, product) => product.nombre,
			title: 'Producto'
		},
		{
			dataIndex: 'productStockHistory_productCode',
			render: (_, product) => product.codigoProducto,
			title: 'Cód. Producto'
		},
		{
			dataIndex: 'productStockHistory_barCode',
			render: (_, product) => product.codigoBarras,
			title: 'Cód. Barras'
		},
		{
			dataIndex: 'productStockHistory_image',
			render: (_, product) => (
                <OpenImage
                    alt='Ver imagen'
                    imageUrl={
                        (product.imagenes && product.imagenes.length > 0)
                            ? product.imagenes[product.imagenes.length - 1].url
                            : '/no-image.png'
                    }
                />
            ),
			title: 'Imagen'
		},
		{
			dataIndex: 'productStockHistory_stockHistory',
			render: (_, product) => {
				return (
					<div>
						Próximamente...
					</div>
				)
			},
			title: 'Historial'
		}
	]


	return (
		<Row gutter={[0, 8]}>
			<Col span={24}>
				<Header />
			</Col>
			<Col span={24}>
				<Table
					width={'100%'}
					dataSource={products_state.productsForRender}
					columns={columnsForTable}
					pagination={{
						current: products_state.paginationParams.page,
						limit: products_state.paginationParams.limit,
						total: products_state.productsTotalRecords,
						showSizeChanger: true,
						onChange: e => setPage(e),
						onShowSizeChange: (e, val) => setLimit(val)
					}}
					rowKey='_id'
					tableLayout='auto'
					size='small'
					loading={products_state.loading}
				/>
			</Col>
		</Row>
	)
}

export default ProductStockHistory