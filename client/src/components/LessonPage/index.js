import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {API_URL} from '../../config';

const LessonPage = () => {
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
    <div>
      <h1>{title}</h1>
      <p>{description}</p>

      {lessonSections &&
        lessonSections.map((section) => (
          <div key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))
      }

      {lessonPracticeQuestions &&
        lessonPracticeQuestions.map((question) => (
          <div key={question.id}>
            <h2>{question.question}</h2>
            <p>{question.option_a}</p>
            <p>{question.option_b}</p>
            <p>{question.option_c}</p>
            <p>{question.option_d}</p>
            <p>{question.answer}</p>
          </div>
        ))
      }
    </div>
  );
};

export default LessonPage;