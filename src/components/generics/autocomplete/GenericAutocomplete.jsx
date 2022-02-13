import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import api from '../../../services';

const GenericAutocomplete = ({modelToFind, keyToCompare, label, styles, setResultSearch, selectedSearch}) => {
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
    }, [search])

    return (
        <>
            <Autocomplete
                disablePortal
                id="generic_autocomplete"
                options={options}
                sx={styles}
                fullWidth={(styles['width']) ? false : true}
                renderInput={(params) => <TextField {...params} label={label} />}
                loading={loading}
                filterOptions={(options) => options}
                onInputChange={(e, val) => setSearch(val)}
                getOptionLabel={(options) => options[keyToCompare]}
                onChange={(e, val) => {
                    console.log(val);
                    setResultSearch(val)
                }}
                isOptionEqualToValue={(options) => options['_id']}
                noOptionsText="Sin resultados..."
                multiple={false}
                size="small"
                disableClearable
                value={(selectedSearch) ? selectedSearch : null}
            />
        </>
    )
}

export default GenericAutocomplete;