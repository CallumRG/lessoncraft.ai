import OpenAI from 'openai';
import React, { useState } from 'react';
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { tokens } from "../../theme";
import Loading from "../Loading";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const NewLesson = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [lessonTitle, setLessonTitle] = useState('');
    const [topics, setTopics] = useState(['']);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTitleChange = (e) => {
        setError(null);
        setLessonTitle(e.target.value);
    }

    const handleTopicChange = (index, value) => {
        const newTopics = [...topics];
        newTopics[index] = value;
        setTopics(newTopics);
        setError(null);
    };

    const handleAddTopic = () => {
        if (topics.length < 4) {
        setTopics([...topics, '']);
        }
        setError(null);
    };

    const handleRemoveTopic = (index) => {
        if (topics.length > 1) {
        const newTopics = [...topics];
        newTopics.splice(index, 1);
        setTopics(newTopics);
        }
        setError(null);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log('File uploaded:', file);
        setError(null);
    };

    const handleCreateLesson = () => {
        setLoading(true);
        
        if(lessonTitle === ""){
            setError('Please include a lesson title.');
            setLoading(false);
        } else if (topics.length === 1 && topics[0] === ""){
            setError('Please include at least one topic.');
            setLoading(false);
        } else if (!selectedFile){
            setError('Please include a file for lesson context.');
            setLoading(false);
        }
        else{
            setTimeout(() => {
                console.log('Lesson Title:', lessonTitle);
                console.log('Topics:', topics);
                console.log('Selected File:', selectedFile ? selectedFile.name : 'No file selected');
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <>
            {!loading ? (
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                    style={{ height: "80vh", width: "50%", margin: "auto" }}
                    sx={{ marginTop: '-50px' }}
                >
                    <Grid item xs={12}>
                        <Typography variant="h2" align="center">
                            New Lesson
                        </Typography>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: -50 }}>
                        {/* Lesson Title */}
                        <TextField
                            label="Lesson Title"
                            fullWidth
                            value={lessonTitle}
                            onChange={(e) => {handleTitleChange(e)}}
                            margin="normal"
                            variant="standard"
                            InputLabelProps={{
                                sx: {
                                  '&.Mui-focused': {
                                    color: colors.blueAccent[100],
                                  },
                                },
                            }}
                        />
                    </Grid>

                    {/* Topics */}
                    <Grid item xs={12}>
                        <Typography variant="h5" style={{ marginTop: 30 }} align='center'>
                            Topics:
                        </Typography>
                    </Grid>
                    {topics.map((topic, index) => (
                        <Grid item xs={7} key={index} style={{ marginTop: "-50px" }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    label={`Topic ${index + 1}`}
                                    fullWidth
                                    value={topic}
                                    onChange={(e) => handleTopicChange(index, e.target.value)}
                                    margin="normal"
                                    variant="standard"
                                    InputLabelProps={{
                                        sx: {
                                        '&.Mui-focused': {
                                            color: colors.blueAccent[100],
                                        },
                                        },
                                    }}
                                />
                                {index > 0 && (
                                    <IconButton onClick={() => handleRemoveTopic(index)} color='secondary'>
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </div>
                        </Grid>
                    ))}
                    <Grid item xs={12} alignItems='center' style={{ textAlign: 'center', marginTop: '-40px' }}>
                        <IconButton onClick={handleAddTopic} color='secondary'>
                            <AddIcon />
                        </IconButton>
                    </Grid>

                    {/* Context Import */}
                    <Grid item xs={12}>
                        <Typography variant="h5" style={{ marginTop: 10 }} align='center'>
                            Import Context:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'center', marginTop: -30 }}>
                        <Input
                            id="input-file"
                            type="file"
                            onChange={handleFileUpload}
                            style={{ display: 'none', marginBottom: 10 }}
                        />
                        <label htmlFor="input-file">
                            <Button variant="outlined" color="secondary" component="span" style={{borderRadius: 25, color: colors.blueAccent[100], marginTop: -5}}>
                                Browse
                            </Button>
                        </label>
                        {selectedFile && (
                            <Typography style={{ marginTop: 5 }}>
                                Selected File: {selectedFile.name}
                            </Typography>
                        )}
                    </Grid>

                    {error &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="h6" color='red' style={{ marginTop: 10 }} align='center'>
                                    {error}
                                </Typography>
                            </Grid>
                        </>
                    }

                    {/* Create Lesson Button */}
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Button onClick={() => {handleCreateLesson()}} startIcon={<AutoAwesomeIcon />} variant="outlined" color="secondary" style={{borderRadius: 25, color: colors.blueAccent[100], boxShadow: 'none',}} size='large'>
                            Generate Lesson
                        </Button>
                    </Grid>
                </Grid>
        ) 
        : 
        (
            <Loading />
        )}
        </>
    );
};

export default NewLesson;