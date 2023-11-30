import React, { useState } from 'react'
import { Select } from 'antd'
import api from '../../../services'

const { Option } = Select

const GenericAutocomplete = ({
    action,
    actionSecondary,
    actionTertiary,
    controller,
    dispatch,
    keyToCompare,
    label,
    multiple,
    modelToFind,
    payloadSecondary,
    returnCompleteModel,
    selectedSearch,
    setResultSearch
}) => {
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState([])

    const handleSearch = (searchText) => {
        if (!searchText || searchText.length < 3) return
        const fetchOptions = async () => {
            setLoading(true)
            const response = await api.genericos.filterAutocompleteOptions(modelToFind, searchText, keyToCompare)
            setOptions(response.data.docs)
            setLoading(false)
        }
        fetchOptions()
    }

    const returnResults = async (items) => {
        const singleObject = async () => await api[controller].findById(items.value)
        const collectionObject = async () => await api[controller].findMultipleIds(items.map(item => item.value))
        if (returnCompleteModel) {
            if (setResultSearch) setResultSearch(multiple ? await collectionObject() : await singleObject())
            if (action) dispatch({ type: action, payload: multiple ? await collectionObject() : await singleObject() })
            if (actionSecondary) dispatch({ type: actionSecondary, payload: payloadSecondary })
            if (actionTertiary) dispatch({ type: actionTertiary })
        } else {
            if (action) dispatch({ type: action, payload: items })
            if (actionSecondary) dispatch({ type: actionSecondary, payload: payloadSecondary })
            if (setResultSearch) setResultSearch(items)
        }
    }

    return (
        <Select
            id='generic_autocomplete'
            mode={multiple ? 'tags' : null}
            showSearch={true}
            filterOption={input => options.map(option => option[keyToCompare].includes(input)[0])}
            labelInValue
            placeholder={label}
            loading={loading}
            onSearch={e => handleSearch(e)}
            onChange={e => returnResults(e)}
            style={{ width: '100%' }}
            value={
                !selectedSearch
                    ? !multiple
                        ? null
                        : []
                    : !multiple
                        ? <Option key={selectedSearch[keyToCompare]}>{selectedSearch}</Option>
                        : (Array.isArray(selectedSearch))
                            ? selectedSearch.map(item => <Option key={item[keyToCompare]}>{item}</Option>)
                            : [<Option key={selectedSearch[keyToCompare]}>{selectedSearch}</Option>]
            }
        >
            {options.map(d => (<Option key={d._id}>{d[keyToCompare]}</Option>))}
        </Select>
    )
}

export default GenericAutocomplete