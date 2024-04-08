import { useEffect, useState, useContext  } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens, ColorModeContext } from "../../theme";

import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import GradeIcon from '@mui/icons-material/Grade';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const SB = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const MenuItemStyles = {
    root: {
      fontSize: '15px',
      fontWeight: 400,
    },
    icon: {
      color: colors.blueAccent[100],
    },
    SubMenuExpandIcon: {
      color: colors.grey[100],
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: colors.primary[200]
    }),
    button: {
      '&:hover': {
        backgroundColor: colors.primary[200],
        color: colors.blueAccent[100],
      },
    }
  };

  return (
      <Sidebar collapsed={props.isCollapsed} backgroundColor={colors.primary[100]} style={{position: 'fixed', height: '100%', overflowY: 'auto'}}>
        <Menu iconShape="square" menuItemStyles={MenuItemStyles}>

            {/* EXPAND/COLLAPSE ICON AND NAME*/}
            <MenuItem
                onClick={() => props.setIsCollapsed(!props.isCollapsed)}
                icon={props.isCollapsed ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon/>}
                style={{
                    color: colors.grey[100],
                    paddingTop: "10px",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography color={colors.grey[100]}>
                        {!props.isCollapsed ? (props.user ? props.user.email : 'Not Signed in') : ' '}
                    </Typography>
                </Box>
            </MenuItem>

            {/* HOME */}
            <Typography
                variant="h5"
                color={colors.grey[300]}
                fontWeight="bold"
                sx={{ m: "15px 0 15px 20px" }}
            >
                {!props.isCollapsed ? 'Home' : ' '}
            </Typography>

            {/* EXPLORE */}
            <MenuItem icon={<ExploreIcon/>} onClick={() => navigate('/explore')}>Explore</MenuItem>
            
            {/* SEARCH */}
            <MenuItem icon={<SearchIcon/>} onClick={() => navigate('/search')}>Search</MenuItem>

            {props.user ? (
                    // CREATE
                    <MenuItem icon={<AddCircleOutlineIcon/>} onClick={() => navigate('/create')}>Create</MenuItem>
                )
                :
                (
                    // SIGN IN/REGISTER
                    <>
                        <MenuItem icon={<LoginIcon/>} onClick={() => navigate('/signin')}>Sign In</MenuItem>
                        <MenuItem icon={<LockOpenIcon/>} onClick={() => navigate('/signup')}>Register</MenuItem>
                    </>
                )
            }


            {/* LEARNING */}
            {props.user &&
                <div style={{justifyContent: 'center', alignItems: "center", flex: 1}}>
                    <Typography
                        variant="h5"
                        color={colors.grey[300]}
                        fontWeight="bold"
                        sx={{ m: "15px 0 15px 20px" }}
                    >
                        {!props.isCollapsed ? 'Learning' : ' '}
                    </Typography>

                    {/* LESSONS */}
                    <SubMenu label="Lessons" icon={<ArticleIcon />}>
                        <MenuItem icon={<PeopleOutlinedIcon/>} onClick={() => navigate('/lessondash/sharedwithme')}>
                            Shared With Me
                        </MenuItem>
                        <MenuItem icon={<GradeIcon/>} onClick={() => navigate('/lessondash/liked')}>
                            Starred
                        </MenuItem>
                        <MenuItem icon={<RemoveRedEyeIcon/>} onClick={() => navigate('/lessondash/recentlyviewed')}>
                            Recently Viewed
                        </MenuItem>
                        <MenuItem icon={<CreateIcon/>} onClick={() => navigate('/lessondash/byme')}>
                            By Me
                        </MenuItem>
                    </SubMenu>

                    {/* COURSES */}
                    <SubMenu label="Courses" icon={<SchoolIcon />}>
                        <MenuItem icon={<HistoryEduIcon/>}>
                            Enrolled
                        </MenuItem>
                        <MenuItem icon={<GradeIcon/>}>
                            Starred
                        </MenuItem>
                        <MenuItem icon={<RemoveRedEyeIcon/>}>
                            Recently Viewed
                        </MenuItem>
                        <MenuItem icon={<CreateIcon/>}>
                            By Me
                        </MenuItem>
                    </SubMenu>
                </div>
            }

            {/* MORE */}
            <Typography
            variant="h5"
            color={colors.grey[300]}
            fontWeight="bold"
            sx={{ m: "15px 0 15px 20px" }}
            >
                {!props.isCollapsed ? 'More' : ' '}
            </Typography>

            {/* THEME */}
            {theme.palette.mode === 'dark' ? (
                <MenuItem icon={<DarkModeIcon/>} onClick={colorMode.toggleColorMode}>Dark Mode</MenuItem>
            )
            :
            (
                <MenuItem icon={<LightModeIcon/>} onClick={colorMode.toggleColorMode}>Light Mode</MenuItem>
            )
            }

            {/* SIGN OUT */}
            {props.user &&
                <MenuItem icon={<LogoutIcon/>} onClick={() => props.logout()}>Sign Out</MenuItem>
            }
        </Menu>
      </Sidebar>
  );
};

export default SB;