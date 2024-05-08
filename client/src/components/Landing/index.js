import React from "react";
import { Typography, Button, Grid, Container, Box, useTheme } from "@mui/material";
import { Link } from "react-router-dom";


const LandingPage = () => {

    const imageUrl = "https://pcgservices.com/wp-content/uploads/2018/10/purple_wave_reverse_hero.png";
    const theme = useTheme();
    const introduction = (       
        <Typography color="textSecondary" variant="h4" style={{marginTop: 10, marginBottom: 25}}>
            Powered by modern AI technology, Lessoncraft empowers users to craft immersive lesson plans in seconds. 
            Drag and drop your PDF of learning content, and watch a complete lesson with practice questions appear. 
        </Typography>
    );

    return(
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                marginTop: -10,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'row',
            }}
            >
    
        <Grid 
            container 
            sx={{ paddingTop: 2, paddingLeft: 3, height: '100vh', overflow: 'hidden'}} 
        >
            <Grid item xs={12} sm={6} 
                sx={{ display: 'flex', 
                    flexDirection: 'column', 
                    marginTop: 40,
                    p: theme.spacing(6) }}
            >
                <Typography variant="h1" gutterBottom>
                    Generate lessons with AI!
                </Typography>

                <Typography variant="h1" gutterBottom>
                    ***The backend hosting service will take a minute to spin up
                </Typography>
                
                {introduction}
               
                <Button
                    component={Link}
                    to="/explore"
                    variant="contained"
                    color="secondary"
                    size="large"
                >
                    Explore
                </Button>
            </Grid>   
      </Grid>
      
      </Box> 

    )
}

export default LandingPage;