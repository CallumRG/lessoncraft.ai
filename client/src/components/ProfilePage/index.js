import React, { useState, useEffect, useContext, useStyles } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper, useTheme, Avatar, Stack} from "@mui/material";
import Firebase from "../Firebase/firebase";
import axios from "axios";
import {API_URL} from '../../config';
import { ColorModeContext, tokens } from "../../theme";


const ProfilePage = (props) => {
    const firebase = new Firebase();
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

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
    };

    return (
        <Paper elevation={3} sx={{ p: 4, margin: 'auto', maxWidth: 900, flexGrow: 1, backgroundColor: theme.palette.mode === "dark" ? colors.primary[200] : colors.primary[100]}}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                <Avatar
                        sx={{width: 120, height: 120, mb: 2,}}
                        src="/broken-image.jpg" // your avatar image path
                    />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h2">
                                {userInfo.firstName} {userInfo.lastName}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.blueAccent[100], boxShadow: 'none'}}>
                                Chat
                            </Button>
                            <Button variant="outlined" color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.blueAccent[100], boxShadow: 'none'}}>
                                Follow
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Section for Details and Manage Account */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <Typography variant="body1"><strong>First Name:</strong> {userInfo.firstName}</Typography>
                <Typography variant="body1"><strong>Last Name:</strong> {userInfo.lastName}</Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Manage Account</Typography>
                <TextField
                    label="Current Password"
                    color="secondary"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="secondary" onClick={updatePassword}>Update Password</Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
        </Paper>
    );
};

export default ProfilePage;
