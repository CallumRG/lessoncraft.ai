import React, { useState, useEffect, useContext, useStyles } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, useTheme, Avatar, Stack} from "@mui/material";
import Firebase from "../Firebase/firebase";
import { updatePassword, getAuth } from "firebase/auth";
import axios from "axios";
import {API_URL} from '../../config';
import { ColorModeContext, tokens } from "../../theme";
import { toast } from 'react-toastify';
import Loading from "../Loading";

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
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const { username } = useParams(); 

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
    }, [username]);

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
        <>
        {!loading ? (
            
            <Grid 
                container 
                spacing={2} 
                alignItems="center"
                sx={{ paddingTop: 2, paddingLeft: 3 }}
            >
                <Grid item>
                <Avatar
                        sx={{width: 120, height: 120, mb: 2,}}
                        src="/broken-image.jpg" // your avatar image path
                    />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h2" sx={{fontWeight:'bold'}}>
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
            
            <Grid item xs={12}>
                <form 
                    style={{ width: "100%" }}
                    onSubmit={handleSubmit}
                >
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{fontWeight:'bold'}}>Details</Typography>
                        <Typography variant="body1"><strong>First Name:</strong> {userInfo.firstName}</Typography>
                        <Typography variant="body1"><strong>Last Name:</strong> {userInfo.lastName}</Typography>


                    </Box>
            </form>
            </Grid>
            </Grid>

             ) : (
                <Loading />
            )}
        </>
    );
};

export default ProfilePage;

