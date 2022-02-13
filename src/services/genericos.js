import axios from 'axios';
const token = localStorage.getItem('token');
const headers = {headers: {Authorization: token}};
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear();
    }
}

const filterAutocompleteOptions = async(service, search, keyToCompare) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/genericos/genericAutocompleteFilter?model=${service}&search=${search}&keyToCompare=${keyToCompare}`, headers);
        return response.data;
    }catch(err){
        checkStorageStatus(err);
        console.error(err);
    }
}

const genericos = {
    filterAutocompleteOptions
}

export default genericos;