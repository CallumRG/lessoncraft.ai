import React from "react";
import { Typography, Button, Grid, Container, Box, useTheme } from "@mui/material";
import { Link } from "react-router-dom";


const LandingPage = () => {

    const imageUrl = "https://en.idei.club/uploads/posts/2023-06/1686191842_en-idei-club-p-artificial-intelligence-background-dizain-1.png";
    const theme = useTheme();
    const introduction = (       
        <Typography variant="subtitle1" color="textSecondary">
            Introducing Lessoncraft, a cutting-edge platform designed to revolutionize the way you create and distribute learning materials. Powered by advanced AI technology, Lessoncraft empowers users to effortlessly craft immersive lesson plans. Simply drag and drop your extensive PDFs into our intuitive interface, and watch as we transform them into engaging and digestible learning experiences. Whether you're eager to expand your knowledge or share your expertise, Lessoncraft streamlines the process with customizable modules and courses, offering a seamless journey towards comprehensive learning. Join us and unlock the potential of effortless education today.
        </Typography>
    );

    return(
        <Box
            sx={{
                width: '100%',
                height: '100vh',
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
                    justifyContent: 'center', 
                    p: theme.spacing(6) }}
            >
                {/* <Typography variant="h2" gutterBottom>
                    Lessoncraft
                </Typography>  */}
                <Typography variant="h2" gutterBottom>
                    Generate lessons with AI!
                </Typography>

                
                {introduction}
               

                {/* <Grid item xs={12} sm={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={theme.spacing(4)}> */}
                    <Button
                        component={Link}
                        to="/explore"
                        variant="contained"
                        color="secondary"
                        size="large"
                        //sx={{ mt: 4 }}
                    >
                        Explore
                    </Button>
                {/* </Grid> */}
            </Grid>   

        <Grid item xs={12} sm={6}>
        {/* <img src={imageUrl} alt="AI" style={{ width: '100%', maxWidth: '600px' }} /> Setting image source to external URL */}
          {/* <Box 
            sx={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                width: '100%'
            }} /> */}
        </Grid>
      </Grid>
      
      </Box> 

    )
}

export default LandingPage;