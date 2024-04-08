import React, { useState, useEffect, useContext, useStyles } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, useTheme, Avatar,} from "@mui/material";
import Firebase from "../Firebase/firebase";
import { updatePassword, getAuth } from "firebase/auth";
import axios from "axios";
import {API_URL} from '../../config';
import { ColorModeContext, tokens } from "../../theme";
import { toast } from 'react-toastify';
import Loading from "../Loading";
import LessonDash from '../LessonDash';

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
    const [lessons, setLessons] = useState([]);
    const [title, setTitle] = useState('');
    const location = useLocation();

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

    // Function to fetch lessons created by the user
    const fetchCreatedLessons = async () => {
        try {
            if (props.user?.id) {
                let endpoint = '';
                let response; // Define response here so it's accessible in the entire function scope

                if (location.pathname === '/lessondash/byme') {
                    setTitle('My Lessons');
                    endpoint = '/lessons/byme';
                    response = await axios.post(`${API_URL}${endpoint}`, { user_id: props.user.id });

                    console.log(response); // Moved inside the if block
                    setLessons(response.data); // Moved inside the if block
                }
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
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
        fetchCreatedLessons();
    }, [location]);

    if (loading) {
        return <Loading />;
    }

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

                     {/* Separator Line
                    <Box
                        sx={{
                            width: '98%',
                            height: '2px',
                            backgroundColor: colors.blueAccent[100],
                            my: 4
                        }}
                    />
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                            Recently Created Lessons
                        </Typography>

                        <Grid container spacing={2}>
                            {lessons.map((lesson) => (
                                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                                    <Typography variant="h2" style={{ textAlign: 'left', marginTop: 100, marginBottom: '50px', borderBottom: `1px solid ${colors.blueAccent[100]}`, paddingBottom: 10}}>{title}</Typography>
                                    <Grid container spacing={2} alignItems="center" style={{width: "100%", margin: "auto", }}>
                                        <Grid item xs={12} sm={6} md={6} key={lesson.id}>
                                            <Link to={`/lesson/${lesson.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Box border={`2px solid ${colors.blueAccent[100]}`} p={2} borderRadius={4} mb={2}>

                                                <Typography variant="h3" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 20}}>{lesson.title}</Typography>

                                                {title === 'Shared with Me' &&
                                                    <div>
                                                        <Typography variant="h6" display="inline">Shared by: </Typography>
                                                        <Typography variant="h6" display="inline" color={colors.blueAccent[100]}>{lesson.sender_email}</Typography>
                                                    </div>
                                                }

                                                <Typography variant="h6" display="inline">Author: </Typography>
                                                <Typography variant="h6" display="inline">{lesson.name}</Typography>

                                                <Typography variant="body1" style={{ marginTop: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lesson.description}</Typography>
                                            </Box>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid> */}
                    </Box>
                // </Box>
            ) : (
                <Loading />
            )}
        </Box>
    );
};

export default ProfilePage;

