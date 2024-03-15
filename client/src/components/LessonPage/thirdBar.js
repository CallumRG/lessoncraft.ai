import { Box, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";
import {API_URL} from '../../config';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';

const ThirdBar = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const makeLikeAction = (action) => {
        if(props.user?.id && props.lessonId){
            let data = JSON.stringify({
                "action": action,
                "user_id": props.user?.id,
                "lesson_id": props.lessonId
            });
            
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${API_URL}/like`,
                headers: { 
                'Content-Type': 'application/json'
                },
                data : data
            };
            axios.request(config)
            .then((response) => {
                if(action === 'add'){
                    setIsLiked(true);
                } else if(action === 'remove'){
                    setIsLiked(false);
                } else if(action === 'check'){
                    const result = response.data.liked;
                    setIsLiked(result);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
        else{
            console.log('no user.')
        }
    }

    const changeLike = () => {
        if(isLiked){
            makeLikeAction('remove');
            toast.success("Unstarred Lesson.");
        }
        else{
            makeLikeAction('add');
            toast.success("Lesson Starred!");
        }
    }

    const fetchLikeCount = async () => {
        const response = await axios.post(`${API_URL}/lessonlikes`, { lesson_id: props.lessonId })
        if(response.data?.like_count){
            setLikeCount(response.data.like_count);
        }
    }

    useEffect(() => {
        makeLikeAction('check');
        if(props.lessonId){
            fetchLikeCount();
        }
    }, []);

    return (
        <div style={{ 
            display: "flex",
            transition: "width 0.3s ease",
            justifyContent: "space-between", 
            alignItems: 'center',
            zIndex: 1000, 
            paddingRight: "75px",
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[200] : colors.primary[100],
            opacity: 0.9,
            padding: 5,
            paddingTop: 0
            }}
        >
            <Box ml="25px" alignItems="center" display='flex'>
                <PublicIcon style={{marginRight: 8, color: colors.primary[900]}}/>
                <Typography variant="h6" style={{ lineHeight: '1', marginRight: 20 }}>{props.isPublic ? 'Public' : 'Private'}</Typography>
                <GradeIcon style={{marginRight: 8, color: colors.primary[900]}}/>
                <Typography variant="h6" style={{ lineHeight: '1', marginRight: 20 }}>{likeCount}</Typography>
                <VisibilityIcon style={{marginRight: 8, color: colors.primary[900]}}/>
                <Typography variant="h6" style={{ lineHeight: '1' }}>{props.views}</Typography>
            </Box>
            <Box mr="50px" alignItems="center" display='flex' padding={0} width="100%" justifyContent="flex-end">
                <Typography variant="h6" style={{marginRight: 20}}>Lesson Code: {props.lessonId}</Typography>
                <IconButton size="large" color="secondary" onClick={() => {}} style={{marginRight: 10}}>
                    <ShareIcon/>
                </IconButton>
                <IconButton size="large" color={isLiked ? 'secondary' : colors.grey[900]} onClick={() => changeLike()} style={{marginRight: 10}}>
                    <GradeIcon/>
                </IconButton>
                <IconButton size="large" color="secondary" onClick={() => {}}>
                    <EditIcon/>
                </IconButton>
            </Box>
        </div>
    );
};

export default ThirdBar;
