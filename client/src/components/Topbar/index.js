import { Box, IconButton, useTheme, Button, TextField, Typography } from "@mui/material";
import { useContext, useCallback } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import React, { useState } from 'react';

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
            <Typography variant="h3" fontWeight="bold">Lessoncraft</Typography>
        </Box>

        {/* Icons */}
        <Box display="flex" justifyContent="space-between" mr="15px">
            <IconButton onClick={colorMode.toggleColorMode} size="large" color="secondary">
                {theme.palette.mode === "dark" ? (
                    <DarkModeIcon/>
                ) : (
                    <LightModeIcon/>
                )}
            </IconButton>

            <IconButton size="large" color="secondary">
                <PersonOutlinedIcon/>
            </IconButton>

            <IconButton size="large" color="secondary">
                <SettingsOutlinedIcon/>
            </IconButton>

            <IconButton size="large" color="secondary">
                <NotificationsOutlinedIcon/>
            </IconButton>
        </Box>
    </div>

  );
};

export default Topbar;