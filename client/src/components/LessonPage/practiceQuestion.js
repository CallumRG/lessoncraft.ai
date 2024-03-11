import React, { useState } from 'react';
import { Grid, Typography, Button, useTheme } from '@mui/material';
import { tokens } from "../../theme";

const PracticeQuestion = ({ question }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selectedOption, setSelectedOption] = useState(null);
    const [revealAnswer, setRevealAnswer] = useState(false);

    const handleOptionClick = (option) => {
        if (!revealAnswer) {
            setSelectedOption(option);
        }
    };

    const handleRevealAnswer = () => {
        setRevealAnswer(true);
    };

    return (
        <Grid item xs={12} style={{ marginBottom: '30px', borderBottom: `1px solid ${colors.blueAccent[100]}`, paddingBottom: 30 }}>
            <Typography variant="h3" style={{marginBottom: 20}}>{question.question}</Typography>

            {['option_a', 'option_b', 'option_c', 'option_d'].map((option) => (
                <div key={option} style={{ display: 'block', marginBottom: '10px' }}>
                    <Button
                        key={option}
                        variant={revealAnswer ? (question.answer === option.split('_')[1] ? 'contained' : 'outlined') : (selectedOption === option ? 'contained' : 'outlined')}
                        onClick={() => handleOptionClick(option)}
                        color = 'secondary'
                        size='large'
                        style={{
                            marginRight: '10px',
                            marginBottom: '10px',
                            borderRadius: 25,
                            borderColor: colors.blueAccent[100],
                            color: revealAnswer
                            ? question.answer === option.split('_')[1]
                                ? '#8FDB8F'
                                : selectedOption === option
                                    ? 'red'
                                    : 'white'
                            : 'white',
                        }}
                        disabled={revealAnswer}
                    >
                        {question[option]}
                    </Button>
                </div>
            ))}

            <Button variant="contained" size='medium' color='secondary' onClick={handleRevealAnswer} style={{color: 'white', borderRadius: 25}}disabled={revealAnswer}>
                Reveal Answer
            </Button>

            {revealAnswer && (
                <Typography variant="body1" style={{ marginTop: '10px', color: (selectedOption.split('_')[1] === question.answer) ? '#8FDB8F' : 'red' }}>
                    {(selectedOption.split('_')[1] === question.answer) ? 'Correct!' : 'Incorrect'}
                </Typography>
            )}
        </Grid>
    );
};

export default PracticeQuestion;