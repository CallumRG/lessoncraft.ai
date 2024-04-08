import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../../config";
import Firebase from '../Firebase/firebase';
import { toast } from 'react-toastify';
import { tokens } from "../../theme";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseClasslist = () => {
    //set states and stuff
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const firebase = new Firebase();
    const navigate = useNavigate();
    const { course_id } = useParams();
    const [userlist, setUserlist] = useState([]);
    const [inCourse, setInCourse] = useState(false);
    const [lesson_id, setLesson_id] = useState(0);


    useEffect(() => {
        // fetch classlist from the server when the component mounts
        fetchCourseClasslist();
    }, [course_id, firebase.auth.currentUser.uid]);

    //grabs classlist
    const fetchCourseClasslist = async () => {
        try {
            const response = await fetch(`${API_URL}/courseFetchClasslist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course_id }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserlist(data.classlist)
                setInCourse(data.classlist.some(user => user.user_id == firebase.auth.currentUser.uid));

            } else {
                console.error('Error fetching course userlist:', response.statusText);
                toast.error('Error fetching course userlist');
            }

        } catch (error) {
            console.error('Error fetching course userlist:', error);
            toast.error('Error fetching course userlist');
        }
    };

    //user wants to join classlist
    const JoinClasslist = async () => {
      try {
        const response = await fetch(`${API_URL}/joinClasslist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                course_id, 
                current_id: firebase.auth.currentUser.uid
            }),
        });

        if (response.ok) {
          fetchCourseClasslist();

        } else {
          console.error('Error joining course classlist:', response.statusText);
          toast.error('Error joining course classlist');

        }

      } catch (error) {
        console.error('Error joining course classlist:', error);
        toast.error('Error joining course classlist:');
      }
    };

    
    //users want to leave classlist
    const LeaveClasslist = async () => {
      try {
        const response = await fetch(`${API_URL}/leaveClasslist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                course_id, 
                current_id: firebase.auth.currentUser.uid
            }),
        });

        if (response.ok) {
          fetchCourseClasslist();

        } else {
          console.error('Error adding course lesson:', response.statusText);
          toast.error('Error adding course lesson');

        }

      } catch (error) {
        console.error('Error adding course lesson:', error);
        toast.error('Error adding course lesson:');
      }
    };

    
    //admin or owner deletes user function
    const handleDeleteUser = async (user_id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");

      if (!confirmDelete) {
          return; // user canceled deletion
      }

      try {
          const response = await fetch(`${API_URL}/removeFromClasslist`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  course_id,
                  current_id: firebase.auth.currentUser.uid,
                  user_id
              }),
          });

          if (response.ok) {
              fetchCourseClasslist();

          } else if (response.status === 403) {
              toast.error('Current User Not Course Owner or administrator');

          } else {
              console.error('Error deleting course user:', response.statusText);
              toast.error('Error deleting course user');
          }
      } catch (error) {
          console.error('Error deleting course user:', error);
          toast.error('Error deleting course user');
      }
  };

  

    
  return (
    <div>
      {/* text field for inputting lesson_id and buttons for deleting and adding */}
      <Grid 
      container 
      spacing={2} 
      alignItems="center">

      {/* button changes depended on if user has joined */}  
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          {!inCourse ? (
            <Button variant="contained" onClick={JoinClasslist}>
              Join
            </Button>
          ) : (
            <Button variant="contained" onClick={LeaveClasslist}>
              Leave
            </Button>
          )}
        </Grid>

        <Grid item xs={12}>
          <hr></hr>
        </Grid>

      

        {/* renders the lessons as boxes clickable to redirect to pages*/}
        <Grid item xs={12} align = 'center'>
          {userlist.length <= 0 ? (
              <Typography variant="body1" align="center">No users found within classroom.</Typography>
          ) : (
              // render table
              <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '50%' }}>
              <thead>
                  <tr>
                  <th style={{ padding: '8px', border: '1px solid black' }}>Name</th>
                  <th style={{ padding: '8px', border: '1px solid black' }}>Email</th>
                  </tr>
              </thead>
              <tbody>
                  {userlist.map((user) => (
                    <tr key={user.user_id} align = 'center'>
                        <td style={{ padding: '8px', border: '1px solid black' }}>{user.name}</td>
                        <td style={{ padding: '8px', border: '1px solid black' }}>{user.email}</td>
                        <td style={{ padding: '8px', border: '1px solid black' }}>
                          <Button variant="contained" onClick={() => handleDeleteUser(user.user_id)}>
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
    </div>
  );
};
export default CourseClasslist;

