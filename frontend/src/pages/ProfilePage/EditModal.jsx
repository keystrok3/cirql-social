import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react"
import EditProfile from "./EditProfile";


const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
};

const EditModal = ({ openModal, onModal }) => {

    const handleModal = () => {
        onModal()
    }

    return (
        <Modal
            open={openModal}
            onClose={handleModal}
        >
            <Box sx={style}>
                <EditProfile />
            </Box>
        </Modal>
    )
};

export default EditModal;