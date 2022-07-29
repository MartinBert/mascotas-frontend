import React, {useState} from 'react';
import {Select} from 'antd';
import api from '../../../services';

const {Option} = Select;

const GenericAutocomplete = ({multiple, modelToFind, keyToCompare, controllerToUse, selectedSearch, label, setResultSearch, dispatch, action, returnCompleteModel}) => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (searchText) => {
        if(!searchText || searchText.length < 3) return;
        const fetchOptions = async() => {
            setLoading(true);
            const response = await api.genericos.filterAutocompleteOptions(modelToFind, searchText, keyToCompare);
            setOptions(response.data.docs);
            setLoading(false)
        }
        fetchOptions();
    } 

    const returnResults = async(items) => {

        const singleObject = async() => {
            return await api[controllerToUse].findById(items.value);
        }
        const collectionObject = async() => {
            return await api[controllerToUse].findMultipleIds(items.map(item => item.value));
        } 

        if(returnCompleteModel){
            if(setResultSearch)return setResultSearch((multiple) ? await collectionObject() : await singleObject());
            return dispatch({type: action, payload: (multiple) ? await collectionObject() : await singleObject()});
        }else{
            if(setResultSearch)return setResultSearch(items);
            return dispatch({type: action, payload: items});
        }
    }
    return (
        <Select
            id="generic_autocomplete"
            mode={(multiple) ? "tags" : null}
            showSearch={true}
            filterOption={(input) => options.map(option => option[keyToCompare].includes(input)[0])}
            labelInValue
            placeholder={label}
            loading={loading}
            onSearch={(e) => {handleSearch(e)}}
            onChange={(e) => {returnResults(e)}}
            style={{ width: '100%' }}
            defaultValue={(selectedSearch) ? (<Option key={selectedSearch[keyToCompare]}></Option>) : null}
        >
            {options.map(d => (<Option key={d._id}>{d[keyToCompare]}</Option>))}
        </Select>
    )
}

export default GenericAutocomplete;