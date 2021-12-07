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
        title: 'Éxito!',
        text: message
    })
}

export const questionAlert = async(message) => {
    return Swal.fire({
        icon: 'info',
        title: 'Atención!',
        text: message,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    })
}