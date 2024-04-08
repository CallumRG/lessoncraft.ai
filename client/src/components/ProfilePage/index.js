import React, { useState, useEffect, useContext, useStyles } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, useTheme, Avatar,} from "@mui/material";
import Firebase from "../Firebase/firebase";
import { updatePassword, getAuth } from "firebase/auth";
import axios from "axios";
import {API_URL} from '../../config';
import { ColorModeContext, tokens } from "../../theme";
import { toast } from 'react-toastify';
import Loading from "../Loading";
// import LessonCard from '../components/LessonCard';

const ProfilePage = (props) => {
    const firebase = new Firebase();
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [error, setError] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const { username } = useParams(); 
    const [profilePic, setProfilePic] = useState('');
    const [open, setOpen] = useState(false);
    const [inputProfilePic, setInputProfilePic] = useState('');
    const [recentlyViewedLessons, setRecentlyViewedLessons] = useState([]);

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
                setProfilePic(response.data.profile_pic_url);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    const fetchRecentlyViewedLessons = async () => {
        try {
            const response = await axios.post(`${API_URL}/lessons/recentlyviewed`, { user_id: props.user.id });
            setRecentlyViewedLessons(response.data);
        } catch (error) {
            console.error('Error fetching recently viewed lessons:', error);
        }
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
            
        };
    

    useEffect(() => {
        fetchUserDetails();
        fetchRecentlyViewedLessons();
    }, []);


    return (
        <Box sx={{ flexGrow: 1, margin: 3 }}>
            {!loading ? (
                <Box sx={{ position: 'relative'}}>
                    <img 
                        src="https://www.pixground.com/wp-content/uploads/2023/08/Purple-Abstract-Layers-AI-Generated-4K-Wallpaper-1024x576.webp" 
                        alt="Background"
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                    <Avatar
                        src={profilePic}
                        sx={{ 
                            width: 220, 
                            height: 220, 
                            position: 'absolute', 
                            top: '105%', 
                            left: '3%', 
                            transform: 'translateY(-50%)',
                            border: '4px solid white',
                        }}
                    />
                    <Box sx={{ position: 'absolute', top: '100%', width: '100%', }}>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={8} sm={6} md={4} rg={3} sx={{ position: 'relative', right: '11%' }}>
                            {/* The relative position and left offset will push the item to the right */}
                            <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
                                {userInfo.firstName} {userInfo.lastName}
                            </Typography>
                            <Button 
                                variant="contained" 
                                sx={{ mt: 2, borderRadius: 20, bgcolor: 'secondary.main' }}
                                onClick={() => toast.success('You had successfully followed the user')}
                            >
                                Follow
                            </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* <Typography variant="h4" sx={{ mt: 4 }}>
                        Recently Viewed Lessons
                    </Typography>
                    <Grid container spacing={2}>
                        {recentlyViewedLessons.map((lesson) => (
                            <LessonCard key={lesson.id} lesson={lesson} />
                        ))}
                    </Grid> */}
                </Box>
            ) : (
                <Loading />
            )}
        </Box>
    );
};

export default ProfilePage;

