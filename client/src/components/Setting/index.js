import React, { useState, useEffect, useContext, useStyles } from 'react';
import {Box, TextField, Typography, Button, Avatar, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import Firebase from "../Firebase/firebase";
import { updatePassword, getAuth } from "firebase/auth";
import axios from "axios";
import {API_URL} from '../../config';
import { ColorModeContext, tokens } from "../../theme";
import { toast } from 'react-toastify';
import Loading from "../Loading";
import { useParams, Link } from 'react-router-dom';

const Setting = (props) => {
    const [email, setEmail] = useState('');
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
    const [profilePic, setProfilePic] = useState('');

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
                setEmail(response.data.email);
                setProfilePic(response.data.profile_pic_url);
                
                console.log(userInfo)
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    // handle profile pic
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleProfilePicUpload = async () => {
        // Retrieve user's Firebase UID
        const firebaseUID = props.user.uid;
        console.log(props.user)

        try {
            const response = await axios.post(`${API_URL}/updateUserProfilePic`, {
                firebase_uid: firebaseUID,
                profile_pic_url: inputProfilePic
            });
    
            if (response.data.success) {
                toast.success("Profile picture updated successfully.");
                setProfilePic(inputProfilePic); 
            } else {
                toast.error(response.data.error || "Failed to update profile picture.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the profile picture.");
            console.error("Error updating profile picture:", error.response || error.message);
        }
        
        handleClose();
    };

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
            height="750px"
            border={`2px solid ${colors.blueAccent[100]}`} 
            sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
        >
            {/* Name, Avatar and Upload Photo Section */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start', // Align items to the start
                    alignItems: 'center', 
                    width: '100%', 
                    px: 2,
                    py: 2 // Use py for padding on the top and bottom
                }} 
            >
                <Avatar
                    sx={{ width: 120, height: 120, mr: 2 }} // Add right margin to separate the avatar from the name
                    src={profilePic}
                />
                {userInfo.firstName && userInfo.lastName && (
                <Typography variant="h2" fontWeight='bold' sx={{ flexGrow: 1 }}>
                    {userInfo.firstName} {userInfo.lastName}
                </Typography>
                )}
                <Button variant="outlined" color="secondary" onClick={handleClickOpen} sx={{ ml: 'auto' }}> {/* Use ml: 'auto' to push the button to the end */}
                    Change Photo
                </Button>
            </Box>

            {/* Separator Line */}
            <Box
                sx={{
                    width: '98%',
                    height: '2px',
                    backgroundColor: colors.blueAccent[100],
                    my: 2
                }}
            />
            {/* Contact Information Section */}

            <Box sx={{ width: '100%', pb: 2, px: 2 }}>
                <Typography variant="h5" gutterBottom  fontWeight='bold' >
                    Contact Information
                </Typography>
                
                <TextField
                    disabled
                    label="First Name"
                    fullWidth
                    value={userInfo.firstName}
                    variant="outlined"
                    sx={{ mt: 2 }}
                />

                <TextField
                    disabled
                    label="Last Name"
                    fullWidth
                    value={userInfo.lastName}
                    variant="outlined"
                    sx={{ mt: 2 }}
                />
                <TextField
                    disabled
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    variant="outlined"
                    sx={{ mt: 2 }}
                />
            </Box>

            {/* Separator Line */}
            <Box
                sx={{
                    width: '98%',
                    height: '2px',
                    backgroundColor: colors.blueAccent[100],
                    my: 2
                }}
            />

            {/* Password Section */}
            <Box sx={{ width: '100%', px: 2, pb: 2}}>
                <form 
                    style={{ width: "100%" }}
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h5" gutterBottom fontWeight='bold'>
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

                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                            Update Password
                    </Button>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}     
                </form>                                                
            </Box>

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
    </Box>
  );
};

export default Setting;
