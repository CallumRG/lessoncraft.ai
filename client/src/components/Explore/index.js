import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { tokens } from "../../theme";
import LessonSearch from "../LessonSearch";
import CourseSearch from "../CourseSearch";
import ModuleSearch from "../ModuleSearch";
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

const ExplorePage = () => {
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
                <Typography variant="h3" align = "left">Explore</Typography>

            </Grid>

            <Grid item xs={12}>
                <hr></hr>
            </Grid>
            
        </Grid>
    )
}

export default ExplorePage;