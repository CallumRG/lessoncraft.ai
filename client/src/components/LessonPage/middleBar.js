import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import React, { useState } from 'react';

// Icons
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PublicIcon from '@mui/icons-material/Public';

const MiddleBar = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    return (
        <div style={{ 
                    display: "flex",
                    transition: "width 0.3s ease",
                    justifyContent: "space-between", 
                    alignItems: 'center',
                    zIndex: 1000, 
                    marginTop: -9,
                    paddingRight: "75px",
                    borderBottom: `1px solid ${colors.primary[300]}`,
                    backgroundColor: theme.palette.mode === "dark" ? colors.primary[200] : colors.primary[100],
                    opacity: 0.9,
                    padding: 5
                }}
        >
            {/* Website Name */}
            <Box ml="25px" alignItems="center" display='flex'>
                <Typography variant="h6" style={{marginRight: 50}}>Author: {props.author.first_name} {props.author.last_name}</Typography>
                <Typography variant="h6" style={{marginRight: 50}}><ScheduleIcon style={{marginBottom: -5, marginRight: 3}}/>Published {formatDate(props.date)}</Typography>
                <Typography variant="h6" ><PublicIcon style={{marginBottom: -5, marginRight: 3}}/>{props.isPublic ? 'Public' : 'Private'}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mr="50px">
                <Typography variant="h6" maxWidth='950px'><PsychologyIcon style={{marginBottom: -5, marginRight: 3}}/>Reference: {props.citation}</Typography>
            </Box>
        </div>

    );
};

export default MiddleBar;