import React from "react";
import { Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return(
        <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Typography variant="h2" align="center">
                Welcome to Lessoncraft
                </Typography>
            </Grid>

            <Grid item xs={4} align="center">
                <Button
                    component={Link}
                    to="/signin"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Sign In
                </Button>
            </Grid>

            <Grid item xs={4} align="center">
                <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    color="secondary"
                    size="large"
                >
                    Register
                </Button>
            </Grid>

            <Grid item xs={4} align="center">
                <Button
                    component={Link}
                    to="/explore"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Explore
                </Button>
            </Grid>
        </Grid>
    )
}

export default LandingPage;