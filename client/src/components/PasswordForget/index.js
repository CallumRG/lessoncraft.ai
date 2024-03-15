import React, { useState } from "react";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { Typography, TextField, Button, Grid, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";

function PasswordForget() {
  const [email, setEmail] = useState('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email === "") {
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
      setLoading(false);
      navigate('/signin');
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      toast.error("Failed to send password reset email.");
      setLoading(false);
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
                Forget Password
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      Reset Password
                    </Button>
                  </Grid>
              </Grid>
            </form>
          </Grid>
          
          <Grid item xs={12} align="center">
            <Typography>
              Remember your password?{" "}
              <Link to="/signin" style={{cursor: "pointer", color: colors.blueAccent[100]}}>
                  Sign In
              </Link>
            </Typography>   
          </Grid>  
        </Grid>
      ) 
      : 
      (
        <Loading />
      )}
    </>
  );
}

export default PasswordForget;
