import {React, useState} from "react";
import { Typography, TextField, Button, Grid, useTheme } from "@mui/material";
import { tokens, ColorModeContext } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import Firebase from '../Firebase/firebase';
import { toast } from 'react-toastify';
import Loading from "../Loading";

const SignInPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const firebase = new Firebase();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, newVal) => {
    setError(false)
    switch (field) {
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
    setLoading(true)
    event.preventDefault();
    
    try {
      const res = await firebase.doSignInWithEmailAndPassword(email, password);
      console.log("FB RESULT:", res);

      toast.success("Sign in successful!");

      setLoading(false);
      navigate('/explore');
    } catch (error) {
      setLoading(false);
      console.error("Error signing in:", error.message);
      setError(true);
    }
  };

  return (
    <>
      {!loading ? (
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            style={{ height: "80vh", width: "80%", margin: "auto" }}
          >
            <Grid item xs={12}>
              <Typography variant="h2" align="center">
                Sign In
              </Typography>
            </Grid>
      
            <Grid item xs={12}>
              <form
                style={{ width: "100%" }}
                onSubmit={handleSubmit}
              >
                <Grid container spacing={2}>
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
                      style={{
                        boxShadow: "none",
                        color: colors.grey[100],
                        borderRadius: 20,
                      }}
                    >
                      Sign In
                    </Button>
      
                    {error &&
                      <Typography color="red" style={{alignItems: "center"}}>Invalid Credentials. Try again.</Typography>
                    }
                  </Grid>
                </Grid>
              </form>
            </Grid>
      
            <Grid item xs={12} align="center">
              <Typography>
                Don't have an account?{" "}
                <Link to="/signup" style={{cursor: "pointer", color: colors.blueAccent[100]}}>
                  Sign Up
                </Link>
              </Typography>
            </Grid>
          </Grid>
        )
        :
        (
          <Loading/>
        )
      }
    </>
  );
};

export default SignInPage;
