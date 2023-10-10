import React, { useEffect } from 'react'
import { InputNumber } from 'antd'
import contexts from '../../../contexts'
const { useOutputsContext } = contexts.Outputs


const ProductQuantity = ({ product }) => {
    const [, outputs_dispatch] = useOutputsContext()

    const changeQuantity = (e, productID) => {
        outputs_dispatch({
            type: 'SET_PRODUCT_QUANTITY',
            payload: { productID: productID, quantity: e }
        })
    }

    useEffect(() => {
        if (!product.cantidadesSalientes) {
            outputs_dispatch({
                type: 'SET_PRODUCT_QUANTITY',
                payload: { productID: product._id, quantity: 0 }
            })
        }
    }, [product.cantidadesSalientes])

    return (
        <InputNumber
            onChange={e => changeQuantity(e, product._id)}
            value={product.cantidadesSalientes}
        />
    )
}

export default ProductQuantity