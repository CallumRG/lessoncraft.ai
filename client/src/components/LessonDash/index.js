import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { Grid, Typography, Box, useTheme } from '@mui/material';
import { API_URL } from '../../config';
import { useLocation, Link } from 'react-router-dom';

function LessonDash(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [lessons, setLessons] = useState([]);
    const [title, setTitle] = useState('');
    const location = useLocation();

    const fetchMyLessons = async () => {
        try {
            if (props.user?.id) {
                let endpoint = '';
                let response;
                if (location.pathname === '/lessondash/byme') {
                    setTitle('My Lessons');
                    endpoint = '/lessons/byme';
                    response = await axios.post(`${API_URL}${endpoint}`, { user_id: props.user.id });
                } else if (location.pathname === '/lessondash/liked') {
                    setTitle('Starred Lessons');
                    endpoint = '/lessons/liked';
                    response = await axios.post(`${API_URL}${endpoint}`, { user_id: props.user.id });
                } else if(location.pathname === '/lessondash/sharedwithme'){
                    setTitle('Shared with Me');
                    endpoint = '/lessons/sharedwithme';
                    response = await axios.post(`${API_URL}${endpoint}`, { email: props.user.email });
                } else if(location.pathname === '/lessondash/recentlyviewed'){
                    setTitle('Recently Viewed Lessons');
                    endpoint = '/lessons/recentlyviewed';
                    response = await axios.post(`${API_URL}${endpoint}`, { user_id: props.user.id });
                }
                console.log(response)
                setLessons(response.data);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    useEffect(() => {
        fetchMyLessons();
    }, [location]);

    return (
        <div style={{ width: "80%", margin: "0 auto", marginTop: "50px" }}>
          <Typography variant="h2" style={{ textAlign: 'left', marginTop: 100, marginBottom: '50px', borderBottom: `1px solid ${colors.blueAccent[100]}`, paddingBottom: 10}}>{title}</Typography>
          <Grid container spacing={2} alignItems="center" style={{width: "100%", margin: "auto", }}>
            {lessons.map((lesson) => (
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
            ))}
          </Grid>
        </div>
      );
      
}

export default LessonDash;