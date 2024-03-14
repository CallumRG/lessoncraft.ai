import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../../config";
import Firebase from '../Firebase/firebase';
import { toast } from 'react-toastify';
import { tokens } from "../../theme";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseAdmin = () => {
    //set states and stuff
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const firebase = new Firebase();
    const navigate = useNavigate();
    const { course_id } = useParams();
    const [administrators, setAdministrators] = useState([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [adminsNotFound, setAdminsNotFound] = useState(false);

    useEffect(() => {
        // fetch administrators from the server when the component mounts
        fetchAdministrators();
    }, [course_id]);

    //grabs administrators
    const fetchAdministrators = async () => {
        try {
            const response = await fetch(`${API_URL}/courseFetchAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course_id }),
            });

            if (response.ok) {
                const data = await response.json();
                setAdminsNotFound(false);
                setAdministrators(data.courseAdmins);
            } else if (response.status === 404) {
                // admins not found
                setAdminsNotFound(true);
                setAdministrators([]);
            } else {
                console.error('Error fetching course admins:', response.statusText);
                toast.error('Error fetching course admins');
            }
        } catch (error) {
            console.error('Error fetching course admins:', error);
            toast.error('Error fetching course admins');
        }
    };

    //add new admin
    const handleAddAdministrator = async () => {
        try {
            const response = await fetch(`${API_URL}/courseAddAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id,
                    newAdminEmail,
                    current_id: firebase.auth.currentUser.uid
                }),
            });

            if (response.ok) {
                setNewAdminEmail('');
                fetchAdministrators();
            } else if (response.status === 404) {
                toast.error('Admin does not exist');
            } else if (response.status === 403) {
                toast.error('Current User Not Course Owner');
            } else if (response.status === 400) {
                toast.error('User already course admin');
            } else {
                console.error('Error adding course admins:', response.statusText);
                toast.error('Error adding course admin');
            }
        } catch (error) {
            console.error('Error adding course admins:', error);
            toast.error('Error adding course admins');
        }
    };

    //delete admin
    const handleDeleteAdministrator = async (admin_id) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this administrator?");

        if (!confirmDelete) {
            return; // User canceled deletion
        }

        try {
            const response = await fetch(`${API_URL}/courseDeleteAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id,
                    admin_id,
                    current_id: firebase.auth.currentUser.uid
                }),
            });

            if (response.ok) {
                fetchAdministrators();
            } else if (response.status === 403) {
                toast.error('Current User Not Course Owner');
            } else {
                console.error('Error deleting course admins:', response.statusText);
                toast.error('Error deleting course admin');
            }
        } catch (error) {
            console.error('Error deleting course admins:', error);
            toast.error('Error deleting course admins');
        }
    };

    return (
        <Grid container
            spacing={1}
            alignItems="center"
            justifyContent="center"
            style={{ height: "30vh", width: "90%", margin: "auto" }}>
            <Grid item xs={12}>
                <Link to={`/course/${course_id}`}>
                    <Button startIcon={<ArrowBackIcon />}  variant="contained">Return to Course</Button>
                </Link>
            </Grid>
            <Grid item xs={12}>
                <hr></hr>
            </Grid>
            <Grid item xs={12} >
                <Typography variant="h4" align ="center"> Edit Administrators (Course ID #{course_id})</Typography>
            </Grid>
            {/* add admins */}
            <Grid item xs={6} align ="right">
                <TextField
                    type="email"
                    placeholder="Enter User Email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                />
            </Grid>
            <Grid item xs={6} align ="left">
                <Button variant="contained" color = "secondary" onClick={handleAddAdministrator}>Add Administrator</Button>
            </Grid>

            {/* display admins */}
            <Grid item xs={12} align = 'center'>
            {adminsNotFound ? (
                <Typography variant="body1" align="center">
                No admins in course ({course_id}).
                </Typography>
            ) : (
                // render table
                <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '50%' }}>
                <thead>
                    <tr>
                    <th style={{ padding: '8px', border: '1px solid black' }}>Email</th>
                    <th style={{ padding: '8px', border: '1px solid black' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {administrators.map((admin) => (
                    <tr key={admin.admin_id} align = 'center'>
                        <td style={{ padding: '8px', border: '1px solid black' }}>{admin.email}</td>
                        <td style={{ padding: '8px', border: '1px solid black' }}>
                        <Button variant="contained" onClick={() => handleDeleteAdministrator(admin.admin_id)}>
                            Delete
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </Grid>
        </Grid>
    );
};

export default CourseAdmin;
