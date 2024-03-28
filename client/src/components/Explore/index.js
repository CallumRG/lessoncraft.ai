import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { API_URL } from '../../config';
import axios from 'axios'
import { tokens } from "../../theme";

import WhatshotIcon from '@mui/icons-material/Whatshot';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradeIcon from '@mui/icons-material/Grade';

const ExplorePage = () => {
    const theme = useTheme();
    const [mostLiked, setMostLiked] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);
    const colors = tokens(theme.palette.mode);

    const fetchMostLiked = async () => {
        try {
            const response = await axios.post(`${API_URL}/most-liked-lessons`);
            setMostLiked(response.data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const fetchMostViewed = async () => {
        try {
            const response = await axios.post(`${API_URL}/most-viewed-lessons`);
            setMostViewed(response.data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    useEffect(() => {
        fetchMostLiked();
        fetchMostViewed();
    }, []);

    return(
        <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            style={{width: "90%", margin: "auto", }}>  

            <Grid item xs={12}>
                <Typography variant="h2" align = "left">Explore</Typography>
            </Grid>

            <Grid item xs={12}>
                <hr></hr>
            </Grid>

            <Grid item xs={12} style={{borderBottomWidth: 1, marginBottom: 40, marginTop: 40}}>
                <Typography variant="h3" align = "left"><WhatshotIcon style={{marginRight: '10px', color: 'red'}}/>T R E N D I N G</Typography>
            </Grid>

            {mostViewed.map((lesson) => (
                <Grid item xs={4} style={{}}>
                    <Link to={`/lesson/${lesson.id}`} key={lesson.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box border={`2px solid ${colors.blueAccent[100]}`} p={2} borderRadius={4} mb={2}>
                            <Typography variant="h3" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{lesson.title}</Typography>
                            <Typography variant="h6" display="inline">Author: </Typography>
                            <Typography variant="h6" display="inline">{lesson.author}</Typography>
                            <br></br>
                            <Typography variant="h6" display="inline" style={{marginRight: '5px'}}><VisibilityIcon style={{paddingTop: 5}}/> </Typography>
                            <Typography variant="h6" display="inline" style={{marginRight: '15px'}}>{lesson.view_count}</Typography>
                            <Typography variant="h6" display="inline" style={{marginRight: '5px'}}><GradeIcon/> </Typography>
                            <Typography variant="h6" display="inline">{lesson.like_count}</Typography>
                        </Box>
                    </Link>
                </Grid>
            ))}

            <Grid item xs={12} style={{borderBottomWidth: 1, marginBottom: 40, marginTop: 40}}>
                <Typography variant="h3" align = "left"><FavoriteIcon style={{marginRight: '10px', color: 'red'}}/>M O S T L O V E D</Typography>
            </Grid>

            {mostLiked.map((lesson) => (
                <Grid item xs={4} style={{}}>
                    <Link to={`/lesson/${lesson.id}`} key={lesson.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box border={`2px solid ${colors.blueAccent[100]}`} p={2} borderRadius={4} mb={2}>
                            <Typography variant="h3">{lesson.title}</Typography>
                            <Typography variant="h6" display="inline">Author: </Typography>
                            <Typography variant="h6" display="inline">{lesson.author}</Typography>
                            <br></br>
                            <Typography variant="h6" display="inline" style={{marginRight: '5px'}}><VisibilityIcon style={{paddingTop: 5}}/> </Typography>
                            <Typography variant="h6" display="inline" style={{marginRight: '15px'}}>{lesson.view_count}</Typography>
                            <Typography variant="h6" display="inline" style={{marginRight: '5px'}}><GradeIcon/> </Typography>
                            <Typography variant="h6" display="inline">{lesson.like_count}</Typography>
                        </Box>
                    </Link>
                </Grid>
            ))}
            
        </Grid>
    )
}

export default ExplorePage;