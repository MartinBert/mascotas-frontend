import React from 'react';
import { Modal} from 'antd';

const DeleteModal = ({deleteVisible, setDeleteVisible, deleteEntityIdConfirmation, setDeleteEntityId, setLoading}) => {
    const handleOk = () => {
        setDeleteEntityId(deleteEntityIdConfirmation);
        setDeleteVisible(false);
    }
    return (
    <Modal 
        title="Eliminar usuario" 
        visible={deleteVisible}
        onCancel={() => {
            setDeleteVisible(false);
            setLoading(true);
        }}
        onOk={() => {handleOk()}}
        width={800}
    >
     <h3>Esta acción eliminará este usuario de forma permanente, ¿desea continuar?</h3>
    </Modal>
  )
}

export default DeleteModal;