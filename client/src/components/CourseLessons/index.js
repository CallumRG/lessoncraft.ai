import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../../config";
import Firebase from '../Firebase/firebase';
import { toast } from 'react-toastify';
import { tokens } from "../../theme";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseLessons = () => {
    //set states and stuff
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const firebase = new Firebase();
    const navigate = useNavigate();
    const { course_id } = useParams();
    const [lessons, setLessons] = useState([]);
    const [lesson_id, setLesson_id] = useState(0);


    useEffect(() => {
        // fetch administrators from the server when the component mounts
        fetchCourseLessons();
    }, [course_id]);

    //grabs administrators
    const fetchCourseLessons = async () => {
        try {
            const response = await fetch(`${API_URL}/courseFetchLessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course_id }),
            });

            if (response.ok) {
                const data = await response.json();
                //console.log(data)
                setLessons(data.courses)

            } else {
                console.error('Error fetching course lessons:', response.statusText);
                toast.error('Error fetching course lessons');
            }

        } catch (error) {
            console.error('Error fetching course lessons:', error);
            toast.error('Error fetching course lessons');
        }
    };

    const addNewCourseLesson = async () => {
      try {
        const lesson_idINT = parseInt(lesson_id);
        if (!Number.isInteger(lesson_idINT) || lesson_idINT <= 0) {
            console.error('Invalid lesson_id:', lesson_idINT);
            toast.error('Invalid lesson_id. Please provide a positive integer lesson_id.');
            return;
        }

        const response = await fetch(`${API_URL}/addNewCourseLesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                course_id, 
                lesson_id,
                current_id: firebase.auth.currentUser.uid
            }),
        });

        if (response.ok) {
          setLesson_id(0)
          fetchCourseLessons()

        } else {
          console.error('Error adding course lesson:', response.statusText);
          toast.error('Error adding course lesson');

        }

      } catch (error) {
        console.error('Error adding course lesson:', error);
        toast.error('Error adding course lesson:');
      }
    };

    const deleteCourseLesson = async () => {
      try {
        const lesson_idINT = parseInt(lesson_id);
        if (!Number.isInteger(lesson_idINT) || lesson_idINT <= 0) {
            console.error('Invalid lesson_id:', lesson_idINT);
            toast.error('Invalid lesson_id. Please provide a positive integer lesson_id.');
            return;
        }

        const response = await fetch(`${API_URL}/deleteCourseLesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                course_id, 
                lesson_id,
                current_id: firebase.auth.currentUser.uid
            }),
        });

        if (response.ok) {
          setLesson_id(0)
          fetchCourseLessons()

        } else {
          console.error('Error deleting course lesson:', response.statusText);
          toast.error('Error deleting course lesson');

        }

      } catch (error) {
        console.error('Error deleting course lesson:', error);
        toast.error('Error deleting course lesson:');
      }
    };

    
    return (
      <div>
        {/* text field for inputting lesson_id and buttons for deleting and adding */}
        <Grid 
        container 
        spacing={2} 
        alignItems="center">
          <Grid item xs={12}>
            <Typography align="center">Add/Remove Course Lessons (Course Owner/Admins Only)</Typography>
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <TextField
              label="Lesson ID"
              variant="outlined"
              value={lesson_id}
              onChange={(e) => setLesson_id(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={addNewCourseLesson}>
              Add
            </Button>
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={deleteCourseLesson}>
              Delete
            </Button>
          </Grid>

          <Grid item xs={12}>
            <hr></hr>
          </Grid>

        </Grid>

          {/* renders the lessons as boxes clickable to redirect to pages*/}
        <Box mt={2}>
          {lessons.length > 0 ? (lessons.map((lesson) => (
            <Link to={`/lesson/${lesson.id}`} key={lesson.id} style={{ textDecoration: 'none', color: 'inherit', }}>
                <Box border={1} p={2} borderRadius={4} mb={2}>
                  <Typography variant="h3" sx={{textDecoration: 'underline'}}>{lesson.title}</Typography>
                  <Typography variant="h6" display="inline">Lesson Creator: </Typography>
                  <Typography variant="caption" display="inline">{lesson.name}</Typography>
                  <br></br>
                  <Typography variant="h6" display="inline">Citation: </Typography>
                  <Typography variant="caption" display="inline">{lesson.citation}</Typography>
                  <hr></hr>
                  <Typography paragraph={true} variant="body1">{lesson.description}</Typography>
                  <Typography variant="h6" display="inline">Date/Time Added To Course: </Typography>
                  <Typography variant="caption" display="inline">{lesson.date_added}</Typography>
                </Box>
            </Link>
          ))
          ) : (
            <Typography variant="body1">No lessons found within classroom.</Typography>
          )
        }
        </Box>
      </div>
    );
};
export default CourseLessons;

