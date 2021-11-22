import Swal from 'sweetalert2'

export const errorAlert = async(message) => {
    return Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error'
    });
}

export const successAlert = async(message) => {
    return Swal.fire({
        icon: 'success',
        title: 'Exito!',
        text: message
    })
}