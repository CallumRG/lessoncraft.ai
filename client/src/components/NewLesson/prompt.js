export const makeLessonDescriptionPrompt = (title, topics, filename) => {
    const sectionsList = topics.map((topic, index) => `"${topic}"`).join(', ');

    return `-I'm building a lesson from the attached textbook PDF, ${filename}.
            -The title of the lesson is "${title}".
            -The sections the lesson will cover are: ${sectionsList}.
            -Use the textbook to generate the following: 
            -In 1 message, write me a 150 word description of the lesson as an intro(explain it to me like I'm an unknowledgeable high school student).
            -DO NOT reply to this message with more than 1 message
            -DO NOT return any text in the response other than the lesson description itself`;
}

export const makeSectionBodyPrompt = (topic) => {
    return `-now, generate a 250 word body for the ${topic} Section. 
            -You should explain it to me logically as if I'm an uneducated, unknowledgeable high school student. 
            -Provide an example to help me understand.
            -DO NOT reply to this message with more than 1 message.
            -DO NOT return any text in the response other than the section body itself.`;
}

export const makePracticeQuestionsPrompt = () => {
    return `-Now, generate 5 multiple-choice practice questions on the topics you just discussed. 
            -Each question should have 4 options: a,b,c,d. 
            -write the list of questions in the following format: 
            question:How many primary colors are there?a:1b:2c:3d:4answer:cquestion:What is 2+2?a:1b:25c:55d:4answer:d
            -There should ONLY be ONE correct answer. 
            -Start each new question with 'question:'.
            -Start each new option with 'a:' or 'b:' or 'c:' or d:'.
            -Start each answer with 'answer:'.
            -ALWAYS use ':' after 'question', 'a', 'b', 'c', 'd', 'answer' as a separator.
            -NEVER use ')' or anything else as a separator.
            -ALWAYS put the answer RIGHT AFTER option d in your response.
            -DO NOT reply to this message with more than 1 message.
            -DO NOT return any text in the response other than the practice question list.`;
}