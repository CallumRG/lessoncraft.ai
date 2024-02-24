import { Box, IconButton, useTheme, Button, TextField, Typography } from "@mui/material";
import { useContext, useCallback } from "react";
import { ColorModeContext, tokens } from "../../theme";
import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Topbar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <div style={{ display: "flex", 
                justifyContent: "space-between", 
                alignItems: 'center', position: "sticky",
                paddingTop: "15px", 
                zIndex: 1000, 
                marginBottom:"15px", 
                paddingBottom: "10px", 
                paddingRight: "75px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[200] : colors.primary[100]
            }}
    >
        {/* Website Name */}
        <Box ml="30px">
            <Typography variant="h1">Lessoncraft</Typography>
        </Box>

        {/* Icons */}
        <Box display="flex" justifyContent="space-between" mr="15px">

            {props.user ? (
                    <>
                        <Button component={Link} to="/create" variant="contained" startIcon={<AddCircleOutlineIcon />} color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.grey[100], boxShadow: 'none'}}>
                            Create
                        </Button>
                        <IconButton size="large" color="secondary">
                            <PersonOutlinedIcon/>
                        </IconButton>

                        <IconButton size="large" color="secondary">
                            <SettingsOutlinedIcon/>
                        </IconButton>

                        <IconButton size="large" color="secondary">
                            <NotificationsOutlinedIcon/>
                        </IconButton>
                    </>
                )
                :
                (
                    <>
                        <Button component={Link} to="/signin" variant="contained" startIcon={<LoginIcon />} color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.grey[100], boxShadow: 'none',}}>
                            Sign in
                        </Button>
                        <Button component={Link} to="/signup" variant="contained" startIcon={<LockOpenIcon />} color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.grey[100], boxShadow: 'none'}}>
                            Register
                        </Button>
                    </>
                )
            }

            {/* COLOR MODE */}
            <IconButton onClick={colorMode.toggleColorMode} size="large" color="secondary">
                {theme.palette.mode === "dark" ? (
                    <DarkModeIcon/>
                ) : (
                    <LightModeIcon/>
                )}
            </IconButton>
        </Box>
    </div>

  );
};

export default Topbar;