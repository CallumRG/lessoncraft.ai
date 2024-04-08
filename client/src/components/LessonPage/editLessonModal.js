import React, { useState, useEffect } from "react";
import { Modal, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { toast } from 'react-toastify';
import axios from "axios";
import {API_URL} from '../../config';

const EditLessonModal = ({ open, onClose, lesson, isLessonLoaded, onLessonSubmit }) => {
const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [editedLesson, setEditedLesson] = useState(lesson);

  useEffect(() => {
    setEditedLesson(lesson);
  }, [lesson]);

  if (!isLessonLoaded) {
    return null;
  }

  const saveLesson = async () => {
    try {
      const response = await axios.put(`${API_URL}/lessons/${editedLesson.lesson_id}`, {
        title: editedLesson.title,
        description: editedLesson.description,
        is_public: editedLesson.isPublic,
      });
      
      if (response.status === 200) {
        console.log('Lesson updated successfully');
      } else {
        // Error updating lesson
        console.error('Error updating lesson');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const saveSections = async () => {
    try {
      // Iterate through each section and update
      for (const section of editedLesson.lessonSections) {
        const response = await axios.put(`${API_URL}/lesson-sections/${section.id}`, {
          title: section.title,
          body: section.body,
        });
  
        if (response.status !== 200) {
          // Error updating section
          console.error(`Error updating section with id ${section.id}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const savePracticeQuestions = async () => {
    try {
      // Iterate through each question and update
      for (const question of editedLesson.lessonPracticeQuestions) {
        const response = await axios.put(`${API_URL}/lesson-practice-questions/${question.id}`, {
          question: question.question,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          answer: question.answer,
        });
  
        if (response.status !== 200) {
          // Error updating practice question
          console.error(`Error updating practice question with id ${question.id}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleSave = async () => {
    console.log('saving')
    try {
      await saveLesson();
      await saveSections();
      await savePracticeQuestions();
      toast.success("Saved lesson");
      onLessonSubmit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson((prevLesson) => ({
      ...prevLesson,
      [name]: value
    }));
  };

  const handleSectionChange = (e, index) => {
    const { name, value } = e.target;
    setEditedLesson((prevLesson) => {
      const updatedSections = [...prevLesson.lessonSections];
      updatedSections[index][name] = value;
      return {
        ...prevLesson,
        lessonSections: updatedSections
      };
    });
  };

  const handleQuestionChange = (e, index) => {
    const { name, value } = e.target;
    setEditedLesson((prevLesson) => {
      const updatedQuestions = [...prevLesson.lessonPracticeQuestions];
      updatedQuestions[index][name] = value;
      return {
        ...prevLesson,
        lessonPracticeQuestions: updatedQuestions
      };
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: colors.primary[100], padding: "20px", width: "80vw", maxWidth: "1200px", maxHeight: "80vh", overflowY: "auto" }}>
            <Typography variant="h3" align="center" gutterBottom color={colors.blueAccent[100]}>
                Edit Lesson
            </Typography>

            <Typography variant="h4" gutterBottom style={{marginTop: "50px"}} color={colors.blueAccent[100]}>
                Lesson Details
            </Typography>

            <TextField
            name="title"
            label="Title"
            value={editedLesson.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
            />
            <TextField
            name="description"
            label="Description"
            value={editedLesson.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            />
            {/* Dropdown menu for selecting public/private status */}
            <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="isPublic">Public Status</InputLabel>
            <Select
                name="isPublic"
                value={editedLesson.isPublic}
                onChange={handleChange}
                fullWidth
                inputProps={{
                id: "isPublic",
                }}
            >
                <MenuItem value={1}>Public</MenuItem>
                <MenuItem value={0}>Private</MenuItem>
            </Select>
            </FormControl>

            <Typography variant="h4" gutterBottom style={{marginTop: "50px"}} color={colors.blueAccent[100]}>
                Lesson Sections
            </Typography>
            {/* Input fields for editing lesson sections */}
            {editedLesson.lessonSections &&
            editedLesson.lessonSections.map((section, index) => (
                <div key={index} style={{marginTop:"20px"}}>
                <TextField
                    name={`title`}
                    label="Section Title"
                    value={section.title}
                    onChange={(e) => handleSectionChange(e, index)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name={`body`}
                    label="Section Body"
                    value={section.body}
                    onChange={(e) => handleSectionChange(e, index)}
                    fullWidth
                    margin="normal"
                    multiline
                />
                </div>
            ))
            }
            <Typography variant="h4" gutterBottom style={{marginTop: "50px"}} color={colors.blueAccent[100]}>
                Practice Questions
            </Typography>
            {/* Input fields for editing practice questions */}
            {editedLesson.lessonPracticeQuestions &&
            editedLesson.lessonPracticeQuestions.map((question, index) => (
                <div key={index} style={{marginTop:"20px"}}>
                <TextField
                    name={`question`}
                    label="Question"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(e, index)}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    InputLabelProps={{ sx: { color: colors.blueAccent[100] } }}
                />
                <TextField
                    name={`option_a`}
                    label="Option A"
                    value={question.option_a}
                    onChange={(e) => handleQuestionChange(e, index)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name={`option_b`}
                    label="Option B"
                    value={question.option_b}
                    onChange={(e) => handleQuestionChange(e, index)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name={`option_c`}
                    label="Option C"
                    value={question.option_c}
                    onChange={(e) => handleQuestionChange(e, index)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name={`option_d`}
                    label="Option D"
                    value={question.option_d}
                    onChange={(e) => handleQuestionChange(e, index)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor={`answer-${index}`}>Answer</InputLabel>
                    <Select
                    name={`answer`}
                    value={question.answer}
                    onChange={(e) => handleQuestionChange(e, index)}
                    fullWidth
                    inputProps={{
                        id: `answer-${index}`,
                    }}
                    >
                    <MenuItem value="a">Option A</MenuItem>
                    <MenuItem value="b">Option B</MenuItem>
                    <MenuItem value="c">Option C</MenuItem>
                    <MenuItem value="d">Option D</MenuItem>
                    </Select>
                </FormControl>
                </div>
            ))
            }

            <Button onClick={handleSave} variant="contained" color="secondary" style={{ marginTop: "20px", color: 'white', boxShadow: 'none', borderRadius: 25}} size='large'>
                Save
            </Button>
        </div>
    </Modal>
  );
};

export default EditLessonModal;
