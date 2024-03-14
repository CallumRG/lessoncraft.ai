import React, { useState } from "react";
import { TextField, Button, IconButton, Typography, Grid, useTheme, Input, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Firebase from "../Firebase/firebase";
import { API_URL } from "../../config";
import { tokens } from "../../theme";

const NewCourse = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const firebase = new Firebase();

  const [formData, setFormData] = useState({
    courseName: "",
    subjects: "",
    isPublic: true,
    maxUsers: 100,
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // validation
    if (!formData.courseName || !formData.subjects || formData.maxUsers <= 0) {
        toast.error("Please fill in all required fields and ensure maxUsers is greater than 0.");
        return;
    }

    // ccheck if the user is authenticated
    if (firebase.auth.currentUser) {
      try {
        // Create the new course on the server using fetch
        const response = await fetch(`${API_URL}/createCourse`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseName: formData.courseName,
            subjects: formData.subjects,
            isPublic: formData.isPublic,
            maxUsers: formData.maxUsers,
            user_id: firebase.auth.currentUser.uid,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          toast.success("New course created!");

          //navigate to new course 
          navigate('/course/'+data.course_id);
          
        } else {
          console.error("Error creating new course:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating new course:", error);
        toast.error("Error creating new course");
      }
    } else {
      toast.error("User not authenticated");
    }
  };

  return (
    <Box
        height="94%"
        width="85%"
        borderRadius="50px"
        border={`3px solid ${colors.blueAccent[100]}`}
        margin="auto"
    >
      <Grid container spacing={3} alignItems="center" justifyContent="center" padding={12}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Create New Course:
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* course name input */}
            <TextField
              label="Course Name"
              name="courseName"
              value={formData.courseName}
              onChange={(e) => handleChange("courseName", e.target.value)}
              fullWidth
              required
              margin="normal"
              variant="standard"
            />

            {/* subjects input */}
            <TextField
              label="Subjects (Comma-separated)"
              name="subjects"
              value={formData.subjects}
              onChange={(e) => handleChange("subjects", e.target.value)}
              fullWidth
              required
              margin="normal"
              variant="standard"
            />

            {/* max users input */}
            <TextField
              label="Maximum Users"
              type="number"
              name="maxUsers"
              value={formData.maxUsers}
              onChange={(e) => handleChange("maxUsers", e.target.value)}
              fullWidth
              required
              margin="normal"
              variant="standard"
            />

            <br></br>

            {/* turn off or on public setting of the course */}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => handleChange("isPublic", e.target.checked)}
                />
                Public Course
              </label>
            </div>
            <br></br>

            {/* submit button */}
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewCourse;
