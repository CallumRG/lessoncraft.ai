import React, { useState, useEffect, useContext, useStyles } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, useTheme, Avatar, Stack, Card, CardContent} from "@mui/material";
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

    return(
        <Card sx={{ maxWidth: 345, mx: 'auto', mt: 5, borderRadius: 5 }}>
        <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                <Avatar
                    alt={`${userInfo.firstName} ${userInfo.lastName}`}
                    src={userInfo.avatar}
                    sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography gutterBottom variant="h4" component="div">
                    {`${userInfo.firstName} ${userInfo.lastName}`}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {userInfo.location}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                    {userInfo.occupation}
                </Typography>
            </Box>

            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{userInfo.friendsCount}</Typography>
                    <Typography variant="caption">Friends</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{userInfo.photosCount}</Typography>
                    <Typography variant="caption">Photos</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{userInfo.commentsCount}</Typography>
                    <Typography variant="caption">Comments</Typography>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                <Button variant="contained" sx={{ borderRadius: 20, mr: 1 }}>
                    Connect
                </Button>
                <Button variant="contained" sx={{ borderRadius: 20, ml: 1 }}>
                    Message
                </Button>
            </Box>

            <Button fullWidth variant="contained" sx={{ borderRadius: 20 }}>
                Show more
            </Button>
        </CardContent>
    </Card>
    );
};

export default ProfilePage;

