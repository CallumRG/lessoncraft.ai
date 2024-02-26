import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import Firebase from "../Firebase/firebase";

const ProfilePage = () => {
    const firebase = new Firebase();
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [error, setError] = useState(null);

    
    const fetchUserDetails = async () => {
        if (firebase.auth.currentUser) {
            const userId = firebase.auth.currentUser.uid; // Get the UID for the current user
            const response = await fetch(`/getUserDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo({ firstName: data.first_name, lastName: data.last_name });
            } else {
                console.error('Failed to fetch user details');
            }
        }
    };

    // Call fetchUserDetails
    fetchUserDetails().catch(console.error);


    
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
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3">
                Profile Details
            </Typography>

            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                <Typography variant="body1">
                    <strong>First Name:</strong> {userInfo.firstName}
                </Typography>
                <Typography variant="body1">
                    <strong>Last Name:</strong> {userInfo.lastName}
                </Typography>
            </Box>
 
            <Typography variant="h5" component="h5" sx={{ marginLeft: "40px", marginTop: '20px' }}>
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
