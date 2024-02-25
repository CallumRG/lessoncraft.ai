import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import FirebaseContext from '../Firebase/firebase'; // Corrected import path based on your project structure

const ProfilePage = () => {
    const firebase = useContext(FirebaseContext); // Correct usage of FirebaseContext
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [error, setError] = useState(null);

    const onSubmit = (event) => {
        if(passwordOne !== passwordTwo) {
            setError("Passwords do not match");
            return;
        }

        // firebase context provides a method to change password
        firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                setPasswordOne('');
                setPasswordTwo('');
                setError(null);
                // Handle successful password change
            })
            .catch(error => {
                setError(error.message);
            });

        event.preventDefault();
    };

    return (
        <Box sx={{flexGrow:1}}>
            <Typography variant="h3" component="h3" sx={{ marginLeft:"40px", marginTop: '20px'}}>
                Manage Account
            </Typography>
           
            <form onSubmit={onSubmit}>
                <TextField
                    name="passwordOne"
                    value={passwordOne}
                    onChange={e => setPasswordOne(e.target.value)}
                    type="password"
                    placeholder="New Password"
                />
                <TextField
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={e => setPasswordTwo(e.target.value)}
                    type="password"
                    placeholder="Confirm New Password"
                />
                <Button type="submit">Change My Password</Button>

                {error && <p>{error}</p>}
            </form>
        </Box>
    );
};

export default ProfilePage;
