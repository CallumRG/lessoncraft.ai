import React, { useState, useEffect, useContext, useStyles } from 'react';
import {Box, TextField, Typography, Button, Avatar, IconButton, Stack, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Firebase from "../Firebase/firebase";
import { updatePassword, getAuth } from "firebase/auth";
import axios from "axios";
import {API_URL} from '../../config';
import { ColorModeContext, tokens } from "../../theme";
import { toast } from 'react-toastify';
import Loading from "../Loading";
import { useParams, Link } from 'react-router-dom';

const Setting = (props) => {
    //const [fullName, setFullName] = useState({ firstName: 'Bryan', lastName: 'Cranston' });
    const [email, setEmail] = useState('bryan.cranston@mail.com');

    const firebase = new Firebase();
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const [open, setOpen] = useState(false);
    const [inputProfilePic, setInputProfilePic] = useState('');
    const [profilePic, setProfilePic] = useState('/path-to-your-image.jpg');

    const makeUserFetchRequest = (firebaseId) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${API_URL}/getUserDetails`,
            headers: { 
                'Content-Type': 'application/json'
            },
            params : {
                firebase_uid: firebaseId
            }
        };
        return config;
    };

    const fetchUserDetails = async () => {
        if (props.user) {
            const userRequest = makeUserFetchRequest(props.user.uid);

            axios.request(userRequest)
            .then((response) => {
                console.log("user details response:", JSON.stringify(response.data));
                setUserInfo({ firstName: response.data.first_name, lastName: response.data.last_name });
                console.log(userInfo);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        if (props.user) {
            fetchUserDetails();
        }
    }, [props.user]);

    // handle profile pic
    // const handleProfilePicChange = (e) => {
    //     setProfilePic(e.target.value);
    // };

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleProfilePicUpload = () => {
        setProfilePic(inputProfilePic); // Set the profilePic state to the input value
        handleClose(); // Close the dialog
        // Here you can add logic to send the inputProfilePic to the backend, if needed
    };

//   // Handlers for changing state
//   // Add your own logic for these functions
//   const handleFullNameChange = (e) => {
//     setFullName({ ...fullName, [e.target.name]: e.target.value });
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   // For demonstration purposes, logging to console
//   const handleUpdateAccount = () => {
//     console.log(fullName, email);
//     // Here you'd typically call an API to update the account
//   };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
        toast.error("Passwords do not match.");
        setLoading(false);
        return;
        }

        try {
            await updatePassword(auth.currentUser, newPassword);
            toast.success("Password has been updated successfully.");
            // setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error) {
            console.error("Error updating password:", error.message);
            toast.error("Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom>
            Account Setting
        </Typography>

        <Box 
            borderRadius="50px"
            height="150px"
            border={`2px solid ${colors.blueAccent[100]}`} 
            sx={{ 
                my: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                px: 2,
            }} 
        >
            {userInfo.firstName && userInfo.lastName ? (
                <Box>
                <Typography variant="h5">{userInfo.firstName} {userInfo.lastName}</Typography>
                </Box>
            ) : (
                <Avatar
                sx={{ width: 120, height: 120, mb: 2, my:2}}
                src={profilePic}
                />
        )}

        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Change Photo
        </Button>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Upload Photo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the URL of the profile picture you wish to upload.
                    </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Image URL"
                            type="url"
                            fullWidth
                            value={inputProfilePic} // Use the inputProfilePic state here
                            onChange={(e) => setInputProfilePic(e.target.value)}
                        />                
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleProfilePicUpload} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
      </Box>

    {/* Temporary Not Using  */}
      {/* <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Full name
        </Typography>
        <Stack direction="row" spacing={2}>

        <TextField
            disabled
            label="First name"
            name="firstName"
            value={userInfo.firstName}
            //onChange={userInfo.firstName}
            variant="outlined"
        /> 
        <TextField
            disabled
            label="Last name"
            name="lastName"
            value={userInfo.lastName}
            //onChange={handleFullNameChange}
            variant="outlined"
        /> 
          
        </Stack>
      </Box> */}

      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Contact email
        </Typography>
        
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          //onChange={handleEmailChange}
          variant="outlined"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
            Password
        </Typography>
        <Typography variant="body2" gutterBottom>
            Change your password.
        </Typography>
        
        <TextField
            required
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            color="secondary"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
        />                              

        <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            color="secondary"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mt: 2 }}
        />                                                    
      </Box>

      <Button 
            variant="contained" 
            color="secondary" 
            type="submit"
        >
                Update Password
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}            

      <Button variant="contained" 
        // onClick={handleUpdateAccount}
    >
        Save Changes
      </Button>
    </Box>
  );
};

export default Setting;
