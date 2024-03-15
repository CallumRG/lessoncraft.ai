import React, { useState, useEffect, useContext, useStyles } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, Avatar, Stack} from "@mui/material";
import Firebase from "../Firebase/firebase";
import axios from "axios";
import {API_URL} from '../../config';
import { tokens } from "../../theme";


const ProfilePage = (props) => {
    const firebase = new Firebase();
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const theme = useTheme();


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

            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const updatePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            await firebase.doPasswordUpdate(newPassword);
            setError('');
            // Handle password update success
        } catch (error) {
            setError(error.message);
            // Handle password update failure
        }
        
        // if(passwordOne !== passwordTwo) {
        //     setError("Passwords do not match");
        //     return;
        // }
        // // firebase context provides a method to change password
        // firebase
        //     .doPasswordUpdate(passwordOne)
        //     .then(() => {
        //         setPasswordOne('');
        //         setPasswordTwo('');
        //         setError(null);
        //         // Handle successful password change
        //     })
        //     .catch(error => {
        //         setError(error.message);
        //     });
        // event.preventDefault();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                p: 3,
                height: 'auto',
                maxWidth: 600,
                margin: 'auto',
                marginTop: theme.spacing(8),
            }}
        >
        <Avatar
            sx={{
                width: 120,
                height: 120,
                mb: 2,
            }}
            src="/broken-image.jpg" // your avatar image path
        />

        <Typography variant="h6">Profile Details</Typography>
            
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1"><strong>First Name:</strong> {userInfo.firstName}</Typography>
                <Typography variant="body1"><strong>Last Name:</strong> {userInfo.lastName}</Typography>
            </Box>

            <Typography variant="h6" sx={{ mt: 4 }}>Manage Account</Typography>
            <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                label="New Password"
                type="password"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button onClick={updatePassword}>Change My Password</Button>
            {error && <Typography color="error">{error}</Typography>}

    
    </Box>
    );
};

export default ProfilePage;
