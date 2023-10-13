import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import api from '../../../services'
import contexts from '../../../contexts'
import { errorAlert, successAlert } from '../../../components/alerts'
const { useAuthContext } = contexts.Auth
const { useOutputsContext } = contexts.Outputs

const formatOutput = (output, auth_state) => {
    const formattedOutput = {
        _id: output._id,
        cantidad: output.quantity,
        gananciaNeta: output.totalCost,
        descripcion:
            output.description && output.description !== ''
                ? output.description
                : '-- Sin descripción --'
        ,
        fecha:
            output.date
                ? output.date
                : new Date()
        ,
        productos: output.products,
        usuario: auth_state.user._id
    }
    return formattedOutput
}


const SaveButton = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [auth_state] = useAuthContext()
    const [outputs_state, outputs_dispatch] = useOutputsContext()

    const redirectToSalidas = () => {
        navigate('/salidas')
    }

    const validateOutputSave = () => {
        if (!outputs_state.description || outputs_state.description === '') {
            outputs_dispatch({ type: 'SET_DESCRIPTION', payload: '-- Sin descripción --' })
        }
        if (!outputs_state.date || !outputs_state.formattedDate) {
            outputs_dispatch({ type: 'SET_DATE', payload: new Date() })
            outputs_dispatch({ type: 'SET_FORMATTED_DATE', payload: new Date() })
        }
        if (outputs_state.products.length === 0) {
            errorAlert('¡Debes seleccionar al menos un producto!')
            return 'FAIL'
        }
        for (const product of outputs_state.products) {
            if (product.cantidadesSalientes === 0) {
                errorAlert(`Indica una cantidad mayor que cero a: ${product.nombre}`)
                return 'FAIL'
            }
        }
        return 'OK'
    }

    const saveNew = async () => {
        const result = validateOutputSave()
        if (result === 'FAIL') return
        for (const product of outputs_state.products) {
            await api.productos.modifyStock({
                product,
                isIncrement: false,
                quantity: product.cantidadesSalientes
            })
        }
        const validatedOutput = formatOutput(outputs_state, auth_state)
        await api.salidas.save(validatedOutput)
            .then(response => {
                if (response.code === 200) {
                    successAlert('El registro se guardó correctamente')
                    outputs_dispatch({ type: 'CLEAN_STATE' })
                    redirectToSalidas()
                } else {
                    errorAlert('Fallo al guardar el registro')
                }
            })
    }

    const saveEdit = async () => {
        for (let product of outputs_state.products) {
            const findOutputToEdit = await api.salidas.findById(outputs_state._id)
            const outputToEdit = findOutputToEdit.data
            const productOfOutputToEdit = outputToEdit.productos.find(el => el._id === product._id)
            if (productOfOutputToEdit && productOfOutputToEdit.cantidadesSalientes !== product.cantidadesSalientes) {
                const findProductToModifyStock = await api.productos.findById(product._id)
                const productToModifyStock = findProductToModifyStock.data
                productToModifyStock.cantidadStock += productOfOutputToEdit.cantidadesSalientes
                productToModifyStock.cantidadStock -= parseFloat(product.cantidadesSalientes)
                await api.productos.edit(productToModifyStock)
            } else {
                await api.productos.modifyStock({
                    product,
                    isIncrement: false,
                    quantity: product.cantidadesSalientes
                })
            }
        }
        await api.salidas.edit(formatOutput(outputs_state, auth_state))
            .then((response) => {
                if (response.code === 200) {
                    successAlert('El registro se editó correctamente')
                    outputs_dispatch({ type: 'CLEAN_STATE' })
                    redirectToSalidas()
                } else {
                    errorAlert('Fallo al editar el registro')
                }
            })
    }

    const saveOutput = () => {
        const saveType = location.pathname.replace('/salidas/', '')
        if (saveType === 'nuevo') saveNew()
        else saveEdit()
    }

    return (
        <Button
            onClick={() => saveOutput()}
            style={{ width: '100%' }}
            type='primary'
        >
            Guardar
        </Button>
    )
}

export default SaveButton