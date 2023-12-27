// React Components and Hooks
import React from 'react'
import { useEffect } from 'react'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports Destructurings
const { simpleDateWithHours } = helpers.dateHelper
const { decimalPercent, roundTwoDecimals } = helpers.mathHelper


const Home = () => {

    const console_documentTypes = false // 'True' to console log all supported voucher types by the afip controller

    useEffect(() => {
        const findDocumentsTypes = async () => {
            if (!console_documentTypes) return
            const cuit = '20374528506'
            const res = await api.afip.getDocumentsTypes(cuit)
            console.log(res)
        }
        findDocumentsTypes()
    }, [console_documentTypes])

    
    return (
        <h1>Home</h1>
    )
}

export default Home