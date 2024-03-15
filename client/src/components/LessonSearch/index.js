import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from "../../config";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { tokens } from "../../theme";

//component for searching for lessons and rendering the results
const LessonSearch = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  //states
  const [lessonID, setLessonID] = useState('');
  const [lessons, setLessons] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    title: '',
    description: '',
    citation: '',
    name: ''
  });

  
  {/* functions */}
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //fetches the lessons, filtering by inputted criteria
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/searchLessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
      });

      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons);
      } else {
        console.error('Failed to fetch lessons');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  //when using direct to lesson checks to see if correct format and naviagates
  const handleRedirect = () => {
    const lessonIDInt = parseInt(lessonID);
    if (Number.isInteger(lessonIDInt) && lessonIDInt > 0) {
      navigate(`/lesson/${lessonIDInt}`);
    } else {
      toast.error("Lesson ID must be positive integer.");
    }
  };

  //grab new data whenever changes are made to criteria
  useEffect(() => {
    fetchData();
  }, [searchCriteria]);

  return (
    <div>
      
      <Grid 
        container 
        spacing={2} 
        alignItems="center">

        {/* direct lesson input */}
        <Grid item xs={12}>
          <Typography variant="h4">Go To Lesson (Lesson ID)</Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Lesson ID"
            name="lessonid"
            value={lessonID}
            onChange={(e) => {setLessonID(e.target.value)}}
          />
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="secondary" onClick={handleRedirect}>Go</Button>
        </Grid>



        <Grid item xs={12}>
          <Typography variant="h4">Lesson Search</Typography>
        </Grid>

        {/* criteria input fields */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Lesson Name"
            name="title"
            value={searchCriteria.title}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={searchCriteria.description}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Citation"
            name="citation"
            value={searchCriteria.citation}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Creator"
            name="name"
            value={searchCriteria.name}
            onChange={handleInputChange}
          />
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
              </Box>
          </Link>
        ))
        ) : (
          <Typography variant="body1">No lessons found with given criteria.</Typography>
        )
      }
      </Box>
    </div>
  );
};

export default LessonSearch;