import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { Grid, Typography, Box, useTheme } from '@mui/material';
import { API_URL } from '../../config';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function LessonDash(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [lessons, setLessons] = useState([]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const fetchMyLessons = async () => {
        try {
            if (props.user?.id) {
                let endpoint = '';
                if (location.pathname === '/lessondash/byme') {
                    setTitle('My Lessons');
                    endpoint = '/lessons/byme';
                } else if (location.pathname === '/lessondash/liked') {
                    setTitle('Starred Lessons');
                    endpoint = '/lessons/liked';
                }
                const response = await axios.post(`${API_URL}${endpoint}`, { user_id: props.user.id });
                setLessons(response.data);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    useEffect(() => {
        fetchMyLessons();
    }, [location]);

    const handleLessonClick = (lessonId) => {
        navigate(`/lesson/${lessonId}`);
    };

    return (
        <div style={{ width: "80%", margin: "0 auto", marginTop: "50px", textAlign: 'center' }}> {/* Center the content horizontally */}
            <Typography variant="h2" style={{ textAlign: 'left', marginTop: 100, marginBottom: '50px', borderBottom: `1px solid ${colors.blueAccent[100]}`, paddingBottom: 10}}>{title}</Typography>
            <Grid container spacing={2} style={{marginTop: 50}}>
                {lessons.map((lesson) => (
                    <Link to={`/lesson/${lesson.id}`} key={lesson.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box border={1} p={2} borderRadius={4} mb={2}>
                        <Typography variant="h3" sx={{ textDecoration: 'underline' }}>{lesson.title}</Typography>
                        <Typography variant="h6" display="inline">Lesson Creator: </Typography>
                        <Typography variant="caption" display="inline">{lesson.name}</Typography>
                        <br></br>
                        <Typography variant="h6" display="inline">Citation: </Typography>
                        <Typography variant="caption" display="inline">{lesson.citation}</Typography>
                        <hr></hr>
                        <Typography paragraph={true} variant="body1">{lesson.description}</Typography>
                    </Box>
                    </Link>
                ))}
            </Grid>
        </div>
    );
}

export default LessonDash;