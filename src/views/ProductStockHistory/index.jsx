// React Components and Hooks
import React, { useEffect } from 'react'

// Custom Components
import OpenImage from '../../components/generics/openImage/OpenImage'

// Custom Contexts
import actions from '../../actions'
import contexts from '../../contexts'

// Design Components
import { Button, Col, Row, Spin, Table } from 'antd'

// Services
import api from '../../services'

// Views
import Header from './Header'
import ProductStockHistoryModal from './ProductStockHistoryModal'

// Imports Destructurings
const { formatFindParams } = actions.paginationParams
const { useProductsContext } = contexts.Products


const ProductStockHistory = () => {
	const [products_state, products_dispatch] = useProductsContext()

	// --------------------- Actions --------------------- //
	const openProductStockHistory = (product) => {
		products_dispatch({ type: 'SET_PRODUCT_FOR_STOCK_HISTORY_MODAL', payload: product })
	}

	const setPageAndLimit = (page, limit) => {
		console.log((page, limit))
        const paginationParams = {
            ...products_state.stockHistory.paginationParams,
            page: parseInt(page),
            limit: parseInt(limit)
        }
        products_dispatch({ type: 'SET_PAGINATION_PARAMS_IN_STOCK_HISTORY', payload: paginationParams })
    }

	// ------------------ Fetch Products ------------------ //
	useEffect(() => {
		const fetchProducts = async () => {
			const findParams = formatFindParams(products_state.stockHistory.paginationParams)
			const data = await api.productos.findPaginated(findParams)
			products_dispatch({ type: 'SET_PRODUCTS_TO_RENDER_IN_STOCK_HISTORY', payload: data })
		}
		fetchProducts()
	}, [products_state.stockHistory.loading, products_state.stockHistory.paginationParams])


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
					<Button
						onClick={() => openProductStockHistory(product)}
						style={{ width: '100%' }}
						type='primary'
					>
						Abrir historial
					</Button>
				)
			},
			title: 'Historial de stock'
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
					dataSource={products_state.stockHistory.productsToRender}
					columns={columnsForTable}
					pagination={{
						defaultCurrent: products_state.stockHistory.paginationParams.page,
						defaultPageSize: products_state.stockHistory.paginationParams.limit,
						limit: products_state.stockHistory.paginationParams.limit,
						onChange: (page, limit) => setPageAndLimit(page, limit),
						showSizeChanger: true,
						total: products_state.stockHistory.totalRecords
					}}
					rowKey='_id'
					tableLayout='auto'
					size='small'
					loading={products_state.stockHistory.loading}
				/>
			</Col>
			<Col span={24}>
				{
					!products_state.stockHistory.product
						? null
						: <ProductStockHistoryModal />
				}
			</Col>
		</Row>
	)
}

export default ProductStockHistory