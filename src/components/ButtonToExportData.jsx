import React, { useState } from 'react'
import { Button, Col, Row, Select } from 'antd'
import helpers from '../helpers'
import { errorAlert } from './alerts'
const { generateExcel } = helpers.excel
const { createProductsCataloguePdf } = helpers.pdfHelper


const allExportOptions = [{ key: 'Todas', label: 'Todas', value: 'Todas' }]
const buttonLabel = 'Exportar'
const defaultDispatchLoadingType = 'SET_LOADING'
const errorMessage_missingExportOptions = 'Seleccione los conceptos a exportar.'
const errorMessage_missingTypeOfExport = 'Seleccione el tipo de documento a exportar.'
const errorMessage_printDocument = (docType) => {
    const message = `No se pudo generar el catálogo en formato "${docType}". Intente de nuevo o utilice otro formato.`
    return message
}
const excel = { label: 'Excel', value: 'excel' }
const pdf = { label: 'PDF', value: 'pdf' }


const ButtonToExportData = (props) => {
    const {
        dispatch,
        exportData
    } = props

    const totalExportOptions = allExportOptions.concat(
        exportData.map(dataItem => {
            const option = {
                key: dataItem.option,
                label: dataItem.option,
                value: [dataItem.header, dataItem.element]
            }
            return option
        })
    )
    const defaultExportOptions = totalExportOptions.filter(option => option !== allExportOptions[0])

    const [exportOptions, setExportOptions] = useState(defaultExportOptions)
    const [loading, setLoading] = useState(false)
    const [missingExportOptions, setMissingExportOptions] = useState(false)
    const [missingExportType, setMissingExportType] = useState(false)
    const [selectedExportOptions, setSelectedExportOptions] = useState(allExportOptions)
    const [selectedExportType, setSelectedExportType] = useState(pdf)

    // ------------------ Button to export ------------------ //
    const exportExcel = async () => {
        // const headers = generateHeaders()
        // const lines = await formatLines(headers)
        // const nameOfDocument = 'Lista de productos'
        // const nameOfSheet = 'Hoja de productos'
        // const result = await generateExcel(headers, lines, nameOfSheet, nameOfDocument)
        // return { isCreated: result.isCreated, docType: 'excel' }
    }

    const exportPdf = async () => {
        // const brands = products_state.exportProductList.brandsForSelect.selectedBrandsNames.map(brand => brand.value)
        // const enterprise = auth_state.user.empresa
        // const headers = generateHeaders()
        // const renglones = await formatLines(headers)
        // const salesArea = salesAreas_state.selectedSalesAreaName.value
        // const types = products_state.exportProductList.typesForSelect.selectedTypesNames.map(type => type.value)
        // const data = { brands, enterprise, headers, renglones, salesArea, types }
        // const result = await createProductsCataloguePdf(data)
        // return { isCreated: result.isCreated, docType: 'pdf' }
    }

    const exportDocument = async () => {
        setLoading(true)
        if (dispatch) {
            dispatch({ type: defaultDispatchLoadingType, payload: true })
        }
        let response
        switch (selectedExportType) {
            case excel:
                response = await exportExcel()
                break
            case pdf:
                response = await exportPdf()
                break
            default:
                response = { isCreated: false, docType: 'excel/pdf' }
                break
        }
        if (!response.isCreated) {
            errorAlert(errorMessage_printDocument(response.docType))
        }
        if (dispatch) {
            dispatch({ type: defaultDispatchLoadingType, payload: false })
        }
        setLoading(false)
    }

    const buttonToExport = (
        <Button
            loading={loading}
            onClick={exportDocument}
            style={{ width: '100%' }}
            type='primary'
        >
            {buttonLabel}
        </Button>
    )

    // ---------------- Select export options --------------- //
    const getUnselectedOptions = (selectedOptions) => {
        const selectedOptionsKeys = selectedOptions.map(option => option.key)
        const unselectedOptions = totalExportOptions.filter(option => !selectedOptionsKeys.includes(option.key))
        return unselectedOptions
    }

    const onDeselectExportOptions = (e) => {
        const remainingOptions = selectedExportOptions.filter(option => option.value !== e)
        if (remainingOptions.length < 1) {
            setExportOptions(defaultExportOptions)
            setSelectedExportOptions(allExportOptions)
        } else {
            const unselectedOptions = getUnselectedOptions(remainingOptions)
            setExportOptions(unselectedOptions)
            setSelectedExportOptions(remainingOptions)
        }
    }

    const onSelectExportOptions = (e) => {
        const selectedOption = exportOptions.find(option => option.value === e)
        if (!selectedOption) {
            setMissingExportOptions(true)
        } else {
            setMissingExportOptions(false)
            const selectedAllExportOptions = selectedOption.key === allExportOptions[0].key
            if (selectedAllExportOptions) {
                setExportOptions(defaultExportOptions)
                setSelectedExportOptions(allExportOptions)
            } else {
                const selectedOptions = [...selectedExportOptions, selectedOption]
                    .filter(option => option !== allExportOptions[0])
                const unselectedOptions = getUnselectedOptions(selectedOptions)
                setExportOptions(unselectedOptions)
                setSelectedExportOptions(selectedOptions)
            }
        }
    }

    const selectExportOptions = (
        <Select
            mode='multiple'
            onDeselect={onDeselectExportOptions}
            onSelect={onSelectExportOptions}
            options={exportOptions}
            showSearch
            style={{ width: '100%' }}
            value={selectedExportOptions}
        />
    )

    // ----------------- Select export type ----------------- //
    const onSelectExportType = (e) => {
        const selectedOption = [excel, pdf].find(option => option.value === e)
        if (!selectedOption) {
            setMissingExportType(true)
        } else {
            setMissingExportType(false)
            setSelectedExportType(selectedOption)
        } 
    }

    const selectExportType = (
        <Select
            onSelect={onSelectExportType}
            options={[excel, pdf]}
            style={{ width: '100%' }}
            value={selectedExportType}
        />
    )


    return (
        <Row gutter={[8, 8]}>
            <Col span={24}>
                {selectExportOptions}
            </Col>
            <Col span={12}>
                {selectExportType}
            </Col>
            <Col span={12}>
                {buttonToExport}
            </Col>
            {
                missingExportOptions && (
                    <span style={{ color: 'red', width: '100%' }}>
                        {errorMessage_missingExportOptions}
                    </span>
                )
            }
            {
                missingExportType && (
                    <span style={{ color: 'red', width: '100%' }}>
                        {errorMessage_missingTypeOfExport}
                    </span>
                )
            }
        </Row>
    )
}

export default ButtonToExportData