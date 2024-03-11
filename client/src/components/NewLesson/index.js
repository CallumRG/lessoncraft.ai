import MakeOpenAIAssistantCall from './openai';
import insertLessonComponents from './lessoninsert';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { tokens } from "../../theme";
import Loading from "../Loading";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const NewLesson = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [lessonTitle, setLessonTitle] = useState('');
    const [topics, setTopics] = useState(['']);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [citation, setCitation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generationStatus, setGenerationStatus] = useState('');

    const handleTitleChange = (e) => {
        setError(null);
        setLessonTitle(e.target.value);
    }

    const handleCitationChange = (e) => {
        setError(null);
        setCitation(e.target.value);
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

    const handleCreateLesson = async () => {
        setLoading(true);
        setError(null);
        
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
            // GENERATE LESSON
            setGenerationStatus('initializing OpenAI Connection');
            try{
                const completeLesson = await MakeOpenAIAssistantCall(lessonTitle, topics, selectedFile, (status) => setGenerationStatus(status));
                console.log(completeLesson);
                // INSERT NEW LESSON TO MYSQL
                const lessonId = await insertLessonComponents(props.user, completeLesson, lessonTitle, topics, isPublic, citation);
                console.log(lessonId)
                setLoading(false);
                setGenerationStatus('');
                navigate(`/lesson/${lessonId}`);
            } catch (error){
                console.error(error)
                setError('Failed to generate lesson');
                setLoading(false);
                setGenerationStatus('');
            }
        }
    };

    return (
        <>
            {!loading ? (
                    <Box
                        height="94%"
                        width="85%"
                        borderRadius="50px"
                        border={`3px solid ${colors.blueAccent[100]}`}
                        margin="auto"
                    >
                        <Grid
                            container
                            spacing={0}
                            alignItems="center"
                            justifyContent="center"
                            style={{ height: "90vh", width: "50%", margin: "auto" }}
                            sx={{ marginTop: '-50px' }}
                        >
                            <Grid item xs={12}>
                                <Typography variant="h2" align="center">
                                    New Lesson:
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
                            <Grid item xs={12} style={{ marginTop: -50 }} textAlign='center'>
                                <Button 
                                    variant={isPublic ? 'contained' : 'outlined'} 
                                    color="secondary"
                                    style={{
                                        boxShadow: 'none',
                                        borderRadius: 25, 
                                        color: isPublic ? 'white' : colors.blueAccent[100], 
                                        marginTop: -5, 
                                        marginRight: 10
                                    }}
                                    onClick={() => setIsPublic(true)}
                                >
                                    Public
                                </Button>
                                <Button 
                                    variant={isPublic ? 'outlined' : 'contained'} 
                                    color="secondary"
                                    style={{
                                        boxShadow: 'none',
                                        borderRadius: 25, 
                                        color: isPublic ? colors.blueAccent[100] : 'white', 
                                        marginTop: -5
                                    }}
                                    onClick={() => setIsPublic(false)}
                                >
                                    Private
                                </Button>
                            </Grid>

                            {/* Topics */}
                            <Grid item xs={12}>
                                <Typography variant="h5" align='center'>
                                    Lesson Topics:
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
                                            <IconButton onClick={() => handleRemoveTopic(index)} color='secondary' sx={{border: `1px solid ${colors.blueAccent[100]}`, marginLeft: 3}} size='small'>
                                                <RemoveIcon />
                                            </IconButton>
                                        )}
                                    </div>
                                </Grid>
                            ))}
                            <Grid item xs={12} alignItems='center' style={{ textAlign: 'center', marginTop: '-40px' }}>
                                <IconButton onClick={handleAddTopic} color='secondary' sx={{border: `1px solid ${colors.blueAccent[100]}`}} size='small'>
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

                            <Grid item xs={10} style={{ marginTop: -50 }}>
                                {/* Context Citation */}
                                <TextField
                                    label="Context Citation"
                                    fullWidth
                                    value={citation}
                                    onChange={(e) => {handleCitationChange(e)}}
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

                            {/* Error display for incomplete form */}
                            {error &&
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color='red' style={{ marginTop: 10 }} align='center'>
                                            ! ! ! {error}
                                        </Typography>
                                    </Grid>
                                </>
                            }

                            {/* Create Lesson Button */}
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <Button onClick={() => {handleCreateLesson()}} startIcon={<AutoAwesomeIcon />} variant="contained" color="secondary" style={{color: 'white', boxShadow: 'none', borderRadius: 25}} size='large'>
                                    Generate Lesson
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
            ) 
            : 
            (
                // LOADING
                <>
                    <Typography variant="h6" color={colors.blueAccent[100]} align='center'>
                        Kick back, this may take a few minutes...
                    </Typography>
                    <Typography variant="h6" color={colors.blueAccent[100]} align='center'>
                        {generationStatus}
                    </Typography>
                    <Loading />
                </>
            )}
        </>
    );
};

export default NewLesson;