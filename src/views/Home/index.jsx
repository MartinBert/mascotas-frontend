// React Components and Hooks
import React from 'react'
import { useEffect } from 'react'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { existsProperty } = helpers.objHelper


const Home = () => {

    const console_documentTypes = false // 'True' to console log all supported voucher types by the afip controller
    const changeModel = false // 'True' to modify database records. You must configure it before.

    useEffect(() => {
        const findDocumentsTypes = async () => {
            if (!console_documentTypes) return
            const cuit = '20374528506'
            const res = await api.afip.getDocumentsTypes(cuit)
            console.log(res)
        }
        findDocumentsTypes()
    }, [console_documentTypes])

    useEffect(() => {
        const changeModels = async () => {
            if (!changeModel) return
            const findVouchers = await api.ventas.findAll()
            const vouchers = findVouchers.docs
            for (let index = 0; index < vouchers.length; index++) {
                const element = vouchers[index]
                if (!existsProperty(element, 'associatedVouchers')) element.associatedVouchers = []
                if (!existsProperty(element, 'buyers')) element.buyers = []
                if (!existsProperty(element, 'iva')) element.iva = []
                if (!existsProperty(element, 'optionals')) element.optionals = []
                if (!existsProperty(element, 'taxes')) element.taxes = []
                await api.ventas.edit(element)
            }
        }
        changeModels()
    }, [changeModel])

    return (
        <h1>Home</h1>
    )
}

export default Home