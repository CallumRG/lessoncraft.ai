import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../../config";
import Firebase from '../Firebase/firebase';
import { toast } from 'react-toastify';
import { tokens } from "../../theme";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseAdmin = () => {
  //set states and stuff
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const firebase = new Firebase();
  const navigate = useNavigate();
  const { course_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [new_message, setNew_message] = useState('');


  useEffect(() => {
      // fetch administrators from the server when the component mounts
      FetchMessages();
  }, [course_id]);

  //grabs messages
  const FetchMessages = async () => {
      try {
          const response = await fetch(`${API_URL}/courseFetchMessage`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ course_id }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data)
            setMessages(data.messages)

          } else {
              console.error('Error fetching course messages:', response.statusText);
              toast.error('Error fetching course messages');
          }
      } catch (error) {
          console.error('Error fetching course messages:', error);
          toast.error('Error fetching course messages');
      }
  };

  const AddMessage = async () => {
    try {
        const response = await fetch(`${API_URL}/courseAddMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              course_id,
              user_id : firebase.auth.currentUser.uid,
              message_content : new_message
            }),
        });

        if (response.ok) {
          FetchMessages();
          setNew_message('');

        } else if (response.status === 400) {
          toast.error('Message content cannot be empty.');

        } 
        else if (response.status === 401) {
          toast.error('User must be in classroom.');

        } else {
            console.error('Error adding course message:', response.statusText);
            toast.error('Error fetching course message');
        }
    } catch (error) {
        console.error('Error adding course message:', error);
        toast.error('Error adding course message');
    }
  };

  return (
    <Grid container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ height: "80vh", width: "90%", margin: "auto" }}>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Enter your message"
          variant="outlined"
          value={new_message}
          onChange={(e) => setNew_message(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Button 
          fullWidth
          variant="contained" 
          color="primary"
          onClick={AddMessage}
        >
          Submit
        </Button>
      </Grid>

      {messages.length > 0 ? (
        messages.map((message, index) => (
          <Grid item xs={12} key={index}>
            <Box p={2} border={1} borderRadius={8} borderColor="grey.400">
              <Typography variant="body1" gutterBottom>
                <strong>{message.name}</strong>: {message.message_content}
              </Typography>
              <Typography variant="body2" gutterBottom>
                ({message.timestamp})
              </Typography>
            </Box>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="body1">No messages found within classroom.</Typography>
        </Grid>
      )}

    </Grid>
  );
};

export default CourseAdmin;
