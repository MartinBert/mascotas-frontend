import React from 'react';
import { Modal} from 'antd';

const DeleteModal = ({deleteVisible, setDeleteVisible, deleteEntityIdConfirmation, setDeleteEntityId, setLoading}) => {
    const handleOk = () => {
        setDeleteEntityId(deleteEntityIdConfirmation);
        setDeleteVisible(false);
    }
    return (
    <Modal 
        title="Eliminar condicion fiscal" 
        visible={deleteVisible}
        onCancel={() => {
            setDeleteVisible(false);
            setLoading(true);
        }}
        onOk={() => {handleOk()}}
        width={800}
    >
     <h3>Esta acción eliminará la condicion fiscal, ¿desea continuar?</h3>
    </Modal>
  )
}

export default DeleteModal;