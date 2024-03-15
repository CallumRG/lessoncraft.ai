import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from "../../config";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { tokens } from "../../theme";

//component for searching for courses and rendering the results
const CourseSearch = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  //states
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({
    course: '',
    description: '',
    subject: '',
    instructor: ''
  });

  
  {/* functions */}
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //fetches the courses, filtering by inputted criteria
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/searchCourses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

    //when using direct to course checks to see if correct format and naviagates
  const handleRedirect = () => {
    const courseIDInt = parseInt(courseID);
    if (Number.isInteger(courseIDInt) && courseIDInt > 0) {
      navigate(`/course/${courseIDInt}`);
    } else {
      toast.error("Course ID must be positive integer.");
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

        {/* direct course input */}
        <Grid item xs={12}>
          <Typography variant="h4">Go To Course (Course ID)</Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Course ID"
            name="courseID"
            value={courseID}
            onChange={(e) => {setCourseID(e.target.value)}}
          />
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="secondary" onClick={handleRedirect}>Go</Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4">Course Search</Typography>
        </Grid>
        
        {/* criteria input fields */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Course Name"
            name="course"
            value={searchCriteria.course}
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
            label="Subject"
            name="subject"
            value={searchCriteria.subject}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Instructor"
            name="instructor"
            value={searchCriteria.instructor}
            onChange={handleInputChange}
          />
        </Grid>

      </Grid>

      {/* renders the courses as boxes clickable to redirect to pages*/}
      <Box mt={2}>
        {courses.length > 0 ? (courses.map((course) => (
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
        ))
        ) : (
          <Typography variant="body1">No courses found with given criteria.</Typography>
        )
        }
      </Box>

      
    </div>
  );
};

export default CourseSearch;