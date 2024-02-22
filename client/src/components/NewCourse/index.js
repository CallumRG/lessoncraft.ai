import React, { useState } from "react";
import { Typography, Button, Grid, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

//page for making new course
const NewCourse = () => {
    const navigate = useNavigate();

    //form data
    const [formData, setFormData] = useState({
        courseName: "",
        subjects: "", 
        isPublic: true,
        maxUsers: 100,
    });

    // update form input
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    //once submit pressed
    const handleSubmit = (e) => {
        e.preventDefault();

        // validation
        if (!formData.courseName || !formData.subjects || formData.maxUsers <= 0) {
            alert("Please fill in all required fields and ensure maxUsers is greater than 0.");
            return;
            }

        navigate("/success"); // placehlder navigation post submit
    };


    return (
    <Grid container spacing={3} alignItems="center" justifyContent="center" padding={12}>
        <Grid item xs={12}> 

        {/* title */}
        <Typography variant="h4" gutterBottom>
            Create New Course:
        </Typography>
        {/* form for input */}
        <form onSubmit={handleSubmit}> 

            {/* course name input */}
            <TextField
            label="Course Name"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            />

            {/* subject input, can input multiple seperated by comma */}
            <TextField
            label="Subjects (Comma-separated)"
            name="subjects" // Updated label to be more clear
            value={formData.subjects}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            />

            {/* max users input for course */}
            <TextField
            label="Maximum Users"
            type="number"
            name="maxUsers"
            value={formData.maxUsers}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            />

            <br></br>

            {/* turn off or on public setting of course */}
            <div>
            <label>
                <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                />
                Public Course
            </label>
            </div>
            <br></br>
            {/* submit button */}
            <Button type="submit" variant="contained" color="primary">
            Submit
            </Button>
        </form>
        </Grid>
    </Grid>
    );
};

export default NewCourse;
