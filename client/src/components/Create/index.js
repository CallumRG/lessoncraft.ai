import React from 'react';
import { Button, Grid, Typography, useTheme, Box } from '@mui/material';
import { tokens } from "../../theme";
import { Link } from "react-router-dom";

import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';

const CreatePage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div style={{display: "flex", flex: 1, alignItems: "center", justifyContent:"center", height: "80vh"}}>
            <Box
                height="400px"
                width="900px"
                borderRadius="50px"
                border={`2px solid ${colors.blueAccent[100]}`}
                margin="auto"
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{height: "400px"}}
                >
                    <Button
                        variant="contained"
                        size="large"
                        style={{ width: '200px', height: '200px', margin: '20px',color: colors.grey[100], boxShadow: 'none' }}
                        startIcon={<ArticleIcon />}
                        color="secondary"
                        component={Link} to="/newlesson"
                    >
                        New Lesson
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        style={{ width: '200px', height: '200px', margin: '20px',color: colors.grey[100], boxShadow: 'none' }}
                        startIcon={<ViewModuleIcon />}
                        color="secondary"
                    >
                        New Module
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        style={{ width: '200px', height: '200px', margin: '20px',color: colors.grey[100], boxShadow: 'none' }}
                        startIcon={<SchoolIcon />}
                        color="secondary"
                        component={Link} to="/newcourse"
                    >
                        New Course
                    </Button>
                </Grid>
            </Box>
        </div>
    );
    };

    export default CreatePage;
