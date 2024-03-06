import axios from "axios";
import {API_URL} from '../../config';
import { parsePracticeQuestionsString } from "./utils";

const makeNewLessonRequest = (user_id, title, description) => {
    let data = JSON.stringify({
        title: title,
        user_id: user_id,
        description: description
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_URL}/createLesson`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    return config;
}

const makeNewSectionRequest = (lessonId, title, body) => {
    let data = JSON.stringify({
        lessonId: lessonId,
        title: title,
        body: body
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_URL}/createLessonSection`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    return config;
}

const makeNewPracticeQuestionRequest = (question, lessonId) => {
    let data = JSON.stringify({
        question: question['question'],
        option_a: question['option_a'],
        option_b: question['option_b'],
        option_c: question['option_c'],
        option_d: question['option_d'],
        answer: question['answer'],
        lessonId: lessonId
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_URL}/createLessonPracticeQuestion`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    return config;
}

const insertLessonComponents = async (user, completeLesson, lessonTitle, topics) => {
    // Insert lesson record
    const newLessonRequest = makeNewLessonRequest(user.id, lessonTitle, completeLesson.description);
    axios.request(newLessonRequest)
    .then((response) => {
        console.log('INSERT LESSON RESPONSE:',  response.data.status);
        const lessonId = response.data.id;

        // Insert Lesson Sections
        for(let i = 0; i < topics.length; i++){
            const newSectionRequest = makeNewSectionRequest(lessonId, topics[i], completeLesson['sections'][i]);
            axios.request(newSectionRequest)
            .then((response) => {
                console.log(`insert "${topics[i]}" section response:`, response.data.status);
            })
            .catch((error) => {
                console.log(error);
            });
        }

        // Insert Lesson Practice Questions
        const practiceQuestionsString = completeLesson.practice_questions;
        const questionList = parsePracticeQuestionsString(practiceQuestionsString);
        for(const question of questionList){
            const newQuestionRequest = makeNewPracticeQuestionRequest(question, lessonId);
            axios.request(newQuestionRequest)
            .then((response) => {
                console.log(`insert practice question response:`, response.data.status);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

export default insertLessonComponents;