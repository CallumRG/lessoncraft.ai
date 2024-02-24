import {React, useState} from "react";
import { Typography, TextField, Button, Grid, useTheme, CircularProgress } from "@mui/material";
import { tokens, ColorModeContext } from "../../theme";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Firebase from '../Firebase/firebase';
import axios from "axios";
import {API_URL} from '../../config';

const SignupPage = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const firebase = new Firebase();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (field, newVal) => {
        switch (field) {
            case "firstName":
                setFirstName(newVal);
                break;
            case "lastName":
                setLastName(newVal);
                break;
            case "email":
                setEmail(newVal);
                break;
            case "password":
                setPassword(newVal);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        console.log(firstName, lastName, email, password);

        // register with firebase
        const regRes = await firebase.doCreateUserWithEmailAndPassword(email, password);
        console.log("FB RESULT:", regRes)

        toast.success("Registration successful!");
        // Add user to MySQL db

        setLoading(false);
        navigate('/explore');
    };

    return (
        <>
            {!loading &&
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    style={{ height: "80vh", width: "80%", margin: "auto" }}
                >
                    <Grid item xs={12}>
                        <Typography variant="h2" align="center">
                            Register
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <form
                        style={{ width: "100%" }}
                        onSubmit={handleSubmit}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="First Name"
                                        variant="standard"
                                        InputLabelProps={{
                                            sx: {
                                            '&.Mui-focused': {
                                                color: colors.blueAccent[100],
                                            },
                                            },
                                        }}
                                        value={firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Last Name"
                                        variant="standard"
                                        InputLabelProps={{
                                            sx: {
                                            '&.Mui-focused': {
                                                color: colors.blueAccent[100],
                                            },
                                            },
                                        }}
                                        value={lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        variant="standard"
                                        InputLabelProps={{
                                            sx: {
                                            '&.Mui-focused': {
                                                color: colors.blueAccent[100],
                                            },
                                            },
                                        }}
                                        value={email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        variant="standard"
                                        InputLabelProps={{
                                            sx: {
                                            '&.Mui-focused': {
                                                color: colors.blueAccent[100],
                                            },
                                            },
                                        }}
                                        value={password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        style={{boxShadow: "none", color: colors.grey[100], borderRadius: 20,}}
                                    >
                                        Sign Up
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>

                    <Grid item xs={12} align="center">
                        <Typography>
                            Already have an account?{" "}
                            <Link to="/signin" style={{cursor: "pointer", color: colors.blueAccent[100]}}>
                                Sign in
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            }
            {loading &&
                <Loading/>
            }
        </>
    );
};

export default SignupPage;
