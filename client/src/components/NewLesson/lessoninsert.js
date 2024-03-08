import axios from "axios";
import {API_URL} from '../../config';
import { parsePracticeQuestionsString } from "./utils";

const makeNewLessonRequest = (user_id, title, description, isPublic, citation) => {
    let data = JSON.stringify({
        title: title,
        user_id: user_id,
        description: description,
        is_public: isPublic,
        citation: citation
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

const insertLessonComponents = async (user, completeLesson, lessonTitle, topics, isPublic, citation) => {
    try {
        // Insert lesson record
        console.log('citation passed to lesson insert:', citation)
        const newLessonRequest = makeNewLessonRequest(user.id, lessonTitle, completeLesson.description, isPublic, citation);
        const lessonResponse = await axios.request(newLessonRequest);
        console.log('INSERT LESSON RESPONSE:', lessonResponse.data.status);

        const lessonId = lessonResponse.data.id;

        // Insert Lesson Sections
        const sectionPromises = topics.map(async (topic, i) => {
            const newSectionRequest = makeNewSectionRequest(lessonId, topic, completeLesson['sections'][i]);
            const sectionResponse = await axios.request(newSectionRequest);
            console.log(`insert "${topic}" section response:`, sectionResponse.data.status);
        });
        await Promise.all(sectionPromises);

        // Insert Lesson Practice Questions
        const practiceQuestionsString = completeLesson.practice_questions;
        console.log(practiceQuestionsString);
        const questionList = parsePracticeQuestionsString(practiceQuestionsString);

        console.log(questionList)
        const questionPromises = questionList.map(async (question) => {
            const newQuestionRequest = makeNewPracticeQuestionRequest(question, lessonId);
            const questionResponse = await axios.request(newQuestionRequest);
            console.log(`insert practice question response:`, questionResponse.data.status);
        });
        await Promise.all(questionPromises);

        return lessonId;
    } catch (error) {
        console.log(error);
    }
};

export default insertLessonComponents;