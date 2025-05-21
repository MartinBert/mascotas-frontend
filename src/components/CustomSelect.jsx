import React, { useState } from 'react'
import { Select } from 'antd'
import api from '../services'
import contexts from '../contexts'

const { useStoreContext } = contexts.Store


const CustomSelect = (props) => {
    const [errorStatus, setErrorStatus] = useState(false)
    const [options, setOptions] = useState([])
    const [value, setValue] = useState()
    const { actions, dispatch, params, state } = useStoreContext()
    const {
        actionType,
        mode,
        modelProp,
        modelSubProp,
        placeholder,
        service,
        validate = false
    } = props


    const onSearch = async (e) => {
        const filters = JSON.stringify({ [modelProp]: e })
        const findDocs = await api[service].findAllByFilters(filters)
        let options = []
        if (findDocs.errorStatus === 'OK' && findDocs.data.docs.length > 0) {
            options = findDocs.data.docs.map(doc => {
                const label = modelSubProp ? doc[modelProp][modelSubProp] : doc[modelProp]
                const option = { label, value: doc._id }
                return option
            })
        }
        setOptions(options)
        setErrorStatus(e.length < 1 ? true : false)
    }

    const onClear = () => {
        const multipleMode = mode === 'multiple'
        dispatch({ type: actionType, payload: multipleMode ? [] : null })
        setOptions([])
        setErrorStatus(true)
    }

    const getById = async (id) => {
        const findDoc = await api[service].findById(id)
        let doc = null
        if (findDoc.errorStatus === 'OK' && findDoc.data) {
            doc = findDoc.data
        }
        return doc
    }

    const getValue = (doc) => {
        const value = modelSubProp ? doc[modelProp][modelSubProp] : doc[modelProp]
        return value
    }

    const onSelect = async (ids) => {
        const multipleMode = mode === 'multiple'
        let payload = multipleMode ? [] : null
        let value = multipleMode ? [] : null
        if (multipleMode) {
            const arraySelection = Array.isArray(ids) ? ids : [ids]
            for (let index = 0; index < arraySelection.length; index++) {
                const id = arraySelection[index]
                const doc = await getById(id)
                const label = getValue(doc)
                if (doc) {
                    payload.push(doc)
                    value.push(label)
                }
            }
        } else {
            payload = await getById(ids)
            value = getValue(payload)
        }
        dispatch({ type: actionType, payload })
        setValue(value)
        setOptions([])
        setErrorStatus(false)
    }

    return (
        <Select
            allowClear
            filterOption={false}
            mode={mode}
            onClear={onClear}
            onSearch={onSearch}
            onSelect={onSelect}
            options={options}
            placeholder={placeholder}
            showSearch
            status={validate && errorStatus ? 'error' : null}
            style={{ width: '100%' }}
            value={value}
        />
    )
}

export default CustomSelect