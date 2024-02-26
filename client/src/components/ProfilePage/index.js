import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import Firebase from "../Firebase/firebase";
import axios from "axios";
import {API_URL} from '../../config';

const ProfilePage = (props) => {
    const firebase = new Firebase();
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [error, setError] = useState(null);

    const makeUserFetchRequest = (firebaseId) => {
    
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${API_URL}/getUserDetails`,
            headers: { 
                'Content-Type': 'application/json'
            },
            params : {
                firebase_uid: firebaseId
            }
        };

        return config;
    };

    const fetchUserDetails = async () => {
        if (props.user) {
            const userRequest = makeUserFetchRequest(props.user.uid);

            axios.request(userRequest)
            .then((response) => {
                console.log("user details response:", JSON.stringify(response.data));
                setUserInfo({ firstName: response.data.first_name, lastName: response.data.last_name });

            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);


    
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
