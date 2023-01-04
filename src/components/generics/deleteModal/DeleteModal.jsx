import React from 'react';
import { Modal} from 'antd';

const DeleteModal = ({deleteVisible, setDeleteVisible, deleteEntityIdConfirmation, setDeleteEntityId, setLoading, title}) => {
    const handleOk = () => {
        setDeleteEntityId(deleteEntityIdConfirmation);
        setDeleteVisible(false);
    }
    return (
    <Modal 
        title={title} 
        open={deleteVisible}
        onCancel={() => {
            setDeleteVisible(false);
            setLoading(true);
        }}
        onOk={() => {handleOk()}}
        width={800}
    >
     <h3>Esta acción eliminará el registro, ¿desea continuar?</h3>
    </Modal>
  )
}

export default DeleteModal;