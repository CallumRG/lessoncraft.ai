import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import axios from "axios";
import {API_URL} from '../../config';
import PracticeQuestion from "./practiceQuestion";

const LessonPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { lesson_id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonSections, setLessonSections] = useState(null);
  const [lessonPracticeQuestions, setLessonPracticeQuestions] = useState(null);

  const makeLessonReq = (url) => {
    let data = JSON.stringify({
      "lesson_id": lesson_id
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    return config;
  }

  const fetchLessonDetails = async () => {
    const lessonDetailsReq = makeLessonReq(`${API_URL}/lesson`)
    axios.request(lessonDetailsReq)
    .then((response) => {
      setTitle(response.data.lesson[0].title);
      setDescription(response.data.lesson[0].description);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const fetchLessonSections = () => {
    const lessonSectionsReq = makeLessonReq(`${API_URL}/lessonSections`);
    axios.request(lessonSectionsReq)
    .then((response) => {
      setLessonSections(response.data.lesson);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const fetchLessonPracticeQuestions = () => {
    const practiceQuestionsReq = makeLessonReq(`${API_URL}/lessonPracticeQuestions`);
    axios.request(practiceQuestionsReq)
    .then((response) => {
      console.log(response.data.lesson);
      setLessonPracticeQuestions(response.data.lesson);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    fetchLessonDetails();
    fetchLessonSections();
    fetchLessonPracticeQuestions();
  }, []);

  return (
    <Grid container style={{ maxWidth: '80%', margin: 'auto' }} spacing={4}>
      <Grid item xs={12}>
        <div style={{borderBottom: `1px solid ${colors.blueAccent[100]}`, marginBottom: '40px'}}>
          <Typography variant="h1" style={{ paddingTop: '10px', marginBottom: '10px' }}>
            {title.toUpperCase()}
          </Typography>
        </div>
        <Typography variant="body1" style={{ marginBottom: '40px', fontSize: '18px', lineHeight: '2.5', textIndent: '30px' }}>
          {description}
        </Typography>
      </Grid>

      {lessonSections &&
        lessonSections.map((section) => (
          <Grid item key={section.id} xs={12} style={{ marginBottom: '40px', fontSize: '18px' }}>
            <div style={{borderBottom: `1px solid ${colors.blueAccent[100]}`, marginBottom: '40px'}}>
              <Typography variant="h2" style={{marginBottom: '10px', fontWeight: 'bold'}}>
                {section.title}
              </Typography>
            </div>
            <Typography variant="body1" style={{ lineHeight: '2.5', fontSize: '18px', textIndent: '30px' }}>
              {section.body}
            </Typography>
          </Grid>
        ))}

      <Grid item xs={12} style={{ marginBottom: '40px', fontSize: '18px' }}>
        <div style={{borderBottom: `1px solid ${colors.blueAccent[100]}`, marginBottom: '40px'}}>
          <Typography variant="h2" style={{marginBottom: '10px', fontWeight: 'bold'}}>
            Practice Questions
          </Typography>
        </div>
        {lessonPracticeQuestions &&
          lessonPracticeQuestions.map((question) => (
            <PracticeQuestion key={question.id} question={question} />
          ))
        }
      </Grid>
    </Grid>
  );
};

export default LessonPage;