const validateDeletion = (confirmDeletion, entityID) => {
    if (
        confirmDeletion === false
        || entityID === null
    ) return 'FAIL'
    return 'OK'
}

const deleteModal = {
    validateDeletion
}

export default deleteModal