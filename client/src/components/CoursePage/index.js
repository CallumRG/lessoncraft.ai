import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from "../../config";
import { toast } from 'react-toastify'
import LessonPage from '../LessonPage';
import DiscussionPage from '../DiscussionPage';
import ClassListPage from '../ClassListPage';
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { tokens } from "../../theme";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import GroupsIcon from '@mui/icons-material/Groups';


const CoursePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //states
  const { course_id } = useParams();
  const [activeSection, setActiveSection] = useState('lesson');
  const [courseInfo, setCourseInfo] = useState(null);
  const [courseNotFound, setCourseNotFound] = useState(false);

  // fetch course details when the component starts
  useEffect(() => {
      
      const fetchCourseInfo = async () => {
          try {
              const response = await fetch(`${API_URL}/courseInfo`, {
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ course_id }),
              });
      
              if (response.ok) {
                  const data = await response.json();
                  setCourseInfo(data.courseInfo);
              } else if (response.status === 404) {
                  // Course not found
                  setCourseNotFound(true);
              } else {
                  console.error('Error fetching course info:', response.statusText);
                  toast.error('Error fetching course info');
              }
              } catch (error) {
              console.error('Error fetching course info:', error);
              toast.error('Error fetching course info');
              }
  };

      fetchCourseInfo();
  }, [course_id]);

  const handleSectionChange = (section) => {
      setActiveSection(section);
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      style={{width: "90%", margin: "auto", }}
      
    >             
      {courseNotFound ? (
        <Grid item xs={12} variant = 'outlined' >
          <Typography variant = "body1" align="center">{`Course with ID ${course_id} not found.`}</Typography>
        </Grid>
      ) : courseInfo ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">{`Course Page: ${courseInfo.course_name}`}</Typography>
          </Grid>

          {/* renders course information */}
          <Grid item xs={3} >
            <Typography align="center">{`Course ID: ${courseInfo.id}`}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography align="center">{`Instructor: ${courseInfo.first_name} ${courseInfo.last_name}`}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography align="center">{`Email: ${courseInfo.email}`}</Typography>
          </Grid>

          <Grid item xs={3} style={{ textAlign: 'center' }}>
            <Link to={`/course/${course_id}/admin`}>
              <Button startIcon={<AdminPanelSettingsIcon />} variant="contained" color="primary">Admin Settings</Button>
            </Link>
          </Grid>

          {/* navigation buttons */}
          <Grid item xs={12}>
            <hr></hr>
          </Grid>

          <Grid item xs={4} container justifyContent="right">
            <Button startIcon={<SchoolIcon />} variant="contained" color="secondary" onClick={() => handleSectionChange('lesson')}>Lesson Page</Button>
          </Grid>

          <Grid item xs={4} container justifyContent="center">
            <Button startIcon={<QuestionAnswerIcon />} variant="contained" color="secondary" onClick={() => handleSectionChange('discussion')}>Discussion Page</Button>
          </Grid>

          <Grid item xs={4} container justifyContent="left">
            <Button startIcon={<GroupsIcon />} variant="contained" color="secondary" onClick={() => handleSectionChange('classlist')}>Class List Page</Button>
          </Grid>

          <Grid item xs={12}>
            <hr></hr>
          </Grid>

          {/* render selection*/}
          <Grid item xs={12}>
            {activeSection === 'lesson' && <LessonPage />}
            {activeSection === 'discussion' && <DiscussionPage />}
            {activeSection === 'classlist' && <ClassListPage />}
          </Grid>
        </>
      ) : (
        <Typography align="center">Loading course information...</Typography>
      )}
    
    </Grid>
    );
  };

export default CoursePage;
