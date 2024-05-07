import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { tokens } from "../../theme";
import LessonSearch from "../LessonSearch";
import CourseSearch from "../CourseSearch";
import ArticleIcon from '@mui/icons-material/Article';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SchoolIcon from '@mui/icons-material/School';

const SearchPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [activeSection, setActiveSection] = useState('lesson');

    return(
        <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            style={{width: "90%", margin: "auto", }}>  

            <Grid item xs={12}>
                <Typography variant="h3" align = "left">Search</Typography>

            </Grid>

            <Grid item xs={12}>
                <hr></hr>
            </Grid>
            
            <Grid item xs={4} container justifyContent="right">
                <Button startIcon={<ArticleIcon />} variant="contained" color="secondary" onClick={() => setActiveSection('lesson')}>Lesson Search</Button>
            </Grid>

            <Grid item xs={4} container justifyContent="left">
                <Button startIcon={<SchoolIcon />} variant="contained" color="secondary" onClick={() => setActiveSection('course')}>Course Search</Button>
            </Grid>
            
            <Grid item xs={12}>
                <hr></hr>
            </Grid>

            <Grid item xs={12}>
                {activeSection === 'lesson' && <LessonSearch />}
                {activeSection === 'course' && <CourseSearch />}
            </Grid>
        </Grid>
    )
}

export default SearchPage;