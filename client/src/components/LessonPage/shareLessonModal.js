import React, { useState } from "react";
import { Modal, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const SharingModal = ({ open, onClose, lessonId, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleRecipientChange = (e) => {
    setRecipientEmail(e.target.value);
  };

  const shareLesson = async () => {
    try {
      const response = await axios.post(`${API_URL}/share`, {
        lesson_id: lessonId,
        sender_id: user.id,
        recipient_email: recipientEmail
      });

      if (response.status === 200) {
        toast.success("Lesson shared successfully");
        onClose();
      } else {
        toast.error("Failed to share lesson");
      }
    } catch (error) {
        if(error.response.status === 400){
            toast.error("This share already exists.");
        }
        else{
            console.error("Error sharing lesson:", error);
            toast.error("An error occurred while sharing lesson");
        }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: colors.primary[100], padding: "20px", width: "400px", maxWidth: "80%", maxHeight: "80vh", overflowY: "auto", border: `5px solid ${colors.blueAccent[100]}`}}>
        <Typography variant="h4" gutterBottom color={colors.blueAccent[100]}>
            Share Lesson
        </Typography>

        <TextField
          label="Recipient's Email"
          value={recipientEmail}
          onChange={handleRecipientChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ sx: { color: colors.blueAccent[100] } }}
        />

        <Button onClick={shareLesson} variant="contained" color="secondary" style={{ marginTop: "20px", color: 'white', boxShadow: 'none', borderRadius: 25}} size='large'>
            Share
        </Button>
      </div>
    </Modal>
  );
};

export default SharingModal;
