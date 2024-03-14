import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import { API_URL } from '../../config';
import { useNavigate, useLocation } from 'react-router-dom';

function LessonDash(props) {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchMyLessons = async () => {
        try {
            if (props.user?.id) {
                let endpoint = '';
                if (location.pathname === '/lessondash/byme') {
                    endpoint = '/lessons/byme';
                } else if (location.pathname === '/lessondash/liked') {
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
        <div>
            <Typography variant="h2">Lessons Dashboard</Typography>
            <Grid container spacing={2}>
                {lessons.map((lesson) => (
                <Grid item key={lesson.id} xs={12} sm={6} md={4} lg={3} onClick={() => handleLessonClick(lesson.id)} style={{ cursor: 'pointer' }}>
                    <Typography variant="subtitle1">{lesson.title}</Typography>
                </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default LessonDash;
