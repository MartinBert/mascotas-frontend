import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import api from '../../../services'
import contexts from '../../../contexts'
import helpers from '../../../helpers'
import { errorAlert, successAlert } from '../../../components/alerts'

const { useAuthContext } = contexts.Auth
const { useEntriesContext } = contexts.Entries
const { simpleDateWithHours } = helpers.dateHelper

const formatEntry = (entry, auth_state) => {
    const formattedEntry = {
        _id: entry._id,
        cantidad: entry.quantity,
        costoTotal: entry.totalCost,
        descripcion:
            entry.description && entry.description !== ''
                ? entry.description
                : '-- Sin descripción --'
        ,
        fecha:
            entry.date
                ? entry.date
                : new Date()
        ,
        fechaString:
            entry.dateString
                ? simpleDateWithHours(entry.date)
                : simpleDateWithHours(new Date())
        ,
        productos: entry.products,
        usuario: auth_state.user._id
    }
    return formattedEntry
}


const SaveButton = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [auth_state] = useAuthContext()
    const [entries_state, entries_dispatch] = useEntriesContext()

    const redirectToEntradas = () => {
        navigate('/entradas')
    }

    const validateEntrySave = () => {
        if (!entries_state.description || entries_state.description === '') {
            entries_dispatch({ type: 'SET_DESCRIPTION', payload: '-- Sin descripción --' })
        }
        if (!entries_state.date || !entries_state.formattedDate) {
            entries_dispatch({ type: 'SET_DATE', payload: new Date() })
            entries_dispatch({ type: 'SET_FORMATTED_DATE', payload: new Date() })
        }
        if (entries_state.products.length === 0) {
            errorAlert('¡Debes seleccionar al menos un producto!')
            return 'FAIL'
        }
        for (const product of entries_state.products) {
            if (product.cantidadesEntrantes === 0) {
                errorAlert(`Indica una cantidad mayor que cero a: ${product.nombre}`)
                return 'FAIL'
            }
        }
        return 'OK'
    }

    const saveNew = async () => {
        const result = validateEntrySave()
        if (result === 'FAIL') return
        for (const product of entries_state.products) {
            await api.productos.modifyStock({
                product,
                isIncrement: true,
                quantity: product.cantidadesEntrantes
            })
        }
        const validatedEntry = formatEntry(entries_state, auth_state)
        await api.entradas.save(validatedEntry)
            .then(response => {
                if (response.code === 200) {
                    successAlert('El registro se guardó correctamente')
                    entries_dispatch({ type: 'CLEAN_STATE' })
                    redirectToEntradas()
                } else {
                    errorAlert('Fallo al guardar el registro')
                }
            })
    }

    const saveEdit = async () => {
        for (let product of entries_state.products) {
            const findEntryToEdit = await api.entradas.findById(entries_state._id)
            const entryToEdit = findEntryToEdit.data
            const productOfEntryToEdit = entryToEdit.productos.find(el => el._id === product._id)
            if (productOfEntryToEdit && productOfEntryToEdit.cantidadesEntrantes !== product.cantidadesEntrantes) {
                const findProductToModifyStock = await api.productos.findById(product._id)
                const productToModifyStock = findProductToModifyStock.data
                productToModifyStock.cantidadStock -= productOfEntryToEdit.cantidadesEntrantes
                productToModifyStock.cantidadStock += parseFloat(product.cantidadesEntrantes)
                await api.productos.edit(productToModifyStock)
            } else {
                await api.productos.modifyStock({
                    product,
                    isIncrement: true,
                    quantity: product.cantidadesEntrantes
                })
            }
        }
        await api.entradas.edit(formatEntry(entries_state, auth_state))
            .then((response) => {
                if (response.code === 200) {
                    successAlert('El registro se editó correctamente')
                    entries_dispatch({ type: 'CLEAN_STATE' })
                    redirectToEntradas()
                } else {
                    errorAlert('Fallo al editar el registro')
                }
            })
    }

    const saveEntry = () => {
        const saveType = location.pathname.replace('/entradas/', '')
        if (saveType === 'nuevo') saveNew()
        else saveEdit()
    }

    return (
        <Button
            onClick={() => saveEntry()}
            style={{ width: '100%' }}
            type='primary'
        >
            Guardar
        </Button>
    )
}

export default SaveButton