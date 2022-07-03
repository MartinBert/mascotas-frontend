import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import api from '../../../services';

const GenericAutocomplete = ({multiple, modelToFind, keyToCompare, label, setResultSearch, selectedSearch, dispatch, action, returnCompleteModel}) => {
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState(null);

    useEffect(() => {
        setLoading(true);
        if(!search || search.length < 3) return;
        const fetchOptions = async() => {
            const response = await api.genericos.filterAutocompleteOptions(modelToFind, search, keyToCompare);
            setOptions(response.data.docs);
            setLoading(false)
        }
        fetchOptions();
    }, 
    //eslint-disable-next-line
    [search])

    const returnResults = async(val) => {
        if(setResultSearch) return setResultSearch(val);
        if(returnCompleteModel){
            const controllerToUse = modelToFind + 's'
            const result = await api[controllerToUse].getById(val._id)
            return dispatch({type: action, payload: result})
        }else{
            return dispatch({type: action, payload: val})
        }
    }
    return (
        <Autocomplete
            disablePortal
            id="generic_autocomplete"
            options={options}
            sx={{backgroundColor: "#fff"}}
            fullWidth={true}
            height={20}
            renderInput={(params) => <TextField {...params} label={label}/>}
            loading={loading}
            filterOptions={(options) => options}
            onInputChange={(e, val) => setSearch(val)}
            getOptionLabel={(options) => options[keyToCompare]}
            onChange={(e, val) => {returnResults(val)}}
            isOptionEqualToValue={(options) => options['_id']}
            noOptionsText="Sin resultados..."
            multiple={multiple}
            size="small"
            disableClearable
            value={(selectedSearch) ? selectedSearch : null}
        />
    )
}

export default GenericAutocomplete;