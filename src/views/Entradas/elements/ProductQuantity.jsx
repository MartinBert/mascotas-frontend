import React, { useEffect } from 'react'
import { InputNumber } from 'antd'
import contexts from '../../../contexts'
const { useEntriesContext } = contexts.Entries


const ProductQuantity = ({ product }) => {
    const [, entries_dispatch] = useEntriesContext()

    const changeQuantity = (e, productID) => {
        entries_dispatch({
            type: 'SET_PRODUCT_QUANTITY',
            payload: { productID: productID, quantity: e }
        })
    }

    useEffect(() => {
        if (!product.cantidadesEntrantes) {
            entries_dispatch({
                type: 'SET_PRODUCT_QUANTITY',
                payload: { productID: product._id, quantity: 0 }
            })
        }
    }, [product.cantidadesEntrantes])

    return (
        <InputNumber
            onChange={e => changeQuantity(e, product._id)}
            value={product.cantidadesEntrantes}
        />
    )
}

export default ProductQuantity