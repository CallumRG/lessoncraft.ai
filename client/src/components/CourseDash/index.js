import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { Grid, Typography, Box, useTheme } from '@mui/material';
import Firebase from '../Firebase/firebase';
import { API_URL } from '../../config';
import { useLocation, Link } from 'react-router-dom';

function CourseDash(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const location = useLocation();
    const firebase = new Firebase();

    //grabs courses based on which path was chosen
    const fetchMyCourses = async () => {
        try {
            if (props.user?.id) {
                let endpoint = '';
                let response;
                if (location.pathname === "/coursedash/byme") {
                    setTitle('My Courses');
                    endpoint = "/coursedash/byme";
                    response = await axios.post(`${API_URL}${endpoint}`, { user_id: firebase.auth.currentUser.uid });
                } else if (location.pathname === "/coursedash/enrolled") {
                    setTitle('Enrolled Courses');
                    endpoint = "/coursedash/enrolled";
                    response = await axios.post(`${API_URL}${endpoint}`, { user_id: firebase.auth.currentUser.uid });
                }
                console.log(response)
                setCourses(response.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    //re fetches with location change
    useEffect(() => {
        fetchMyCourses();
    }, [location]);

    return (
        
        <div style={{ width: "80%", margin: "0 auto", marginTop: "50px" }}>
        {/* renders fetched courses to be seen by user*/}
          <Typography variant="h2" style={{ textAlign: 'left', marginTop: 100, marginBottom: '50px', borderBottom: `1px solid ${colors.blueAccent[100]}`, paddingBottom: 10}}>{title}</Typography>
          <Grid container spacing={2} alignItems="center" style={{width: "100%", margin: "auto", }}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={6} key={course.id}>
                <Link to={`/course/${course.id}`} key={course.id} style={{ textDecoration: 'none', color: 'inherit', }}>
                    <Box border={1} p={2} borderRadius={4} mb={2}>
                        <Typography variant="h3" sx={{textDecoration: 'underline'}}>{course.course_name}</Typography>
                        <Typography variant="h6" display="inline">Course Instructor: </Typography>
                        <Typography variant="caption" display="inline">{course.instructor}</Typography>
                        <br></br>
                        <Typography variant="h6" display="inline">Subjects: </Typography>
                        <Typography variant="caption" display="inline">{course.subjects}</Typography>
                        <hr></hr>
                        <Typography paragraph={true} variant="body1">{course.description}</Typography>
                    </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
      );
      
}

export default CourseDash;